package cn.flashtalk.hatom.hik

import android.util.Log
import cn.flashtalk.hatom.common.Events
import cn.flashtalk.hatom.common.EzPtzSpeed
import cn.flashtalk.hatom.common.PlaybackCommand
import cn.flashtalk.hatom.common.SdkVersion
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.common.MapBuilder
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.hikvision.hatomplayer.PlayConfig
import com.hikvision.hatomplayer.core.PlaybackSpeed
import com.hikvision.hatomplayer.core.Quality
import com.videogo.openapi.EZConstants
import java.util.Calendar

/**
 * 集成版播放器 manager
 * 本 Manager 只做数据处理和功能分发，不处理具体功能和操作流程
 *
 * **************************************************
 * 支持海康 SDK V2.1.0
 * 支持 Android MediaPlayer 播放器
 * 支持 萤石 SDK
 */
class RNHikVideoManager : SimpleViewManager<HikVideoView>() {
    companion object {
        const val NAME = "HikVideo"
        private const val TAG = "$NAME Manager"
    }

    override fun getName(): String {
        return NAME
    }

    override fun createViewInstance(reactContext: ThemedReactContext): HikVideoView {
        return HikVideoView(reactContext)
    }

    override fun getExportedCustomDirectEventTypeConstants(): Map<String, Map<String, String>> {
        val builder: MapBuilder.Builder<String, Map<String, String>> = MapBuilder.builder()
        for (event in Events.values()) {
            builder.put(event.name, MapBuilder.of("registrationName", event.name))
        }
        return builder.build()
    }

    //region 属性
    /**
     * 初始化sdk版本
     */
    @ReactProp(name = "initSdkVersion")
    fun initSdkVersion(hikVideoView: HikVideoView, sdkVersion: String) {
        hikVideoView.initSdkVersion(SdkVersion.nameToEnum(sdkVersion))
    }

    /**
     * 初始化播放器
     *
     ***************************************************
     * HikVideo
     *
     ***************************************************
     * Primordial
     *
     ***************************************************
     * Ezviz
     *
     * @param  configMap.deviceSerial     (String) 设备序列号
     * @param  configMap.cameraNo         (int)    通道号
     */
    @ReactProp(name = "initPlayer")
    fun initPlayer(hikVideoView: HikVideoView, configMap: ReadableMap) {
        when (hikVideoView.getSdkVersion()) {
            SdkVersion.HikVideo_V2_1_0, SdkVersion.Imou -> {
                hikVideoView.initPlayerHatom()
            }

            SdkVersion.PrimordialVideo -> {
                hikVideoView.initPlayerPrimordial()
            }

            SdkVersion.EzvizVideo -> {
                // 数据转换
                val deviceSerial    = configMap.getString   ("deviceSerial").toString()
                val cameraNo        = configMap.getInt      ("cameraNo")
                // 配置
                hikVideoView.initPlayerEzviz(deviceSerial, cameraNo)
            }

            SdkVersion.Unknown -> {
                Log.e(TAG, "未 initSdkVersion")
            }
        }
    }


    /**
     * 设置视频配置
     * 设置视频配置。在开始播放前设置。
     *
     ***************************************************
     * HikVideo
     *
     * @Nullable PlayConfig.hardDecode  (Boolean)   是否使用硬解码，默认false
     * @Nullable PlayConfig.privateData (Boolean)   是否显示智能信息,默认false
     * @Nullable PlayConfig.timeout     (int)       取流超时时间，单位秒，默认20s
     * @Nullable PlayConfig.secretKey   (String)    解码秘钥。如果码流进行了加密，需要设置解码秘钥
     *
     ***************************************************
     * Primordial
     */
    @ReactProp(name = "setPlayConfig")
    fun setPlayConfig(hikVideoView: HikVideoView, configMap: ReadableMap) {
        when (hikVideoView.getSdkVersion()) {
            SdkVersion.HikVideo_V2_1_0, SdkVersion.Imou -> {
                // 数据转换
                val playConfig = PlayConfig()
                playConfig.hardDecode   = configMap.getBoolean      ("hardDecode")
                playConfig.privateData  = configMap.getBoolean      ("privateData")
                playConfig.timeout      = configMap.getInt          ("timeout")
                playConfig.secretKey    = configMap.getString       ("secretKey")
                // 配置
                hikVideoView.setPlayConfigHatom(playConfig)
            }

            SdkVersion.PrimordialVideo -> {
            }

            SdkVersion.Unknown -> {
                Log.e(TAG, "未 initSdkVersion")
            }
        }
    }

