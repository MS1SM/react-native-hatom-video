export function SdkVersionEnum() {
    /**
     * 枚举
     */
    this.HikVideo_2_1_0     = "HikVideo_V2_1_0"
    this.PrimordialVideo    = "PrimordialVideo"
    this.EzvizVideo         = "EzvizVideo"

    /**
     * 枚举数组
     */
    this.enums = [
        this.HikVideo_2_1_0,
        this.PrimordialVideo,
        this.EzvizVideo
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