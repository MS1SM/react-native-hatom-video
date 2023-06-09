package cn.flashtalk.hatom.hik

import android.util.Log
import cn.flashtalk.hatom.base.Events
import cn.flashtalk.hatom.base.EzPtzSpeed
import cn.flashtalk.hatom.base.SdkVersion
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.common.MapBuilder
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.hikvision.hatomplayer.PlayConfig
import com.videogo.openapi.EZConstants

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
            SdkVersion.HikVideo_V2_1_0 -> {
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
            SdkVersion.HikVideo_V2_1_0 -> {
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
            SdkVersion.HikVideo_V2_1_0 -> {
                // 数据转换
                val headerMap = HashMap<String, String>()
                if (configMap.hasKey("headers")) {
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
            SdkVersion.HikVideo_V2_1_0 -> {
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
            SdkVersion.HikVideo_V2_1_0 -> {
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
            SdkVersion.HikVideo_V2_1_0 -> {
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
     *
     ***************************************************
     * Ezviz
     */
    @ReactProp(name = "startLocalRecord")
    fun startLocalRecord(hikVideoView: HikVideoView, configMap: ReadableMap) {
        when (hikVideoView.getSdkVersion()) {
            SdkVersion.HikVideo_V2_1_0 -> {
            }

            SdkVersion.PrimordialVideo -> {
            }

            SdkVersion.EzvizVideo -> {
                hikVideoView.startLocalRecordEzviz()
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
     * 通过 Events.OnLocalRecord 通知结果
     */
    @ReactProp(name = "stopLocalRecord")
    fun stopLocalRecord(hikVideoView: HikVideoView, phString: String?) {
        when (hikVideoView.getSdkVersion()) {
            SdkVersion.HikVideo_V2_1_0 -> {
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
            SdkVersion.HikVideo_V2_1_0 -> {
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
            SdkVersion.HikVideo_V2_1_0 -> {
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
     *
     ***************************************************
     * Ezviz
     *
     * @param  configMap.isStart            (Boolean)    是否开启对讲
     * @param  configMap.isDeviceTalkBack   (Boolean)    可为空，默认true。用于判断对讲的设备，true表示与当前设备对讲，false表示与NVR设备下的IPC通道对讲。
     */
    @ReactProp(name = "voiceTalk")
    fun voiceTalk(hikVideoView: HikVideoView, configMap: ReadableMap) {
        when (hikVideoView.getSdkVersion()) {
            SdkVersion.HikVideo_V2_1_0 -> {
            }


            SdkVersion.PrimordialVideo -> {
            }

            SdkVersion.EzvizVideo -> {
                val isStart = configMap.getBoolean("isStart")
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
     * 通过 Events.OnCapturePicture 通知结果
     */
    @ReactProp(name = "capturePicture")
    fun capturePicture(hikVideoView: HikVideoView, phString: String?) {
        when (hikVideoView.getSdkVersion()) {
            SdkVersion.HikVideo_V2_1_0 -> {
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
     * Ezviz
     *
     * @param  configMap.videoLevel     (String)    参考 enum EZConstants.EZVideoLevel
     */
    @ReactProp(name = "setVideoLevel")
    fun setVideoLevel(hikVideoView: HikVideoView, configMap: ReadableMap) {
        when (hikVideoView.getSdkVersion()) {
            SdkVersion.HikVideo_V2_1_0 -> {
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
     * 通过 Events.OnStreamFlow 通知结果
     */
    @ReactProp(name = "getStreamFlow")
    fun getStreamFlow(hikVideoView: HikVideoView, phString: String?) {
        when (hikVideoView.getSdkVersion()) {
            SdkVersion.HikVideo_V2_1_0 -> {
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
}