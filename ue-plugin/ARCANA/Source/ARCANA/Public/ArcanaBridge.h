#pragma once

#include "CoreMinimal.h"
#include "IWebSocket.h"
#include "Dom/JsonObject.h"

DECLARE_DELEGATE_TwoParams(FOnArcanaResponse, bool /* bSuccess */, TSharedPtr<FJsonObject> /* Result */);

class ARCANA_API FArcanaBridge
{
public:
    static FArcanaBridge& Get();

    void Connect(const FString& Host = TEXT("localhost"), int32 Port = 9878);
    void Disconnect();
    bool IsConnected() const;

    void SendCommand(const FString& ToolId, TSharedPtr<FJsonObject> Params, FOnArcanaResponse Callback);

private:
    FArcanaBridge();
    ~FArcanaBridge();

    void OnConnected();
    void OnConnectionError(const FString& Error);
    void OnClosed(int32 StatusCode, const FString& Reason, bool bWasClean);
    void OnMessage(const FString& Message);
    void SendRegistration();
    void HandleIncomingCommand(const FString& Id, const FString& ToolId, TSharedPtr<FJsonObject> Params);

    TSharedPtr<IWebSocket> WebSocket;
    bool bConnected = false;
    int32 CommandCount = 0;

    TMap<FString, FOnArcanaResponse> PendingRequests;
};

