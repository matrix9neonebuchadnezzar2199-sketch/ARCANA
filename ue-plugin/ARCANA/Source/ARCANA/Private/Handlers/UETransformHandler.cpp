#include "Handlers/UETransformHandler.h"
#include "ArcanaToolRouter.h"
#include "Engine/World.h"
#include "GameFramework/Actor.h"
#include "Editor.h"
#include "EngineUtils.h"

static AActor* FindActorByName(const FString& Name)
{
    if (!GEditor || !GEditor->GetEditorWorldContext().World()) return nullptr;
    UWorld* World = GEditor->GetEditorWorldContext().World();
    for (TActorIterator<AActor> It(World); It; ++It)
    {
        if ((*It)->GetName() == Name) return *It;
    }
    return nullptr;
}

void FUETransformHandler::Register()
{
    auto& Router = FArcanaToolRouter::Get();

    Router.RegisterRoute(TEXT("ue_transform_set_location"), FArcanaToolHandler::CreateLambda([](TSharedPtr<FJsonObject> Params) -> TSharedPtr<FJsonObject>
    {
        TSharedPtr<FJsonObject> Result = MakeShareable(new FJsonObject());
        AActor* Actor = FindActorByName(Params->GetStringField(TEXT("name")));
        if (Actor)
        {
            const TArray<TSharedPtr<FJsonValue>>* Loc;
            if (Params->TryGetArrayField(TEXT("location"), Loc) && Loc->Num() >= 3)
            {
                Actor->SetActorLocation(FVector((*Loc)[0]->AsNumber(), (*Loc)[1]->AsNumber(), (*Loc)[2]->AsNumber()));
                Result->SetStringField(TEXT("name"), Actor->GetName());
                Result->SetStringField(TEXT("set"), TEXT("location"));
            }
        }
        return Result;
    }));

    Router.RegisterRoute(TEXT("ue_transform_set_rotation"), FArcanaToolHandler::CreateLambda([](TSharedPtr<FJsonObject> Params) -> TSharedPtr<FJsonObject>
    {
        TSharedPtr<FJsonObject> Result = MakeShareable(new FJsonObject());
        AActor* Actor = FindActorByName(Params->GetStringField(TEXT("name")));
        if (Actor)
        {
            const TArray<TSharedPtr<FJsonValue>>* Rot;
            if (Params->TryGetArrayField(TEXT("rotation"), Rot) && Rot->Num() >= 3)
            {
                Actor->SetActorRotation(FRotator((*Rot)[0]->AsNumber(), (*Rot)[1]->AsNumber(), (*Rot)[2]->AsNumber()));
                Result->SetStringField(TEXT("name"), Actor->GetName());
                Result->SetStringField(TEXT("set"), TEXT("rotation"));
            }
        }
        return Result;
    }));

    Router.RegisterRoute(TEXT("ue_transform_set_scale"), FArcanaToolHandler::CreateLambda([](TSharedPtr<FJsonObject> Params) -> TSharedPtr<FJsonObject>
    {
        TSharedPtr<FJsonObject> Result = MakeShareable(new FJsonObject());
        AActor* Actor = FindActorByName(Params->GetStringField(TEXT("name")));
        if (Actor)
        {
            const TArray<TSharedPtr<FJsonValue>>* Scl;
            if (Params->TryGetArrayField(TEXT("scale"), Scl) && Scl->Num() >= 3)
            {
                Actor->SetActorScale3D(FVector((*Scl)[0]->AsNumber(), (*Scl)[1]->AsNumber(), (*Scl)[2]->AsNumber()));
                Result->SetStringField(TEXT("set"), TEXT("scale"));
            }
        }
        return Result;
    }));

    Router.RegisterRoute(TEXT("ue_transform_get_transform"), FArcanaToolHandler::CreateLambda([](TSharedPtr<FJsonObject> Params) -> TSharedPtr<FJsonObject>
    {
        TSharedPtr<FJsonObject> Result = MakeShareable(new FJsonObject());
        AActor* Actor = FindActorByName(Params->GetStringField(TEXT("name")));
        if (Actor)
        {
            FVector L = Actor->GetActorLocation();
            FRotator R = Actor->GetActorRotation();
            FVector S = Actor->GetActorScale3D();
            Result->SetStringField(TEXT("name"), Actor->GetName());

            auto MakeArr = [](double X, double Y, double Z) {
                TArray<TSharedPtr<FJsonValue>> A;
                A.Add(MakeShareable(new FJsonValueNumber(X)));
                A.Add(MakeShareable(new FJsonValueNumber(Y)));
                A.Add(MakeShareable(new FJsonValueNumber(Z)));
                return A;
            };
            Result->SetArrayField(TEXT("location"), MakeArr(L.X, L.Y, L.Z));
            Result->SetArrayField(TEXT("rotation"), MakeArr(R.Pitch, R.Yaw, R.Roll));
            Result->SetArrayField(TEXT("scale"), MakeArr(S.X, S.Y, S.Z));
        }
        return Result;
    }));

    Router.RegisterRoute(TEXT("ue_transform_add_offset"), FArcanaToolHandler::CreateLambda([](TSharedPtr<FJsonObject> Params) -> TSharedPtr<FJsonObject>
    {
        TSharedPtr<FJsonObject> Result = MakeShareable(new FJsonObject());
        AActor* Actor = FindActorByName(Params->GetStringField(TEXT("name")));
        if (Actor)
        {
            const TArray<TSharedPtr<FJsonValue>>* Off;
            if (Params->TryGetArrayField(TEXT("offset"), Off) && Off->Num() >= 3)
            {
                FVector Cur = Actor->GetActorLocation();
                Cur += FVector((*Off)[0]->AsNumber(), (*Off)[1]->AsNumber(), (*Off)[2]->AsNumber());
                Actor->SetActorLocation(Cur);
                Result->SetStringField(TEXT("moved"), Actor->GetName());
            }
        }
        return Result;
    }));

    Router.RegisterRoute(TEXT("ue_transform_snap_to_ground"), FArcanaToolHandler::CreateLambda([](TSharedPtr<FJsonObject> Params) -> TSharedPtr<FJsonObject>
    {
        TSharedPtr<FJsonObject> Result = MakeShareable(new FJsonObject());
        Result->SetStringField(TEXT("status"), TEXT("stub"));
        return Result;
    }));

    UE_LOG(LogTemp, Log, TEXT("[ARCANA] UE Transform Handler: 6 tools registered"));
}