    /**
     * 设置视频播放参数
     * 设置视频参数，开启播放前设置。实时预览、录像回放开启播放时，需要用到的取流url及其他请求参数。
     *
     ***************************************************
     * HikVideo
     * @param configMap.path    (String)                播放url
     * @param configMap.headers (ReadableNativeMap)     其他请求参数
     *
     * headers.TOKEN      (String)  用于headers中传递token的key
     * headers.START_TIME (String)  用于headers中传递回放开始时间的key
     * headers.END_TIME   (String)  用于headers中传递回放结束时间的key
     *
     ***************************************************
     * Primordial
     * @param configMap.path    (String)                播放文件名
     */
    @ReactProp(name = "setDataSource")
    fun setDataSource(hikVideoView: HikVideoView, configMap: ReadableMap) {
        when (hikVideoView.getSdkVersion()) {
            SdkVersion.HikVideo_V2_1_0, SdkVersion.Imou -> {
                // 数据转换
                var headerMap: HashMap<String, String>? = null
                if (configMap.hasKey("headers")) {
                    headerMap = HashMap<String, String>()
                    val headers = configMap.getMap("headers")
                    headers!!.getString("TOKEN")?.       let { headerMap.put("TOKEN", it) }
                    headers.getString("START_TIME")?.    let { headerMap.put("START_TIME", it) }
                    headers.getString("END_TIME")?.      let { headerMap.put("END_TIME", it) }
                }

                // 设置
                hikVideoView.setDataSourceHatom(configMap.getString("path").toString(), headerMap)
            }

            SdkVersion.PrimordialVideo -> {
                hikVideoView.setDataSourcePrimordial(configMap.getString("path").toString())
            }

            SdkVersion.Unknown -> {
                Log.e(TAG, "未 initSdkVersion")
            }
        }
    }

    /**
     * 开始播放
     * 开启视频预览或回放
     * name = "start" 将产生冲突异常，name 改为 startPlay
     */
    @ReactProp(name = "startPlay")
    fun start(hikVideoView: HikVideoView, phString: String?) {
        when (hikVideoView.getSdkVersion()) {
            SdkVersion.HikVideo_V2_1_0, SdkVersion.Imou -> {
                hikVideoView.startHatom()
            }

            SdkVersion.PrimordialVideo -> {
                hikVideoView.startPrimordial()
            }

            SdkVersion.EzvizVideo -> {
                hikVideoView.startRealEzviz()
            }

            SdkVersion.Unknown -> {
                Log.e(TAG, "未 initSdkVersion")
            }
        }
    }

    /**
     * 停止播放
     */
    @ReactProp(name = "stopPlay")
    fun stop(hikVideoView: HikVideoView, phString: String?) {
        when (hikVideoView.getSdkVersion()) {
            SdkVersion.HikVideo_V2_1_0, SdkVersion.Imou -> {
                hikVideoView.stopHatom()
            }

            SdkVersion.PrimordialVideo -> {
            }

            SdkVersion.EzvizVideo -> {
                hikVideoView.stopRealEzviz()
            }

            SdkVersion.Unknown -> {
                Log.e(TAG, "未 initSdkVersion")
            }
        }
    }

    /**
     * 释放资源
     */
    @ReactProp(name = "release")
    fun release(hikVideoView: HikVideoView, phString: String?) {
        when (hikVideoView.getSdkVersion()) {
            SdkVersion.HikVideo_V2_1_0, SdkVersion.Imou -> {
            }

            SdkVersion.PrimordialVideo -> {
            }

            SdkVersion.EzvizVideo -> {
                hikVideoView.releaseEzviz()
            }

            SdkVersion.Unknown -> {
                Log.e(TAG, "未 initSdkVersion")
            }
        }
    }

    /**
     * 开启录像
     * @param  configMap.deviceSerial     (String？) 设备序列号，用于细分存储目录
     *
     ***************************************************
     * Ezviz
     */
    @ReactProp(name = "startLocalRecord")
    fun startLocalRecord(hikVideoView: HikVideoView, configMap: ReadableMap) {
        var deviceSerial = ""
        if (configMap.hasKey("deviceSerial")) {
            deviceSerial = configMap.getString("deviceSerial").toString()
        }

        when (hikVideoView.getSdkVersion()) {
            SdkVersion.HikVideo_V2_1_0, SdkVersion.Imou -> {
                hikVideoView.startLocalRecordHatom(deviceSerial)
            }

            SdkVersion.PrimordialVideo -> {
            }

            SdkVersion.EzvizVideo -> {
                hikVideoView.startLocalRecordEzviz(deviceSerial)
            }

            SdkVersion.Unknown -> {
                Log.e(TAG, "未 initSdkVersion")
            }
        }
    }

