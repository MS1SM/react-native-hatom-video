package cn.flashtalk.hatom.hik

import android.util.Log
import cn.flashtalk.hatom.base.SdkVersion
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.hikvision.hatomplayer.PlayConfig

/**
 * 集成版播放器 manager
 *
 * **************************************************
 * 支持海康 SDK V2.1.0
 * 支持 Android MediaPlayer 播放器
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

    /**
     * 初始化sdk版本
     */
    @ReactProp(name = "initSdkVersion")
    fun initSdkVersion(hikVideoView: HikVideoView, sdkVersion: String) {
        try {
            if (sdkVersion == SdkVersion.Unknown.name) {
                throw Exception("not exist")
            }
            hikVideoView.initSdkVersion(SdkVersion.valueOf(sdkVersion))
        } catch (e: Exception) {
            Log.e(TAG, "initSdkVersion: 请使用枚举中记录的Sdk版本，Unknown 除外")
            hikVideoView.initSdkVersion(SdkVersion.Unknown)
        }
    }

    /**
     * 设置视频配置
     * 设置视频配置。在开始播放前设置。
     *
     * 海康 SDK V2.1.0
     * 重写，不使用默认配置
     *
     * @Nullable PlayConfig.hardDecode  (Boolean)   是否使用硬解码，默认false
     * @Nullable PlayConfig.privateData (Boolean)   是否显示智能信息,默认false
     * @Nullable PlayConfig.timeout     (int)       取流超时时间，单位秒，默认20s
     * @Nullable PlayConfig.secretKey   (String)    解码秘钥。如果码流进行了加密，需要设置解码秘钥
     *
     * Primordial
     * 使用默认配置
     */
    @ReactProp(name = "setPlayConfig")
    fun setPlayConfig(hikVideoView: HikVideoView, configMap: ReadableMap?) {
        when (hikVideoView.getSdkVersion()) {
            SdkVersion.HikVideo_V2_1_0 -> {
                // 数据转换
                val playConfig = PlayConfig()
                configMap?.let {
                    playConfig.hardDecode   = it.getBoolean      ("hardDecode")
                    playConfig.privateData  = it.getBoolean      ("privateData")
                    playConfig.timeout      = it.getInt          ("timeout")
                    playConfig.secretKey    = it.getString       ("secretKey")
                }
                // 配置
                hikVideoView.setPlayConfigHatom(playConfig)
            }

            SdkVersion.PrimordialVideo -> {
            }
            
            SdkVersion.Unknown -> {
                Log.e(TAG, "setPlayConfig: 未 initSdkVersion")
            }
        }
    }

    /**
     * 设置视频播放参数
     * 设置视频参数，开启播放前设置。实时预览、录像回放开启播放时，需要用到的取流url及其他请求参数。
     *
     * 重写，不使用默认参数
     *
     * @param configMap.path    (String)                播放url
     * @param configMap.headers (ReadableNativeMap)     其他请求参数
     *
     * headers.TOKEN      (String)  用于headers中传递token的key
     * headers.START_TIME (String)  用于headers中传递回放开始时间的key
     * headers.END_TIME   (String)  用于headers中传递回放结束时间的key
     */
    @ReactProp(name = "setDataSource")
    fun setDataSource(hikVideoView: HikVideoView, configMap: ReadableMap) {
        when (hikVideoView.getSdkVersion()) {
            SdkVersion.HikVideo_V2_1_0 -> {
                // 数据转换
                val headerMap = HashMap<String, String>()
                if (configMap.hasKey("headers")) {
                    val headers = configMap.getMap("headers")
                    headers?.let { header ->
                        header.getString("TOKEN")?.         let { headerMap.put("TOKEN", it) }
                        header.getString("START_TIME")?.    let { headerMap.put("START_TIME", it) }
                        header.getString("END_TIME")?.      let { headerMap.put("END_TIME", it) }
                    }
                }

                // 设置
                configMap.getString("path")?.let { hikVideoView.setDataSourceHatom(it, headerMap) }
            }

            SdkVersion.PrimordialVideo -> {
                configMap.getString("path")?.let { hikVideoView.setDataSourcePrimordial(it) }
            }

            SdkVersion.Unknown -> {
                Log.e(TAG, "setDataSource: 未 initSdkVersion")
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

            SdkVersion.Unknown -> {
                Log.e(TAG, "start: 未 initSdkVersion")
            }
        }
    }
}