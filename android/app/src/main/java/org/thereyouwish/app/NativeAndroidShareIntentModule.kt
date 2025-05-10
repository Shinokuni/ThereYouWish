package org.thereyouwish.app

import android.app.Activity
import android.content.Intent
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.ReactApplicationContext

class NativeAndroidShareIntentModule(val reactContext: ReactApplicationContext) :
        NativeAndroidShareIntentSpec(reactContext), ActivityEventListener {

    private var initialSharedText: String? = null

    init {
        reactContext.addActivityEventListener(this)
        currentActivity?.intent?.let {
            if (it.action == Intent.ACTION_SEND) {
                initialSharedText = it.getStringExtra(Intent.EXTRA_TEXT)
            }
        }
    }

    override fun getInitialSharedText(): String? {
        return initialSharedText
    }

    override fun clearInitialSharedText() {
        initialSharedText = null
    }

    override fun onNewIntent(intent: Intent) = handleIntent(intent)

    override fun onActivityResult(
            activity: Activity,
            requestCode: Int,
            resultCode: Int,
            data: Intent?
    ) {}

    fun handleIntent(intent: Intent) {
        if (intent.action == Intent.ACTION_SEND) {
            val value = intent.getStringExtra(Intent.EXTRA_TEXT)
            println(intent.getStringExtra(Intent.EXTRA_TEXT))
            emitOnNewIntent(value)
        }
    }

    companion object {
        const val NAME = "NativeAndroidShareIntent"
    }
}
