using UnityEditor;
using UnityEngine;

namespace Arcana.Editor.Setup
{
    public class ArcanaSetupWindow : EditorWindow
    {
        private int _selectedClient = 0;
        private readonly string[] _clients = {
            "Claude Desktop", "Cursor", "VS Code", "Other"
        };

        [MenuItem("Tools/ARCANA/Setup")]
        public static void ShowWindow()
        {
            GetWindow<ArcanaSetupWindow>("ARCANA Setup");
        }

        private void OnGUI()
        {
            GUILayout.Label("ARCANA Setup", EditorStyles.boldLabel);
            GUILayout.Space(10);

            GUILayout.Label("Select your AI client:");
            _selectedClient = GUILayout.SelectionGrid(
                _selectedClient, _clients, 2);
            GUILayout.Space(20);

            if (GUILayout.Button("Complete MCP Setup", GUILayout.Height(40)))
            {
                RunSetup();
            }

            GUILayout.Space(10);
            EditorGUILayout.HelpBox(
                "This will generate the MCP configuration file for your AI client. "
                + "Restart your AI client after setup.",
                MessageType.Info);
        }

        private void RunSetup()
        {
            var serverPath = System.IO.Path.GetFullPath(
                "Assets/../server/dist/index.js");
            var config = "{"
                + "\"mcpServers\":{"
                + "\"arcana\":{"
                + "\"command\":\"node\","
                + $"\"args\":[\"{serverPath.Replace("\\", "/")}\"]"
                + "}}};

            Debug.Log($"[ARCANA] MCP config for {_clients[_selectedClient]}:");
            Debug.Log(config);
            EditorUtility.DisplayDialog("ARCANA Setup",
                $"MCP config generated for {_clients[_selectedClient]}.\n"
                + "Check the Console for the JSON config.\n"
                + "Restart your AI client after applying.",
                "OK");
        }
    }
}