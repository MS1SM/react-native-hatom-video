package cn.flashtalk.hatom.hik

import android.content.Context
import android.content.res.AssetFileDescriptor
import android.media.MediaPlayer
import android.text.TextUtils
import android.util.Log
import android.view.SurfaceView
import cn.flashtalk.hatom.base.SdkVersion
import com.hikvision.hatomplayer.DefaultHatomPlayer
import com.hikvision.hatomplayer.HatomPlayer
import com.hikvision.hatomplayer.PlayConfig
import com.videogo.openapi.EZOpenSDK
import com.videogo.openapi.EZPlayer

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
     * 初始化播放器
     */
    fun initPlayerPrimordial() {
        mediaPlayer.setDisplay(this.holder)
    }

    /**
     * 设置视频播放参数
     * @param path      播放url，用于测试，所以仅支持 assets 文件夹下的视频
     */
    fun setDataSourcePrimordial(path: String) {
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

    /************************* 使用 萤石 播放器 *************************/
    // 设备序列号
    private var deviceSerial = ""
    // 通道号
    private var cameraNo = -1
    private val ezPlayer: EZPlayer by lazy {
        if (TextUtils.isEmpty(deviceSerial) || cameraNo == -1) {
            Log.e(TAG, "ezPlayer: 必须先使用正确参数调用initPlayer，初始化播放器，才可以调用其他方法")
        }
        EZOpenSDK.getInstance().createPlayer(deviceSerial, cameraNo)
    }

    /**
     * 初始化播放器
     * @param deviceSerial  设备序列号
     * @param cameraNo      通道号
     */
    fun initPlayerEzviz(deviceSerial: String, cameraNo: Int) {
        this.deviceSerial = deviceSerial
        this.cameraNo = cameraNo
        ezPlayer.setSurfaceHold(this.holder)
    }

    /**
     * 开始直播
     */
    fun startRealEzviz() {
        ezPlayer.startRealPlay()
    }
}