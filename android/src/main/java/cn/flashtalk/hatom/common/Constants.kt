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
    onStreamFlow,

    /**
     * 播放器状态回调
     *
     ***************************************************
     * HikVideo
     * code: (String) (code == '-1') 成功，(code == 其他) 错误码。参考海康文档
     *
     ***************************************************
     * Ezviz
     * code: (Int)          状态。参考萤石文档，EZConstants.EZRealPlayConstants
     *
     * data: (Object?)      (code == MSG_REALPLAY_PLAY_FAIL<103>) data = { code, message }
     *                          (data.code = 400035 || 400036) 需要输入验证码 || 验证码错误
     *
     *                      (code == 其他) data 暂无数据
     */
    onPlayStatus,

    /**
     * 对讲状态回调
     *
     ***************************************************
     * HikVideo
     * code: (String) (code == '-1') 成功，(code == 其他) 错误码。参考海康文档
     *
     ***************************************************
     * Ezviz
     * code: (Int)          状态。参考萤石文档，EZConstants.EZRealPlayConstants
     */
    onTalkStatus,

    /**
     * 回看状态
     * speed: (String)      倍速，对应枚举的字符串
     * seek: (Long)         进度，时间戳，毫秒
     */
    onPlayback
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
     * Int | String
     */
    code,

    /**
     * 录像路径
     */
    recordPath,

    /**
     * 速度
     * String
     */
    speed,

    /**
     * 进度
     * Long
     */
    seek
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

//region 回放功能
enum class PlaybackCommand {
    // 开始
    Start,
    // 停止
    Stop,
    // 暂停
    Pause,
    // 恢复
    Resume,
    // 设置倍速
    Speed,
    // 设置进度
    Seek,
    // 获取状态，通过 onPlayback 回调
    Status
}
// endregion