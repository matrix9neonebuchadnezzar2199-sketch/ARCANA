#include "ArcanaModule.h"
#include "Handlers/UESceneHandler.h"
#include "Handlers/UETransformHandler.h"
#include "Handlers/UEMeshHandler.h"
#include "Handlers/UEPCGHandler.h"
#include "Handlers/UEUMGHandler.h"
#include "Handlers/UEFoliageHandler.h"
#include "Handlers/UEAnimationHandler.h"
#include "Handlers/UEAudioHandler.h"
#include "Handlers/UELightingHandler.h"
#include "Handlers/UEMaterialHandler.h"
#include "Handlers/UEBuildHandler.h"
#include "Handlers/UEControlRigHandler.h"
#include "Handlers/UEEnhancedInputHandler.h"
#include "Handlers/UELevelHandler.h"
#include "Handlers/UELandscapeHandler.h"
#include "Handlers/UEBlueprintHandler.h"
#include "Handlers/UESequencerHandler.h"
#include "Handlers/UEUIHandler.h"
#include "Handlers/UEAIHandler.h"
#include "Handlers/UEMetaHumanHandler.h"
#include "Handlers/UEPhysicsHandler.h"
#include "Handlers/UECameraHandler.h"
#include "Handlers/UENiagaraHandler.h"
#include "Handlers/UEMetaSoundHandler.h"
#include "ArcanaBridge.h"
#include "ToolMenus.h"

#define LOCTEXT_NAMESPACE "FArcanaModule"

void FArcanaModule::StartupModule()
{
    UE_LOG(LogTemp, Log, TEXT("[ARCANA] Plugin starting..."));
        FUESceneHandler::Register();
    FUETransformHandler::Register();
    FUEMeshHandler::Register();
    FUEPCGHandler::Register();
    FUEUMGHandler::Register();
    FUEFoliageHandler::Register();
    FUEAnimationHandler::Register();
    FUEAudioHandler::Register();
    FUELightingHandler::Register();
    FUEMaterialHandler::Register();
    FUEBuildHandler::Register();
    FUEControlRigHandler::Register();
    FUEEnhancedInputHandler::Register();
    FUELevelHandler::Register();
    FUELandscapeHandler::Register();
    FUEBlueprintHandler::Register();
    FUESequencerHandler::Register();
    FUEUIHandler::Register();
    FUEAIHandler::Register();
    FUEMetaHumanHandler::Register();
    FUEPhysicsHandler::Register();
    FUECameraHandler::Register();
    FUENiagaraHandler::Register();
    FUEMetaSoundHandler::Register();
FArcanaBridge::Get().Connect();
    RegisterMenus();
    UE_LOG(LogTemp, Log, TEXT("[ARCANA] Plugin started. 192 tools available."));
}

void FArcanaModule::ShutdownModule()
{
    FArcanaBridge::Get().Disconnect();
    UE_LOG(LogTemp, Log, TEXT("[ARCANA] Plugin shutdown."));
}

FArcanaModule& FArcanaModule::Get()
{
    return FModuleManager::LoadModuleChecked<FArcanaModule>("ARCANA");
}

void FArcanaModule::RegisterMenus()
{
    UToolMenus::RegisterStartupCallback(FSimpleMulticastDelegate::FDelegate::CreateLambda([]()
    {
        UToolMenu* Menu = UToolMenus::Get()->ExtendMenu("LevelEditor.MainMenu.Tools");
        FToolMenuSection& Section = Menu->FindOrAddSection("ARCANA");
        Section.AddMenuEntry(
            "ARCANAStatus",
            LOCTEXT("StatusLabel", "ARCANA Status"),
            LOCTEXT("StatusTooltip", "Check ARCANA bridge connection status"),
            FSlateIcon(),
            FUIAction(FExecuteAction::CreateLambda([]()
            {
                bool bConnected = FArcanaBridge::Get().IsConnected();
                FString Msg = bConnected
                    ? TEXT("ARCANA: Connected to MCP Server")
                    : TEXT("ARCANA: Not connected. Check server is running.");
                FMessageDialog::Open(EAppMsgType::Ok, FText::FromString(Msg));
            }))
        );
    }));
}

#undef LOCTEXT_NAMESPACE

IMPLEMENT_MODULE(FArcanaModule, ARCANA)

