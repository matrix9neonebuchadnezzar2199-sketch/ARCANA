#pragma once

#include "CoreMinimal.h"
#include "Modules/ModuleManager.h"

class FArcanaModule : public IModuleInterface
{
public:
    virtual void StartupModule() override;
    virtual void ShutdownModule() override;

    static FArcanaModule& Get();

private:
    void RegisterMenus();
};
