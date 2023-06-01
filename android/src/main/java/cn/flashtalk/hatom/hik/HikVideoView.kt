package cn.flashtalk.hatom.hik

import android.content.Context
import android.content.res.AssetFileDescriptor
import android.media.MediaPlayer
import android.text.TextUtils
import android.util.Log
import android.view.SurfaceView
import cn.flashtalk.hatom.base.EzPtzSpeed
import cn.flashtalk.hatom.base.SdkVersion
import com.hikvision.hatomplayer.DefaultHatomPlayer
import com.hikvision.hatomplayer.HatomPlayer
import com.hikvision.hatomplayer.PlayConfig
import com.videogo.openapi.EZConstants
import com.videogo.openapi.EZOpenSDK
import com.videogo.openapi.EZPlayer
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.flowOn
import kotlinx.coroutines.runBlocking

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
     * @param accessToken   token
     * @param deviceSerial  设备序列号
     * @param cameraNo      通道号
     */
    fun initPlayerEzviz(accessToken: String, deviceSerial: String, cameraNo: Int) {
        EZOpenSDK.getInstance().setAccessToken(accessToken)
        this.deviceSerial = deviceSerial
        this.cameraNo = cameraNo
        ezPlayer.setSurfaceHold(this.holder)
    }

    /**
     * 开始直播
     * @return 操作是否成功
     */
    fun startRealEzviz(): Boolean {
        return ezPlayer.startRealPlay()
    }

    /**
     * 停止直播
     * @return 操作是否成功
     */
    fun stopRealEzviz(): Boolean {
        return ezPlayer.stopRealPlay()
    }

    /**
     * 释放资源
     */
    fun releaseEzviz() {
        ezPlayer.release()
    }

    /**
     * 开启录像
     * @param recordFile 录制本地路径
     * @return 操作是否成功
     */
    fun startLocalRecordEzviz(recordFile: String): Boolean {
        return ezPlayer.startLocalRecordWithFile(recordFile)
    }

    /**
     * 结束本地直播流录像
     * 与 startLocalRecordEzviz 成对使用
     */
    fun stopLocalRecordEzviz(): Boolean {
        return ezPlayer.stopLocalRecord()
    }

    /**
     * 截图
     * TODO MS 23.6.1 需要存储 bitmap 并返回存储地址
     */
    fun capturePictureEzviz() {
        ezPlayer.capturePicture()
    }

    /**
     * 声音控制
     * @param isOpen 是否打开
     * @return 操作是否成功
     */
    fun soundEzviz(isOpen: Boolean): Boolean {
        return if (isOpen) {
            ezPlayer.openSound()
        } else {
            ezPlayer.closeSound()
        }
    }

    /**
     * 云台 PTZ 控制接口
     * 该接口为耗时操作，必须在线程中调用
     *
     * @param command   ptz控制命令
     * @param action    控制启动/停止
     * @param speed     速度（0-2）
     *
     * @return 操作成功或者失败(返回失败错误码) TODO MS 23.6.1
     */
    fun controlPtzEzviz(command: EZConstants.EZPTZCommand, action: EZConstants.EZPTZAction, speed: EzPtzSpeed = EzPtzSpeed.PTZ_SPEED_DEFAULT) {
        runBlocking {
            flow<Int> {
                EZOpenSDK.getInstance().controlPTZ(
                    deviceSerial,
                    cameraNo,
                    command,
                    action,
                    speed.value
                )
            }.flowOn(Dispatchers.IO).catch {
                Log.e(TAG, "controlPtzEzviz: 操作异常", it)
            }.collect {

            }
        }
    }

    /**
     * 设置视频清晰度
     *
     * 此调节可以在视频播放前设置也可以在视频播放成功后设置
     * 视频播放成功后设置了清晰度需要先停止播放 stopRealPlay 然后重新开启播放 startRealPlay 才能生效
     */
    fun setVideoLevelEzviz(videoLevel: EZConstants.EZVideoLevel) {
        EZOpenSDK.getInstance().setVideoLevel(
            deviceSerial,
            cameraNo,
            videoLevel.videoLevel
        )
    }
}