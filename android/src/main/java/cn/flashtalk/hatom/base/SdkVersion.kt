package cn.flashtalk.hatom.base

import android.util.Log

/**
 * sdk 版本枚举
 */
enum class SdkVersion {
    // 没有配置，未知。实际使用不得配置此版本，仅用于报错提示。
    Unknown,
    // 支持海康 SDK V2.1.0。使用本地依赖。
    HikVideo_V2_1_0,
    // 支持 Android MediaPlayer 播放器
    PrimordialVideo,
    // 支持萤石 SDK。萤石使用 Gradle 获得，不强调版本。
    EzvizVideo;

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