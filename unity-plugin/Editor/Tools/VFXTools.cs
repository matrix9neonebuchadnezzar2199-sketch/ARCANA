using Arcana.Runtime;
using UnityEditor;
using UnityEngine;

namespace Arcana.Editor.Tools
{
    public static class VFXTools
    {
        [ArcanaTool(
            "vfx_create_particle",
            "Create a new particle system in the scene",
            "シーンに新しいパーティクルシステムを作成",
            "vfx")]
        public static string CreateParticle(
            string name, float x = 0, float y = 0, float z = 0, int maxParticles = 1000)
        {
            var go = new GameObject(name);
            var ps = go.AddComponent<ParticleSystem>();
            go.transform.position = new Vector3(x, y, z);
            var main = ps.main;
            main.maxParticles = maxParticles;
            Undo.RegisterCreatedObjectUndo(go, $"ARCANA Create Particle {name}");
            return $"Created particle system: {name}";
        }

        [ArcanaTool(
            "vfx_set_color",
            "Set the start color of a particle system",
            "パーティクルシステムの開始色を設定",
            "vfx")]
        public static string SetColor(string name, string color)
        {
            var go = GameObject.Find(name);
            if (go == null) return $"GameObject not found: {name}";
            var ps = go.GetComponent<ParticleSystem>();
            if (ps == null) return $"No ParticleSystem on {name}";
            if (!ColorUtility.TryParseHtmlString(color, out Color c))
                return $"Invalid color: {color}";
            Undo.RecordObject(ps, "ARCANA Set Particle Color");
            var main = ps.main;
            main.startColor = c;
            return $"Set particle color of {name} to {color}";
        }

        [ArcanaTool(
            "vfx_set_speed",
            "Set the start speed and lifetime of a particle system",
            "パーティクルの初速と寿命を設定",
            "vfx")]
        public static string SetSpeed(string name, float startSpeed, float startLifetime = 5f)
        {
            var go = GameObject.Find(name);
            if (go == null) return $"GameObject not found: {name}";
            var ps = go.GetComponent<ParticleSystem>();
            if (ps == null) return $"No ParticleSystem on {name}";
            Undo.RecordObject(ps, "ARCANA Set Particle Speed");
            var main = ps.main;
            main.startSpeed = startSpeed;
            main.startLifetime = startLifetime;
            return $"Set particle speed of {name} to {startSpeed}, lifetime {startLifetime}";
        }

        [ArcanaTool(
            "vfx_set_shape",
            "Set the emission shape of a particle system",
            "パーティクルの放出形状を設定",
            "vfx")]
        public static string SetShape(string name, string shape, float radius = 1f)
        {
            var go = GameObject.Find(name);
            if (go == null) return $"GameObject not found: {name}";
            var ps = go.GetComponent<ParticleSystem>();
            if (ps == null) return $"No ParticleSystem on {name}";
            Undo.RecordObject(ps, "ARCANA Set Particle Shape");
            var sh = ps.shape;
            sh.enabled = true;
            switch (shape)
            {
                case "Sphere": sh.shapeType = ParticleSystemShapeType.Sphere; break;
                case "Hemisphere": sh.shapeType = ParticleSystemShapeType.Hemisphere; break;
                case "Cone": sh.shapeType = ParticleSystemShapeType.Cone; break;
                case "Box": sh.shapeType = ParticleSystemShapeType.Box; break;
                case "Circle": sh.shapeType = ParticleSystemShapeType.Circle; break;
                case "Edge": sh.shapeType = ParticleSystemShapeType.SingleSidedEdge; break;
            }
            sh.radius = radius;
            return $"Set particle shape of {name} to {shape}";
        }
    }
}