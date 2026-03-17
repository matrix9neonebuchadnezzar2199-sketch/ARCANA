using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Arcana.Runtime;
using UnityEngine;

namespace Arcana.Editor.Core
{
    public static class ArcanaToolExecutor
    {
        private static Dictionary<string, MethodInfo> _tools;

        public static void Initialize()
        {
            _tools = new Dictionary<string, MethodInfo>();
            var assemblies = AppDomain.CurrentDomain.GetAssemblies();

            foreach (var asm in assemblies)
            {
                try
                {
                    foreach (var type in asm.GetTypes())
                    {
                        foreach (var method in type.GetMethods(
                            BindingFlags.Static | BindingFlags.Public))
                        {
                            var attr = method.GetCustomAttribute<ArcanaToolAttribute>();
                            if (attr != null)
                            {
                                _tools[attr.Id] = method;
                                Debug.Log($"[ARCANA] Registered: {attr.Id}");
                            }
                        }
                    }
                }
                catch { }
            }

            Debug.Log($"[ARCANA] {_tools.Count} Unity tools registered");
        }

        public static object Execute(string toolId, object[] parameters)
        {
            if (!_tools.TryGetValue(toolId, out var method))
            {
                throw new Exception($"Tool not found: {toolId}");
            }
            return method.Invoke(null, parameters);
        }

        public static List<string> GetRegisteredTools()
        {
            return _tools?.Keys.ToList() ?? new List<string>();
        }
    }
}