package cn.flashtalk.hatom.base

/**
 * 与 js 交互的事件
 */
enum class Events {
    /**
     * 截图回调
     * success： (Boolean)   是否成功，只有保存到系统相册才算成功
     */
    OnCapturePicture,

    /**
     * 录像结果回调
     * success： (Boolean)   是否成功，不保存到系统相册
     * message： (String?)   信息，失败时的信息
     * data：    (String?)   文件路径，成功时
     */
    OnLocalRecord,

    /**
     * 云台控制回调
     * 暂时只有失败才做回调
     * success： (Boolean)   操作是否成功
     * message： (String?)   信息，失败时的信息
     */
    OnPtzControl,

    /**
     * 流量使用回调，总流量
     * data:    (Double)  总流量值，单位：B
     */
    OnStreamFlow
}

/**
 * 事件交互时携带的参数
 */
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