    /**
     * 结束本地直播流录像
     * 与 startLocalRecord 成对使用
     *
     * 通过 Events.onLocalRecord 通知结果
     */
    @ReactProp(name = "stopLocalRecord")
    fun stopLocalRecord(hikVideoView: HikVideoView, phString: String?) {
        when (hikVideoView.getSdkVersion()) {
            SdkVersion.HikVideo_V2_1_0, SdkVersion.Imou -> {
                hikVideoView.stopLocalRecordHatom()
            }

            SdkVersion.PrimordialVideo -> {
            }

            SdkVersion.EzvizVideo -> {
                hikVideoView.stopLocalRecordEzviz()
            }

            SdkVersion.Unknown -> {
                Log.e(TAG, "未 initSdkVersion")
            }
        }
    }

    /**
     * 声音控制
     * @param isOpen 是否打开
     */
    @ReactProp(name = "sound")
    fun sound(hikVideoView: HikVideoView, isOpen: Boolean) {
        when (hikVideoView.getSdkVersion()) {
            SdkVersion.HikVideo_V2_1_0, SdkVersion.Imou -> {
                hikVideoView.enableAudioHatom(isOpen)
            }

            SdkVersion.PrimordialVideo -> {
            }

            SdkVersion.EzvizVideo -> {
                hikVideoView.soundEzviz(isOpen)
            }

            SdkVersion.Unknown -> {
                Log.e(TAG, "未 initSdkVersion")
            }
        }
    }

    /**
     * 云台 PTZ 控制接口
     * 通过 Events.onPtzControl 通知结果
     *
     ***************************************************
     * Ezviz
     *
     * @param  configMap.command    (String)    参考 enum EZConstants.EZPTZCommand
     * @param  configMap.action     (String)    参考 enum EZConstants.EZPTZAction
     * @param  configMap.speed      (String)    可为空，EzPtzSpeed, 默认：PTZ_SPEED_DEFAULT
     */
    @ReactProp(name = "controlPtz")
    fun controlPtz(hikVideoView: HikVideoView, configMap: ReadableMap) {
        when (hikVideoView.getSdkVersion()) {
            SdkVersion.HikVideo_V2_1_0, SdkVersion.Imou -> {
            }


            SdkVersion.PrimordialVideo -> {
            }

            SdkVersion.EzvizVideo -> {
                try {
                    val command = EZConstants.EZPTZCommand.valueOf(configMap.getString("command")!!)
                    val action  = EZConstants.EZPTZAction.valueOf(configMap.getString("action")!!)
                    var speed   = EzPtzSpeed.PTZ_SPEED_DEFAULT
                    if (configMap.hasKey("speed")) {
                        speed = EzPtzSpeed.valueOf(configMap.getString("speed")!!)
                    }

                    hikVideoView.controlPtzEzviz(command, action, speed)
                } catch (e: Exception) {
                    Log.e(TAG, "controlPtz: EzvizVideo 参数配置异常，请核对")
                }
            }

            SdkVersion.Unknown -> {
                Log.e(TAG, "未 initSdkVersion")
            }
        }
    }

    /**
     * 对讲控制
     * @param  configMap.isStart            (Boolean)    是否开启对讲
     *
     ***************************************************
     * HikVideo
     * @param  configMap.talkUrl            (String)     对讲短链接，通过调用openApi获取
     *
     ***************************************************
     * Ezviz
     * @param  configMap.isDeviceTalkBack   (Boolean)    可为空，默认true。用于判断对讲的设备，true表示与当前设备对讲，false表示与NVR设备下的IPC通道对讲。
     */
    @ReactProp(name = "voiceTalk")
    fun voiceTalk(hikVideoView: HikVideoView, configMap: ReadableMap) {
        val isStart = configMap.getBoolean("isStart")

        when (hikVideoView.getSdkVersion()) {
            SdkVersion.HikVideo_V2_1_0, SdkVersion.Imou -> {
                val talkUrl = configMap.getString("talkUrl")!!
                hikVideoView.voiceTalkHatom(isStart, talkUrl)
            }

            SdkVersion.PrimordialVideo -> {
            }

            SdkVersion.EzvizVideo -> {
                var isDeviceTalkBack = true
                if (configMap.hasKey("isDeviceTalkBack")) {
                    isDeviceTalkBack = configMap.getBoolean("isDeviceTalkBack")
                }

                hikVideoView.voiceTalkEzviz(isStart, isDeviceTalkBack)
            }

            SdkVersion.Unknown -> {
                Log.e(TAG, "未 initSdkVersion")
            }
        }
    }

