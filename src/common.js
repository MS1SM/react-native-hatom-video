export function SdkVersionEnum() {
    /**
     * 枚举
     */
    this.HikVideo_2_1_0     = "HikVideo_V2_1_0"
    this.PrimordialVideo    = "PrimordialVideo"
    this.EzvizVideo         = "EzvizVideo"
    this.Imou               = "Imou"

    /**
     * 枚举数组
     */
    this.enums = [
        this.HikVideo_2_1_0,
        this.PrimordialVideo,
        this.EzvizVideo,
        this.Imou
    ]
}

// 萤石云台控制命令
export function EZPTZCommand() {
    /**
     * 枚举
     */
    this.EZPTZCommandLeft     = "EZPTZCommandLeft"
    this.EZPTZCommandRight    = "EZPTZCommandRight"
    this.EZPTZCommandUp       = "EZPTZCommandUp"
    this.EZPTZCommandDown     = "EZPTZCommandDown"
    this.EZPTZCommandZoomIn   = "EZPTZCommandZoomIn"
    this.EZPTZCommandZoomOut  = "EZPTZCommandZoomOut"

    /**
     * 枚举数组
     */
    this.enums = [
        this.EZPTZCommandLeft,
        this.EZPTZCommandRight,
        this.EZPTZCommandUp,
        this.EZPTZCommandDown,
        this.EZPTZCommandZoomIn,
        this.EZPTZCommandZoomOut
    ]
}

// 萤石云台控制动作
export function EZPTZAction() {
    /**
     * 枚举
     */
    this.EZPTZActionSTART   = "EZPTZActionSTART"
    this.EZPTZActionSTOP    = "EZPTZActionSTOP"

    /**
     * 枚举数组
     */
    this.enums = [
        this.EZPTZActionSTART,
        this.EZPTZActionSTOP
    ]
}

// 萤石云台控制速度
export function EzPtzSpeed() {
    /**
     * 枚举
     */
    this.PTZ_SPEED_SLOW     = "PTZ_SPEED_SLOW"
    this.PTZ_SPEED_DEFAULT  = "PTZ_SPEED_DEFAULT"
    this.PTZ_SPEED_FAST     = "PTZ_SPEED_FAST"

    /**
     * 枚举数组
     */
    this.enums = [
        this.PTZ_SPEED_SLOW,
        this.PTZ_SPEED_DEFAULT,
        this.PTZ_SPEED_FAST
    ]
}

// 萤石视频画质
export function EZVideoLevel() {
    /**
     * 枚举
     */
    this.VIDEO_LEVEL_SUPERCLEAR = "VIDEO_LEVEL_SUPERCLEAR"
    this.VIDEO_LEVEL_HD         = "VIDEO_LEVEL_HD"
    this.VIDEO_LEVEL_BALANCED   = "VIDEO_LEVEL_BALANCED"
    this.VIDEO_LEVEL_FLUNET     = "VIDEO_LEVEL_FLUNET"

    /**
     * 枚举数组
     */
    this.enums = [
        this.VIDEO_LEVEL_SUPERCLEAR,
        this.VIDEO_LEVEL_HD,
        this.VIDEO_LEVEL_BALANCED,
        this.VIDEO_LEVEL_FLUNET
    ]
}

// 萤石开关
export function EzSwitch() {
    /**
     * 枚举
     */
    this.Open   = 1
    this.Close  = 0

    /**
     * 枚举数组
     */
    this.enums = [
        this.Open,
        this.Close
    ]
}

// 萤石镜像
export function EzMirror() {
    /**
     * 枚举
     */
    // 垂直方向，上下镜像
    this.Vertical   = 0
    // 水平方向，左右镜像
    this.Horizontal = 1
    // 中心镜像
    this.Center     = 2

    /**
     * 枚举数组
     */
    this.enums = [
        this.Vertical,
        this.Horizontal,
        this.Center
    ]
}

// 萤石告警声音模式
export function EzAlarm() {
    /**
     * 枚举
     */
    // 短叫
    this.Short  = 0
    // 长叫
    this.Long   = 1
    // 静音
    this.Silent = 2

    /**
     * 枚举数组
     */
    this.enums = [
        this.Short,
        this.Long,
        this.Silent
    ]
}

// 萤石 sd 状态
export function EzSdStatus() {
    /**
     * 枚举
     */
    // 不存在
    this.NotExist = -1
    // 正常
    this.Normal  = 0
    // 存储介质错误
    this.Error   = 1
    // 未格式化
    this.Unformat = 2
    // 正在格式化
    this.Formatting = 3

    /**
     * 枚举数组
     */
    this.enums = [
        this.NotExist,
        this.Normal,
        this.Error,
        this.Unformat,
        this.Formatting
    ]
}

