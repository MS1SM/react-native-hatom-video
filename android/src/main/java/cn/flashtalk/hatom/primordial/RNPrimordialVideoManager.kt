package cn.flashtalk.hatom.primordial

import cn.flashtalk.hatom.base.RNBaseVideoManager
import com.facebook.react.uimanager.ThemedReactContext

/**
 * 支持 Android MediaPlayer 播放器
 */
class RNPrimordialVideoManager: RNBaseVideoManager<PrimordialVideoView>() {
    companion object {
        const val NAME = "PrimordialVideo"
        private const val TAG = "$NAME RNPrimordialVideoManager"
    }

    override fun getName(): String {
        return NAME
    }

    override fun createViewInstance(reactContext: ThemedReactContext): PrimordialVideoView {
        return PrimordialVideoView(reactContext)
    }
}