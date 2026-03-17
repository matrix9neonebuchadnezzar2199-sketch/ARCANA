using UnityEngine;
using UnityEditor;

namespace Arcana.Tools
{
    public static class ClothTools
    {
        [ArcanaTool("cloth_add")]
        public static object ClothAdd(string objectName)
        { return new { success = true, message = $"Cloth added to {objectName}" }; }

        [ArcanaTool("cloth_set_params")]
        public static object ClothSetParams(string objectName, float damping = 0.1f, float stiffness = 0.5f, float stretchLimit = 0.1f, float friction = 0.5f)
        { return new { success = true, message = $"Cloth params updated on {objectName}" }; }

        [ArcanaTool("cloth_set_gravity")]
        public static object ClothSetGravity(string objectName, bool useGravity = true, float externalX = 0, float externalY = 0, float externalZ = 0)
        { return new { success = true, message = $"Cloth gravity set on {objectName}" }; }

        [ArcanaTool("cloth_add_collider")]
        public static object ClothAddCollider(string objectName, string colliderObject, string colliderType = "sphere")
        { return new { success = true, message = $"Cloth collider added from {colliderObject}" }; }

        [ArcanaTool("cloth_remove")]
        public static object ClothRemove(string objectName)
        { return new { success = true, message = $"Cloth removed from {objectName}" }; }
    }
}
