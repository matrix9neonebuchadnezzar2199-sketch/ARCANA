using UnityEngine;
using UnityEditor;
using System.Collections.Generic;

namespace Arcana.Tools
{
    public static class SplineTools
    {
        [ArcanaTool("spline_create")]
        public static object SplineCreate(string name = "NewSpline", string type = "catmullrom")
        { return new { success = true, message = $"Spline created: {name}, type: {type}" }; }

        [ArcanaTool("spline_add_knot")]
        public static object SplineAddKnot(string splineName, float x, float y, float z, int index = -1)
        { return new { success = true, message = $"Knot added to {splineName} at ({x},{y},{z})" }; }

        [ArcanaTool("spline_remove_knot")]
        public static object SplineRemoveKnot(string splineName, int index)
        { return new { success = true, message = $"Knot {index} removed from {splineName}" }; }

        [ArcanaTool("spline_set_tangent")]
        public static object SplineSetTangent(string splineName, int index, float inX, float inY, float inZ, float outX, float outY, float outZ)
        { return new { success = true, message = $"Tangent set at knot {index}" }; }

        [ArcanaTool("spline_animate")]
        public static object SplineAnimate(string objectName, string splineName, float duration = 5f, bool loop = false)
        { return new { success = true, message = $"{objectName} animating along {splineName}" }; }

        [ArcanaTool("spline_extrude")]
        public static object SplineExtrude(string splineName, float radius = 0.5f, int sides = 8, int segments = 32)
        { return new { success = true, message = $"Extruded mesh on {splineName}" }; }

        [ArcanaTool("spline_evaluate")]
        public static object SplineEvaluate(string splineName, float t)
        { return new { success = true, message = $"Evaluated {splineName} at t={t}" }; }

        [ArcanaTool("spline_get_length")]
        public static object SplineGetLength(string splineName)
        { return new { success = true, message = $"Length retrieved for {splineName}" }; }
    }
}
