package cn.flashtalk.hatom.hik_2_1_0

import android.content.Context
import android.util.Log
import cn.flashtalk.hatom.base.BaseVideoView
import com.hikvision.hatomplayer.DefaultHatomPlayer
import com.hikvision.hatomplayer.HatomPlayer
import com.hikvision.hatomplayer.PlayConfig

/**
 * 支持海康 SDK V2.1.0 Normal 版本的播放器
 * 
 * @error NoPlayerSDK中是可以与萤石SDK共用的版本，实际测试无法使用
 *
 * 资源demo
 * https://open.hikvision.com/download/5c67f1e2f05948198c909700?type=10
 * 综合安防管理平台 -> V2.0.0 -> Android SDK V2.1.0
 */
class HikVideoView(context: Context) : BaseVideoView(context) {
    private val hatomPlayer: HatomPlayer by lazy {
        DefaultHatomPlayer()
    }

    companion object {
        private const val TAG = "HikVideoView"
    }

    /**
     * 初始化SDK
     * 文档要求：初始化方法必须在工程的自定义 Application 类的 onCreate() 方法中调用
     * 实际测试不需要在 onCreate 中调用，但需要用到 Application 初始化，因此由 Module 提供初始化
     */
    override fun initSdk() {
        Log.w(TAG, "initSdk: 请使用 NativeModules 提供的方法进行初始化")
    }

    /**
     * 初始化播放器
     */
    override fun initPlayer() {
        hatomPlayer.setSurfaceHolder(this.holder)
    }

    /**
     * 设置视频配置
     */
    override fun setPlayConfig() {
        setPlayConfig(PlayConfig())
    }

    /**
     * 设置视频配置
     */
    fun setPlayConfig(playConfig: PlayConfig) {
        hatomPlayer.setPlayConfig(playConfig)
    }

    /**
     * 设置视频播放参数
     * @param path      播放url
     */
    override fun setDataSource(path: String) {
        setDataSource(path, null)
    }

    /**
     * 设置视频播放参数
     * 设置视频参数，开启播放前设置。实时预览、录像回放开启播放时，需要用到的取流url及其他请求参数。
     * @param path      播放url
     * @param headers   其他请求参数
     */
    fun setDataSource(path: String, headers: HashMap<String, String>?) {
        hatomPlayer.setDataSource(path, headers)
    }

    /**
     * 开始播放
     * 开启视频预览或回放
     * 此方法需要在子线程中执行
     */
    override fun start() {
        hatomPlayer.start()
    }
}