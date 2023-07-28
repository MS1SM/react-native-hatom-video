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
    this.notExist = -1
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
        this.notExist,
        this.Normal,
        this.Error,
        this.Unformat,
        this.Formatting
    ]
}