// 萤石固件升级状态
export function EzUpgradeStatus() {
    /**
     * 枚举
     */
    // 正在升级
    this.Upgrading = 0
    // 设备重启
    this.Reboot = 1
    // 升级成功
    this.Success = 2
    // 升级失败
    this.Error = 3

    /**
     * 枚举数组
     */
    this.enums = [
        this.Upgrading,
        this.Reboot,
        this.Success,
        this.Error
    ]
}

// 国标/海康 视频画质
export function HikVideoLevel() {
    /**
     * 枚举
     */
    this.MAIN_STREAM_HIGH       = "MAIN_STREAM_HIGH"
    this.SUB_STREAM_STANDARD    = "SUB_STREAM_STANDARD"
    this.SUB_STREAM_LOW         = "SUB_STREAM_LOW"
    this.STREAM_SUPER_CLEAR     = "STREAM_SUPER_CLEAR"

    /**
     * 枚举数组
     */
    this.enums = [
        this.MAIN_STREAM_HIGH,
        this.SUB_STREAM_STANDARD,
        this.SUB_STREAM_LOW,
        this.STREAM_SUPER_CLEAR
    ]
}

// 回放功能
export function PlaybackCommand() {
    /**
     * 枚举
     */
    this.Start   = "Start"
    this.Stop    = "Stop"
    this.Pause   = "Pause"
    this.Resume  = "Resume"
    this.Speed   = "Speed"
    this.Seek    = "Seek"
    this.Status  = "Status"

    /**
     * 枚举数组
     */
    this.enums = [
        this.Start,
        this.Stop,
        this.Pause,
        this.Resume,
        this.Speed,
        this.Seek,
        this.Status
    ]
}

// 萤石 回放倍速
export function EZPlaybackRate() {
    /**
     * 枚举
     */
    // 0.0625
    this.EZ_PLAYBACK_RATE_16_1  = "EZ_PLAYBACK_RATE_16_1"
    // 0.125
    this.EZ_PLAYBACK_RATE_8_1   = "EZ_PLAYBACK_RATE_8_1"
    // 0.25
    this.EZ_PLAYBACK_RATE_4_1   = "EZ_PLAYBACK_RATE_4_1"
    // 0.5
    this.EZ_PLAYBACK_RATE_2_1   = "EZ_PLAYBACK_RATE_2_1"
    // 1.0
    this.EZ_PLAYBACK_RATE_1     = "EZ_PLAYBACK_RATE_1"
    // 2.0
    this.EZ_PLAYBACK_RATE_2     = "EZ_PLAYBACK_RATE_2"
    // 4.0
    this.EZ_PLAYBACK_RATE_4     = "EZ_PLAYBACK_RATE_4"
    // 8.0
    this.EZ_PLAYBACK_RATE_8     = "EZ_PLAYBACK_RATE_8"
    // 16.0
    this.EZ_PLAYBACK_RATE_16    = "EZ_PLAYBACK_RATE_16"
    // 32.0
    this.EZ_PLAYBACK_RATE_32    = "EZ_PLAYBACK_RATE_32"

    /**
     * 枚举数组
     */
    this.enums = [
        this.EZ_PLAYBACK_RATE_16_1,
        this.EZ_PLAYBACK_RATE_8_1,
        this.EZ_PLAYBACK_RATE_4_1,
        this.EZ_PLAYBACK_RATE_2_1,
        this.EZ_PLAYBACK_RATE_1,
        this.EZ_PLAYBACK_RATE_2,
        this.EZ_PLAYBACK_RATE_4,
        this.EZ_PLAYBACK_RATE_8,
        this.EZ_PLAYBACK_RATE_16,
        this.EZ_PLAYBACK_RATE_32
    ]
}

// 海康 回放倍速
export function HikPlaybackRate() {
    /**
     * 枚举
     */
    // 0.125
    this.ONE_EIGHTH = "ONE_EIGHTH"
    // 0.25
    this.QUARTER    = "QUARTER"
    // 0.5
    this.HALF       = "HALF"
    // 1.0
    this.NORMAL     = "NORMAL"
    // 2.0
    this.DOUBLE     = "DOUBLE"
    // 4.0
    this.FOUR       = "FOUR"
    // 8.0
    this.EIGHT      = "EIGHT"
    // 16.0
    this.SIXTEEN    = "SIXTEEN"
    // 32.0
    this.THIRTY_TWO = "THIRTY_TWO"

    /**
     * 枚举数组
     */
    this.enums = [
        this.ONE_EIGHTH,
        this.QUARTER,
        this.HALF,
        this.NORMAL,
        this.DOUBLE,
        this.FOUR,
        this.EIGHT,
        this.SIXTEEN,
        this.THIRTY_TWO
    ]
}