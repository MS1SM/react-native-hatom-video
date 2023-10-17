import React, { Component } from 'react';
import {
    requireNativeComponent,
    ViewPropTypes,
    NativeModules,
    Dimensions
} from 'react-native';
import PropTypes from 'prop-types';
import { EZPlaybackRate, PlaybackCommand, SdkVersionEnum } from './common';
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
    upgrade,
    searchRecord,
    presetAdd,
    presetMove,
    presetClear
} from './api/EzvizApi';
import { formatHik, getVersionParam, playbackUrl, presetsAddition, presetsDeletion, presetsSearches, previewUrl, ptzControl, recordClose, recordOpen, sdStatus, talkUrl } from './api/HikApi';

const TAG = 'HatomVideo';

const SdkVersion = new SdkVersionEnum()
const Playback   = new PlaybackCommand()
const EzRate     = new EZPlaybackRate()

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

        // 当前回看倍速，仅萤石需要自行记录
        this._speedPlayback = EzRate.EZ_PLAYBACK_RATE_1

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
        this._root?.setNativeProps(nativeProps);
    };

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

    /**
     * 是否支持国标 Http
     * @param {String} sdkVersion? 可为空，空使用GlobalConfig.sdk.version 判断
     * @return {Boolean} 支持：true
     */
    static supportGB(sdkVersion) {
        let sdkParam = sdkVersion ? sdkVersion : GlobalConfig.sdk.version

        if (sdkParam == SdkVersion.HikVideo_2_1_0 || sdkParam == SdkVersion.Imou) {
            return true
        } else {
            Log.error(TAG, "supportGB 当前非国标环境，未支持此功能", sdkParam)
            return false
        }
    }

    /**
     * 获取当前环境不支持此功能的 Promise.reject
     */
    static unsupportReject() {
        return Promise.reject({
            code: -1,
            msg: "当前环境未支持此功能。请确认 sdkVersion or GlobalConfig.sdk.version"
        })
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

    /**
     * 设置播放参数
     * @param {String} path 播放地址
     * @param {object} config? 参考 _setDataSource
     */
    setDataSource(path, config) {
        if (this.isUseRnVideo()) {
            that.setState({
                datasource: path,
            })
            that.setState({
                isPaused: false,
            })

        } else {
            this._setDataSource(path, config)
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
     * 截图
     * 通过 onCapturePicture 回调结果
     * 
     * @param {object} config? 参考 _capturePicture
     */
    capturePicture(config) {
        this._capturePicture(config)
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
     * 
     * @param {*} config 参考 _stopLocalRecord
     */
    stopLocalRecord(config) {
        this._stopLocalRecord(config)
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
    
    /**
     * 开始回放
     * @param {object} config 
     * 
     * **************************************************
     * HikVideo
     * 流程是 setDataSource -> start -> seekPlayback
     * startPlayback 集成以上三个流程
     * @param {string} config.path      播放串
     * @param {number} config.seekTime  定位时间。精确到毫秒的时间戳
     * 通过api获取播放串时用到的参数即为这里的 开始时间与结束时间。
     * 时间格式：yyyy-MM-dd'T'HH:mm:ss.SSSXXX  (2018-08-07T14:44:04.923+08:00)
     * @param {string} config.startTime    开始时间
     * @param {string} config.endTime      结束时间
     * 
     * **************************************************
     * Ezviz
     * @param {number} config.startTime  开始时间。精确到毫秒的时间戳
     * @param {number} config.endTime    结束时间。精确到毫秒的时间戳
     */
    startPlayback(config) {
        switch (this._sdkVersion) {
            case SdkVersion.HikVideo_2_1_0, SdkVersion.Imou:
                this.setDataSource(
                    config.path,
                    {
                        startTime: config.startTime,
                        endTime: config.endTime
                    }
                )
                this.start()
                this.seekPlayback(config.seekTime)
                break
            
            case SdkVersion.EzvizVideo:
                // 新的播放，倍速为一倍速
                this._speedPlayback = EzRate.EZ_PLAYBACK_RATE_1
                // 播放
                config.command = Playback.Start
                this._playback(config)
                break
            
            default:
                Log.error(TAG, "startPlayback", "未实现")
                break
        }
    }

    /**
     * 停止回放
     * 
     * **************************************************
     * HikVideo
     * 用的是 stop
     * 
     * **************************************************
     * Ezviz
     * 
     */
    stopPlayback() {
        switch (this._sdkVersion) {
            case SdkVersion.HikVideo_2_1_0, SdkVersion.Imou:
                this.stop()
                break
            
            case SdkVersion.EzvizVideo:
                this._playback({
                    command: Playback.Stop
                })
                break
            
            default:
                Log.error(TAG, "stopPlayback", "未实现")
                break
        }
    }

    // 暂停
    pausePlayback() {
        this._playback({
            command: Playback.Pause
        })
    }

    // 恢复
    resumePlayback() {
        this._playback({
            command: Playback.Resume
        })
    }

    /**
     * 设置倍速
     * 
     * **************************************************
     * HikVideo
     * @param {HikPlaybackRate} rate 
     * 
     * **************************************************
     * Ezviz
     * @param {EZPlaybackRate} rate 
     */
    speedPlayback(rate) {
        // 萤石需要记录倍速
        if (this._sdkVersion == SdkVersion.EzvizVideo) {
            this._speedPlayback = rate
        }
        // 设置
        this._playback({
            command:    Playback.Speed,
            speed:      rate
        })
    }

    /**
     * 设置进度
     * @param {number} seekTime 定位回放时间。精确到毫秒的时间戳
     * 
     * **************************************************
     * HikVideo
     * 
     * **************************************************
     * Ezviz
     * 拖动进度条时调用此接口。先停止当前播放，再把seekTime作为起始时间按时间回放
     * 建议使用stopPlayback+startPlayback(seekTime,stopTime)代替此接口
     */
    seekPlayback(seekTime) {
        this._playback({
            command:    Playback.Seek,
            seekTime:   seekTime
        })
    }

    /**
     * 获取状态
     * 通过 onPlayback 回调 {speed, seek}
     */
    statusPlayback() {
        this._playback({
            command:    Playback.Status
        })
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
     * 查询存储录像信息列表
     * @param {object} config 参考 _searchRecordFile
     * @return {Promise} promise 参考 _searchRecordFile
     */
    static searchRecordFile(config) {
        return HatomVideo.searchRecordFile(config)
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
     * @param {string} config.http.hikUrl?          海康国标地址
     * @param {string} config.http.hikToken?        token
     * @param {string} config.http.hikDeviceCode?   设备序列号
     * @param {string} config.http.cameraCode?      摄像头序列号，一个设备可能有多个摄像头，此处仅考虑只有一个摄像头的情形
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

        return HatomVideo.unsupportReject()
    }

    /**
     * 全天录像
     * 
     * @return {Promise}
     * @return {null} resolve
     * @return {Object} reject error{code, msg}
     * 
     * **************************************************
     * 海康国标
     * @param {boolean} data.enable     开: true; 关: false
     * @param {Number} data.channelNum  通道号
     * 
     * **************************************************
     * Ezviz
     * @param {object} data
     * 
     * @param {Number} data.enable     状态，参考 EzSwitch
     * @param {Number} data.channelNo  通道号，不传表示设备本身
     */
    static recordSet(data) {
        switch (GlobalConfig.sdk.version) {
            case SdkVersion.HikVideo_2_1_0, SdkVersion.Imou:
                if (data.enable) {
                    return recordOpen(data)
                } else {
                    return recordClose(data)
                }
            
            case SdkVersion.EzvizVideo:
                return recordSet(data)
            
            default:
                Log.error(TAG, "recordSet 当前环境，未支持此功能")
                return HatomVideo.unsupportReject()
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

        return HatomVideo.unsupportReject()
    }

    /**
     * 设备状态
     * 主要是为了获取sd卡的状态
     * 
     * **************************************************
     * 海康国标
     * 只有sd卡信息
     * 
     * @return {Promise} resolve
     * {
            "SDCardStatusInfo": [
                {
                    // 存储容量，单位：MB
                    "Capacity": 0,
                    // 格式化进度（可选）0-100，百分比
                    "FormatProgress": 0,
                    // 剩余存储容量，单位：MB
                    "FreeSpace": 0,
                    // SD卡名称
                    "HddName": "",
                    // SD卡编号
                    "ID": 0,
                    // 状态，ok-正常，formatting-格式化，unformatted-未格式化，idle-空闲，error-错误
                    "Status": ""
                }
            ]
        }
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
        switch (GlobalConfig.sdk.version) {
            case SdkVersion.HikVideo_2_1_0, SdkVersion.Imou:
                return sdStatus(data)
            
            case SdkVersion.EzvizVideo:
                return status(data)
            
            default:
                Log.error(TAG, "status 当前环境，未支持此功能")
                return HatomVideo.unsupportReject()
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

        return HatomVideo.unsupportReject()
    }

    /**
     * TF卡格式化
     * 
     * @return {Promise}
     * @return {null} resolve
     * @return {Object} reject error{code, msg}
     * 
     * **************************************************
     * 海康国标
     * @param {string} data.sDCardId SD卡编码，该值为0时，对所有存储卡进行格式化
     * 
     * **************************************************
     * Ezviz
     */
    static format(data) {
        switch (GlobalConfig.sdk.version) {
            case SdkVersion.HikVideo_2_1_0, SdkVersion.Imou:
                return formatHik(data)
            
            case SdkVersion.EzvizVideo:
                return format()
            
            default:
                Log.error(TAG, "format 当前环境，未支持此功能")
                return HatomVideo.unsupportReject()
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

        return HatomVideo.unsupportReject()
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

        return HatomVideo.unsupportReject()
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

        return HatomVideo.unsupportReject()
    }

    /**
     * 获取设备版本信息
     * 
     * **************************************************
     * 海康国标
     * @return {Promise} resolve
     * {
		"softwareVer": "2.800.174I000.0.T 2023-08-30"
	   }
     * @return {Promise} reject error{code, msg}
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
        switch (GlobalConfig.sdk.version) {
            case SdkVersion.HikVideo_2_1_0, SdkVersion.Imou:
                return getVersionParam()
            
            case SdkVersion.EzvizVideo:
                return version()
            
            default:
                Log.error(TAG, "version 当前环境，未支持此功能")
                return HatomVideo.unsupportReject()
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

        return HatomVideo.unsupportReject()
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

        return HatomVideo.unsupportReject()
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

        return HatomVideo.unsupportReject()
    }

    /**
     * 根据时间获取存储文件信息
     * 
     * **************************************************
     * 海康国标
     * @param {object} data
     * 
     * @param {Number} data.recordLocation?     0:中心存储 1:设备存储 默认为中心存储
     * @param {string} data.protocol?           "rtsp" or "hls" or "rtmp" or "hik"
     * @param {Number} data.transmode?          0:UDP 1:TCP
     * @param {string} data.beginTime           起始时间，yyyy-MM-dd'T'HH:mm:ss.SSSXXX
     * @param {string} data.endTime             结束时间，yyyy-MM-dd'T'HH:mm:ss.SSSXXX
     * @param {string} data.uuid?               分页查询 id，上一次查询 返回的 uuid，用于继续查 询剩余片段
     * @param {string} data.expand?             "transcode=1&videtype=h264"
     * @param {string} data.streamform?         "ps"
     * @param {Number} data.lockType?           0-查询全部录像;1-查询未锁定录像;2-查询已锁定录像.不传默认值为 0
     * 
     * @return {Promise} resolve
     * {
            "list": [
                {
                    // 查询录像的锁定类型，0-全部录像;1-未锁定录像; 2-已锁定录像
                    "lockType": 1,
                    "beginTime": "2018-08-07T14:44:04.923+08:00", 
                    "endTime": "2018-08-07T14:54:18.183+08:00", 
                    // 录像片段大小(单位: Byte)
                    "size": 66479332
                }
            ],
            "uuid": "e33421g1109046a79b6280bafb6fa5a7", 
            // 取流短 url，注:rtsp 的回放 url 后面要指定 ?playBackMode=1 在 vlc 上才能播放
            "url": "rtsp://10.2.145.66:6304/EUrl/Dib1ErK"
        }
     * @return {Promise} reject error{code, msg}
     * 
     * **************************************************
     * Ezviz
     * @param {object} data
     * @param {Number} data.channelNo? 通道号，非必选，默认为1
     * @param {Number} data.startTime? 起始时间，时间戳（毫秒）。非必选，默认为当天0点
     * @param {Number} data.endTime?   结束时间，时间戳（毫秒）。非必选，默认为当前时间
     * @param {Number} data.recType?   回放源，0-系统自动选择，1-云存储，2-本地录像。非必选，默认为0
     * 
     * @return {Promise}
     * @return {Array} resolve 
     * @return {Number} resolve[x].startTime    起始时间，时间戳（毫秒）
     * @return {Number} resolve[x].endTime      结束时间，时间戳（毫秒）
     * 
     * @return {Object} reject error{code, msg}
     */
    static searchRecord(data) {
        switch (GlobalConfig.sdk.version) {
            case SdkVersion.HikVideo_2_1_0, SdkVersion.Imou:
                return playbackUrl(data)
            
            case SdkVersion.EzvizVideo:
                return searchRecord(data)
            
            default:
                Log.error(TAG, "searchRecord 当前环境，未支持此功能")
                return HatomVideo.unsupportReject()
        }
    }

    /**
     * 添加预置点
     * 
     * **************************************************
     * 海康国标
     * @param {object} data
     * @param {string} data.presetName          预置点名称
     * @param {number} data.presetIndex         预置点编号
     * 
     * @return {Promise}
     * @return {null} resolve data
     * @return {Object} reject error{code, msg}
     * 
     * **************************************************
     * Ezviz
     * @param {object} data
     * @param {Number} data.channelNo 通道号
     * 
     * @return {Promise}
     * @return {Object} resolve data
     * @return {Number} data.index 预置点序号，C6设备是1-12，该参数需要开发者自行保存
     * @return {Object} reject error{code, msg}
     */
    static presetAdd(data) {
        switch (GlobalConfig.sdk.version) {
            case SdkVersion.HikVideo_2_1_0, SdkVersion.Imou:
                return presetsAddition(data)
            
            case SdkVersion.EzvizVideo:
                return presetAdd(data)
            
            default:
                Log.error(TAG, "presetAdd 当前环境，未支持此功能")
                return HatomVideo.unsupportReject()
        }
    }

    /**
     * 调用预置点
     * 
     * **************************************************
     * 海康国标
     * @param {object} data 参考 HatomVideo.ptzControl
     * @return {Promise} 参考 HatomVideo.ptzControl
     * 
     * **************************************************
     * Ezviz
     * @param {object} data
     * @param {Number} data.channelNo 通道号
     * @param {Number} data.index     预置点，C6设备预置点是1-12
     * 
     * @return {Promise}
     * @return {null} resolve data
     * @return {Object} reject error{code, msg}
     */
    static presetMove(data) {
        switch (GlobalConfig.sdk.version) {
            case SdkVersion.HikVideo_2_1_0, SdkVersion.Imou:
                return HatomVideo.ptzControl(data)
            
            case SdkVersion.EzvizVideo:
                return presetMove(data)
            
            default:
                Log.error(TAG, "presetMove 当前环境，未支持此功能")
                return HatomVideo.unsupportReject()
        }
    }

    /**
     * 清除预置点
     * 
     * **************************************************
     * 海康国标
     * @param {object} data
     * @param {number} data.presetIndex         预置点编号
     * 
     * @return {Promise}
     * @return {null} resolve data
     * @return {Object} reject error{code, msg}
     * 
     * **************************************************
     * Ezviz
     * @param {object} data
     * @param {Number} data.channelNo 通道号
     * @param {Number} data.index     预置点，C6设备预置点是1-12
     * 
     * @return {Promise}
     * @return {null} resolve data
     * @return {Object} reject error{code, msg}
     */
    static presetClear(data) {
        switch (GlobalConfig.sdk.version) {
            case SdkVersion.HikVideo_2_1_0, SdkVersion.Imou:
                return presetsDeletion(data)
            
            case SdkVersion.EzvizVideo:
                return presetClear(data)
            
            default:
                Log.error(TAG, "presetClear 当前环境，未支持此功能")
                return HatomVideo.unsupportReject()
        }
    }

    /**
     * 查询预置点信息
     * 
     * **************************************************
     * 海康国标
     * 
     * @return {Promise} resolve
     * {
            "total": 1,
            "list": [
                {
                    "presetPointName": "预置点1",
                    "presetPointIndex": 1,
                    "cameraIndexCode": "9b388a28080c448a873b711aafda144c"
                }
            ]
        }

     * @return {Promise} reject error{code, msg}
     * 
     * **************************************************
     * Ezviz
     * 萤石没有查询预置点信息的功能，需要在 presetAdd 时自行维护预置点信息
     */
    static presetsSearches() {
        if (HatomVideo.supportGB()) {
            return presetsSearches()
        }

        return HatomVideo.unsupportReject()
    }

    /************************* 仅国标支持的Http功能 static *************************/
    /**
     * 获取预览播放串
     * 
     * @param {string} data.protocol?           "rtsp" or "hls" or "rtmp" or "hik"
     * @param {Number} data.streamType?         0:主码流 1:子码流 2:第三码流
     * @param {string} data.expand?             "transcode=1&videtype=h264"
     * @param {Number} data.transmode?          0:UDP 1:TCP
     * @param {string} data.streamform?         "ps"
     * 
     * @return {Promise} resolve
     *  {
         "url": "rtsp://10.2.145.66:655/EUrl/CLJ52BW" 
        }
     * @return {Promise} reject error{code, msg}
     */
    static previewUrl(data) {
        if (HatomVideo.supportGB()) {
            return previewUrl(data)
        }

        return HatomVideo.unsupportReject()
    }

    /**
     * 查询对讲 URL
     * @param {object} data
     * 
     * @param {string} data.expand?             "transcode=1&videtype=h264"
     * @param {Number} data.transmode?          0:UDP 1:TCP
     * @param {string} data.eurlExpand?         扩展字段
     * 
     * @return {Promise} resolve
     *  {
         "url": "rtsp://10.2.145.66:655/EUrl/CLJ52BW" 
        }
     * @return {Promise} reject error{code, msg}
     */
    static talkUrl(data) {
        if (HatomVideo.supportGB()) {
            return talkUrl(data)
        }

        return HatomVideo.unsupportReject()
    }

    /**
     * 云台操作
     * @param {object} data
     * 
     * @param {Number} data.action              0-开始 ，1-停止
     * @param {string} data.command             控制指令
     * @param {Number} data.speed?              云台速度, [1, 100], default = 50
     * @param {Number} data.presetIndex?        预置点编号，通过查询预置点信息接口获取
     * 
     * @return {Promise} resolve null
     * @return {Promise} reject error{code, msg}
     */
    static ptzControl(data) {
        if (HatomVideo.supportGB()) {
            return ptzControl(data)
        }

        return HatomVideo.unsupportReject()
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
     *
     * @param  promise              (Promise)       使用 Promise 回调结果
     * @return promise.resolve      (Object)        操作结果
     *         resolve.recordPath   (String)        录像存储根路径
     *         resolve.picturePath  (String)        图片存储根路径
     */
    static _getConstants(config) {
        if (!config) {
            config = {}
        }
        return NativeModules.RNHatomVideo.getConstants(config)
    }


    /**
     * 查询存储录像信息列表
     * 含 云存储 和 SD卡存储
     * 请使用 searchRecordFile
     *
     * @param  config.sdkVersion     (String)    sdk 版本
     * @param  config.isSd           (boolean)   查询sd 还是 云存储
     * @param  promise               (Promise)   使用 Promise 回调结果
     *
     ***************************************************
     * Ezviz
     * @param  config.deviceSerial   (String)    设备序列号
     * @param  config.cameraNo       (int)       通道号
     * @param  config.startTime      (long)      查询时间范围: 开始时间。精确到毫秒的时间戳
     * @param  config.endTime        (long)      查询时间范围: 结束时间。精确到毫秒的时间戳
     */
    static _searchRecordFile(config) {
        return NativeModules.RNHatomVideo.searchRecordFile(config)
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
     * 
     * **************************************************
     * HikVideo 
     * @param {object} config? 
     * @param {string} config.token?        用于headers中传递 token
     * 开始时间与结束时间，回看时不得为空，否则无法设置进度与倍速。
     * 时间格式：yyyy-MM-dd'T'HH:mm:ss.SSSXXX  (2018-08-07T14:44:04.923+08:00)
     * @param {string} config.startTime?    用于headers中传递 开始时间
     * @param {string} config.endTime?      用于headers中传递 结束时间
     */
    _setDataSource(path, config) {
        let params = {
            path: path
        }
        if (config) {
            params.headers = config
        }
        this.setNativeProps({setDataSource: params})
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
        this.setNativeProps({releasePlay: "phString"})
    }

    /**
     * 开启录像
     * 请使用 startLocalRecord
     * config 可为空对象{}
     * 
     * @param {object} config
     * @param {string} config.deviceSerial?  设备序列号，用于细分存储目录
     * 可作为 自定义目录 进行存储管理。例：deviceSerial = aaa/ccc
     * 使用 getConstants 获取到的图片目录（recordPath）拼接 自定义目录（aaa/ccc） 即为实际存储目录(recordPath + "/aaa/ccc")
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
     * 
     * @param config.deviceSerial? (String) 设备序列号，用于细分存储目录。请和 startLocalRecord 的 deviceSerial 保持一致
     *
     ***************************************************
     * ios
     * ios 是沙箱机制，保存到文件夹中的图片无法出现在系统相册中。
     * 因此，ios提供两种保存方式。
     * @param config.saveAlbum?     (Boolean) 是否保存到相册, default = true
     * @param config.saveFolder?    (Boolean) 是否保存到文件夹, default = true
     */
    _stopLocalRecord(config) {
        if (!config) {
            config = {}
        }
        this.setNativeProps({stopLocalRecord: config})
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
     * 
     * @param config.deviceSerial? (String) 设备序列号，用于细分存储目录
     * 可作为 自定义目录 进行存储管理。例：deviceSerial = aaa/ccc
     * 使用 getConstants 获取到的图片目录（picturePath）拼接 自定义目录（aaa/ccc） 即为实际存储目录(picturePath + "/aaa/ccc")
     *
     ***************************************************
     * ios
     * ios 是沙箱机制，保存到文件夹中的图片无法出现在系统相册中。
     * 因此，ios提供两种保存方式。
     * @param config.saveAlbum?     (Boolean) 是否保存到相册, default = true
     * @param config.saveFolder?    (Boolean) 是否保存到文件夹, default = true
     */
    _capturePicture(config) {
        if (!config) {
            config = {}
        }
        this.setNativeProps({capturePicture: config})
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

    /**
     * 回看控制功能
     * @param {object} config 
     */
    _playback(config) {
        this.setNativeProps({playback: config})
    }
    // #endregion

    // #region event
    /************************* event *************************/

    /**
     * 截图回调
     * ios 保存到相册与文件夹同时使能的情况下，将回调两次，一次是保存到相册的结果；一次是保存到文件夹的结果。通过message判断
     * android 只有刷新到系统相册才回调成功
     * 
     * nativeEvent.success： (Boolean)   是否成功
     * nativeEvent.message?: (String)    saveAlbum or saveFolder：本次回调所属操作；[other]：截图失败信息，两个保存操作都将失败
     * nativeEvent.data?:    (String)    保存到文件夹时的文件地址
     */
    _onCapturePicture = (event) => {
        if (this.props.onCapturePicture) {
            this.props.onCapturePicture(event.nativeEvent)
        }
    }

    /**
     * 录像结果回调
     * ios 保存到相册与文件夹同时使能的情况下，将回调两次，一次是保存到相册的结果；一次是保存到文件夹的结果。通过message判断
     * android 只有刷新到系统相册才回调成功
     * 
     * nativeEvent.success： (Boolean)   是否成功
     * nativeEvent.message： (String?)   saveAlbum or saveFolder：本次回调所属操作；[other]：截图失败信息，两个保存操作都将失败
     * nativeEvent.data      (String?)   保存到文件夹时的文件地址
     * nativeEvent.code：    (String?)   操作失败错误码，仅海康国标有实际意义
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

    /**
     * 回看状态
     * speed: (String)      倍速，对应枚举的字符串
     * seek: (Long)         进度，时间戳，毫秒
     */
    _onPlayback = (event) => {
        if (this.props.onPlayback) {
            // 萤石需要添加速率
            if (this._sdkVersion == SdkVersion.EzvizVideo) {
                event.nativeEvent.speed = this._speedPlayback
            }
            // 回调
            this.props.onPlayback(event.nativeEvent)
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
                onPlayback:         this._onPlayback,
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
    // 回看状态回调
    onPlayback: PropTypes.func,

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