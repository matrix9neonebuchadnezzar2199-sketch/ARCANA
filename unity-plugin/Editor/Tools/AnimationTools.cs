using Arcana.Runtime;
using UnityEditor;
using UnityEngine;

namespace Arcana.Editor.Tools
{
    public static class AnimationTools
    {
        [ArcanaTool(
            "anim_add_animator",
            "Add an Animator component to a GameObject",
            "GameObjectにAnimatorコンポーネントを追加",
            "animation")]
        public static string AddAnimator(string name, string controllerPath = "")
        {
            var go = GameObject.Find(name);
            if (go == null) return $"GameObject not found: {name}";
            Undo.AddComponent<Animator>(go);
            if (!string.IsNullOrEmpty(controllerPath))
            {
                var controller = AssetDatabase.LoadAssetAtPath
                    <RuntimeAnimatorController>(controllerPath);
                if (controller != null)
                    go.GetComponent<Animator>().runtimeAnimatorController = controller;
            }
            return $"Added Animator to {name}";
        }

        [ArcanaTool(
            "anim_set_parameter",
            "Set a parameter value on an Animator",
            "Animatorのパラメータ値を設定",
            "animation")]
        public static string SetParameter(
            string name, string paramName, string paramType, string value = "")
        {
            var go = GameObject.Find(name);
            if (go == null) return $"GameObject not found: {name}";
            var animator = go.GetComponent<Animator>();
            if (animator == null) return $"No Animator on {name}";
            switch (paramType)
            {
                case "float":
                    animator.SetFloat(paramName, float.Parse(value));
                    break;
                case "int":
                    animator.SetInteger(paramName, int.Parse(value));
                    break;
                case "bool":
                    animator.SetBool(paramName, bool.Parse(value));
                    break;
                case "trigger":
                    animator.SetTrigger(paramName);
                    break;
            }
            return $"Set {paramName} ({paramType}) on {name}";
        }

        [ArcanaTool(
            "anim_play",
            "Play an animation state on an Animator",
            "Animatorのアニメーションステートを再生",
            "animation")]
        public static string Play(string name, string stateName, int layer = 0)
        {
            var go = GameObject.Find(name);
            if (go == null) return $"GameObject not found: {name}";
            var animator = go.GetComponent<Animator>();
            if (animator == null) return $"No Animator on {name}";
            animator.Play(stateName, layer);
            return $"Playing {stateName} on {name}";
        }

        [ArcanaTool(
            "anim_create_clip",
            "Create a simple animation clip with position keyframes",
            "位置キーフレーム付きのアニメーションクリップを作成",
            "animation")]
        public static string CreateClip(
            string clipName, string targetName, float duration,
            float endX, float endY, float endZ, bool loop = false)
        {
            var go = GameObject.Find(targetName);
            if (go == null) return $"GameObject not found: {targetName}";
            var clip = new AnimationClip();
            clip.name = clipName;
            var startPos = go.transform.position;
            var curveX = AnimationCurve.Linear(0, startPos.x, duration, endX);
            var curveY = AnimationCurve.Linear(0, startPos.y, duration, endY);
            var curveZ = AnimationCurve.Linear(0, startPos.z, duration, endZ);
            clip.SetCurve("", typeof(Transform), "localPosition.x", curveX);
            clip.SetCurve("", typeof(Transform), "localPosition.y", curveY);
            clip.SetCurve("", typeof(Transform), "localPosition.z", curveZ);
            if (loop)
            {
                var settings = AnimationUtility.GetAnimationClipSettings(clip);
                settings.loopTime = true;
                AnimationUtility.SetAnimationClipSettings(clip, settings);
            }
            var path = $"Assets/{clipName}.anim";
            AssetDatabase.CreateAsset(clip, path);
            AssetDatabase.SaveAssets();
            return $"Created animation clip: {path}";
        }
    }
}