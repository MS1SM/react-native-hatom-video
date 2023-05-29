package cn.flashtalk.hatom.hik

import android.content.Context
import android.content.res.AssetFileDescriptor
import android.media.MediaPlayer
import android.util.Log
import android.view.SurfaceView
import cn.flashtalk.hatom.base.SdkVersion
import com.hikvision.hatomplayer.DefaultHatomPlayer
import com.hikvision.hatomplayer.HatomPlayer
import com.hikvision.hatomplayer.PlayConfig

/**
 * 集成版 View
 *
 * **************************************************
 * 支持海康 SDK V2.1.0 Normal 版本的播放器
 * 
 * @error NoPlayerSDK中是可以与萤石SDK共用的版本，实际测试无法使用
 *
 * 资源demo
 * https://open.hikvision.com/download/5c67f1e2f05948198c909700?type=10
 * 综合安防管理平台 -> V2.0.0 -> Android SDK V2.1.0
 *
 *
 * **************************************************
 * 使用 Android MediaPlayer 播放器的控件
 */
class HikVideoView(context: Context) : SurfaceView(context) {

    private var sdkVersion: SdkVersion = SdkVersion.Unknown

    companion object {
        private const val TAG = "HikVideoView"
    }

    /**
     * 初始化sdk版本
     */
    fun initSdkVersion(sdkVersion: SdkVersion) {
        Log.i(TAG, "initSdkVersion: ${sdkVersion.name}")
        this.sdkVersion = sdkVersion
    }

    /**
     * 获取当前选择的播放器版本
     */
    fun getSdkVersion(): SdkVersion {
        return sdkVersion
    }

    /************************* 海康 SDK V2.1.0 Normal 版本的播放器 *************************/

    private val hatomPlayer: HatomPlayer by lazy {
        DefaultHatomPlayer()
    }

    /**
     * 初始化SDK
     * 文档要求：初始化方法必须在工程的自定义 Application 类的 onCreate() 方法中调用
     * 实际测试不需要在 onCreate 中调用，但需要用到 Application 初始化，因此由 Module 提供初始化
     */
    fun initSdkHatom() {
        Log.w(TAG, "initSdk: 请使用 NativeModules 提供的方法进行初始化")
    }

    /**
     * 初始化播放器
     */
    fun initPlayerHatom() {
        hatomPlayer.setSurfaceHolder(this.holder)
    }

    /**
     * 设置视频配置
     */
    fun setPlayConfigHatom(playConfig: PlayConfig) {
        hatomPlayer.setPlayConfig(playConfig)
    }

    /**
     * 设置视频播放参数
     * 设置视频参数，开启播放前设置。实时预览、录像回放开启播放时，需要用到的取流url及其他请求参数。
     * @param path      播放url
     * @param headers   其他请求参数
     */
    fun setDataSourceHatom(path: String, headers: HashMap<String, String>?) {
        hatomPlayer.setDataSource(path, headers)
    }

    /**
     * 开始播放
     * 开启视频预览或回放
     * 此方法需要在子线程中执行
     */
    fun startHatom() {
        hatomPlayer.start()
    }

    /************************* 使用 Android MediaPlayer 播放器 *************************/

    private val mediaPlayer: MediaPlayer by lazy {
        MediaPlayer()
    }

    /**
     * 设置视频播放参数
     * @param path      播放url，用于测试，所以仅支持 assets 文件夹下的视频
     */
    fun setDataSourcePrimordial(path: String) {
        mediaPlayer.setDisplay(this.holder)
        val fd: AssetFileDescriptor = this.context.assets.openFd(path)
        mediaPlayer.setDataSource(fd.fileDescriptor, fd.startOffset, fd.length)
        mediaPlayer.prepareAsync()
    }

    /**
     * 开始播放
     * 开启视频预览或回放
     */
    fun startPrimordial() {
        if (!mediaPlayer.isPlaying) {
            mediaPlayer.start()
        }
    }
}