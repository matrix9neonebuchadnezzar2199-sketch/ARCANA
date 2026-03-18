#include "ArcanaBridge.h"
#include "ArcanaToolRouter.h"
#include "WebSocketsModule.h"
#include "Serialization/JsonReader.h"
#include "Serialization/JsonWriter.h"
#include "Serialization/JsonSerializer.h"

FArcanaBridge& FArcanaBridge::Get()
{
    static FArcanaBridge Instance;
    return Instance;
}

FArcanaBridge::FArcanaBridge()
{
}

FArcanaBridge::~FArcanaBridge()
{
    Disconnect();
}

void FArcanaBridge::Connect(const FString& Host, int32 Port)
{
    if (bConnected) return;

    FModuleManager::Get().LoadModuleChecked<FWebSocketsModule>("WebSockets");

    FString URL = FString::Printf(TEXT("ws://%s:%d"), *Host, Port);
    FString Protocol = TEXT("arcana");

    WebSocket = FWebSocketsModule::Get().CreateWebSocket(URL, Protocol);

    WebSocket->OnConnected().AddRaw(this, &FArcanaBridge::OnConnected);
    WebSocket->OnConnectionError().AddRaw(this, &FArcanaBridge::OnConnectionError);
    WebSocket->OnClosed().AddRaw(this, &FArcanaBridge::OnClosed);
    WebSocket->OnMessage().AddRaw(this, &FArcanaBridge::OnMessage);

    WebSocket->Connect();
    UE_LOG(LogTemp, Log, TEXT("[ARCANA] Connecting to %s..."), *URL);
}

void FArcanaBridge::Disconnect()
{
    if (WebSocket.IsValid())
    {
        WebSocket->Close();
        WebSocket.Reset();
    }
    bConnected = false;
    PendingRequests.Empty();
}

bool FArcanaBridge::IsConnected() const
{
    return bConnected;
}

void FArcanaBridge::OnConnected()
{
    bConnected = true;
    UE_LOG(LogTemp, Log, TEXT("[ARCANA] Connected to MCP server"));
    SendRegistration();
}

void FArcanaBridge::OnConnectionError(const FString& Error)
{
    UE_LOG(LogTemp, Error, TEXT("[ARCANA] Connection error: %s"), *Error);
    bConnected = false;
}

void FArcanaBridge::OnClosed(int32 StatusCode, const FString& Reason, bool bWasClean)
{
    UE_LOG(LogTemp, Warning, TEXT("[ARCANA] Disconnected: %s (code %d)"), *Reason, StatusCode);
    bConnected = false;
}

void FArcanaBridge::OnMessage(const FString& Message)
{
    TSharedPtr<FJsonObject> JsonObj;
    TSharedRef<TJsonReader<>> Reader = TJsonReaderFactory<>::Create(Message);

    if (!FJsonSerializer::Deserialize(Reader, JsonObj) || !JsonObj.IsValid())
    {
        UE_LOG(LogTemp, Error, TEXT("[ARCANA] Failed to parse: %s"), *Message);
        return;
    }

    // Check if this is a response to a pending request
    FString Id;
    if (JsonObj->TryGetStringField(TEXT("id"), Id))
    {
        if (PendingRequests.Contains(Id))
        {
            FOnArcanaResponse Callback = PendingRequests[Id];
            PendingRequests.Remove(Id);

            bool bSuccess = JsonObj->GetBoolField(TEXT("success"));
            TSharedPtr<FJsonObject> Result = JsonObj->GetObjectField(TEXT("result"));

            Callback.ExecuteIfBound(bSuccess, Result);
            return;
        }
    }

    // Incoming command from server
    FString ToolId;
    if (JsonObj->TryGetStringField(TEXT("tool"), ToolId))
    {
        CommandCount++;
        HandleIncomingCommand(Id, ToolId, JsonObj->GetObjectField(TEXT("params")));
    }
}

void FArcanaBridge::SendRegistration()
{
    TSharedPtr<FJsonObject> Reg = MakeShareable(new FJsonObject());
    Reg->SetStringField(TEXT("type"), TEXT("register"));
    Reg->SetStringField(TEXT("editor"), TEXT("unreal"));
    Reg->SetStringField(TEXT("version"), FEngineVersion::Current().ToString());
    Reg->SetNumberField(TEXT("tools"), 192);

    FString Output;
    TSharedRef<TJsonWriter<>> Writer = TJsonWriterFactory<>::Create(&Output);
    FJsonSerializer::Serialize(Reg.ToSharedRef(), Writer);
    WebSocket->Send(Output);

    UE_LOG(LogTemp, Log, TEXT("[ARCANA] Registration sent"));
}

void FArcanaBridge::SendCommand(const FString& ToolId, TSharedPtr<FJsonObject> Params, FOnArcanaResponse Callback)
{
    if (!bConnected)
    {
        Callback.ExecuteIfBound(false, nullptr);
        return;
    }

    FString Id = FString::Printf(TEXT("ue_%lld_%d"), FDateTime::Now().GetTicks(), FMath::Rand());

    TSharedPtr<FJsonObject> Msg = MakeShareable(new FJsonObject());
    Msg->SetStringField(TEXT("id"), Id);
    Msg->SetStringField(TEXT("tool"), ToolId);
    Msg->SetObjectField(TEXT("params"), Params.IsValid() ? Params : MakeShareable(new FJsonObject()));

    FString Output;
    TSharedRef<TJsonWriter<>> Writer = TJsonWriterFactory<>::Create(&Output);
    FJsonSerializer::Serialize(Msg.ToSharedRef(), Writer);
    WebSocket->Send(Output);

    PendingRequests.Add(Id, Callback);
}


void FArcanaBridge::HandleIncomingCommand(const FString& Id, const FString& ToolId, TSharedPtr<FJsonObject> Params)
{
    TSharedPtr<FJsonObject> Result = FArcanaToolRouter::Get().ExecuteTool(ToolId, Params);

    TSharedPtr<FJsonObject> Response = MakeShareable(new FJsonObject());
    Response->SetStringField(TEXT("id"), Id);
    Response->SetBoolField(TEXT("success"), !Result->HasField(TEXT("error")));
    Response->SetObjectField(TEXT("result"), Result);

    FString Output;
    TSharedRef<TJsonWriter<>> Writer = TJsonWriterFactory<>::Create(&Output);
    FJsonSerializer::Serialize(Response.ToSharedRef(), Writer);
    WebSocket->Send(Output);
}
