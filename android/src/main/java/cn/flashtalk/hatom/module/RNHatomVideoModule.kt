package cn.flashtalk.hatom.module

import android.util.Log
import cn.flashtalk.hatom.common.EventProp
import cn.flashtalk.hatom.common.SdkVersion
import com.ezviz.sdk.configwifi.EZConfigWifiInfoEnum
import com.ezviz.sdk.configwifi.EZWiFiConfigManager
import com.ezviz.sdk.configwifi.ap.ApConfigParam
import com.ezviz.sdk.configwifi.common.EZConfigWifiCallback
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.hikvision.hatomplayer.HatomPlayerSDK
import com.videogo.openapi.EZOpenSDK
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.launch


class RNHatomVideoModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    companion object {
        private const val NAME = "RNHatomVideo"
        private const val TAG = "RNHatomVideoModule"
    }

    override fun getName(): String {
        return NAME
    }

    //region 内部方法
    private fun getSdkVersion(configMap: ReadableMap): SdkVersion {
        // 获取 sdkVersion
        var sdkVersion = ""
        if (configMap.hasKey("sdkVersion")) {
            sdkVersion = configMap.getString("sdkVersion").toString()
        }

        return SdkVersion.nameToEnum(sdkVersion)
    }

    /**
     * 萤石 wifi 配置回调
     * @param  promise              (Promise)       使用 Promise 回调结果
     *
     * @return promise.resolve      (WritableMap)   成功，无实际数据
     *
     * @return promise.reject       (Exception)     操作异常，返回异常内容
     *          reject.message      (String)        异常编码code
     */
    private fun getEzConfigWifiCallback(promise: Promise): EZConfigWifiCallback {
        return object: EZConfigWifiCallback() {
            override fun onInfo(code: Int, message: String?) {
                super.onInfo(code, message)
                if (code == EZConfigWifiInfoEnum.CONNECTING_SENT_CONFIGURATION_TO_DEVICE.code) {
                    EZWiFiConfigManager.stopAPConfig()
                    promise.resolve("")
                }
            }

            override fun onError(code: Int, description: String?) {
                super.onError(code, description)
                EZWiFiConfigManager.stopAPConfig()
                promise.reject(Exception(code.toString()))
            }
        }
    }
    //endregion

    //region 对外接口
    /**
     * 初始化 SDK
     * @param configMap.sdkVersion    (String)  sdk 版本
     * @param configMap.appKey        (String)  appKey
     * @param configMap.printLog      (Boolean) 是否打开日志，仅限 SDK 的日志，本封装库的日志不受控
     *
     ***************************************************
     * Ezviz
     * @param  configMap.accessToken  (String) token
     */
    @ReactMethod
    fun initSdk(configMap: ReadableMap) {
        // appKey
        val appKey      = configMap.getString("appKey")
        // 是否打开日志
        val printLog    = configMap.getBoolean("printLog")

        when(getSdkVersion(configMap)) {
            SdkVersion.HikVideo_V2_1_0, SdkVersion.Imou -> {
                HatomPlayerSDK.init(currentActivity!!.application, appKey, printLog)
            }

            SdkVersion.PrimordialVideo -> {
                Log.d(TAG, "initSdk: ${SdkVersion.PrimordialVideo.name}")
            }

            SdkVersion.EzvizVideo -> {
                // sdk日志开关，正式发布需要去掉
                EZOpenSDK.showSDKLog(printLog)
                // 设置是否支持P2P取流,详见api
                EZOpenSDK.enableP2P(false)
                // 初始化
                EZOpenSDK.initLib(currentActivity!!.application, appKey)
                // 设置 token
                EZOpenSDK.getInstance().setAccessToken(configMap.getString("accessToken"))
            }
        }
    }

    /**
     * 查询设备信息
     *
     * @param  configMap.sdkVersion     (String)    sdk 版本
     *
     ***************************************************
     * Ezviz
     * @param  configMap.deviceSerial   (String)    设备序列号
     * @param  configMap.deviceType     (String)    设备型号
     *
     * @param  promise              (Promise)       使用 Promise 回调结果
     * @return promise.resolve      (WritableMap)   操作结果，返回数据对象。成功与失败都通过此方式返回结果，通过code判断。
     *         resolve.code         (Int?)          不存在时表示查询成功，需要添加对象；存在时根据错误码确定设备状态。参考 设备添加流程：https://open.ys7.com/help/36
     */
    @ReactMethod
    fun probeDeviceInfo(configMap: ReadableMap, promise: Promise) {
        when(getSdkVersion(configMap)) {
            SdkVersion.HikVideo_V2_1_0 -> {
            }

            SdkVersion.PrimordialVideo -> {
            }

            SdkVersion.EzvizVideo -> {
                // 设备序列号
                val deviceSerial = configMap.getString("deviceSerial")
                // 设备型号
                val deviceType = configMap.getString("deviceType")

                CoroutineScope(Dispatchers.IO).launch {
                    flow<String> {
                        val result = EZOpenSDK.getInstance().probeDeviceInfo(
                            deviceSerial,
                            deviceType
                        )

                        // 返回值
                        val propMap = Arguments.createMap()
                        if (result.baseException != null) {
                            propMap.putInt(EventProp.code.name, result.baseException.errorCode)
                        }
                        // 设备信息，需要再添加
                        if (result.ezProbeDeviceInfo != null) {
                        }

                        promise.resolve(propMap)

                    }.catch {
                        val propMap = Arguments.createMap()
                        propMap.putInt(EventProp.code.name, -1)
                        promise.resolve(propMap)
                    }.collect {}
                }
            }
        }
    }

    /**
     * wifi 配网
     *
     * @param  configMap.sdkVersion     (String)    sdk 版本
     * @param  promise                  (Promise)   使用 Promise 回调结果
     *
     ***************************************************
     * Ezviz
     * @param  configMap.deviceSsid                     (String)    设备wifi ssid，可传空，默认为"EZVIZ_" + 设备序列号
     * @param  configMap.devicePassword                 (String)    设备wifi 密码， 可传空，默认为"EZVIZ_" + 设备验证码
     * @param  configMap.deviceSerial                   (String)    设备序列号
     * @param  configMap.verifyCode                     (String)    设备验证码
     * @param  configMap.routerSsid                     (String)    路由器ssid
     * @param  configMap.routerPassword                 (String)    路由器密码
     * @param  configMap.isAutoConnect                  (Boolean)   是否自动连接设备热点,需要获取可扫描wifi的权限；如果开发者已经确认手机连接到设备热点，则传false
     */
    @ReactMethod
    fun startConfigWifi(configMap: ReadableMap, promise: Promise) {
        when(getSdkVersion(configMap)) {
            SdkVersion.HikVideo_V2_1_0 -> {
            }

            SdkVersion.PrimordialVideo -> {
            }

            SdkVersion.EzvizVideo -> {
                // 设备ssid
                var deviceSsid: String? = null
                if (configMap.hasKey("deviceSsid")) deviceSsid = configMap.getString("deviceSsid")
                // 设备wifi 密码
                var devicePassword: String? = null
                if (configMap.hasKey("devicePassword")) devicePassword = configMap.getString("devicePassword")
                // 设备序列号
                val deviceSerial = configMap.getString("deviceSerial")
                // 设备验证码
                val verifyCode = configMap.getString("verifyCode")
                // 路由器ssid
                val routerSsid = configMap.getString("routerSsid")
                // 路由器密码
                val routerPassword = configMap.getString("routerPassword")
                // 是否自动连接设备热点
                val isAutoConnect = configMap.getBoolean("isAutoConnect")

                // 参数
                val param                   = ApConfigParam()
                param.deviceHotspotSsid     = deviceSsid
                param.deviceHotspotPwd      = devicePassword
                param.deviceSerial          = deviceSerial
                param.deviceVerifyCode      = verifyCode
                param.routerWifiSsid        = routerSsid
                param.routerWifiPwd         = routerPassword
                param.autoConnect           = isAutoConnect

                // 开始配网
                EZWiFiConfigManager.startAPConfig(
                    currentActivity!!.application,
                    param,
                    getEzConfigWifiCallback(promise)
                )
            }
        }
    }
    //endregion
}
