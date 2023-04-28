package cn.flashtalk.hatom.base

import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableNativeMap
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.annotations.ReactProp

/**
 * 虚基类 ViewManager，暴露播放器的 VideoImpl 方法
 */
abstract class RNBaseVideoManager<T: BaseVideoView> : SimpleViewManager<T>(), ManagerImpl<T> {
    companion object {
        private const val TAG = "RNBaseVideoManager"
    }

    @ReactProp(name = "test")
    override fun setTest(videoImpl: T, value: String) {
        videoImpl.setTest(value)
    }

    /**
     * 初始化SDK
     *
     * @param configMap.appKey      (String)        保留字段
     * @param configMap.printLog    (Boolean)       是否打印sdk日志
     */
    @ReactProp(name = "initSdk")
    override fun initSdk(videoImpl: T, configMap: ReadableMap) {
        videoImpl.initSdk()
    }

    /**
     * 初始化播放器
     */
    @ReactProp(name = "initPlayer")
    override fun initPlayer(videoImpl: T, phString: String?) {
        videoImpl.initPlayer()
    }

    /**
     * 设置视频配置
     * 设置视频配置。在开始播放前设置。
     */
    @ReactProp(name = "setPlayConfig")
    override fun setPlayConfig(videoImpl: T, configMap: ReadableMap?) {
        videoImpl.setPlayConfig()
    }

    /**
     * 设置视频播放参数
     * 设置视频参数，开启播放前设置
     *
     * @param configMap.path    (String)                播放url
     * @param configMap.headers (ReadableNativeMap)     其他请求参数
     */
    @ReactProp(name = "setDataSource")
    override fun setDataSource(videoImpl: T, configMap: ReadableMap) {
        configMap.getString("path")?.let { videoImpl.setDataSource(it) }
    }

    /**
     * 开始播放
     * 开启视频预览或回放
     */
    @ReactProp(name = "start")
    override fun start(videoImpl: T, phString: String) {
        videoImpl.start()
    }
}