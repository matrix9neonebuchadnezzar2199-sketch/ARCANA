using System;

namespace Arcana.Runtime
{
    [AttributeUsage(AttributeTargets.Method)]
    public class ArcanaToolAttribute : Attribute
    {
        public string Id { get; }
        public string Description { get; }
        public string DescriptionJa { get; }
        public string Category { get; }

        public ArcanaToolAttribute(
            string id,
            string description,
            string descriptionJa = "",
            string category = "general")
        {
            Id = id;
            Description = description;
            DescriptionJa = descriptionJa;
            Category = category;
        }
    }
}