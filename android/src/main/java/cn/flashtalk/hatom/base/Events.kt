package cn.flashtalk.hatom.base

/**
 * 与 js 交互的事件
 */
enum class Events() {
    /**
     * 截图回调
     * success： (Boolean)   是否成功，成功保存到系统相册
     */
    OnCapturePicture
}

/**
 * 事件交互时携带的参数
 */
enum class EventProp() {
    /**
     * 是否成功
     * Boolean
     */
    success
}