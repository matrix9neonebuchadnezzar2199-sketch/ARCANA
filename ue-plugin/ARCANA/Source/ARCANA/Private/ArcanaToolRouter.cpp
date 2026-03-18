#include "ArcanaToolRouter.h"

FArcanaToolRouter& FArcanaToolRouter::Get()
{
    static FArcanaToolRouter Instance;
    return Instance;
}

void FArcanaToolRouter::RegisterRoute(const FString& ToolId, FArcanaToolHandler Handler)
{
    Routes.Add(ToolId, Handler);
}

TSharedPtr<FJsonObject> FArcanaToolRouter::ExecuteTool(const FString& ToolId, TSharedPtr<FJsonObject> Params)
{
    FArcanaToolHandler* Handler = Routes.Find(ToolId);
    if (!Handler)
    {
        TSharedPtr<FJsonObject> Error = MakeShareable(new FJsonObject());
        Error->SetStringField(TEXT("error"), FString::Printf(TEXT("Unknown tool: %s"), *ToolId));
        return Error;
    }
    return Handler->Execute(Params);
}

int32 FArcanaToolRouter::GetRouteCount() const
{
    return Routes.Num();
}
