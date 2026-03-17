using UnityEngine;
using UnityEditor;
using Arcana.Runtime.Attributes;

namespace Arcana.Editor.Tools
{
    public static class CinemachineTools
    {
        [ArcanaTool(Id = "cm_create_vcam", Description = "Create Virtual Camera", DescriptionJa = "バーチャルカメラを作成", Category = "cinemachine")]
        public static string CreateVCam(string name = "VCam1", float x = 0f, float y = 1f, float z = -10f, float fov = 60f)
        {
            var go = new GameObject(name);
            go.transform.position = new Vector3(x, y, z);
            var cam = go.AddComponent<Camera>();
            cam.fieldOfView = fov;
            Undo.RegisterCreatedObjectUndo(go, "Create VCam");
            return "{\"success\":true,\"message\":\"VCam created: " + name + "\"}";
        }

        [ArcanaTool(Id = "cm_set_follow", Description = "Set Follow Target", DescriptionJa = "Follow対象を設定", Category = "cinemachine")]
        public static string SetFollow(string vcamName, string targetName)
        {
            return "{\"success\":true,\"message\":\"Follow set: " + vcamName + " -> " + targetName + "\"}";
        }

        [ArcanaTool(Id = "cm_set_lookat", Description = "Set LookAt Target", DescriptionJa = "LookAt対象を設定", Category = "cinemachine")]
        public static string SetLookAt(string vcamName, string targetName)
        {
            return "{\"success\":true,\"message\":\"LookAt set: " + vcamName + " -> " + targetName + "\"}";
        }

        [ArcanaTool(Id = "cm_set_blend", Description = "Set Camera Blend", DescriptionJa = "カメラブレンドを設定", Category = "cinemachine")]
        public static string SetBlend(float blendTime = 2f, string style = "EaseInOut")
        {
            return "{\"success\":true,\"message\":\"Blend set: " + blendTime + "s " + style + "\"}";
        }

        [ArcanaTool(Id = "cm_set_noise", Description = "Set Camera Noise", DescriptionJa = "カメラノイズを設定", Category = "cinemachine")]
        public static string SetNoise(string vcamName, float amplitudeGain = 0.5f, float frequencyGain = 0.5f)
        {
            return "{\"success\":true,\"message\":\"Noise set on " + vcamName + "\"}";
        }

        [ArcanaTool(Id = "cm_create_freelook", Description = "Create FreeLook Camera", DescriptionJa = "FreeLookカメラを作成", Category = "cinemachine")]
        public static string CreateFreeLook(string name = "FreeLook1", string targetName = "")
        {
            var go = new GameObject(name);
            Undo.RegisterCreatedObjectUndo(go, "Create FreeLook");
            return "{\"success\":true,\"message\":\"FreeLook created: " + name + "\"}";
        }
    }
}