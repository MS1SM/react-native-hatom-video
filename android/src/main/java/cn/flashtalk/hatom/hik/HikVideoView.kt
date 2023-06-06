package cn.flashtalk.hatom.hik

import android.content.res.AssetFileDescriptor
import android.media.MediaPlayer
import android.text.TextUtils
import android.util.Log
import android.view.SurfaceView
import cn.flashtalk.hatom.base.EventProp
import cn.flashtalk.hatom.base.Events
import cn.flashtalk.hatom.base.EzPtzSpeed
import cn.flashtalk.hatom.base.SdkVersion
import cn.flashtalk.hatom.utils.SaveUtils
import cn.flashtalk.hatom.utils.Utils
import com.facebook.react.bridge.Arguments
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.events.RCTEventEmitter
import com.hikvision.hatomplayer.DefaultHatomPlayer
import com.hikvision.hatomplayer.HatomPlayer
import com.hikvision.hatomplayer.PlayConfig
import com.videogo.openapi.EZConstants
import com.videogo.openapi.EZOpenSDK
import com.videogo.openapi.EZOpenSDKListener
import com.videogo.openapi.EZPlayer
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.flow.flowOn
import kotlinx.coroutines.runBlocking
import java.io.File

/**
 * 集成版 View
 * 本 View 负责所有具体操作流程与功能
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
 *
 * **************************************************
 * 支持 萤石 SDK
 */
class HikVideoView(private val reactContext: ThemedReactContext) : SurfaceView(reactContext) {

    private var sdkVersion: SdkVersion = SdkVersion.Unknown

    companion object {
        private const val TAG = "HikVideoView"
    }

    /**
     * 事件发射器
     */
    private val eventEmitter: RCTEventEmitter by lazy {
        reactContext.getJSModule(RCTEventEmitter::class.java)
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
    // 萤石视频播放
    private val ezPlayer: EZPlayer by lazy {
        if (TextUtils.isEmpty(deviceSerial) || cameraNo == -1) {
            Log.e(TAG, "ezPlayer: 必须先使用正确参数调用initPlayer，初始化播放器，才可以调用其他方法")
        }
        EZOpenSDK.getInstance().createPlayer(deviceSerial, cameraNo)
    }
    // 萤石对讲播放器
    private val talkEzPlayer: EZPlayer by lazy {
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
     */
    fun startRealEzviz() {
        ezPlayer.startRealPlay()
    }

    /**
     * 停止直播
     */
    fun stopRealEzviz() {
        ezPlayer.stopRealPlay()
    }

    /**
     * 释放资源
     */
    fun releaseEzviz() {
        ezPlayer.release()
    }

    /**
     * 开启录像
     */
    fun startLocalRecordEzviz() {
        /**
         * 录像结果回调接口
         * 通过 Events.OnLocalRecord 通知 js
         */
        ezPlayer.setStreamDownloadCallback(object: EZOpenSDKListener.EZStreamDownloadCallback {
            override fun onSuccess(path: String?) {
                // 回调结果
                val propMap = Arguments.createMap()
                propMap.putBoolean(EventProp.success.name, true)
                propMap.putString(EventProp.path.name, path)
                eventEmitter.receiveEvent(id, Events.OnLocalRecord.name, propMap)
            }

            override fun onError(error: EZOpenSDKListener.EZStreamDownloadError?) {
                // 失败回调
                val propMap = Arguments.createMap()
                propMap.putBoolean(EventProp.success.name, false)
                error?.let { propMap.putString(EventProp.message.name, error.name) }
                eventEmitter.receiveEvent(id, Events.OnLocalRecord.name, propMap)
            }
        })

        val recordFile = Utils.generateRecordPath(context)
        ezPlayer.startLocalRecordWithFile(recordFile)
    }

    /**
     * 结束本地直播流录像
     * 与 startLocalRecordEzviz 成对使用
     * EZStreamDownloadCallback 回调结果
     */
    fun stopLocalRecordEzviz() {
        ezPlayer.stopLocalRecord()
    }

    /**
     * 截图
     * 通过 Events.OnCapturePicture 通知结果
     */
    fun capturePictureEzviz() {
        // 回调截图保存结果
        val propMap = Arguments.createMap()
        propMap.putBoolean(EventProp.success.name, SaveUtils.saveBitmapToAlbum(context, ezPlayer.capturePicture()))
        eventEmitter.receiveEvent(id, Events.OnCapturePicture.name, propMap)
    }

    /**
     * 声音控制
     * @param isOpen 是否打开
     */
    fun soundEzviz(isOpen: Boolean) {
        if (isOpen) {
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
     * 操作失败将抛出异常
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
                // 失败回调
                val propMap = Arguments.createMap()
                propMap.putBoolean(EventProp.success.name, false)
                propMap.putString(EventProp.message.name, it.message)
                eventEmitter.receiveEvent(id, Events.OnPtzControl.name, propMap)
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

    /**
     * 对讲控制
     * @param isStart           是否开启对讲
     * @param isDeviceTalkBack  用于判断对讲的设备，true表示与当前设备对讲，false表示与NVR设备下的IPC通道对讲。
     */
    fun voiceTalkEzviz(isStart: Boolean, isDeviceTalkBack: Boolean = true) {
        if (isStart) {
            talkEzPlayer.startVoiceTalk(isDeviceTalkBack)
        } else {
            talkEzPlayer.stopVoiceTalk()
        }
    }

    /**
     * 半双工对讲时，设置对讲状态
     *
     * @param pressed 按下true：手机端说，设备端听；按下false：手机端听，设备端说
     */
    fun voiceTalkStatusEzviz(pressed: Boolean) {
        talkEzPlayer.setVoiceTalkStatus(pressed)
    }
}