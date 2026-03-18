using UnrealBuildTool;

public class ARCANA : ModuleRules
{
    public ARCANA(ReadOnlyTargetRules Target) : base(Target)
    {
        PCHUsage = ModuleRules.PCHUsageMode.UseExplicitOrSharedPCHs;

        PublicDependencyModuleNames.AddRange(new string[]
        {
            "Core",
            "CoreUObject",
            "Engine",
            "InputCore",
            "WebSockets",
            "Json",
            "JsonUtilities",
        });

        PrivateDependencyModuleNames.AddRange(new string[]
        {
            "UnrealEd",
            "Slate",
            "SlateCore",
            "EditorStyle",
            "LevelEditor",
            "Landscape",
            "Foliage",
            "AIModule",
            "NavigationSystem",
            "Niagara",
            "UMG",
            "Sequencer",
            "MovieScene",
            "EnhancedInput",
            "PCG",
            "MetasoundEngine",
            "ControlRig",
            "ToolMenus",
        });
    }
}
