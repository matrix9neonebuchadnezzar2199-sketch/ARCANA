using UnityEngine;
using UnityEditor;
using System.Linq;
using Arcana.Runtime.Attributes;

namespace Arcana.Editor.Tools
{
    public static class BuildTools
    {
        [ArcanaTool(Id = "build_set_platform", Description = "Switch Platform", DescriptionJa = "プラットフォームを切替", Category = "build")]
        public static string SetPlatform(string platform)
        {
            BuildTarget target = BuildTarget.StandaloneWindows64;
            switch (platform)
            {
                case "Windows": target = BuildTarget.StandaloneWindows64; break;
                case "Mac": target = BuildTarget.StandaloneOSX; break;
                case "Linux": target = BuildTarget.StandaloneLinux64; break;
                case "Android": target = BuildTarget.Android; break;
                case "iOS": target = BuildTarget.iOS; break;
                case "WebGL": target = BuildTarget.WebGL; break;
            }
            EditorUserBuildSettings.SwitchActiveBuildTarget(BuildPipeline.GetBuildTargetGroup(target), target);
            return "{\"success\":true,\"message\":\"Platform switched to " + platform + "\"}";
        }

        [ArcanaTool(Id = "build_add_scene", Description = "Add Scene to Build", DescriptionJa = "ビルドにシーンを追加", Category = "build")]
        public static string AddScene(string path, bool enabled = true)
        {
            var scenes = EditorBuildSettings.scenes.ToList();
            scenes.Add(new EditorBuildSettingsScene(path, enabled));
            EditorBuildSettings.scenes = scenes.ToArray();
            return "{\"success\":true,\"message\":\"Scene added: " + path + "\"}";
        }

        [ArcanaTool(Id = "build_set_player", Description = "Set Player Settings", DescriptionJa = "プレイヤー設定を構成", Category = "build")]
        public static string SetPlayerSettings(string productName = "", string companyName = "", string version = "", string defaultIcon = "")
        {
            if (!string.IsNullOrEmpty(productName)) PlayerSettings.productName = productName;
            if (!string.IsNullOrEmpty(companyName)) PlayerSettings.companyName = companyName;
            if (!string.IsNullOrEmpty(version)) PlayerSettings.bundleVersion = version;
            return "{\"success\":true,\"message\":\"Player settings updated\"}";
        }

        [ArcanaTool(Id = "build_execute", Description = "Build Project", DescriptionJa = "ビルドを実行", Category = "build")]
        public static string Execute(string outputPath, bool development = false)
        {
            var scenes = EditorBuildSettings.scenes.Where(s => s.enabled).Select(s => s.path).ToArray();
            var opts = new BuildPlayerOptions
            {
                scenes = scenes,
                locationPathName = outputPath,
                target = EditorUserBuildSettings.activeBuildTarget,
                options = development ? BuildOptions.Development : BuildOptions.None
            };
            var report = BuildPipeline.BuildPlayer(opts);
            return "{\"success\":true,\"message\":\"Build complete: " + report.summary.result + "\"}";
        }

        [ArcanaTool(Id = "build_get_settings", Description = "Get Build Settings", DescriptionJa = "ビルド設定を取得", Category = "build")]
        public static string GetSettings()
        {
            var target = EditorUserBuildSettings.activeBuildTarget.ToString();
            var sceneCount = EditorBuildSettings.scenes.Length;
            return "{\"success\":true,\"message\":\"Platform: " + target + ", Scenes: " + sceneCount + "\"}";
        }

        [ArcanaTool(Id = "build_clean", Description = "Clean Build Cache", DescriptionJa = "ビルドキャッシュをクリーン", Category = "build")]
        public static string Clean()
        {
            Caching.ClearCache();
            return "{\"success\":true,\"message\":\"Build cache cleaned\"}";
        }
    }
}