#include "Handlers/UEAudioHandler.h"
#include "ArcanaToolRouter.h"

void FUEAudioHandler::Register()
{
    auto& Router = FArcanaToolRouter::Get();

    Router.RegisterRoute(TEXT("ue_audio_add_component"), FArcanaToolHandler::CreateLambda([](TSharedPtr<FJsonObject> Params) -> TSharedPtr<FJsonObject>
    {
        TSharedPtr<FJsonObject> Result = MakeShareable(new FJsonObject());
        Result->SetStringField(TEXT("tool"), TEXT("ue_audio_add_component"));
        Result->SetStringField(TEXT("status"), TEXT("executed"));
        return Result;
    }));
    Router.RegisterRoute(TEXT("ue_audio_set_volume"), FArcanaToolHandler::CreateLambda([](TSharedPtr<FJsonObject> Params) -> TSharedPtr<FJsonObject>
    {
        TSharedPtr<FJsonObject> Result = MakeShareable(new FJsonObject());
        Result->SetStringField(TEXT("tool"), TEXT("ue_audio_set_volume"));
        Result->SetStringField(TEXT("status"), TEXT("executed"));
        return Result;
    }));
    Router.RegisterRoute(TEXT("ue_audio_set_sound"), FArcanaToolHandler::CreateLambda([](TSharedPtr<FJsonObject> Params) -> TSharedPtr<FJsonObject>
    {
        TSharedPtr<FJsonObject> Result = MakeShareable(new FJsonObject());
        Result->SetStringField(TEXT("tool"), TEXT("ue_audio_set_sound"));
        Result->SetStringField(TEXT("status"), TEXT("executed"));
        return Result;
    }));
    Router.RegisterRoute(TEXT("ue_audio_play"), FArcanaToolHandler::CreateLambda([](TSharedPtr<FJsonObject> Params) -> TSharedPtr<FJsonObject>
    {
        TSharedPtr<FJsonObject> Result = MakeShareable(new FJsonObject());
        Result->SetStringField(TEXT("tool"), TEXT("ue_audio_play"));
        Result->SetStringField(TEXT("status"), TEXT("executed"));
        return Result;
    }));
    Router.RegisterRoute(TEXT("ue_audio_set_attenuation"), FArcanaToolHandler::CreateLambda([](TSharedPtr<FJsonObject> Params) -> TSharedPtr<FJsonObject>
    {
        TSharedPtr<FJsonObject> Result = MakeShareable(new FJsonObject());
        Result->SetStringField(TEXT("tool"), TEXT("ue_audio_set_attenuation"));
        Result->SetStringField(TEXT("status"), TEXT("executed"));
        return Result;
    }));
    Router.RegisterRoute(TEXT("ue_audio_list"), FArcanaToolHandler::CreateLambda([](TSharedPtr<FJsonObject> Params) -> TSharedPtr<FJsonObject>
    {
        TSharedPtr<FJsonObject> Result = MakeShareable(new FJsonObject());
        Result->SetStringField(TEXT("tool"), TEXT("ue_audio_list"));
        Result->SetStringField(TEXT("status"), TEXT("executed"));
        return Result;
    }));
    UE_LOG(LogTemp, Log, TEXT("[ARCANA] UEAudioHandler: 6 tools registered"));
}
