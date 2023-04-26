import React, { Component } from 'react';
import {
    requireNativeComponent,
    NativeModules,
    View,
    ViewPropTypes
} from 'react-native';
import PropTypes from 'prop-types';

const CLASS_NAME = 'HatomVideo';

export default class HatomVideo extends Component {

    constructor(props) {
        super(props)
        this.HatomVideoModule = NativeModules.RNHatomVideo
    }

    _assignRoot = (component) => {
        this._root = component
    }

    setNativeProps(nativeProps) {
        //调用这个组件的setNativeProps方法，设置android原生定义个props
        this._root.setNativeProps(nativeProps);
    };

    componentDidMount() {
        // 对象持有修改测试
        this.HatomVideoModule.initTest(
            "ms1007", 
            (test) => {
                console.log(CLASS_NAME + " initTest: " + test)

                this.HatomVideoModule.changeTest("lb1996")
                console.log(CLASS_NAME + " changeTest: " + test)
            }
        )
    }

    setDataSource(path) {
        console.log(CLASS_NAME + " setDataSource: " + path)
        this.HatomVideoModule.setDataSource(path)
    }

    test(path) {
        console.log(CLASS_NAME + " test: " + path)
        this.setNativeProps({test: path})
    }

    render() {
        const nativeProps = Object.assign({}, this.props);
        Object.assign(nativeProps, {});
        return (
          <RNHatomVideo
            ref={this._assignRoot}
            {...nativeProps}
            />
        );
    }
}

HatomVideo.propTypes = {
    scaleX: PropTypes.number,
    scaleY: PropTypes.number,
    translateX: PropTypes.number,
    translateY: PropTypes.number,
    rotation: PropTypes.number,
    ...ViewPropTypes
}

const RNHatomVideo = requireNativeComponent('RNHatomVideoView', HatomVideo)