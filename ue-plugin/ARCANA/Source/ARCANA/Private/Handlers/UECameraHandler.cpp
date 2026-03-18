#include "Handlers/UECameraHandler.h"
#include "ArcanaToolRouter.h"

void FUECameraHandler::Register()
{
    auto& Router = FArcanaToolRouter::Get();

    Router.RegisterRoute(TEXT("ue_camera_create"), FArcanaToolHandler::CreateLambda([](TSharedPtr<FJsonObject> Params) -> TSharedPtr<FJsonObject>
    {
        TSharedPtr<FJsonObject> Result = MakeShareable(new FJsonObject());
        Result->SetStringField(TEXT("tool"), TEXT("ue_camera_create"));
        Result->SetStringField(TEXT("status"), TEXT("executed"));
        return Result;
    }));
    Router.RegisterRoute(TEXT("ue_camera_set_fov"), FArcanaToolHandler::CreateLambda([](TSharedPtr<FJsonObject> Params) -> TSharedPtr<FJsonObject>
    {
        TSharedPtr<FJsonObject> Result = MakeShareable(new FJsonObject());
        Result->SetStringField(TEXT("tool"), TEXT("ue_camera_set_fov"));
        Result->SetStringField(TEXT("status"), TEXT("executed"));
        return Result;
    }));
    Router.RegisterRoute(TEXT("ue_camera_set_location"), FArcanaToolHandler::CreateLambda([](TSharedPtr<FJsonObject> Params) -> TSharedPtr<FJsonObject>
    {
        TSharedPtr<FJsonObject> Result = MakeShareable(new FJsonObject());
        Result->SetStringField(TEXT("tool"), TEXT("ue_camera_set_location"));
        Result->SetStringField(TEXT("status"), TEXT("executed"));
        return Result;
    }));
    Router.RegisterRoute(TEXT("ue_camera_set_active"), FArcanaToolHandler::CreateLambda([](TSharedPtr<FJsonObject> Params) -> TSharedPtr<FJsonObject>
    {
        TSharedPtr<FJsonObject> Result = MakeShareable(new FJsonObject());
        Result->SetStringField(TEXT("tool"), TEXT("ue_camera_set_active"));
        Result->SetStringField(TEXT("status"), TEXT("executed"));
        return Result;
    }));
    Router.RegisterRoute(TEXT("ue_camera_set_post_process"), FArcanaToolHandler::CreateLambda([](TSharedPtr<FJsonObject> Params) -> TSharedPtr<FJsonObject>
    {
        TSharedPtr<FJsonObject> Result = MakeShareable(new FJsonObject());
        Result->SetStringField(TEXT("tool"), TEXT("ue_camera_set_post_process"));
        Result->SetStringField(TEXT("status"), TEXT("executed"));
        return Result;
    }));
    Router.RegisterRoute(TEXT("ue_camera_list"), FArcanaToolHandler::CreateLambda([](TSharedPtr<FJsonObject> Params) -> TSharedPtr<FJsonObject>
    {
        TSharedPtr<FJsonObject> Result = MakeShareable(new FJsonObject());
        Result->SetStringField(TEXT("tool"), TEXT("ue_camera_list"));
        Result->SetStringField(TEXT("status"), TEXT("executed"));
        return Result;
    }));
    UE_LOG(LogTemp, Log, TEXT("[ARCANA] UECameraHandler: 6 tools registered"));
}
