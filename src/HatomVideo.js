import React, { Component } from 'react';
import {
    requireNativeComponent,
    ViewPropTypes,
    NativeModules
} from 'react-native';
import PropTypes from 'prop-types';
import { SdkVersionEnum } from './common';

const TAG = 'HatomVideo';

export const SdkVersion = new SdkVersionEnum()

export default class HatomVideo extends Component {

    constructor(props) {
        super(props)
        // sdk 类型版本
        this.sdkVersion = props.sdkVersion
    }

    componentDidMount() {
    }

    // 获取组件进行保存
    _assignRoot = (component) => {
        this._root = component
    }

    // 调用这个组件的setNativeProps方法
    setNativeProps(nativeProps) {
        this._root.setNativeProps(nativeProps);
    };

    // 初始化SDK
    _initSdk(appKey, pringLog) {
        NativeModules.RNHatomVideo.initSdk(this.sdkVersion, appKey, pringLog)
    }

    /**
     * 初始化播放器
     * **************************************************
     * HikVideo and Primordial
     * configk 可为空对象{}
     * 
     * **************************************************
     * Ezviz
     * @param {object} config
     * @param {string} config.accessToken   token
     * @param {string} config.deviceSerial  设备序列号
     * @param {number} config.cameraNo      通道号
     */
    _initPlayer(config) {
        this.setNativeProps({initPlayer: config})
    }

    // 设置播放参数
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
     *
     * @param  recordFile      (String) 录制本地路径
     * 可为空，将使用默认存储地址: Environment.getExternalStorageDirectory().getPath() + "/record"
     */
    _startLocalRecord(recordFile) {
        let config = {}
        if (recordFile) {
            config.recordFile = recordFile
        }
        this.setNativeProps({startLocalRecord: config})
    }

    /**
     * 结束本地直播流录像
     * 与 _startLocalRecord 成对使用
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

    render() {
        // 参数复制
        const nativeProps = Object.assign({}, this.props);
        Object.assign(nativeProps, {
            initSdkVersion: this.sdkVersion
        });

        // 获取RN播放器
        const RnHatonVideo = getRnHatonVideo("HikVideo")

        // 页面
        return (
          <RnHatonVideo
            ref={this._assignRoot}
            {...nativeProps}
            />
        );
    }
}

HatomVideo.propTypes = {
    // sdk 版本，应从 SdkVersion 枚举中获取
    sdkVersion: PropTypes.oneOf(SdkVersion.enums),
    // 继承页面
    scaleX: PropTypes.number,
    scaleY: PropTypes.number,
    translateX: PropTypes.number,
    translateY: PropTypes.number,
    rotation: PropTypes.number,
    ...ViewPropTypes
}

// 存储所有已经注册的组件，避免重复注册问题
let RnHatonVideoList = []

const getRnHatonVideo = (sdkVersion) => {
    console.info(TAG, sdkVersion)
    
    // 寻找已注册组件
    for (let i=0; i<RnHatonVideoList.length; i++) {
        let item = RnHatonVideoList[i]
        if (item.version == sdkVersion) {
            console.log(TAG, "已注册")
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