import React, { Component } from 'react';
import {
    requireNativeComponent,
    ViewPropTypes,
    NativeModules,
    Dimensions
} from 'react-native';
import PropTypes from 'prop-types';
import { SdkVersionEnum } from './common';
import { getToken } from 'react-native-hatom-video/src/api/HikApi';
import Log from 'react-native-hatom-video/src/utils/Log';
import Video from "react-native-video";

const TAG = 'HatomVideo';

export const SdkVersion = new SdkVersionEnum()

// 全局属性【用于保证that的有效区域】
let that;
// 全局属性【用于获取屏幕宽高等信息】
const windowSize = Dimensions.get("window");

export default class HatomVideo extends Component {

    constructor(props) {
        super(props)
        // sdk 类型版本
        this._sdkVersion = props.sdkVersion

        // 当前使用的总流量，单位：B，每秒更新
        this._streamFlow = 0

        // 流量监听定时器
        this._streamFlowTimer = null

        that = this;

        // 用于 GBVideo 的控制
        this.state = {
            // 数据源
            datasource: "",
            // 是否暂停
            isPaused: true,
            // 总时长
            duration: 0,
            // 当前播放时间
            currentTime: 0,
            // 进度条的进度
            sliderValue: 0,
            // 是否在拖动中
            isSlider:false,

            //用来控制进入全屏的属性
            videoViewWidth: windowSize.width,
            videoViewHeight: this.props.style.height,
            isFullScreen: false,
            isVisiblePausedSliderFullScreen: false,
        };
    }

    componentWillUnmount() {
        // 清理流量监听定时器
        if (this._streamFlowTimer) {
            clearInterval(this._streamFlowTimer)
        }
    }

    // 获取组件进行保存
    _assignRoot = (component) => {
        this._root = component
        // 支持国标使用 GBVideo 单独存储一个播放器
        if (this.supportGB()) {
            that._gbVideo = component
        }
    }
    // 调用这个组件的setNativeProps方法
    setNativeProps(nativeProps) {
        this._root.setNativeProps(nativeProps);
    };

    /**
     * 是否支持国标
     * @param {String} sdkVersion? 可为空，空使用this._sdkVersion 判断
     * @return {Boolean} 支持：true
     */
    supportGB(sdkVersion) {
        let sdkParam = sdkVersion ? sdkVersion : this._sdkVersion

        switch (sdkParam) {
            case SdkVersion.Imou:
                return true
                break
            
            default:
                return false
        }
    }

    /************************* public *************************/

    /**
     * 初始化播放器
     * 将启动流量监听线程
     * 
     * @param {*} config 参考 _initPlayer
     */
    initPlayer(config) {
        this._initPlayer(config)

        // 流量监听，每秒查询一次。初始化一秒后执行，避免尚未初始化的数据异常
        this._streamFlowTimer = setInterval(
            () => {
                this._getStreamFlow()
            },
            1000
        )
    }

    getToken() {
        if (this.supportGB()) {
            this._getToken()
        } else {
            Log.debug(TAG, "getToken", "default")
        }
    }

    /**
     * 设置播放参数
     * @param {String} path 播放地址
     */
    setDataSource(path) {
        if (this.supportGB()) {
            that.setState({
                datasource: path,
            })
            that.setState({
                isPaused: false,
            })

        } else {
            this._setDataSource(path)
        }
    }

    /************************* HikApi *************************/
    _getToken() {
        getToken()
    }

    /************************* NativeModules *************************/

    /**
     * 初始化SDK
     * @param {object}      config
     * @param {string}      config.sdkVersion 
     * @param {string}      config.appKey 
     * @param {Boolean}     config.printLog 
     * 
     * **************************************************
     * Ezviz
     * @param {string} config.accessToken 
     */
    static _initSdk(config) {
        NativeModules.RNHatomVideo.initSdk(config)
    }

    /**
     * 查询设备信息
     * @param {object}      config
     * @param {string}      config.sdkVersion 
     * 
     * **************************************************
     * Ezviz
     * @param {string} config.deviceSerial   设备序列号
     * @param {string} config.deviceType     设备型号
     * 
     * @return {object} promise.resolve      操作结果，返回数据对象。成功与失败都通过此方式返回结果，通过code判断。
     *         {number?} resolve.code        不存在时表示查询成功，需要添加对象；存在时根据错误码确定设备状态。参考 设备添加流程：https://open.ys7.com/help/36
     */
    static _probeDeviceInfo(config) {
        return NativeModules.RNHatomVideo.probeDeviceInfo(config)
    }

