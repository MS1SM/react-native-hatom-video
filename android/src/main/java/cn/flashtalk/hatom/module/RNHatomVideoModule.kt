package cn.flashtalk.hatom.module

import android.util.Log
import cn.flashtalk.hatom.hik_2_1_0.RNHikVideoManager
import cn.flashtalk.hatom.primordial.RNPrimordialVideoManager
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
            RNHikVideoManager.NAME -> {
                currentActivity?.application?.let { HatomPlayerSDK.init(it, appKey, printLog) }
            }

            RNPrimordialVideoManager.NAME -> {
                Log.d(TAG, "initSdk: ${RNPrimordialVideoManager.NAME}")
            }

            else -> {
                Log.e(TAG, "initSdk: 不存在该版本的sdk")
            }
        }
    }
}