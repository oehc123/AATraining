#include "RNGestureHandlerModule.h"
#include <youireact/NativeModuleRegistry.h>
#define LOG_TAG "RNGestureHandlerModule"
YI_RN_INSTANTIATE_MODULE(RNGestureHandler);
YI_RN_REGISTER_MODULE(RNGestureHandler);
RNGestureHandler::RNGestureHandler()
{
}
RNGestureHandler::~RNGestureHandler() = default;
YI_RN_DEFINE_EXPORT_CONSTANT(RNGestureHandler, Direction)
{
    YI_LOGI(LOG_TAG, "RNGestureHandler::Direction");
    return folly::dynamic(ToDynamic(std::move(CYIString::EmptyString())));
}
YI_RN_DEFINE_EXPORT_METHOD(RNGestureHandler, createGestureHandler)(std::string name, uint64_t tag, const folly::dynamic &config)
{
    YI_LOGI(LOG_TAG, "RNGestureHandler::createGestureHandler");
    YI_UNUSED(name);
    YI_UNUSED(tag);
    YI_UNUSED(config);
}
YI_RN_DEFINE_EXPORT_METHOD(RNGestureHandler, attachGestureHandler)(uint64_t handlerTag, uint64_t viewTag)
{
    YI_LOGI(LOG_TAG, "RNGestureHandler::attachGestureHandler");
    YI_UNUSED(handlerTag);
    YI_UNUSED(viewTag);
}
YI_RN_DEFINE_EXPORT_METHOD(RNGestureHandler, updateGestureHandler)(uint64_t handlerTag, const folly::dynamic &newConfig)
{
    YI_LOGI(LOG_TAG, "RNGestureHandler::updateGestureHandler");
    YI_UNUSED(handlerTag);
    YI_UNUSED(newConfig);
}
YI_RN_DEFINE_EXPORT_METHOD(RNGestureHandler, dropGestureHandler)(uint64_t handlerTag)
{
    YI_LOGI(LOG_TAG, "RNGestureHandler::dropGestureHandler");
    YI_UNUSED(handlerTag);
}
YI_RN_DEFINE_EXPORT_METHOD(RNGestureHandler, handleSetJSResponder)(uint64_t viewTag)
{
    YI_LOGI(LOG_TAG, "RNGestureHandler::handleSetJSResponder");
    YI_UNUSED(viewTag);  
}
YI_RN_DEFINE_EXPORT_METHOD(RNGestureHandler, blockNativeResponder)(uint64_t blockNativeResponder)
{
    YI_LOGI(LOG_TAG, "RNGestureHandler::blockNativeResponder");
    YI_UNUSED(blockNativeResponder);  
}
YI_RN_DEFINE_EXPORT_METHOD(RNGestureHandler, handleClearJSResponder)()
{
    YI_LOGI(LOG_TAG, "RNGestureHandler::handleClearJSResponder");
}