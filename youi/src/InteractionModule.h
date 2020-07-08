#ifndef _YOUIREACT_INTERACTION_MODULE_H
#define _YOUIREACT_INTERACTION_MODULE_H

#include <youireact/NativeModule.h>
#include <event/YiEventHandler.h>
#include <youireact/modules/EventEmitter.h>

class YI_RN_MODULE(InteractionModule, yi::react::EventEmitterModule), public CYIEventHandler
{
public:
    InteractionModule();
    virtual ~InteractionModule() final;

    virtual bool HandleEvent(const std::shared_ptr<CYIEventDispatcher> &pDispatcher, CYIEvent *pEvent) override;

    YI_RN_EXPORT_NAME(InteractionModule);

    YI_RN_EXPORT_METHOD(startListening)();
    YI_RN_EXPORT_METHOD(stopListening)();
};

#endif
