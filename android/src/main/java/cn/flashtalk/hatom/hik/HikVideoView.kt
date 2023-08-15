package cn.flashtalk.hatom.hik

import android.content.res.AssetFileDescriptor
import android.media.MediaPlayer
import android.os.Handler
import android.os.Looper
import android.os.Message
import android.text.TextUtils
import android.util.Log
import android.view.SurfaceView
import cn.flashtalk.hatom.common.EventProp
import cn.flashtalk.hatom.common.Events
import cn.flashtalk.hatom.common.EzPtzSpeed
import cn.flashtalk.hatom.common.SdkVersion
import cn.flashtalk.hatom.utils.SaveUtils
import cn.flashtalk.hatom.utils.Utils
import com.facebook.react.bridge.Arguments
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.events.RCTEventEmitter
import com.hikvision.hatomplayer.DefaultHatomPlayer
import com.hikvision.hatomplayer.HatomPlayer
import com.hikvision.hatomplayer.PlayCallback
import com.hikvision.hatomplayer.PlayCallback.Status
import com.hikvision.hatomplayer.PlayConfig
import com.hikvision.hatomplayer.core.PlaybackSpeed
import com.hikvision.hatomplayer.core.Quality
import com.videogo.errorlayer.ErrorInfo
import com.videogo.openapi.EZConstants
import com.videogo.openapi.EZConstants.EZPlaybackRate
import com.videogo.openapi.EZOpenSDK
import com.videogo.openapi.EZOpenSDKListener
import com.videogo.openapi.EZPlayer
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.launch
import java.lang.ref.WeakReference
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Locale

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

        // 海康操作成功返回码
        private const val SUCCESS_HATOM = 0
    }

    //region 公用
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
    //endregion

    //region 海康 SDK V2.1.0 Normal 版本的播放器
    private val hatomPlayer: HatomPlayer by lazy {
        DefaultHatomPlayer()
    }

    private val talkHatomPlayer: HatomPlayer by lazy {
        DefaultHatomPlayer()
    }

    // 播放器回调
    private val hatomPlayCallback = PlayCallback.PlayStatusCallback { status: Status, errorCode: String ->
        run {
            val propMap = Arguments.createMap()

            Log.i(TAG, "hatomPlayCallback: $status")
            if (!TextUtils.isEmpty(errorCode)) {
                Log.e(TAG, "hatomPlayCallback: $errorCode")
                propMap.putString(EventProp.code.name, errorCode)
            } else {
                propMap.putString(EventProp.code.name, "-1")
            }

            // 回调
            eventEmitter.receiveEvent(id, Events.onPlayStatus.name, propMap)
        }
    }

    // 对讲回调
    private val talkHatomCallback = PlayCallback.VoiceTalkCallback { status: Status, errorCode: String ->
        run {
            val propMap = Arguments.createMap()

            Log.i(TAG, "talkHatomCallback: $status")
            if (!TextUtils.isEmpty(errorCode)) {
                Log.e(TAG, "hatomPlayCallback: $errorCode")
                propMap.putString(EventProp.code.name, errorCode)
            } else {
                propMap.putString(EventProp.code.name, "-1")
            }

            // 回调
            eventEmitter.receiveEvent(id, Events.onTalkStatus.name, propMap)
        }
    }

    // 本地录制文件地址
    private var recordPathHatom = ""

    /**
     * 初始化播放器
     */
    fun initPlayerHatom() {
        hatomPlayer.setSurfaceHolder(this.holder)
        // 默认 PlayConfig
        var playerConfig = PlayConfig()
        playerConfig.hardDecode = true
        playerConfig.privateData = true
        setPlayConfigHatom(playerConfig)
        // 播放回调
        hatomPlayer.setPlayStatusCallback(hatomPlayCallback)
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
        CoroutineScope(Dispatchers.IO).launch {
            flow<String> {
                hatomPlayer.start()
            }.catch {
                Log.e(TAG, "startHatom: 播放异常", it)
            }.collect {
            }
        }
    }

    /**
     * 停止播放
     * 此方法需要在子线程中执行
     */
    fun stopHatom() {
        CoroutineScope(Dispatchers.IO).launch {
            flow<String> {
                hatomPlayer.stop()
            }.catch {
                Log.e(TAG, "stopHatom: 操作异常", it)
            }.collect {
            }
        }
    }

    /**
     * 截图
     * 通过 Events.onCapturePicture 通知结果
     */
    fun capturePictureHatom() {
        // 截图
        val filePath    = Utils.generatePicturePath(context)
        val shotResult  = hatomPlayer.screenshot(filePath, null)
        // 保存到相册
        var saveResult = false
        if (shotResult == SUCCESS_HATOM) {
            saveResult = SaveUtils.saveImgFileToAlbum(context, filePath)
        } else {
            Log.e(TAG, "capturePictureHatom: $shotResult")
        }

        // 回调截图保存结果
        val propMap = Arguments.createMap()
        propMap.putBoolean(EventProp.success.name, saveResult)
        eventEmitter.receiveEvent(id, Events.onCapturePicture.name, propMap)
    }

    /**
     * 开启录像
     * 通过 Events.onLocalRecord 通知结果。仅失败通知；成功由 stopLocalRecordHatom 调用后通知
     */
    fun startLocalRecordHatom(deviceSerial: String?) {
        recordPathHatom = Utils.generateRecordPath(context, deviceSerial)
        val result = hatomPlayer.startRecordAndConvert(recordPathHatom)
        if (result != SUCCESS_HATOM) {
            Log.e(TAG, "startLocalRecordHatom: result")
            recordPathHatom = ""

            // 失败回调
            val propMap = Arguments.createMap()
            propMap.putBoolean(EventProp.success.name, false)
            propMap.putString(EventProp.message.name, result.toString())
            eventEmitter.receiveEvent(id, Events.onLocalRecord.name, propMap)
        }
    }

    /**
     * 结束本地直播流录像
     * 与 startLocalRecordHatom 成对使用
     * 通过 Events.onLocalRecord 通知结果
     */
    fun stopLocalRecordHatom() {
        // 路径为空的错误信息
        var result = -1
        // 路径非空，停止录制
        if (!TextUtils.isEmpty(recordPathHatom)) {
            result = hatomPlayer.stopRecord()
        }
        // 相册刷新
        SaveUtils.insertMediaPic(context, recordPathHatom, false)
        // 回调结果
        val propMap = Arguments.createMap()
        propMap.putBoolean(EventProp.success.name, result == SUCCESS_HATOM)
        propMap.putString(EventProp.message.name, result.toString())
        propMap.putString(EventProp.data.name, recordPathHatom)
        eventEmitter.receiveEvent(id, Events.onLocalRecord.name, propMap)
        // 清理路径
        recordPathHatom = ""
    }

    /**
     * 对讲控制
     * @param isStart  是否开启对讲
     * @param talkUrl  对讲短链接，通过调用openApi获取
     */
    fun voiceTalkHatom(isStart: Boolean, talkUrl: String) {
        if (isStart) {
            // 设置参数
            talkHatomPlayer.setVoiceDataSource(talkUrl, null)
            // 设置回调
            talkHatomPlayer.setVoiceStatusCallback(talkHatomCallback)
            // 开启对讲
            CoroutineScope(Dispatchers.IO).launch {
                flow<String> {
                    talkHatomPlayer.startVoiceTalk()
                }.catch {
                    Log.e(TAG, "talkHatomPlayer: 播放异常", it)
                }.collect {
                }
            }

        } else {
            // 停止对讲
            CoroutineScope(Dispatchers.IO).launch {
                flow<String> {
                    talkHatomPlayer.stopVoiceTalk()
                }.catch {
                    Log.e(TAG, "talkHatomPlayer: 操作异常", it)
                }.collect {
                }
            }
        }
    }

    /**
     * 声音控制
     * @param isOpen 是否打开
     */
    fun enableAudioHatom(isOpen: Boolean) {
        val result = hatomPlayer.enableAudio(isOpen)
        if (result != SUCCESS_HATOM) {
            Log.e(TAG, "soundHatom: $result")
        }
    }

    /**
     * 预览码流平滑切换
     * 必须先调用 setDataSource 接口,设置新的取流url
     */
    fun changeStreamHatom(quality: Quality) {
        val result = hatomPlayer.changeStream(quality)
        if (result != SUCCESS_HATOM) {
            Log.e(TAG, "changeStreamHatom: $result")
        }
    }

    /**
     * 获取总流量值
     *
     * 通过 Events.onStreamFlow 通知结果
     */
    fun totalTrafficHatom() {
        val propMap = Arguments.createMap()
        propMap.putDouble(EventProp.data.name, hatomPlayer.totalTraffic.toDouble())
        eventEmitter.receiveEvent(id, Events.onStreamFlow.name, propMap)
    }

    fun pausePlaybackHatom() {
        hatomPlayer.pause()
    }

    fun resumePlaybackHatom() {
        hatomPlayer.resume()
    }

    fun setSpeedPlaybackHatom(speed: PlaybackSpeed) {
        hatomPlayer.playbackSpeed = speed
    }

    fun seekPlaybackHatom(offsetTime: Calendar) {
        hatomPlayer.seekPlayback(SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssSSSZ").format(offsetTime.time))
    }

    fun statusPlaybackHatom() {
        val propMap = Arguments.createMap()
        propMap.putString(EventProp.speed.name, hatomPlayer.playbackSpeed.name)
        propMap.putDouble(EventProp.seek.name, hatomPlayer.osdTime.toDouble())
        eventEmitter.receiveEvent(id, Events.onPlayback.name, propMap)
    }

    //endregion

    //region Android MediaPlayer 播放器
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
    //endregion

    //region 萤石 播放器
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

    // 萤石播放器 Handler
    private val ezHandler = EzHandler(WeakReference(this))
    // 萤石对讲播放器 Handler
    private val talkEzHandler = TalkEzHandler(WeakReference(this))

    /**
     * 萤石播放器 Handler 处理
     * 使用弱引用实现，避免内存泄漏
     */
    private class EzHandler(val hikVideoView: WeakReference<HikVideoView>): Handler(Looper.getMainLooper()) {
        override fun handleMessage(msg: Message) {
            super.handleMessage(msg)

            hikVideoView.get()?.run {
                Log.i(TAG, "EzHandler: $msg")
                val propMap = Arguments.createMap()

                when (msg.what) {
                    // 播放失败
                    EZConstants.EZRealPlayConstants.MSG_REALPLAY_PLAY_FAIL -> {
                        val dataMap = Arguments.createMap()
                        val errorInfo = msg.obj as ErrorInfo
                        dataMap.putInt(EventProp.code.name, errorInfo.errorCode)
                        dataMap.putString(EventProp.message.name, errorInfo.toString())
                        propMap.putMap(EventProp.data.name, dataMap)
                    }

                    else -> {
                    }
                }

                // 回调
                propMap.putInt(EventProp.code.name, msg.what)
                eventEmitter.receiveEvent(id, Events.onPlayStatus.name, propMap)
            }
        }
    }

    /**
     * 萤石对讲播放器 Handler 处理
     * 使用弱引用实现，避免内存泄漏
     */
    private class TalkEzHandler(val hikVideoView: WeakReference<HikVideoView>): Handler(Looper.getMainLooper()) {
        override fun handleMessage(msg: Message) {
            super.handleMessage(msg)

            hikVideoView.get()?.run {
                when (msg.what) {
                    else -> {
                        Log.i(TAG, "TalkEzHandler: $msg")
                    }
                }
                // 回调
                val propMap = Arguments.createMap()
                propMap.putInt(EventProp.code.name, msg.what)
                eventEmitter.receiveEvent(id, Events.onTalkStatus.name, propMap)
            }
        }
    }

    /**
     * 录像结果回调
     * 通过 Events.onLocalRecord 通知 js
     */
    private val ezLocalRecordCallback = object: EZOpenSDKListener.EZStreamDownloadCallback {
        override fun onSuccess(path: String?) {
            // 相册刷新
            SaveUtils.insertMediaPic(context, path, false)
            // 回调结果
            val propMap = Arguments.createMap()
            propMap.putBoolean(EventProp.success.name, true)
            propMap.putString(EventProp.data.name, path)
            eventEmitter.receiveEvent(id, Events.onLocalRecord.name, propMap)
        }

        override fun onError(error: EZOpenSDKListener.EZStreamDownloadError?) {
            // 失败回调
            val propMap = Arguments.createMap()
            propMap.putBoolean(EventProp.success.name, false)
            error?.let { propMap.putString(EventProp.message.name, error.name) }
            eventEmitter.receiveEvent(id, Events.onLocalRecord.name, propMap)
        }
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
        ezPlayer.setHandler(ezHandler)
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
    fun startLocalRecordEzviz(deviceSerial: String?) {
        /**
         * 录像结果回调接口
         * 通过 Events.onLocalRecord 通知 js
         */
        ezPlayer.setStreamDownloadCallback(ezLocalRecordCallback)

        val recordFile = Utils.generateRecordPath(context, deviceSerial)
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
     * 通过 Events.onCapturePicture 通知结果
     */
    fun capturePictureEzviz() {
        // 回调截图保存结果
        val propMap = Arguments.createMap()
        propMap.putBoolean(EventProp.success.name, SaveUtils.saveBitmapToAlbum(context, ezPlayer.capturePicture()))
        eventEmitter.receiveEvent(id, Events.onCapturePicture.name, propMap)
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
     * 通过 Events.onPtzControl 通知失败结果
     */
    fun controlPtzEzviz(command: EZConstants.EZPTZCommand, action: EZConstants.EZPTZAction, speed: EzPtzSpeed = EzPtzSpeed.PTZ_SPEED_DEFAULT) {
        CoroutineScope(Dispatchers.IO).launch {
            flow<String> {
                EZOpenSDK.getInstance().controlPTZ(
                    deviceSerial,
                    cameraNo,
                    command,
                    action,
                    speed.value
                )
            }.catch {
                Log.e(TAG, "controlPtzEzviz: 操作异常", it)
                // 失败回调
                val propMap = Arguments.createMap()
                propMap.putBoolean(EventProp.success.name, false)
                propMap.putString(EventProp.message.name, it.message)
                eventEmitter.receiveEvent(id, Events.onPtzControl.name, propMap)
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
            talkEzPlayer.setHandler(talkEzHandler)
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

    /**
     * 获取总流量值
     *
     * 通过 Events.onStreamFlow 通知结果
     */
    fun getStreamFlowEzviz() {
        val propMap = Arguments.createMap()
        propMap.putDouble(EventProp.data.name, ezPlayer.streamFlow.toDouble())
        eventEmitter.receiveEvent(id, Events.onStreamFlow.name, propMap)
    }

    /**
     * 设置播放验证码
     */
    fun setVerifyCodeEzviz(verifyCode: String) {
        ezPlayer.setPlayVerifyCode(verifyCode)
    }

    fun startPlaybackEzviz(startCalendar: Calendar, stopTime: Calendar) {
        ezPlayer.startPlayback(startCalendar, stopTime)
    }

    fun stopPlaybackEzviz() {
        ezPlayer.stopPlayback()
    }

    fun pausePlaybackEzviz() {
        ezPlayer.pausePlayback()
    }

    fun resumePlaybackEzviz() {
        ezPlayer.resumePlayback()
    }

    fun setSpeedPlaybackEzviz(rate: EZPlaybackRate) {
        ezPlayer.setPlaybackRate(rate)
    }

    /**
     * 根据偏移时间播放
     * 拖动进度条时调用此接口。先停止当前播放，再把offsetTime作为起始时间按时间回放
     * 建议使用stopPlayback+startPlayback(offsetTime,stopTime)代替此接口
     */
    fun seekPlaybackEzviz(offsetTime: Calendar) {
        ezPlayer.seekPlayback(offsetTime)
    }

    fun statusPlaybackEzviz() {
        val propMap = Arguments.createMap()
        propMap.putDouble(EventProp.seek.name, ezPlayer.osdTime.timeInMillis.toDouble())
        eventEmitter.receiveEvent(id, Events.onPlayback.name, propMap)
    }
    //endregion
}