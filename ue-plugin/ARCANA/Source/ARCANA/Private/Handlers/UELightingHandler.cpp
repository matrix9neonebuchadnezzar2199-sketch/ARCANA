#include "Handlers/UELightingHandler.h"
#include "ArcanaToolRouter.h"

void FUELightingHandler::Register()
{
    auto& Router = FArcanaToolRouter::Get();

    Router.RegisterRoute(TEXT("ue_light_create"), FArcanaToolHandler::CreateLambda([](TSharedPtr<FJsonObject> Params) -> TSharedPtr<FJsonObject>
    {
        TSharedPtr<FJsonObject> Result = MakeShareable(new FJsonObject());
        Result->SetStringField(TEXT("tool"), TEXT("ue_light_create"));
        Result->SetStringField(TEXT("status"), TEXT("executed"));
        return Result;
    }));
    Router.RegisterRoute(TEXT("ue_light_set_color"), FArcanaToolHandler::CreateLambda([](TSharedPtr<FJsonObject> Params) -> TSharedPtr<FJsonObject>
    {
        TSharedPtr<FJsonObject> Result = MakeShareable(new FJsonObject());
        Result->SetStringField(TEXT("tool"), TEXT("ue_light_set_color"));
        Result->SetStringField(TEXT("status"), TEXT("executed"));
        return Result;
    }));
    Router.RegisterRoute(TEXT("ue_light_set_intensity"), FArcanaToolHandler::CreateLambda([](TSharedPtr<FJsonObject> Params) -> TSharedPtr<FJsonObject>
    {
        TSharedPtr<FJsonObject> Result = MakeShareable(new FJsonObject());
        Result->SetStringField(TEXT("tool"), TEXT("ue_light_set_intensity"));
        Result->SetStringField(TEXT("status"), TEXT("executed"));
        return Result;
    }));
    Router.RegisterRoute(TEXT("ue_light_set_type"), FArcanaToolHandler::CreateLambda([](TSharedPtr<FJsonObject> Params) -> TSharedPtr<FJsonObject>
    {
        TSharedPtr<FJsonObject> Result = MakeShareable(new FJsonObject());
        Result->SetStringField(TEXT("tool"), TEXT("ue_light_set_type"));
        Result->SetStringField(TEXT("status"), TEXT("executed"));
        return Result;
    }));
    Router.RegisterRoute(TEXT("ue_light_set_shadow"), FArcanaToolHandler::CreateLambda([](TSharedPtr<FJsonObject> Params) -> TSharedPtr<FJsonObject>
    {
        TSharedPtr<FJsonObject> Result = MakeShareable(new FJsonObject());
        Result->SetStringField(TEXT("tool"), TEXT("ue_light_set_shadow"));
        Result->SetStringField(TEXT("status"), TEXT("executed"));
        return Result;
    }));
    Router.RegisterRoute(TEXT("ue_light_list"), FArcanaToolHandler::CreateLambda([](TSharedPtr<FJsonObject> Params) -> TSharedPtr<FJsonObject>
    {
        TSharedPtr<FJsonObject> Result = MakeShareable(new FJsonObject());
        Result->SetStringField(TEXT("tool"), TEXT("ue_light_list"));
        Result->SetStringField(TEXT("status"), TEXT("executed"));
        return Result;
    }));
    UE_LOG(LogTemp, Log, TEXT("[ARCANA] UELightingHandler: 6 tools registered"));
}
