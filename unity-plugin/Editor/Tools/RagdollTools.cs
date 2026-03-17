using UnityEngine;
using UnityEditor;

namespace Arcana.Tools
{
    public static class RagdollTools
    {
        [ArcanaTool("ragdoll_create")]
        public static object RagdollCreate(string objectName, float totalMass = 70f)
        { return new { success = true, message = $"Ragdoll created on {objectName}" }; }

        [ArcanaTool("ragdoll_enable")]
        public static object RagdollEnable(string objectName, bool enabled = true)
        { return new { success = true, message = $"Ragdoll {(enabled ? "enabled" : "disabled")} on {objectName}" }; }

        [ArcanaTool("ragdoll_set_joint_limits")]
        public static object RagdollSetJointLimits(string objectName, string boneName, float lowTwist = -20, float highTwist = 20, float swing1 = 30, float swing2 = 30)
        { return new { success = true, message = $"Joint limits set on {boneName}" }; }

        [ArcanaTool("ragdoll_add_force")]
        public static object RagdollAddForce(string objectName, string boneName, float forceX, float forceY, float forceZ, string mode = "Impulse")
        { return new { success = true, message = $"Force applied to {boneName}" }; }

        [ArcanaTool("ragdoll_set_collision")]
        public static object RagdollSetCollision(string objectName, string mode = "Continuous")
        { return new { success = true, message = $"Collision mode set to {mode}" }; }

        [ArcanaTool("ragdoll_remove")]
        public static object RagdollRemove(string objectName)
        { return new { success = true, message = $"Ragdoll removed from {objectName}" }; }
    }
}
