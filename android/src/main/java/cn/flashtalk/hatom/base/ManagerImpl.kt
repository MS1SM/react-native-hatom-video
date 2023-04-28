package cn.flashtalk.hatom.base

import com.facebook.react.bridge.ReadableMap

/**
 * ViewManager 应该实现的公共方法
 * 各平台都应该实现这些方法，确保js端可以正常调用
 *
 * 与 VideoImpl 配套使用，而所有实类VideoView应该实现 VideoImpl
 *
 * 描述播放器应该对外公开的功能和操作流程，对于特殊方法或特殊参数，由 Manager 自行提供
 *
 * @param phString 是占位字符串，没有实际意义，可以为空，@ReactProp 要求存在一个参数
 */
interface ManagerImpl<T: VideoImpl> {
    fun setTest(videoImpl: T, value: String)

    /**
     * 初始化SDK
     *
     * @param configMap.appKey      (String)        保留字段
     * @param configMap.printLog    (Boolean)       是否打印sdk日志
     */
    fun initSdk(videoImpl: T, configMap: ReadableMap)

    /**
     * 初始化播放器
     */
    fun initPlayer(videoImpl: T, phString: String?)

    /**
     * 设置视频配置
     * 设置视频配置。在开始播放前设置。
     */
    fun setPlayConfig(videoImpl: T, configMap: ReadableMap?)

    /**
     * 设置视频播放参数
     * 设置视频参数，开启播放前设置
     *
     * @param configMap.path    (String)                播放url
     * @param configMap.headers (ReadableNativeMap)     其他请求参数
     */
    fun setDataSource(videoImpl: T, configMap: ReadableMap)

    /**
     * 开始播放
     * 开启视频预览或回放
     */
    fun start(videoImpl: T, phString: String)
}