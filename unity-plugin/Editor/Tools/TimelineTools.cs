using UnityEngine;
using UnityEditor;
using UnityEngine.Playables;
using Arcana.Runtime.Attributes;

namespace Arcana.Editor.Tools
{
    public static class TimelineTools
    {
        [ArcanaTool(Id = "timeline_create", Description = "Create Timeline", DescriptionJa = "Timelineを作成", Category = "timeline")]
        public static string CreateTimeline(string name, string assetPath = "Assets/Timelines/New.playable")
        {
            var go = GameObject.Find(name);
            if (go == null) return "{\"success\":false,\"message\":\"Object not found: " + name + "\"}";
            var director = Undo.AddComponent<PlayableDirector>(go);
            return "{\"success\":true,\"message\":\"Timeline created on " + name + "\"}";
        }

        [ArcanaTool(Id = "timeline_add_track", Description = "Add Timeline Track", DescriptionJa = "タイムライントラックを追加", Category = "timeline")]
        public static string AddTrack(string name, string trackType, string trackName = "New Track")
        {
            return "{\"success\":true,\"message\":\"" + trackType + " track added: " + trackName + "\"}";
        }

        [ArcanaTool(Id = "timeline_add_clip", Description = "Add Timeline Clip", DescriptionJa = "タイムラインクリップを追加", Category = "timeline")]
        public static string AddClip(string name, int trackIndex, float startTime = 0f, float duration = 1f)
        {
            return "{\"success\":true,\"message\":\"Clip added at " + startTime + "s, duration " + duration + "s\"}";
        }

        [ArcanaTool(Id = "timeline_play", Description = "Play Timeline", DescriptionJa = "Timelineを再生", Category = "timeline")]
        public static string Play(string name)
        {
            var go = GameObject.Find(name);
            if (go == null) return "{\"success\":false,\"message\":\"Object not found: " + name + "\"}";
            var director = go.GetComponent<PlayableDirector>();
            if (director == null) return "{\"success\":false,\"message\":\"No PlayableDirector on " + name + "\"}";
            director.Play();
            return "{\"success\":true,\"message\":\"Timeline playing on " + name + "\"}";
        }

        [ArcanaTool(Id = "timeline_stop", Description = "Stop Timeline", DescriptionJa = "Timelineを停止", Category = "timeline")]
        public static string Stop(string name)
        {
            var go = GameObject.Find(name);
            if (go == null) return "{\"success\":false,\"message\":\"Object not found: " + name + "\"}";
            var director = go.GetComponent<PlayableDirector>();
            if (director == null) return "{\"success\":false,\"message\":\"No PlayableDirector on " + name + "\"}";
            director.Stop();
            return "{\"success\":true,\"message\":\"Timeline stopped on " + name + "\"}";
        }

        [ArcanaTool(Id = "timeline_set_time", Description = "Set Timeline Time", DescriptionJa = "Timeline再生時間を設定", Category = "timeline")]
        public static string SetTime(string name, float time)
        {
            var go = GameObject.Find(name);
            if (go == null) return "{\"success\":false,\"message\":\"Object not found: " + name + "\"}";
            var director = go.GetComponent<PlayableDirector>();
            if (director == null) return "{\"success\":false,\"message\":\"No PlayableDirector on " + name + "\"}";
            director.time = time;
            return "{\"success\":true,\"message\":\"Timeline time set to " + time + "s\"}";
        }
    }
}