    /**
     * wifi 配网
     * @param {object}      config
     * @param {string}      config.sdkVersion 
     *
     ***************************************************
     * Ezviz
     * 
     * Android 可以自动切换Wi-Fi实现配网；iOS 需要先连接到设备wifi，才可以开始配网
     * 
     * Android
     * @param {string} config.deviceSsid            设备wifi ssid，可传空，默认为"EZVIZ_" + 设备序列号
     * @param {string} config.devicePassword        设备wifi 密码， 可传空，默认为"EZVIZ_" + 设备验证码
     * @param {string} config.deviceSerial          设备序列号
     * @param {string} config.verifyCode            设备验证码
     * @param {string} config.routerSsid            路由器ssid
     * @param {string} config.routerPassword        路由器密码
     * @param {Boolean}config.isAutoConnect         是否自动连接设备热点,需要获取可扫描wifi的权限；如果开发者已经确认手机连接到设备热点，则传false
     * 
     * iOS
     * @param {string} config.deviceSerial          设备序列号
     * @param {string} config.verifyCode            设备验证码
     * @param {string} config.routerSsid            路由器ssid
     * @param {string} config.routerPassword        路由器密码
     * 
     * @return {object} promise.resolve             成功，无实际数据
     *
     * @return {object} promise.reject              操作异常，返回异常内容
     *         {String} reject.message              异常编码code
     */
     static _startConfigWifi(config) {
        return NativeModules.RNHatomVideo.startConfigWifi(config)
    }

    /************************* setNativeProps *************************/

    /**
     * 初始化播放器
     * 请使用 initPlayer
     * 
     * **************************************************
     * HikVideo and Primordial
     * configk 可为空对象{}
     * 
     * **************************************************
     * Ezviz
     * @param {object} config
     * @param {string} config.deviceSerial  设备序列号
     * @param {number} config.cameraNo      通道号
     */
    _initPlayer(config) {
        this.setNativeProps({initPlayer: config})
    }

    /**
     * 设置播放参数
     * 请使用 setDataSource
     * 
     * @param {String} path 播放地址
     */
    _setDataSource(path) {
        this.setNativeProps({setDataSource: {
            path: path
        }})
    }

    // 开始播放
    _start() {
        this.setNativeProps({startPlay: "phString"})
    }

    // 停止播放
    _stop() {
        this.setNativeProps({stopPlay: "phString"})
    }

    // 释放资源
    _release() {
        this.setNativeProps({release: "phString"})
    }

    /**
     * 开启录像
     *
     ***************************************************
     * Ezviz
     */
    _startLocalRecord() {
        let config = {}
        this.setNativeProps({startLocalRecord: config})
    }

    /**
     * 结束本地直播流录像
     * 与 _startLocalRecord 成对使用
     * 
     * 通过 _onLocalRecord 回调结果
     */
    _stopLocalRecord() {
        this.setNativeProps({stopLocalRecord: "phString"})
    }

    /**
     * 声音控制
     * @param isOpen 是否打开
     */
    _sound(isOpen) {
        this.setNativeProps({sound: isOpen})
    }

    /**
     * 云台 PTZ 控制接口
     * 通过 _onPtzControl 回调结果 暂时只有失败才回调结果
     *
     ***************************************************
     * Ezviz
     *
     * 参数皆为枚举，使用 common 中的定义
     * @param  config.command    (EZPTZCommand)    方向
     * @param  config.action     (EZPTZAction)     动作
     * @param  config.speed      (EzPtzSpeed)      速度，可为空，默认为 PTZ_SPEED_DEFAULT
     */
     _controlPtz(config) {
        this.setNativeProps({controlPtz: config})
    }

    /**
     * 对讲控制
     *
     ***************************************************
     * Ezviz
     * 
     * @param  config.isStart           (Boolean)    是否开启对讲
     * @param  config.isDeviceTalkBack  (Boolean)    可为空，默认true。用于判断对讲的设备，true表示与当前设备对讲，false表示与NVR设备下的IPC通道对讲。
     */
    _voiceTalk(config) {
        this.setNativeProps({voiceTalk: config})
    }

    /**
     * 截图
     * 通过 _onCapturePicture 回调结果
     */
    _capturePicture() {
        this.setNativeProps({capturePicture: "phString"})
    }

    /**
     * 设置视频清晰度
     *
     ***************************************************
     * Ezviz
     * 
     * @param  config.videoLevel     (EZVideoLevel)   清晰度
     */
     _setVideoLevel(config) {
        this.setNativeProps({setVideoLevel: config})
    }

    /**
     * 获取总流量值
     * 通过 _onStreamFlow 回调结果
     */
     _getStreamFlow() {
        this.setNativeProps({getStreamFlow: "phString"})
    }

    /************************* event *************************/

    /**
     * 截图回调
     * nativeEvent.success： (Boolean)   是否成功，只有保存到系统相册才算成功
     */
    _onCapturePicture = (event) => {
        if (this.props.onCapturePicture) {
            this.props.onCapturePicture(event.nativeEvent)
        }
    }

