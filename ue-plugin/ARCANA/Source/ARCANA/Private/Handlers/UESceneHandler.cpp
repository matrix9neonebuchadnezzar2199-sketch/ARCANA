#include "Handlers/UESceneHandler.h"
#include "ArcanaToolRouter.h"
#include "Engine/World.h"
#include "GameFramework/Actor.h"
#include "Editor.h"
#include "EngineUtils.h"

void FUESceneHandler::Register()
{
    auto& Router = FArcanaToolRouter::Get();

    Router.RegisterRoute(TEXT("ue_scene_list_actors"), FArcanaToolHandler::CreateLambda([](TSharedPtr<FJsonObject> Params) -> TSharedPtr<FJsonObject>
    {
        TSharedPtr<FJsonObject> Result = MakeShareable(new FJsonObject());
        TArray<TSharedPtr<FJsonValue>> ActorArray;

        if (GEditor && GEditor->GetEditorWorldContext().World())
        {
            UWorld* World = GEditor->GetEditorWorldContext().World();
            for (TActorIterator<AActor> It(World); It; ++It)
            {
                AActor* Actor = *It;
                TSharedPtr<FJsonObject> ActorObj = MakeShareable(new FJsonObject());
                ActorObj->SetStringField(TEXT("name"), Actor->GetName());
                ActorObj->SetStringField(TEXT("class"), Actor->GetClass()->GetName());
                FVector Loc = Actor->GetActorLocation();
                TArray<TSharedPtr<FJsonValue>> LocArr;
                LocArr.Add(MakeShareable(new FJsonValueNumber(Loc.X)));
                LocArr.Add(MakeShareable(new FJsonValueNumber(Loc.Y)));
                LocArr.Add(MakeShareable(new FJsonValueNumber(Loc.Z)));
                ActorObj->SetArrayField(TEXT("location"), LocArr);
                ActorArray.Add(MakeShareable(new FJsonValueObject(ActorObj)));
            }
        }

        Result->SetArrayField(TEXT("actors"), ActorArray);
        Result->SetNumberField(TEXT("count"), ActorArray.Num());
        return Result;
    }));

    Router.RegisterRoute(TEXT("ue_scene_spawn_actor"), FArcanaToolHandler::CreateLambda([](TSharedPtr<FJsonObject> Params) -> TSharedPtr<FJsonObject>
    {
        TSharedPtr<FJsonObject> Result = MakeShareable(new FJsonObject());
        FString ClassName = Params->GetStringField(TEXT("class"));
        FString Name = Params->GetStringField(TEXT("name"));

        if (GEditor && GEditor->GetEditorWorldContext().World())
        {
            UWorld* World = GEditor->GetEditorWorldContext().World();
            FVector Location = FVector::ZeroVector;
            const TArray<TSharedPtr<FJsonValue>>* LocArr;
            if (Params->TryGetArrayField(TEXT("location"), LocArr) && LocArr->Num() >= 3)
            {
                Location.X = (*LocArr)[0]->AsNumber();
                Location.Y = (*LocArr)[1]->AsNumber();
                Location.Z = (*LocArr)[2]->AsNumber();
            }

            FActorSpawnParameters SpawnParams;
            SpawnParams.Name = FName(*Name);
            AActor* NewActor = World->SpawnActor<AActor>(AActor::StaticClass(), &Location, nullptr, SpawnParams);

            if (NewActor)
            {
                Result->SetStringField(TEXT("name"), NewActor->GetName());
                Result->SetStringField(TEXT("spawned"), TEXT("true"));
            }
        }
        return Result;
    }));

    Router.RegisterRoute(TEXT("ue_scene_delete_actor"), FArcanaToolHandler::CreateLambda([](TSharedPtr<FJsonObject> Params) -> TSharedPtr<FJsonObject>
    {
        TSharedPtr<FJsonObject> Result = MakeShareable(new FJsonObject());
        FString Name = Params->GetStringField(TEXT("name"));

        if (GEditor && GEditor->GetEditorWorldContext().World())
        {
            UWorld* World = GEditor->GetEditorWorldContext().World();
            for (TActorIterator<AActor> It(World); It; ++It)
            {
                if ((*It)->GetName() == Name)
                {
                    World->DestroyActor(*It);
                    Result->SetStringField(TEXT("deleted"), Name);
                    break;
                }
            }
        }
        return Result;
    }));

    Router.RegisterRoute(TEXT("ue_scene_find_actor"), FArcanaToolHandler::CreateLambda([](TSharedPtr<FJsonObject> Params) -> TSharedPtr<FJsonObject>
    {
        TSharedPtr<FJsonObject> Result = MakeShareable(new FJsonObject());
        FString Query = Params->GetStringField(TEXT("query"));

        if (GEditor && GEditor->GetEditorWorldContext().World())
        {
            TArray<TSharedPtr<FJsonValue>> Found;
            UWorld* World = GEditor->GetEditorWorldContext().World();
            for (TActorIterator<AActor> It(World); It; ++It)
            {
                if ((*It)->GetName().Contains(Query))
                {
                    TSharedPtr<FJsonObject> A = MakeShareable(new FJsonObject());
                    A->SetStringField(TEXT("name"), (*It)->GetName());
                    A->SetStringField(TEXT("class"), (*It)->GetClass()->GetName());
                    Found.Add(MakeShareable(new FJsonValueObject(A)));
                }
            }
            Result->SetArrayField(TEXT("found"), Found);
        }
        return Result;
    }));

    Router.RegisterRoute(TEXT("ue_scene_duplicate_actor"), FArcanaToolHandler::CreateLambda([](TSharedPtr<FJsonObject> Params) -> TSharedPtr<FJsonObject>
    {
        TSharedPtr<FJsonObject> Result = MakeShareable(new FJsonObject());
        Result->SetStringField(TEXT("status"), TEXT("stub"));
        return Result;
    }));

    Router.RegisterRoute(TEXT("ue_scene_set_actor_label"), FArcanaToolHandler::CreateLambda([](TSharedPtr<FJsonObject> Params) -> TSharedPtr<FJsonObject>
    {
        TSharedPtr<FJsonObject> Result = MakeShareable(new FJsonObject());
        FString Name = Params->GetStringField(TEXT("name"));
        FString Label = Params->GetStringField(TEXT("label"));

        if (GEditor && GEditor->GetEditorWorldContext().World())
        {
            UWorld* World = GEditor->GetEditorWorldContext().World();
            for (TActorIterator<AActor> It(World); It; ++It)
            {
                if ((*It)->GetName() == Name)
                {
                    (*It)->SetActorLabel(Label);
                    Result->SetStringField(TEXT("name"), Name);
                    Result->SetStringField(TEXT("label"), Label);
                    break;
                }
            }
        }
        return Result;
    }));

    UE_LOG(LogTemp, Log, TEXT("[ARCANA] UE Scene Handler: 6 tools registered"));
}
