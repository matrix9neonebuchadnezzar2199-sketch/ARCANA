using Arcana.Runtime;
using UnityEditor;
using UnityEngine;
using UnityEngine.UI;

namespace Arcana.Editor.Tools
{
    public static class UITools
    {
        private static Canvas FindOrCreateCanvas(string canvasName = "Canvas")
        {
            var existing = GameObject.Find(canvasName);
            if (existing != null) return existing.GetComponent<Canvas>();
            return null;
        }

        [ArcanaTool(
            "ui_create_canvas",
            "Create a new UI Canvas in the scene",
            "シーンに新しいUI Canvasを作成",
            "ui")]
        public static string CreateCanvas(
            string name = "Canvas", string renderMode = "ScreenSpaceOverlay")
        {
            var go = new GameObject(name);
            var canvas = go.AddComponent<Canvas>();
            switch (renderMode)
            {
                case "ScreenSpaceOverlay": canvas.renderMode = RenderMode.ScreenSpaceOverlay; break;
                case "ScreenSpaceCamera": canvas.renderMode = RenderMode.ScreenSpaceCamera; break;
                case "WorldSpace": canvas.renderMode = RenderMode.WorldSpace; break;
            }
            go.AddComponent<CanvasScaler>();
            go.AddComponent<GraphicRaycaster>();
            Undo.RegisterCreatedObjectUndo(go, $"ARCANA Create Canvas {name}");
            // Ensure EventSystem exists
            if (Object.FindObjectOfType<UnityEngine.EventSystems.EventSystem>() == null)
            {
                var es = new GameObject("EventSystem");
                es.AddComponent<UnityEngine.EventSystems.EventSystem>();
                es.AddComponent<UnityEngine.EventSystems.StandaloneInputModule>();
                Undo.RegisterCreatedObjectUndo(es, "ARCANA Create EventSystem");
            }
            return $"Created canvas: {name}";
        }

        [ArcanaTool(
            "ui_create_text",
            "Create a text element on a Canvas",
            "Canvasにテキスト要素を作成",
            "ui")]
        public static string CreateText(
            string name, string text, int fontSize = 24,
            string color = "", float x = 0, float y = 0)
        {
            var canvas = Object.FindObjectOfType<Canvas>();
            if (canvas == null) return "No Canvas found. Create one first with ui_create_canvas.";
            var go = new GameObject(name);
            go.transform.SetParent(canvas.transform, false);
            var txt = go.AddComponent<Text>();
            txt.text = text;
            txt.fontSize = fontSize;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.alignment = TextAnchor.MiddleCenter;
            if (!string.IsNullOrEmpty(color) && ColorUtility.TryParseHtmlString(color, out Color c))
                txt.color = c;
            else
                txt.color = Color.white;
            var rect = go.GetComponent<RectTransform>();
            rect.anchoredPosition = new Vector2(x, y);
            rect.sizeDelta = new Vector2(300, 60);
            Undo.RegisterCreatedObjectUndo(go, $"ARCANA Create Text {name}");
            return $"Created text: {name}";
        }

        [ArcanaTool(
            "ui_create_button",
            "Create a button element on a Canvas",
            "Canvasにボタン要素を作成",
            "ui")]
        public static string CreateButton(
            string name, string label, float width = 160, float height = 40,
            float x = 0, float y = 0, string color = "")
        {
            var canvas = Object.FindObjectOfType<Canvas>();
            if (canvas == null) return "No Canvas found. Create one first with ui_create_canvas.";
            var go = new GameObject(name);
            go.transform.SetParent(canvas.transform, false);
            var img = go.AddComponent<Image>();
            if (!string.IsNullOrEmpty(color) && ColorUtility.TryParseHtmlString(color, out Color c))
                img.color = c;
            var btn = go.AddComponent<Button>();
            var rect = go.GetComponent<RectTransform>();
            rect.anchoredPosition = new Vector2(x, y);
            rect.sizeDelta = new Vector2(width, height);
            // Add label text
            var textGo = new GameObject("Text");
            textGo.transform.SetParent(go.transform, false);
            var txt = textGo.AddComponent<Text>();
            txt.text = label;
            txt.fontSize = 18;
            txt.font = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
            txt.alignment = TextAnchor.MiddleCenter;
            txt.color = Color.black;
            var textRect = textGo.GetComponent<RectTransform>();
            textRect.anchorMin = Vector2.zero;
            textRect.anchorMax = Vector2.one;
            textRect.sizeDelta = Vector2.zero;
            Undo.RegisterCreatedObjectUndo(go, $"ARCANA Create Button {name}");
            return $"Created button: {name}";
        }

        [ArcanaTool(
            "ui_create_image",
            "Create an image element on a Canvas",
            "Canvasに画像要素を作成",
            "ui")]
        public static string CreateImage(
            string name, string spritePath = "", string color = "",
            float width = 100, float height = 100, float x = 0, float y = 0)
        {
            var canvas = Object.FindObjectOfType<Canvas>();
            if (canvas == null) return "No Canvas found. Create one first with ui_create_canvas.";
            var go = new GameObject(name);
            go.transform.SetParent(canvas.transform, false);
            var img = go.AddComponent<Image>();
            if (!string.IsNullOrEmpty(spritePath))
            {
                var sprite = AssetDatabase.LoadAssetAtPath<Sprite>(spritePath);
                if (sprite != null) img.sprite = sprite;
            }
            if (!string.IsNullOrEmpty(color) && ColorUtility.TryParseHtmlString(color, out Color c))
                img.color = c;
            var rect = go.GetComponent<RectTransform>();
            rect.anchoredPosition = new Vector2(x, y);
            rect.sizeDelta = new Vector2(width, height);
            Undo.RegisterCreatedObjectUndo(go, $"ARCANA Create Image {name}");
            return $"Created image: {name}";
        }
    }
}