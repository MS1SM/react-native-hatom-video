package cn.flashtalk.hatom.base

/**
 * 播放器应该实现的公共方法
 * 包含常规的视频播放相关功能：url配置，播放暂停，声音控制等
 *
 * 仅要求默认配置的方法，具有特殊参数的同名方法，由 VideoView 自行实现提供
 * 此接口是为了和 ManagerImpl 保持统一，以说明播放器应有的功能和操作流程
 */
interface VideoImpl {
    fun setTest(value: String)

    /**
     * 初始化SDK
     */
    fun initSdk()

    /**
     * 初始化播放器
     */
    fun initPlayer()

    /**
     * 设置视频配置
     */
    fun setPlayConfig()

    /**
     * 设置视频播放参数
     * @param path      播放url
     */
    fun setDataSource(path: String)

    /**
     * 开始播放
     * 开启视频预览或回放
     */
    fun start()
}