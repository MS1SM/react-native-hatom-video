package cn.flashtalk.hatom.hik_2_1_0

import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext

class RNHikVideoManager : SimpleViewManager<HikVideoView>() {
    override fun getName(): String {
        return NAME
    }

    override fun createViewInstance(reactContext: ThemedReactContext): HikVideoView {
        val hikVideoView = HikVideoView(reactContext)
        hikVideoView.setBackgroundColor(android.graphics.Color.RED)
        return hikVideoView
    }

    companion object {
        private const val NAME = "HikVideo_V2.1.0"
        private const val TAG = "$NAME RNHikVideoManager"
    }
}