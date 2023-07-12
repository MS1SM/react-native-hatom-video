package cn.flashtalk.hatom.common

import android.util.Log

//region 与 js 交互的事件
enum class Events {
    /**
     * 截图回调
     * success： (Boolean)   是否成功，只有保存到系统相册才算成功
     */
    onCapturePicture,

    /**
     * 录像结果回调
     * success： (Boolean)   是否成功，不保存到系统相册
     * message： (String?)   信息，失败时的信息
     * data：    (String?)   文件路径，成功时
     */
    onLocalRecord,

    /**
     * 云台控制回调
     * 暂时只有失败才做回调
     * success： (Boolean)   操作是否成功
     * message： (String?)   信息，失败时的信息
     */
    onPtzControl,

    /**
     * 流量使用回调，总流量
     * data:    (Double)  总流量值，单位：B
     */
    onStreamFlow
}
//endregion

//region 事件交互时携带的参数
enum class EventProp {
    /**
     * 是否成功
     * Boolean
     */
    success,

    /**
     * 信息
     * String
     */
    message,

    /**
     * 数据
     * Any
     */
    data,

    /**
     * 编码
     * Int
     */
    code
}
//endregion

//region 萤石云台速度
enum class EzPtzSpeed(val value: Int) {
    PTZ_SPEED_SLOW(0),
    PTZ_SPEED_DEFAULT(1),
    PTZ_SPEED_FAST(2)
}
//endregion

//region sdk 版本枚举
enum class SdkVersion {
    // 没有配置，未知。实际使用不得配置此版本，仅用于报错提示。
    Unknown,
    // 支持海康 SDK V2.1.0。使用本地依赖。
    HikVideo_V2_1_0,
    // 支持 Android MediaPlayer 播放器
    PrimordialVideo,
    // 支持萤石 SDK。萤石使用 Gradle 获得，不强调版本。
    EzvizVideo,
    // 乐橙云
    Imou;

    companion object {
        private const val TAG = "SdkVersion"

        fun nameToEnum(name: String): SdkVersion {
            return try {
                if (name == Unknown.name) {
                    throw Exception("not exist")
                }
                SdkVersion.valueOf(name)
            } catch (e: Exception) {
                Log.e(TAG, "nameToEnum: SdkVersion = $name 请使用枚举中记录的Sdk版本，请勿使用 Unknown")
                Unknown
            }
        }
    }
}
//endregion