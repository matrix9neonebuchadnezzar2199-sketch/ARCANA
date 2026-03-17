using UnityEngine;
using UnityEditor;
using Arcana.Runtime.Attributes;

namespace Arcana.Editor.Tools
{
    public static class MeshTools
    {
        [ArcanaTool(Id = "mesh_combine", Description = "Combine Meshes", DescriptionJa = "メッシュを結合", Category = "mesh")]
        public static string CombineMeshes(string name)
        {
            var go = GameObject.Find(name);
            if (go == null) return "{\"success\":false,\"message\":\"Object not found: " + name + "\"}";
            var filters = go.GetComponentsInChildren<MeshFilter>();
            var combine = new CombineInstance[filters.Length];
            for (int i = 0; i < filters.Length; i++) { combine[i].mesh = filters[i].sharedMesh; combine[i].transform = filters[i].transform.localToWorldMatrix; }
            var mf = go.GetComponent<MeshFilter>(); if (mf == null) mf = go.AddComponent<MeshFilter>();
            mf.sharedMesh = new Mesh();
            mf.sharedMesh.CombineMeshes(combine);
            Undo.RegisterCreatedObjectUndo(mf.sharedMesh, "Combine Meshes");
            return "{\"success\":true,\"message\":\"Meshes combined on " + name + "\"}";
        }

        [ArcanaTool(Id = "mesh_flip", Description = "Flip Normals", DescriptionJa = "法線を反転", Category = "mesh")]
        public static string FlipNormals(string name)
        {
            var go = GameObject.Find(name);
            if (go == null) return "{\"success\":false,\"message\":\"Object not found: " + name + "\"}";
            var mf = go.GetComponent<MeshFilter>();
            if (mf == null || mf.sharedMesh == null) return "{\"success\":false,\"message\":\"No mesh found\"}";
            var mesh = Object.Instantiate(mf.sharedMesh);
            var normals = mesh.normals;
            for (int i = 0; i < normals.Length; i++) normals[i] = -normals[i];
            mesh.normals = normals;
            var tris = mesh.triangles;
            for (int i = 0; i < tris.Length; i += 3) { var tmp = tris[i]; tris[i] = tris[i + 2]; tris[i + 2] = tmp; }
            mesh.triangles = tris;
            Undo.RecordObject(mf, "Flip Normals");
            mf.sharedMesh = mesh;
            return "{\"success\":true,\"message\":\"Normals flipped on " + name + "\"}";
        }

        [ArcanaTool(Id = "mesh_recalc_normals", Description = "Recalculate Normals", DescriptionJa = "法線を再計算", Category = "mesh")]
        public static string RecalcNormals(string name)
        {
            var go = GameObject.Find(name);
            if (go == null) return "{\"success\":false,\"message\":\"Object not found: " + name + "\"}";
            var mf = go.GetComponent<MeshFilter>();
            if (mf == null || mf.sharedMesh == null) return "{\"success\":false,\"message\":\"No mesh found\"}";
            Undo.RecordObject(mf.sharedMesh, "Recalc Normals");
            mf.sharedMesh.RecalculateNormals();
            return "{\"success\":true,\"message\":\"Normals recalculated on " + name + "\"}";
        }

        [ArcanaTool(Id = "mesh_set_vertex_color", Description = "Set Vertex Color", DescriptionJa = "頂点カラーを設定", Category = "mesh")]
        public static string SetVertexColor(string name, string color = "#FFFFFF")
        {
            var go = GameObject.Find(name);
            if (go == null) return "{\"success\":false,\"message\":\"Object not found: " + name + "\"}";
            var mf = go.GetComponent<MeshFilter>();
            if (mf == null || mf.sharedMesh == null) return "{\"success\":false,\"message\":\"No mesh found\"}";
            ColorUtility.TryParseHtmlString(color, out Color c);
            var colors = new Color[mf.sharedMesh.vertexCount];
            for (int i = 0; i < colors.Length; i++) colors[i] = c;
            Undo.RecordObject(mf.sharedMesh, "Set Vertex Color");
            mf.sharedMesh.colors = colors;
            return "{\"success\":true,\"message\":\"Vertex color set on " + name + "\"}";
        }

        [ArcanaTool(Id = "mesh_get_info", Description = "Get Mesh Info", DescriptionJa = "メッシュ情報を取得", Category = "mesh")]
        public static string GetMeshInfo(string name)
        {
            var go = GameObject.Find(name);
            if (go == null) return "{\"success\":false,\"message\":\"Object not found: " + name + "\"}";
            var mf = go.GetComponent<MeshFilter>();
            if (mf == null || mf.sharedMesh == null) return "{\"success\":false,\"message\":\"No mesh found\"}";
            var m = mf.sharedMesh;
            return "{\"success\":true,\"message\":\"vertices:" + m.vertexCount + " triangles:" + (m.triangles.Length/3) + " bounds:" + m.bounds + "\"}";
        }

        [ArcanaTool(Id = "mesh_replace_primitive", Description = "Replace Mesh Primitive", DescriptionJa = "プリミティブメッシュに差替", Category = "mesh")]
        public static string ReplacePrimitive(string name, string primitive)
        {
            var go = GameObject.Find(name);
            if (go == null) return "{\"success\":false,\"message\":\"Object not found: " + name + "\"}";
            PrimitiveType pt = PrimitiveType.Cube;
            switch (primitive) { case "Sphere": pt = PrimitiveType.Sphere; break; case "Cylinder": pt = PrimitiveType.Cylinder; break; case "Capsule": pt = PrimitiveType.Capsule; break; case "Plane": pt = PrimitiveType.Plane; break; case "Quad": pt = PrimitiveType.Quad; break; }
            var temp = GameObject.CreatePrimitive(pt);
            var mf = go.GetComponent<MeshFilter>(); if (mf == null) mf = go.AddComponent<MeshFilter>();
            Undo.RecordObject(mf, "Replace Primitive");
            mf.sharedMesh = temp.GetComponent<MeshFilter>().sharedMesh;
            Object.DestroyImmediate(temp);
            return "{\"success\":true,\"message\":\"Mesh replaced with " + primitive + "\"}";
        }
    }
}