using Arcana.Runtime;
using UnityEditor;
using UnityEngine;

namespace Arcana.Editor.Tools
{
    public static class AudioTools
    {
        [ArcanaTool(
            "audio_add_source",
            "Add an AudioSource component to a GameObject",
            "GameObjectにAudioSourceコンポーネントを追加",
            "audio")]
        public static string AddSource(
            string name, string clipPath,
            bool loop = false, float volume = 1f, bool playOnAwake = true)
        {
            var go = GameObject.Find(name);
            if (go == null) return $"GameObject not found: {name}";
            var clip = AssetDatabase.LoadAssetAtPath<AudioClip>(clipPath);
            if (clip == null) return $"AudioClip not found: {clipPath}";
            Undo.AddComponent<AudioSource>(go);
            var source = go.GetComponent<AudioSource>();
            source.clip = clip;
            source.loop = loop;
            source.volume = volume;
            source.playOnAwake = playOnAwake;
            return $"Added AudioSource to {name}";
        }

        [ArcanaTool(
            "audio_set_volume",
            "Set the volume of an AudioSource",
            "AudioSourceの音量を設定",
            "audio")]
        public static string SetVolume(string name, float volume)
        {
            var go = GameObject.Find(name);
            if (go == null) return $"GameObject not found: {name}";
            var source = go.GetComponent<AudioSource>();
            if (source == null) return $"No AudioSource on {name}";
            Undo.RecordObject(source, "ARCANA Set Volume");
            source.volume = volume;
            return $"Set volume of {name} to {volume}";
        }

        [ArcanaTool(
            "audio_set_spatial",
            "Configure 3D spatial audio settings",
            "3D空間オーディオ設定を構成",
            "audio")]
        public static string SetSpatial(
            string name, float spatialBlend,
            float minDistance = 1f, float maxDistance = 500f)
        {
            var go = GameObject.Find(name);
            if (go == null) return $"GameObject not found: {name}";
            var source = go.GetComponent<AudioSource>();
            if (source == null) return $"No AudioSource on {name}";
            Undo.RecordObject(source, "ARCANA Set Spatial Audio");
            source.spatialBlend = spatialBlend;
            source.minDistance = minDistance;
            source.maxDistance = maxDistance;
            return $"Set spatial audio on {name}: blend={spatialBlend}";
        }
    }
}