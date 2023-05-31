package cn.flashtalk.hatom.module

import android.util.Log
import cn.flashtalk.hatom.base.SdkVersion
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.hikvision.hatomplayer.HatomPlayerSDK
import com.videogo.openapi.EZOpenSDK

class RNHatomVideoModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule( reactContext) {

    companion object {
        private const val NAME = "RNHatomVideo"
        private const val TAG = "RNHatomVideoModule"
    }

    override fun getName(): String {
        return NAME
    }

    @ReactMethod
    fun initSdk(sdkVersion: String, appKey: String?, printLog: Boolean) {
        when(sdkVersion) {
            SdkVersion.HikVideo_V2_1_0.name -> {
                currentActivity?.application?.let { HatomPlayerSDK.init(it, appKey, printLog) }
            }

            SdkVersion.PrimordialVideo.name -> {
                Log.d(TAG, "initSdk: ${SdkVersion.PrimordialVideo.name}")
            }

            SdkVersion.EzvizVideo.name -> {
                // sdk日志开关，正式发布需要去掉
                EZOpenSDK.showSDKLog(printLog)
                // 设置是否支持P2P取流,详见api
                EZOpenSDK.enableP2P(false)
                // 初始化
                currentActivity?.application?.let { EZOpenSDK.initLib(it, appKey) }
            }

            else -> {
                Log.e(TAG, "initSdk: 不存在该版本的sdk")
            }
        }
    }
}