    /**
     * 截图
     * 通过 Events.onCapturePicture 通知结果
     */
    @ReactProp(name = "capturePicture")
    fun capturePicture(hikVideoView: HikVideoView, phString: String?) {
        when (hikVideoView.getSdkVersion()) {
            SdkVersion.HikVideo_V2_1_0, SdkVersion.Imou -> {
                hikVideoView.capturePictureHatom()
            }


            SdkVersion.PrimordialVideo -> {
            }

            SdkVersion.EzvizVideo -> {
                hikVideoView.capturePictureEzviz()
            }

            SdkVersion.Unknown -> {
                Log.e(TAG, "未 initSdkVersion")
            }
        }
    }

    /**
     * 设置视频清晰度
     *
     ***************************************************
     * Hatom
     * @param configMap.path        (String?)   播放url，可为空，如果为空，需要自行调用 setDataSource 设置新的取流url
     * @param configMap.videoLevel  (String)    参考 enum hatomplayer.core.Quality
     *
     ***************************************************
     * Ezviz
     *
     * @param  configMap.videoLevel     (String)    参考 enum EZConstants.EZVideoLevel
     */
    @ReactProp(name = "setVideoLevel")
    fun setVideoLevel(hikVideoView: HikVideoView, configMap: ReadableMap) {
        when (hikVideoView.getSdkVersion()) {
            SdkVersion.HikVideo_V2_1_0, SdkVersion.Imou -> {
                // setDataSource
                if (configMap.hasKey("path")) {
                    hikVideoView.setDataSourceHatom(configMap.getString("path").toString(), null)
                }
                // changeStream
                try {
                    val videoLevel = Quality.valueOf(configMap.getString("videoLevel")!!)
                    hikVideoView.changeStreamHatom(videoLevel)
                } catch (e: Exception) {
                    Log.e(TAG, "setVideoLevel: ${hikVideoView.getSdkVersion().name} 参数配置异常，请核对")
                }
            }


            SdkVersion.PrimordialVideo -> {
            }

            SdkVersion.EzvizVideo -> {
                try {
                    val videoLevel = EZConstants.EZVideoLevel.valueOf(configMap.getString("videoLevel")!!)
                    hikVideoView.setVideoLevelEzviz(videoLevel)
                } catch (e: Exception) {
                    Log.e(TAG, "setVideoLevel: EzvizVideo 参数配置异常，请核对")
                }
            }

            SdkVersion.Unknown -> {
                Log.e(TAG, "未 initSdkVersion")
            }
        }
    }

    /**
     * 获取总流量值
     * 通过 Events.onStreamFlow 通知结果
     */
    @ReactProp(name = "getStreamFlow")
    fun getStreamFlow(hikVideoView: HikVideoView, phString: String?) {
        when (hikVideoView.getSdkVersion()) {
            SdkVersion.HikVideo_V2_1_0, SdkVersion.Imou -> {
                hikVideoView.totalTrafficHatom()
            }


            SdkVersion.PrimordialVideo -> {
            }

            SdkVersion.EzvizVideo -> {
                hikVideoView.getStreamFlowEzviz()
            }

            SdkVersion.Unknown -> {
                Log.e(TAG, "未 initSdkVersion")
            }
        }
    }

    /**
     * 设置播放验证码
     */
    @ReactProp(name = "setVerifyCode")
    fun setVerifyCode(hikVideoView: HikVideoView, verifyCode: String) {
        when (hikVideoView.getSdkVersion()) {
            SdkVersion.HikVideo_V2_1_0, SdkVersion.Imou -> {
            }


            SdkVersion.PrimordialVideo -> {
            }

            SdkVersion.EzvizVideo -> {
                hikVideoView.setVerifyCodeEzviz(verifyCode)
            }

            SdkVersion.Unknown -> {
                Log.e(TAG, "未 initSdkVersion")
            }
        }
    }

