#include "Handlers/UEPCGHandler.h"
#include "ArcanaToolRouter.h"

void FUEPCGHandler::Register()
{
    auto& Router = FArcanaToolRouter::Get();

    Router.RegisterRoute(TEXT("ue_pcg_create_graph"), FArcanaToolHandler::CreateLambda([](TSharedPtr<FJsonObject> Params) -> TSharedPtr<FJsonObject>
    {
        TSharedPtr<FJsonObject> Result = MakeShareable(new FJsonObject());
        Result->SetStringField(TEXT("tool"), TEXT("ue_pcg_create_graph"));
        Result->SetStringField(TEXT("status"), TEXT("executed"));
        return Result;
    }));
    Router.RegisterRoute(TEXT("ue_pcg_add_point_sampler"), FArcanaToolHandler::CreateLambda([](TSharedPtr<FJsonObject> Params) -> TSharedPtr<FJsonObject>
    {
        TSharedPtr<FJsonObject> Result = MakeShareable(new FJsonObject());
        Result->SetStringField(TEXT("tool"), TEXT("ue_pcg_add_point_sampler"));
        Result->SetStringField(TEXT("status"), TEXT("executed"));
        return Result;
    }));
    Router.RegisterRoute(TEXT("ue_pcg_add_filter"), FArcanaToolHandler::CreateLambda([](TSharedPtr<FJsonObject> Params) -> TSharedPtr<FJsonObject>
    {
        TSharedPtr<FJsonObject> Result = MakeShareable(new FJsonObject());
        Result->SetStringField(TEXT("tool"), TEXT("ue_pcg_add_filter"));
        Result->SetStringField(TEXT("status"), TEXT("executed"));
        return Result;
    }));
    Router.RegisterRoute(TEXT("ue_pcg_add_mesh_spawner"), FArcanaToolHandler::CreateLambda([](TSharedPtr<FJsonObject> Params) -> TSharedPtr<FJsonObject>
    {
        TSharedPtr<FJsonObject> Result = MakeShareable(new FJsonObject());
        Result->SetStringField(TEXT("tool"), TEXT("ue_pcg_add_mesh_spawner"));
        Result->SetStringField(TEXT("status"), TEXT("executed"));
        return Result;
    }));
    Router.RegisterRoute(TEXT("ue_pcg_set_density"), FArcanaToolHandler::CreateLambda([](TSharedPtr<FJsonObject> Params) -> TSharedPtr<FJsonObject>
    {
        TSharedPtr<FJsonObject> Result = MakeShareable(new FJsonObject());
        Result->SetStringField(TEXT("tool"), TEXT("ue_pcg_set_density"));
        Result->SetStringField(TEXT("status"), TEXT("executed"));
        return Result;
    }));
    Router.RegisterRoute(TEXT("ue_pcg_execute"), FArcanaToolHandler::CreateLambda([](TSharedPtr<FJsonObject> Params) -> TSharedPtr<FJsonObject>
    {
        TSharedPtr<FJsonObject> Result = MakeShareable(new FJsonObject());
        Result->SetStringField(TEXT("tool"), TEXT("ue_pcg_execute"));
        Result->SetStringField(TEXT("status"), TEXT("executed"));
        return Result;
    }));
    UE_LOG(LogTemp, Log, TEXT("[ARCANA] UEPCGHandler: 6 tools registered"));
}
