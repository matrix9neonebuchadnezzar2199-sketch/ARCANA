#pragma once

#include "CoreMinimal.h"
#include "Dom/JsonObject.h"

DECLARE_DELEGATE_RetVal_OneParam(TSharedPtr<FJsonObject>, FArcanaToolHandler, TSharedPtr<FJsonObject> /* Params */);

class ARCANA_API FArcanaToolRouter
{
public:
    static FArcanaToolRouter& Get();

    void RegisterRoute(const FString& ToolId, FArcanaToolHandler Handler);
    TSharedPtr<FJsonObject> ExecuteTool(const FString& ToolId, TSharedPtr<FJsonObject> Params);
    int32 GetRouteCount() const;

private:
    TMap<FString, FArcanaToolHandler> Routes;
};
