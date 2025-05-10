package org.thereyouwish.app

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
import org.thereyouwish.app.NativeAndroidShareIntentModule

class NativeAndroidShareIntentPackage : BaseReactPackage() {

    override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? =
        if (name == NativeAndroidShareIntentModule.NAME) {
            NativeAndroidShareIntentModule(reactContext)
        } else {
            null
        }

    override fun getReactModuleInfoProvider() = ReactModuleInfoProvider {
        mapOf(
            NativeAndroidShareIntentModule.NAME to ReactModuleInfo(
                name = NativeAndroidShareIntentModule.NAME,
                className = NativeAndroidShareIntentModule.NAME,
                canOverrideExistingModule = false,
                needsEagerInit = false,
                isCxxModule = false,
                isTurboModule = true
            )
        )
    }
}