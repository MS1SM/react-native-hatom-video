package cn.flashtalk.hatom.module

import android.util.Log
import cn.flashtalk.hatom.base.SdkVersion
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.hikvision.hatomplayer.HatomPlayerSDK

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

            else -> {
                Log.e(TAG, "initSdk: 不存在该版本的sdk")
            }
        }
    }
}