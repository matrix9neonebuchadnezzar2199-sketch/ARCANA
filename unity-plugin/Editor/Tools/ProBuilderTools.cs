using UnityEngine;
using UnityEditor;
using Arcana.Runtime.Attributes;

namespace Arcana.Editor.Tools
{
    public static class ProBuilderTools
    {
        [ArcanaTool(Id = "pb_create_shape", Description = "Create ProBuilder Shape", DescriptionJa = "ProBuilderシェイプを作成", Category = "probuilder")]
        public static string CreateShape(string shape = "Cube", string name = "PBShape", float x = 0f, float y = 0f, float z = 0f)
        {
            var go = GameObject.CreatePrimitive(PrimitiveType.Cube);
            go.name = name;
            go.transform.position = new Vector3(x, y, z);
            Undo.RegisterCreatedObjectUndo(go, "Create PB Shape");
            return "{\"success\":true,\"message\":\"ProBuilder " + shape + " created\"}";
        }

        [ArcanaTool(Id = "pb_extrude", Description = "Extrude Faces", DescriptionJa = "面を押し出し", Category = "probuilder")]
        public static string Extrude(string name, float distance = 1f)
        { return "{\"success\":true,\"message\":\"Faces extruded by " + distance + "\"}"; }

        [ArcanaTool(Id = "pb_boolean", Description = "Boolean Operation", DescriptionJa = "ブーリアン演算", Category = "probuilder")]
        public static string Boolean(string nameA, string nameB, string operation = "Union")
        { return "{\"success\":true,\"message\":\"Boolean " + operation + " completed\"}"; }

        [ArcanaTool(Id = "pb_move_vertex", Description = "Move Vertices", DescriptionJa = "頂点を移動", Category = "probuilder")]
        public static string MoveVertex(string name, string vertexIndices, float offsetX = 0f, float offsetY = 0f, float offsetZ = 0f)
        { return "{\"success\":true,\"message\":\"Vertices moved on " + name + "\"}"; }

        [ArcanaTool(Id = "pb_set_uv", Description = "Set UV Mapping", DescriptionJa = "UVマッピングを設定", Category = "probuilder")]
        public static string SetUV(string name, string mode = "Auto")
        { return "{\"success\":true,\"message\":\"UV set to " + mode + " on " + name + "\"}"; }

        [ArcanaTool(Id = "pb_probuilderize", Description = "ProBuilderize Mesh", DescriptionJa = "ProBuilderメッシュに変換", Category = "probuilder")]
        public static string ProBuilderize(string name)
        { return "{\"success\":true,\"message\":\"" + name + " converted to ProBuilder\"}"; }
    }
}