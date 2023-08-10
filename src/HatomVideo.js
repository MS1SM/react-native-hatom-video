import React, { Component } from 'react';
import {
    requireNativeComponent,
    ViewPropTypes,
    NativeModules,
    Dimensions
} from 'react-native';
import PropTypes from 'prop-types';
import { SdkVersionEnum } from './common';
import { getToken, preview } from './api/HikApi';
import Log from './utils/Log';
import Video from "react-native-video";
import GlobalConfig, { setGlobalConfig } from './utils/GlobalConfig';
import { 
    recordSet, 
    recordStatus,
    info,
    status,
    mirror,
    format,
    defence,
    encryptOn,
    encryptOff,
    version,
    sound,
    upgradeStatus,
    upgrade
} from './api/EzvizApi';

const TAG = 'HatomVideo';

export const SdkVersion = new SdkVersionEnum()

// 全局属性【用于保证that的有效区域】
let that;
// 全局属性【用于获取屏幕宽高等信息】
const windowSize = Dimensions.get("window");

export default class HatomVideo extends Component {

    //#region 内部

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
        // 使用 RnVideo 单独存储一个播放器
        if (this.isUseRnVideo()) {
            that._rnVideo = component
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
            
            default:
                return false
        }
    }

    /**
     * 是否使用RnVideo
     * @param {String} sdkVersion? 可为空，空使用this._sdkVersion 判断
     * @return {Boolean} 使用RnVideo：true
     */
    isUseRnVideo(sdkVersion) {
        let sdkParam = sdkVersion ? sdkVersion : this._sdkVersion

        switch (sdkParam) {
            default:
                return false
        }
    }

    /**
     * 是否支持萤石 Http
     * @param {String} sdkVersion? 可为空，空使用GlobalConfig.sdk.version 判断
     * @return {Boolean} 是萤石环境：true
     */
    static supportEzviz(sdkVersion) {
        let sdkParam = sdkVersion ? sdkVersion : GlobalConfig.sdk.version
        if (sdkParam == SdkVersion.EzvizVideo) {
            return true
        } else {
            Log.error(TAG, "supportEzviz 当前非萤石环境，未支持此功能", sdkParam)
            return false
        }
    }
    //#endregion

    //#region public
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
            getToken()
        } else {
            Log.debug(TAG, "getToken", "default")
        }
    }

    /**
     * 设置播放参数
     * @param {String} path 播放地址
     */
    setDataSource(path) {
        if (this.isUseRnVideo()) {
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

    // 开始播放
    start() {
        this._start()
    }

    // 停止播放
    stop() {
        this._stop()
    }

    // 释放资源
    release() {
        this._release()
    }

    /**
     * 获取预览播放串
     * 仅国标可用
     * 
     * @param {object} data
     * 
     * @param {string} data.indexCode     "a5a04f5e2c5a4e83a5180545f0cb898f"
     * @param {string} data.protocol      "rtsp" or "hls"
     * @param {number} data.streamType    0
     * @param {string} data.expand        "transcode=1&videtype=h264"
     * 
     * @return {Promise} Promise.resolve: 仅成功获取url才回调；Promise.reject：获取失败，或无法获取
     * @return {string}  resolve.url        成功获取的url
     * @return {string}  reject.message     失败信息         
     */
    getPreviewUrl(data) {
        return new Promise((resolve, reject) => {
            if (this.supportGB()) {
                preview(data)
                .then(response => {
                    resolve(response)
                }).catch(error => {
                    reject({
                        message: error.msg
                    });
                })

            }  else {
                // 不支持国标无法获取播放串
                reject({
                    message: "非国标无法获取播放串"
                })
            }
        })
    }

    /**
     * 截图
     * 通过 onCapturePicture 回调结果
     */
    capturePicture() {
        this._capturePicture()
    }

    /**
     * 开启录像
     * 
     * @param {*} config 参考 _startLocalRecord
     */
    startLocalRecord(config) {
        this._startLocalRecord(config)
    }

    /**
     * 结束本地直播流录像
     * 与 startLocalRecord 成对使用
     * 
     * 通过 onLocalRecord 回调结果
     */
    stopLocalRecord() {
        this._stopLocalRecord()
    }

    /**
     * 对讲控制
     * @param {object} config 参考 _voiceTalk
     */
    voiceTalk(config) {
        this._voiceTalk(config)
    }

    /**
     * 声音控制
     * @param isOpen 是否打开
     */
    sound(isOpen) {
        this._sound(isOpen)
    }

    /**
     * 设置视频清晰度
     * @param {object} config 参考 _setVideoLevel
     */
    setVideoLevel(config) {
        this._setVideoLevel(config)
    }

    /**
     * 设置播放验证码
     * @param {string} verifyCode 播放验证码
     */
    setVerifyCode(verifyCode) {
        this._setVerifyCode(verifyCode)
    }
    //#endregion

    // #region static
    /************************* static *************************/
    
    /**
     * 初始化SDK
     * @param {object} config 参考 _initSdk
     */
    static initSdk(config) {
        HatomVideo._initSdk(config)
    }

    /**
     * 获取常量
     * @param {object | null} config 参考 _getConstants
     * 
     * @return {Promise} promise                参考 _getConstants
     *                   resolve.globalConfig   附加 globalConfig 信息
     */
    static getConstants(config) {
        return new Promise((resolve, reject) => {
            HatomVideo._getConstants(config)
            .then(data => {
                data.globalConfig = GlobalConfig
                resolve(data)
            })
        })
    }

    /**
     * 设置配置
     * 参数皆可为空，未配置的使用默认配置
     * 
     * **************************************************
     * @param {object} config? 配置
     * 
     * **************************************************
     * http 配置
     * @param {object} config.http?             http 配置
     * @param {boolean} config.http.isTest?     是否启用测试地址
     * @param {string} config.http.baseUrl?     基础地址，用于测试地址
     * @param {number} config.http.timeout?     超时时间，单位：毫秒
     * 
     * @param {string} config.http.hikUrl?      海康国标地址
     * @param {string} config.http.hikToken?    token
     * 
     * @param {string} config.http.ezvizUrl?    萤石地址
     * @param {string} config.http.ezvizToken?  token
     * @param {string} config.http.ezvizSerial? 设备序列号
     * 
     * **************************************************
     * 日志配置
     * @param {object} config.log?              日志配置
     * @param {boolean} config.log.showTime?    是否显示时间
     * @param {number} config.log.level?        日志控制级别，[0,5]，Levels = {OFF: 0, ERROR: 1, WARN: 2, INFO: 3, DEBUG: 4, LOG: 5}
     * 
     * **************************************************
     * sdk配置
     * @param {object} config.sdk?              sdk配置
     * @param {string} config.sdk.version?      sdk版本，参考：SdkVersionEnum
     */
    static setGlobalConfig(config) {
        Log.info(TAG, "setGlobalConfig", config)
        setGlobalConfig(config)
    }

    /**
     * 全天录像开关状态
     * 
     * **************************************************
     * Ezviz
     * 
     * @return {Promise}
     * 
     * @return {Object} resolve data
     * @return {String} data.deviceSerial
     * @return {Number} data.channelNo
     * @return {Number} data.enable  状态，参考 EzSwitch
     * 
     * @return {Object} reject error{code, msg}
     */
    static recordStatus() {
        if (HatomVideo.supportEzviz()) {
            return recordStatus()
        }
    }

    /**
     * 全天录像
     * 
     * **************************************************
     * Ezviz
     * @param {object} data
     * 
     * @param {Number} data.enable     状态，参考 EzSwitch
     * @param {Number} data.channelNo  通道号，不传表示设备本身
     * 
     * @return {Promise}
     * @return {null} resolve
     * @return {Object} reject error{code, msg}
     */
    static recordSet(data) {
        if (HatomVideo.supportEzviz()) {
            return recordSet(data)
        }
    }

    /**
     * 设备信息
     * 
     * **************************************************
     * Ezviz
     * 单个设备信息：设备布撤防状态、是否加密、告警声音模式等
     * 
     * @return {Promise}
     * 
     * @return {Object} resolve data
     * @return {Number} data.defence        设备布撤防状态，参考 EzSwitch
     * @return {Number} data.isEncrypt      是否加密，参考 EzSwitch
     * @return {Number} data.alarmSoundMode 告警声音模式，参考 EzAlarm
     * 
     * @return {Object} reject error{code, msg}
     */
    static info() {
        if (HatomVideo.supportEzviz()) {
            return info()
        }
    }

    /**
     * 设备状态
     * 
     * **************************************************
     * Ezviz
     * sd卡信息等
     * @param {object} data
     * @param {Number} data.channel?    通道号,默认为1
     * 
     * @return {Promise}
     * 
     * @return {Object} resolve data
     * @return {Number} data.diskNum            挂载的sd硬盘数量,-1:设备没有上报或者设备不支持该状态
     * @return {String} data.diskState          sd硬盘状态:0:正常;1:存储介质错;2:未格式化;3:正在格式化;返回形式:一个硬盘表示为"0---------------",两个硬盘表示为"00--------------",以此类推;-1:设备没有上报或者设备不支持该状态
     * @return {Number} data.firstDiskState     第一个sd硬盘状态，状态参考 EzSdStatus
     * 
     * @return {Object} reject error{code, msg}
     */
    static status(data) {
        if (HatomVideo.supportEzviz()) {
            return status(data)
        }
    }

    /**
     * 镜像翻转
     * 
     * **************************************************
     * Ezviz
     * @param {object} data
     * @param {Number} data.channelNo   通道号
     * @param {Number} data.command     镜像方向，参考 EzMirror
     * 
     * @return {Promise}
     * @return {null} resolve
     * @return {Object} reject error{code, msg}
     */
    static mirror(data) {
        if (HatomVideo.supportEzviz()) {
            return mirror(data)
        }
    }

    /**
     * TF卡格式化
     * 
     * **************************************************
     * Ezviz
     * 
     * @return {Promise}
     * @return {null} resolve
     * @return {Object} reject error{code, msg}
     */
    static format() {
        if (HatomVideo.supportEzviz()) {
            return format()
        }
    }

    /**
     * 设备撤/布防
     * 
     * **************************************************
     * Ezviz
     * @param {object} data
     * @param {Number} data.isDefence   设备布撤防状态，参考 EzSwitch
     * 
     * @return {Promise}
     * @return {null} resolve
     * @return {Object} reject error{code, msg}
     */
    static defence(data) {
        if (HatomVideo.supportEzviz()) {
            return defence(data)
        }
    }

    /**
     * 开启设备视频加密
     * 
     * **************************************************
     * Ezviz
     * 
     * @return {Promise}
     * @return {null} resolve
     * @return {Object} reject error{code, msg}
     */
    static encryptOn() {
        if (HatomVideo.supportEzviz()) {
            return encryptOn()
        }
    }

    /**
     * 关闭设备视频加密
     * 
     * **************************************************
     * Ezviz
     * 
     * @return {Promise}
     * @return {null} resolve
     * @return {Object} reject error{code, msg}
     */
    static encryptOff() {
        if (HatomVideo.supportEzviz()) {
            return encryptOff()
        }
    }

    /**
     * 获取设备版本信息
     * 
     * **************************************************
     * Ezviz
     * 
     * @return {Promise}
     * @return {Object} resolve data
     * @return {String} data.currentVersion
     * @return {Object} reject error{code, msg}
     */
    static version() {
        if (HatomVideo.supportEzviz()) {
            return version()
        }
    }

    /**
     * 设备升级固件
     * 
     * **************************************************
     * Ezviz
     * 
     * @return {Promise}
     * @return {null} resolve
     * @return {Object} reject error{code, msg}
     */
    static upgrade() {
        if (HatomVideo.supportEzviz()) {
            return upgrade()
        }
    }

    /**
     * 获取设备升级状态
     * 
     * **************************************************
     * Ezviz
     * 
     * @return {Promise}
     * @return {Object} resolve data
     * @return {number} data.progress   升级进度，仅status为正在升级状态时有效，取值范围为1-100
     * @return {number} data.status     升级状态，参考 EzUpgradeStatus
     * @return {Object} reject error{code, msg}
     */
    static upgradeStatus() {
        if (HatomVideo.supportEzviz()) {
            return upgradeStatus()
        }
    }

    /**
     * 设置告警声音模式
     * 
     * **************************************************
     * Ezviz
     * @param {object} data
     * @param {Number} data.type   声音类型，参考 EzAlarm
     * 
     * @return {Promise}
     * @return {null} resolve
     * @return {Object} reject error{code, msg}
     */
    static sound(data) {
        if (HatomVideo.supportEzviz()) {
            return sound(data)
        }
    }
    // #endregion
    
    // #region NativeModules
    /************************* NativeModules *************************/

    /**
     * 初始化SDK
     * 请使用 initSdk
     *  
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
     * @return {Promise} promise.resolve      操作结果，返回数据对象。成功与失败都通过此方式返回结果，通过code判断。
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
     * @return {Promise} promise.resolve            成功，无实际数据
     *
     * @return {Promise} promise.reject             操作异常，返回异常内容
     *         {String} reject.message              异常编码code
     */
     static _startConfigWifi(config) {
        return NativeModules.RNHatomVideo.startConfigWifi(config)
     }
    
    /**
     * 获取常量
     * 请使用 getConstants
     * 
     * @param {object | null} config
     * @param  config.deviceSerial     (String？) 设备序列号，用于获取细分存储目录的地址。仅安卓有效，ios已存储到系统相册
     *
     * @param  promise              (Promise)       使用 Promise 回调结果
     * @return promise.resolve      (Object)        操作结果
     *         resolve.recordPath   (String)        录像存储路径
     */
    static _getConstants(config) {
        if (!config) {
            config = {}
        }
        return NativeModules.RNHatomVideo.getConstants(config)
    }
    // #endregion

    // #region setNativeProps
    /************************* setNativeProps *************************/

    /**
     * 初始化播放器
     * 请使用 initPlayer
     * 
     * **************************************************
     * HikVideo and Primordial
     * config 可为空对象{}
     * 
     * **************************************************
     * Ezviz
     * @param {object} config
     * @param {string} config.deviceSerial  设备序列号
     * @param {number} config.cameraNo      通道号
     */
    _initPlayer(config) {
        if (!config) {
            config = {}
        }
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

    /**
     * 开始播放
     * 请使用 start
     */
    _start() {
        this.setNativeProps({startPlay: "phString"})
    }

    /**
     * 停止播放
     * 请使用 stop
     */
    _stop() {
        this.setNativeProps({stopPlay: "phString"})
    }

    /**
     * 释放资源
     * 请使用 release
     */
    _release() {
        this.setNativeProps({release: "phString"})
    }

    /**
     * 开启录像
     * 请使用 startLocalRecord
     * config 可为空对象{}
     * 
     * @param {object} config
     * @param {string} config.deviceSerial?  设备序列号，用于细分存储目录。仅安卓有效，ios直接存放到系统相册
     */
    _startLocalRecord(config) {
        if (!config) {
            config = {}
        }
        this.setNativeProps({startLocalRecord: config})
    }

    /**
     * 结束本地直播流录像
     * 与 _startLocalRecord 成对使用
     * 
     * 通过 _onLocalRecord 回调结果
     * 
     * 请使用 stopLocalRecord
     */
    _stopLocalRecord() {
        this.setNativeProps({stopLocalRecord: "phString"})
    }

    /**
     * 声音控制
     * @param isOpen 是否打开
     * 
     * 请使用 sound
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
     * 请使用 voiceTalk
     * 
     * @param  config.isStart            (Boolean)    是否开启对讲
     *
     ***************************************************
     * HikVideo
     * @param  config.talkUrl            (String)     对讲短链接，通过调用openApi获取
     *
     ***************************************************
     * Ezviz
     * 
     * @param  config.isDeviceTalkBack  (Boolean)    可为空，默认true。用于判断对讲的设备，true表示与当前设备对讲，false表示与NVR设备下的IPC通道对讲。
     */
    _voiceTalk(config) {
        this.setNativeProps({voiceTalk: config})
    }

    /**
     * 截图
     * 请使用 capturePicture
     * 通过 _onCapturePicture 回调结果
     */
    _capturePicture() {
        this.setNativeProps({capturePicture: "phString"})
    }

    /**
     * 设置视频清晰度
     * 
     * 请使用 setVideoLevel
     *
     ***************************************************
     * Hatom
     * @param configMap.path        (String?)           播放url，可为空，如果为空，需要自行调用 setDataSource 设置新的取流url
     * @param configMap.videoLevel  (HikVideoLevel)     清晰度
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
    
    /**
     * 设置播放验证码
     * 请使用 setVerifyCode
     * @param {string} verifyCode 播放验证码
     */
    _setVerifyCode(verifyCode) {
        this.setNativeProps({setVerifyCode: verifyCode})
    }
    // #endregion

    // #region event
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
    _onPlayStatus = (event) => {
        if (this.props.onPlayStatus) {
            this.props.onPlayStatus(event.nativeEvent)
        }
    }

    /**
     * 对讲状态回调
     *
     ***************************************************
     * HikVideo
     * code: (String) (code == '-1') 成功，(code == 其他) 错误码。参考海康文档
     *
     ***************************************************
     * Ezviz
     * code: (Int) 状态。参考萤石文档，EZConstants.EZRealPlayConstants
     */
    _onTalkStatus = (event) => {
        if (this.props.onTalkStatus) {
            this.props.onTalkStatus(event.nativeEvent)
        }
    }
    //#endregion

    render() {
        if (!this.isUseRnVideo()) {
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
                onStreamFlow:       this._onStreamFlow,
                onPlayStatus:       this._onPlayStatus,
                onTalkStatus:       this._onTalkStatus,
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
    onStreamFlow: PropTypes.func,
    // 播放器状态回调
    onPlayStatus: PropTypes.func,
    // 对讲状态回调
    onTalkStatus: PropTypes.func,

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
    // 寻找已注册组件
    for (let i=0; i<RnHatonVideoList.length; i++) {
        let item = RnHatonVideoList[i]
        if (item.version == sdkVersion) {
            return item.video
        }
    }

    let video = requireNativeComponent(sdkVersion, HatomVideo)

    // 尚未注册，需要注册并添加
    Log.info(TAG, "getRnHatonVideo", sdkVersion)
    Log.info(TAG, "getRnHatonVideo", that._sdkVersion)
    RnHatonVideoList.push({
        version: sdkVersion,
        video: video
    })
    return video
}