    /**
     * 回放功能
     */
    @ReactProp(name = "playback")
    fun playback(hikVideoView: HikVideoView, configMap: ReadableMap) {
        val command = PlaybackCommand.valueOf(configMap.getString("command")!!)

        when (hikVideoView.getSdkVersion()) {
            SdkVersion.HikVideo_V2_1_0, SdkVersion.Imou -> {
                playbackHatom(hikVideoView, command, configMap)
            }

            SdkVersion.PrimordialVideo -> {
            }

            SdkVersion.EzvizVideo -> {
                playbackEzviz(hikVideoView, command, configMap)
            }

            SdkVersion.Unknown -> {
                Log.e(TAG, "未 initSdkVersion")
            }
        }
    }

    /**
     * 海康回放功能
     *
     ***************************************************
     * Speed
     * @param  configMap.speed    (String)    参考 enum PlaybackSpeed
     *
     ***************************************************
     * Seek
     * @param  configMap.seekTime (Long)    偏移时间。精确到毫秒的时间戳
     *
     ***************************************************
     * Status
     * 通过 onPlayback 回调 {speed, seek}
     */
    fun playbackHatom(hikVideoView: HikVideoView, command: PlaybackCommand, configMap: ReadableMap) {
        when (command) {
            PlaybackCommand.Pause -> {
                hikVideoView.pausePlaybackHatom()
            }

            PlaybackCommand.Resume -> {
                hikVideoView.resumePlaybackHatom()
            }

            PlaybackCommand.Speed -> {
                val speed = PlaybackSpeed.valueOf(configMap.getString("speed")!!)
                hikVideoView.setSpeedPlaybackHatom(speed)
            }

            PlaybackCommand.Seek -> {
                val seekTime = configMap.getDouble("seekTime")
                val seekCalendar = Calendar.getInstance()
                seekCalendar.timeInMillis = seekTime.toLong()
                hikVideoView.seekPlaybackHatom(seekCalendar)
            }

            PlaybackCommand.Status -> {
                hikVideoView.statusPlaybackHatom()
            }

            else -> {
                Log.w(TAG, "playbackHatom: 未实现功能")
            }
        }
    }

    /**
     * 萤石回放功能
     *
     ***************************************************
     * Start
     * @param configMap.startTime (Long)  开始时间。精确到毫秒的时间戳
     * @param configMap.endTime   (Long)  结束时间。精确到毫秒的时间戳
     *
     ***************************************************
     * Speed
     * @param  configMap.speed    (String)    参考 enum EZConstants.EZPlaybackRate
     *
     ***************************************************
     * Seek
     * @param  configMap.seekTime (Long)    偏移时间。精确到毫秒的时间戳
     * 根据偏移时间播放
     * 拖动进度条时调用此接口。先停止当前播放，再把offsetTime作为起始时间按时间回放
     * 建议使用stopPlayback+startPlayback(offsetTime,stopTime)代替此接口
     *
     ***************************************************
     * Status
     * 通过 onPlayback 回调 {seek}
     */
    fun playbackEzviz(hikVideoView: HikVideoView, command: PlaybackCommand, configMap: ReadableMap) {
        when (command) {
            PlaybackCommand.Start -> {
                // 开始时间
                val startTime = configMap.getDouble("startTime")
                val startCalendar = Calendar.getInstance()
                startCalendar.timeInMillis = startTime.toLong()
                // 结束时间
                val endTime = configMap.getDouble("endTime")
                val endCalendar = Calendar.getInstance()
                endCalendar.timeInMillis = endTime.toLong()
                // 开始回放
                hikVideoView.startPlaybackEzviz(startCalendar, endCalendar)
            }

            PlaybackCommand.Stop -> {
                hikVideoView.stopPlaybackEzviz()
            }

            PlaybackCommand.Pause -> {
                hikVideoView.pausePlaybackEzviz()
            }

            PlaybackCommand.Resume -> {
                hikVideoView.resumePlaybackEzviz()
            }

            PlaybackCommand.Speed -> {
                val speed = EZConstants.EZPlaybackRate.valueOf(configMap.getString("speed")!!)
                hikVideoView.setSpeedPlaybackEzviz(speed)
            }

            PlaybackCommand.Seek -> {
                val seekTime = configMap.getDouble("seekTime")
                val seekCalendar = Calendar.getInstance()
                seekCalendar.timeInMillis = seekTime.toLong()
                hikVideoView.seekPlaybackEzviz(seekCalendar)
            }

            PlaybackCommand.Status -> {
                hikVideoView.statusPlaybackEzviz()
            }
        }
    }
    //endregion
}