package cn.flashtalk.hatom.base

import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.annotations.ReactProp

/**
 * 虚基类 ViewManager，暴露播放器的 VideoImpl 方法
 */
abstract class RNBaseVideoManager<T: BaseVideoView> : SimpleViewManager<T>(), ManagerImpl<T> {
    @ReactProp(name = "test")
    override fun setTest(videoImpl: T, value: String) {
        videoImpl.setTest(value)
    }

    companion object {
        private const val TAG = "RNBaseVideoManager"
    }
}