    /**
     * 录像结果回调
     * nativeEvent.success： (Boolean)   是否成功
     * nativeEvent.message： (String?)   信息，失败时的信息
     * nativeEvent.data      (String?)   文件路径，成功时
     */
    _onLocalRecord = (event) => {
        if (this.props.onLocalRecord) {
            this.props.onLocalRecord(event.nativeEvent)
        }
    }

    /**
     * 云台控制回调
     * nativeEvent.success： (Boolean)   操作是否成功
     * nativeEvent.message： (String?)   信息，失败时的信息
     */
    _onPtzControl = (event) => {
        if (this.props.onPtzControl) {
            this.props.onPtzControl(event.nativeEvent)
        }
    }

    /**
     * 流量使用回调，总流量
     * nativeEvent.data      (number)   总流量值，单位：B
     */
    _onStreamFlow = (event) => {
        // 最新总流量
        let data = event.nativeEvent.data

        // 回调
        if (this.props.onStreamFlow) {
            this.props.onStreamFlow({
                streamFlow: data,
                speed:      data - this._streamFlow
            })
        }

        // 重置当前流量
        this._streamFlow = data
    }

    render() {
        if (!this.supportGB()) {
            // 不支持国标使用 sdk 封装的控件

            // 参数复制
            const nativeProps = Object.assign({}, this.props);
            Object.assign(nativeProps, {
                // 属性
                initSdkVersion: this._sdkVersion,

                // 回调事件
                onCapturePicture:   this._onCapturePicture,
                onLocalRecord:      this._onLocalRecord,
                onPtzControl:       this._onPtzControl,
                onStreamFlow:       this._onStreamFlow
            });

            // 获取RN播放器
            const RnHatonVideo = getRnHatonVideo("HikVideo")

            // HikVideo 页面
            return (
                <RnHatonVideo
                ref={this._assignRoot}
                {...nativeProps}
                />
            );

        } else {
            // 支持国标使用 RNVideo 播放器
            return (
                <Video 
                    source={{uri:that.state.datasource}}
                    ref={this._assignRoot}
                    style={{ width: that.state.videoViewWidth, height: that.state.videoViewHeight, backgroundColor: "#000000" }}

                    allowsExternalPlayback={false} // 不允许导出 或 其他播放器播放

                    paused={that.state.isPaused} // 控制视频是否播放
                    resizeMode="cover"

                    posterResizeMode="cover"

                    onLoadStart={(event)=>{
                        Log.info(TAG, "RNVideo onLoadStart", '开始加载')
                    }}

                    onBuffer={(event)=>{
                        Log.info(TAG, "RNVideo onBuffer", '正在缓冲')
                    }}

                    onReadyForDisplay={(event)=>{
                        Log.info(TAG, "RNVideo onReadyForDisplay", '准备播放')
                    }}

                    onEnd={(event)=>{
                        Log.info(TAG, "RNVideo onReadyForDisplay", '播放结束')
                    }}

                    onLoad={(event) => {
                        Log.info(TAG, "RNVideo onLoad", '加载时')
                    }}

                    onProgress={(event) => {
                        // Log.info(TAG, "RNVideo onProgress", '进度')
                    }}

                    fullscreen={that.state.isFullScreen}
                />
            )
        }
    }
}

HatomVideo.propTypes = {
    // sdk 版本，应从 SdkVersion 枚举中获取
    sdkVersion: PropTypes.oneOf(SdkVersion.enums),

    // 截图回调
    onCapturePicture:   PropTypes.func,
    // 录像结果回调
    onLocalRecord:      PropTypes.func,
    // 云台控制回调
    onPtzControl:       PropTypes.func,
    /**
     * 流量使用回调，每秒回调一次
     * params.streamFlow    (number) 总流量，单位：B
     * params.speed         (number) 网速，单位：B/s
     */
    onStreamFlow:       PropTypes.func,

    // 继承页面
    scaleX:         PropTypes.number,
    scaleY:         PropTypes.number,
    translateX:     PropTypes.number,
    translateY:     PropTypes.number,
    rotation:       PropTypes.number,
    ...ViewPropTypes
}

// 存储所有已经注册的组件，避免重复注册问题
let RnHatonVideoList = []

const getRnHatonVideo = (sdkVersion) => {
    Log.info(TAG, "getRnHatonVideo", sdkVersion)
    
    // 寻找已注册组件
    for (let i=0; i<RnHatonVideoList.length; i++) {
        let item = RnHatonVideoList[i]
        if (item.version == sdkVersion) {
            Log.info(TAG, "getRnHatonVideo", "已注册")
            return item.video
        }
    }

    let video = requireNativeComponent(sdkVersion, HatomVideo)

    // 尚未注册，需要注册并添加
    RnHatonVideoList.push({
        version: sdkVersion,
        video: video
    })
    return video
}