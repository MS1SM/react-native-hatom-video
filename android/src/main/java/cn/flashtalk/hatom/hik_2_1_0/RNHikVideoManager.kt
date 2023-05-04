package cn.flashtalk.hatom.hik_2_1_0

import cn.flashtalk.hatom.base.RNBaseVideoManager
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.ReadableNativeMap
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.hikvision.hatomplayer.PlayConfig

/**
 * 支持海康 SDK V2.1.0
 */
class RNHikVideoManager : RNBaseVideoManager<HikVideoView>() {
    companion object {
        const val NAME = "HikVideo_V2.1.0"
        private const val TAG = "$NAME RNHikVideoManager"
    }

    override fun getName(): String {
        return NAME
    }

    override fun createViewInstance(reactContext: ThemedReactContext): HikVideoView {
        val hikVideoView = HikVideoView(reactContext)
        hikVideoView.setBackgroundColor(android.graphics.Color.RED)
        return hikVideoView
    }

    /**
     * 设置视频配置
     * 设置视频配置。在开始播放前设置。
     *
     * 重写，不使用默认配置
     *
     * @Nullable PlayConfig.hardDecode  (Boolean)   是否使用硬解码，默认false
     * @Nullable PlayConfig.privateData (Boolean)   是否显示智能信息,默认false
     * @Nullable PlayConfig.timeout     (int)       取流超时时间，单位秒，默认20s
     * @Nullable PlayConfig.secretKey   (String)    解码秘钥。如果码流进行了加密，需要设置解码秘钥
     */
    @ReactProp(name = "setPlayConfig")
    override fun setPlayConfig(videoImpl: HikVideoView, configMap: ReadableMap?) {
        // 数据转换
        val playConfig = PlayConfig()
        configMap?.let {
            playConfig.hardDecode   = it.getBoolean      ("hardDecode")
            playConfig.privateData  = it.getBoolean      ("privateData")
            playConfig.timeout      = it.getInt          ("timeout")
            playConfig.secretKey    = it.getString       ("secretKey")
        }
        // 配置
        videoImpl.setPlayConfig(playConfig)
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
    override fun setDataSource(videoImpl: HikVideoView, configMap: ReadableMap) {
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
        configMap.getString("path")?.let { videoImpl.setDataSource(it, headerMap) }
    }
}