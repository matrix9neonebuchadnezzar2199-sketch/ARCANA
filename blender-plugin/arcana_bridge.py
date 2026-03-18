"""
ARCANA Bridge - WebSocket client for Blender <-> ARCANA Server communication.
Runs WebSocket in a background thread, dispatches commands to bpy via timer.
"""

import json
import threading
import time
import queue
import bpy

# WebSocket: Blender bundled Python may not have websockets, so we use socket
import socket
import struct
import hashlib
import base64
import os

_bridge_instance = None
_command_queue = queue.Queue()
_response_queue = queue.Queue()


def get_bridge():
    return _bridge_instance


def connect(host="localhost", port=9879):
    global _bridge_instance
    if _bridge_instance and _bridge_instance.connected:
        _bridge_instance.close()
    _bridge_instance = ArcanaBridge(host, port)
    _bridge_instance.start()


def disconnect():
    global _bridge_instance
    if _bridge_instance:
        _bridge_instance.close()
        _bridge_instance = None


def register_handlers():
    if bpy.app.timers.is_registered(_process_commands):
        return
    bpy.app.timers.register(_process_commands, persistent=True)


def unregister_handlers():
    if bpy.app.timers.is_registered(_process_commands):
        bpy.app.timers.unregister(_process_commands)


def _process_commands():
    """Timer callback - runs in main thread, safe to call bpy."""
    max_per_tick = 10
    processed = 0
    while not _command_queue.empty() and processed < max_per_tick:
        try:
            msg = _command_queue.get_nowait()
            _handle_command(msg)
            processed += 1
        except queue.Empty:
            break
    return 0.05  # 50ms interval


def _handle_command(msg):
    """Route incoming command to appropriate handler."""
    from .utils.command_router import route_command
    try:
        data = json.loads(msg) if isinstance(msg, str) else msg
        cmd_id = data.get("id", "unknown")
        tool_id = data.get("tool", "")
        params = data.get("params", {})

        result = route_command(tool_id, params)

        response = {
            "id": cmd_id,
            "success": True,
            "result": result
        }
    except Exception as e:
        response = {
            "id": data.get("id", "unknown") if isinstance(data, dict) else "unknown",
            "success": False,
            "error": str(e)
        }

    bridge = get_bridge()
    if bridge and bridge.connected:
        bridge.send(json.dumps(response))


class ArcanaBridge:
    """WebSocket client that connects to ARCANA MCP Server."""

    def __init__(self, host="localhost", port=9879):
        self.host = host
        self.port = port
        self.connected = False
        self.tool_count = 238
        self.cmd_count = 0
        self._socket = None
        self._thread = None
        self._running = False

    def start(self):
        self._running = True
        self._thread = threading.Thread(target=self._run, daemon=True)
        self._thread.start()

    def close(self):
        self._running = False
        self.connected = False
        if self._socket:
            try:
                self._socket.close()
            except:
                pass
            self._socket = None

    def send(self, data):
        if not self._socket or not self.connected:
            return
        try:
            self._ws_send(data)
        except Exception as e:
            print(f"[ARCANA] Send error: {e}")
            self.connected = False

    def _run(self):
        """Background thread: connect and listen."""
        retry_delay = 1
        max_retry = 30

        while self._running:
            try:
                self._socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                self._socket.settimeout(5)
                self._socket.connect((self.host, self.port))

                # WebSocket handshake
                if not self._ws_handshake():
                    raise ConnectionError("WebSocket handshake failed")

                self.connected = True
                self._socket.settimeout(1)
                retry_delay = 1
                print(f"[ARCANA] Connected to {self.host}:{self.port}")

                # Send registration
                reg = json.dumps({
                    "type": "register",
                    "editor": "blender",
                    "version": bpy.app.version_string,
                    "tools": self.tool_count
                })
                self._ws_send(reg)

                # Listen loop
                while self._running and self.connected:
                    try:
                        msg = self._ws_recv()
                        if msg is None:
                            continue
                        if msg == "":
                            # Connection closed
                            break
                        self.cmd_count += 1
                        _command_queue.put(msg)
                    except socket.timeout:
                        continue
                    except Exception as e:
                        print(f"[ARCANA] Recv error: {e}")
                        break

            except Exception as e:
                if self._running:
                    print(f"[ARCANA] Connection failed: {e}, retry in {retry_delay}s")

            self.connected = False
            if self._socket:
                try:
                    self._socket.close()
                except:
                    pass
                self._socket = None

            if self._running:
                time.sleep(retry_delay)
                retry_delay = min(retry_delay * 2, max_retry)

    def _ws_handshake(self):
        """Perform WebSocket upgrade handshake."""
        key = base64.b64encode(os.urandom(16)).decode('utf-8')
        handshake = (
            f"GET / HTTP/1.1\r\n"
            f"Host: {self.host}:{self.port}\r\n"
            f"Upgrade: websocket\r\n"
            f"Connection: Upgrade\r\n"
            f"Sec-WebSocket-Key: {key}\r\n"
            f"Sec-WebSocket-Version: 13\r\n"
            f"Sec-WebSocket-Protocol: arcana\r\n"
            f"\r\n"
        )
        self._socket.sendall(handshake.encode('utf-8'))

        response = b""
        while b"\r\n\r\n" not in response:
            chunk = self._socket.recv(4096)
            if not chunk:
                return False
            response += chunk

        return b"101" in response

    def _ws_send(self, data):
        """Send a WebSocket text frame (client must mask)."""
        payload = data.encode('utf-8')
        frame = bytearray()
        frame.append(0x81)  # FIN + text opcode

        length = len(payload)
        if length < 126:
            frame.append(0x80 | length)  # MASK bit set
        elif length < 65536:
            frame.append(0x80 | 126)
            frame.extend(struct.pack(">H", length))
        else:
            frame.append(0x80 | 127)
            frame.extend(struct.pack(">Q", length))

        mask = os.urandom(4)
        frame.extend(mask)
        masked = bytearray(b ^ mask[i % 4] for i, b in enumerate(payload))
        frame.extend(masked)

        self._socket.sendall(bytes(frame))

    def _ws_recv(self):
        """Receive a WebSocket frame."""
        try:
            header = self._recv_exact(2)
            if not header:
                return ""

            opcode = header[0] & 0x0F
            if opcode == 0x8:  # Close
                return ""
            if opcode == 0x9:  # Ping
                self._ws_send_pong()
                return None

            masked = bool(header[1] & 0x80)
            length = header[1] & 0x7F

            if length == 126:
                length = struct.unpack(">H", self._recv_exact(2))[0]
            elif length == 127:
                length = struct.unpack(">Q", self._recv_exact(8))[0]

            if masked:
                mask = self._recv_exact(4)
                data = self._recv_exact(length)
                data = bytearray(b ^ mask[i % 4] for i, b in enumerate(data))
            else:
                data = self._recv_exact(length)

            if opcode == 0x1:  # Text
                return data.decode('utf-8')
            return None

        except socket.timeout:
            raise
        except Exception:
            return ""

    def _ws_send_pong(self):
        """Send pong frame."""
        frame = bytearray([0x8A, 0x80])  # FIN + pong, masked, 0 length
        frame.extend(os.urandom(4))  # mask key
        self._socket.sendall(bytes(frame))

    def _recv_exact(self, n):
        """Receive exactly n bytes."""
        data = bytearray()
        while len(data) < n:
            chunk = self._socket.recv(n - len(data))
            if not chunk:
                return None
            data.extend(chunk)
        return bytes(data)
