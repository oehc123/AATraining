#include "InteractionModule.h"

#include <youireact/NativeModuleRegistry.h>
#include <framework/YiAppContext.h>
#include <framework/YiApp.h>
#include <scenetree/YiSceneManager.h>

#define LOG_TAG "InteractionModule"

YI_RN_INSTANTIATE_MODULE(InteractionModule, yi::react::EventEmitterModule);
YI_RN_REGISTER_MODULE(InteractionModule);

static const std::string USER_INTERACTION = "USER_INTERACTION";

InteractionModule::InteractionModule()
{
    SetSupportedEvents
    ({
       USER_INTERACTION
    });
}

InteractionModule::~InteractionModule() = default;


bool InteractionModule::HandleEvent(const std::shared_ptr<CYIEventDispatcher> &pDispatcher, CYIEvent *pEvent)
{
    YI_UNUSED(pDispatcher);
    YI_UNUSED(pEvent);
    YI_LOGD("InteractionModule", "Jose EmitEvent c++ ");
    EmitEvent(USER_INTERACTION, {}); //emits to JS

    return false;
}

YI_RN_DEFINE_EXPORT_METHOD(InteractionModule, startListening)()
{
     CYIAppContext::GetInstance()->GetApp()->GetSceneManager()->AddGlobalEventListener(CYIEvent::Type::KeyDown, this);
}

YI_RN_DEFINE_EXPORT_METHOD(InteractionModule, stopListening)()
{
     CYIAppContext::GetInstance()->GetApp()->GetSceneManager()->RemoveGlobalEventListener(CYIEvent::Type::KeyDown, this);
}