package cn.flashtalk.hatom.base

/**
 * sdk 版本枚举
 */
enum class SdkVersion {
    // 没有配置，未知。实际使用不得配置此版本，仅用于报错提示。
    Unknown,
    // 支持海康 SDK V2.1.0
    HikVideo_V2_1_0,
    // 支持 Android MediaPlayer 播放器
    PrimordialVideo
}