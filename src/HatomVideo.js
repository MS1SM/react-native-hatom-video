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

    // 初始化播放器
    _initPlayer() {
        this.setNativeProps({initPlayer: "phString"})
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

    test(path) {
        console.log(TAG + " test: " + path)
        this.setNativeProps({test: path})
    }

    render() {
        // 参数复制
        const nativeProps = Object.assign({}, this.props);
        Object.assign(nativeProps, {});

        // 获取RN播放器
        const RnHatonVideo = getRnHatonVideo(this.sdkVersion)

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

const getRnHatonVideo = (sdkVersion) => {
    console.info(TAG, sdkVersion)
    return requireNativeComponent(sdkVersion, HatomVideo)
}