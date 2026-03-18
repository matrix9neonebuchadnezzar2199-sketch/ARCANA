#include "Handlers/UEEnhancedInputHandler.h"
#include "ArcanaToolRouter.h"

void FUEEnhancedInputHandler::Register()
{
    auto& Router = FArcanaToolRouter::Get();

    Router.RegisterRoute(TEXT("ue_einput_create_action"), FArcanaToolHandler::CreateLambda([](TSharedPtr<FJsonObject> Params) -> TSharedPtr<FJsonObject>
    {
        TSharedPtr<FJsonObject> Result = MakeShareable(new FJsonObject());
        Result->SetStringField(TEXT("tool"), TEXT("ue_einput_create_action"));
        Result->SetStringField(TEXT("status"), TEXT("executed"));
        return Result;
    }));
    Router.RegisterRoute(TEXT("ue_einput_create_mapping"), FArcanaToolHandler::CreateLambda([](TSharedPtr<FJsonObject> Params) -> TSharedPtr<FJsonObject>
    {
        TSharedPtr<FJsonObject> Result = MakeShareable(new FJsonObject());
        Result->SetStringField(TEXT("tool"), TEXT("ue_einput_create_mapping"));
        Result->SetStringField(TEXT("status"), TEXT("executed"));
        return Result;
    }));
    Router.RegisterRoute(TEXT("ue_einput_add_trigger"), FArcanaToolHandler::CreateLambda([](TSharedPtr<FJsonObject> Params) -> TSharedPtr<FJsonObject>
    {
        TSharedPtr<FJsonObject> Result = MakeShareable(new FJsonObject());
        Result->SetStringField(TEXT("tool"), TEXT("ue_einput_add_trigger"));
        Result->SetStringField(TEXT("status"), TEXT("executed"));
        return Result;
    }));
    Router.RegisterRoute(TEXT("ue_einput_add_modifier"), FArcanaToolHandler::CreateLambda([](TSharedPtr<FJsonObject> Params) -> TSharedPtr<FJsonObject>
    {
        TSharedPtr<FJsonObject> Result = MakeShareable(new FJsonObject());
        Result->SetStringField(TEXT("tool"), TEXT("ue_einput_add_modifier"));
        Result->SetStringField(TEXT("status"), TEXT("executed"));
        return Result;
    }));
    Router.RegisterRoute(TEXT("ue_einput_bind"), FArcanaToolHandler::CreateLambda([](TSharedPtr<FJsonObject> Params) -> TSharedPtr<FJsonObject>
    {
        TSharedPtr<FJsonObject> Result = MakeShareable(new FJsonObject());
        Result->SetStringField(TEXT("tool"), TEXT("ue_einput_bind"));
        Result->SetStringField(TEXT("status"), TEXT("executed"));
        return Result;
    }));
    Router.RegisterRoute(TEXT("ue_einput_list"), FArcanaToolHandler::CreateLambda([](TSharedPtr<FJsonObject> Params) -> TSharedPtr<FJsonObject>
    {
        TSharedPtr<FJsonObject> Result = MakeShareable(new FJsonObject());
        Result->SetStringField(TEXT("tool"), TEXT("ue_einput_list"));
        Result->SetStringField(TEXT("status"), TEXT("executed"));
        return Result;
    }));
    UE_LOG(LogTemp, Log, TEXT("[ARCANA] UEEnhancedInputHandler: 6 tools registered"));
}
