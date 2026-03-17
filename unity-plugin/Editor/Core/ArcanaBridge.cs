using System;
using System.Collections.Generic;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using UnityEngine;

namespace Arcana.Editor.Core
{
    public class ArcanaBridge
    {
        private ClientWebSocket _ws;
        private readonly string _url;
        private readonly Queue<Action> _mainThreadQueue = new Queue<Action>();
        private CancellationTokenSource _cts;

        public bool IsConnected => _ws?.State == WebSocketState.Open;

        public ArcanaBridge(string url = "ws://localhost:8765")
        {
            _url = url;
        }

        public async Task ConnectAsync()
        {
            _cts = new CancellationTokenSource();
            _ws = new ClientWebSocket();
            try
            {
                await _ws.ConnectAsync(new Uri(_url), _cts.Token);
                Debug.Log("[ARCANA] Bridge connected to server");
                _ = ReceiveLoop();
            }
            catch (Exception e)
            {
                Debug.LogError($"[ARCANA] Connection failed: {e.Message}");
            }
        }

        private async Task ReceiveLoop()
        {
            var buffer = new byte[8192];
            while (_ws.State == WebSocketState.Open)
            {
                try
                {
                    var result = await _ws.ReceiveAsync(
                        new ArraySegment<byte>(buffer), _cts.Token);
                    if (result.MessageType == WebSocketMessageType.Text)
                    {
                        var json = Encoding.UTF8.GetString(buffer, 0, result.Count);
                        HandleMessage(json);
                    }
                }
                catch (Exception e)
                {
                    Debug.LogError($"[ARCANA] Receive error: {e.Message}");
                    break;
                }
            }
        }

        private void HandleMessage(string json)
        {
            Debug.Log($"[ARCANA] Received: {json}");
        }

        public async Task SendAsync(string json)
        {
            if (_ws?.State != WebSocketState.Open) return;
            var bytes = Encoding.UTF8.GetBytes(json);
            await _ws.SendAsync(
                new ArraySegment<byte>(bytes),
                WebSocketMessageType.Text, true, _cts.Token);
        }

        public void ProcessMainThreadQueue()
        {
            lock (_mainThreadQueue)
            {
                while (_mainThreadQueue.Count > 0)
                {
                    _mainThreadQueue.Dequeue()?.Invoke();
                }
            }
        }

        public void EnqueueMainThread(Action action)
        {
            lock (_mainThreadQueue)
            {
                _mainThreadQueue.Enqueue(action);
            }
        }

        public void Disconnect()
        {
            _cts?.Cancel();
            _ws?.Dispose();
            Debug.Log("[ARCANA] Bridge disconnected");
        }
    }
}