import React, { Component } from 'react';
import {
  Button,
  Image,
  StatusBar,
  PermissionsAndroid,
  View
} from 'react-native';
import { HatomVideo, SdkVersion, EZPTZCommand, EZPTZAction, EzPtzSpeed } from 'react-native-hatom-video';
import { observer } from "mobx-react";
import Log from "../../../utils/Log";
import Utils from '../../../utils/Utils';

const TAG = 'ImouPage';

@observer
export default class ImouPage extends Component {
  constructor(props) {
    super(props);
  }

  onCallback = (params) => {
    Log.info(TAG, "onCallback params", params)
  }

  render () {
    return (
      <View>
        <Button
          onPress={() => {
            HatomVideo.initSdk({
              sdkVersion: SdkVersion.Imou,
              appKey: "",
              printLog: true
            })
          }}
          title="初始化sdk"
        />
        <Button
          onPress={() => {
            this.hatomVideo.initPlayer()
          }}
          title="initPlayer"
        />
        <Button
          onPress={() => {
            this.hatomVideo.setDataSource("rtsp://10.26.0.13:554/EUrl/LCjIqCk")
          }}
          title="source"
        />
        <Button
          onPress={() => {
            this.hatomVideo.start()
          }}
          title="start"
        />
        <Button
          onPress={() => {
            this.hatomVideo.stop()
          }}
          title="stop"
        />
        <Button
          onPress={() => {
            this.hatomVideo.capturePicture()
          }}
          title="截图"
        />
        <Button
          onPress={() => {
            this.hatomVideo._controlPtz({
              command: EZPTZCommand.EZPTZCommandRight,
              action: EZPTZAction.EZPTZActionSTART
            })
          }}
          title="云台start"
        />
        <Button
          onPress={() => {
            this.hatomVideo._controlPtz({
              command: EZPTZCommand.EZPTZCommandRight,
              action: EZPTZAction.EZPTZActionSTOP
            })
          }}
          title="云台Stop"
        />
        <Button
          onPress={() => {
            // 安卓动态权限获取
            Utils.PermissionUtil(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
              .then(() => {
                this.hatomVideo.startLocalRecord()
              })
              .catch(() => {

              })
          }}
          title="录像start"
        />
        <Button
          onPress={() => {
            this.hatomVideo.stopLocalRecord()
          }}
          title="录像stop"
        />
        <Button
          onPress={() => {
            // 安卓动态权限获取
            Utils.PermissionUtil(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO)
              .then(() => {
                this.hatomVideo.voiceTalk({
                  isStart: true,
                  talkUrl: ""
                })
              })
              .catch(() => {

              })
          }}
          title="开始对讲"
        />
        <Button
          onPress={() => {
            this.hatomVideo.getToken()
          }}
          title="token"
        />
        <Button
          onPress={() => {
            this.hatomVideo.setGlobalConfig({
              http: {
                isTest: false,
                hikToken: "dmdyq57olK3SrXMhzDr_3YzWlV9PpMlJ63zSKgqf_3U"
              }
            })
          }}
          title="set Config"
        />
        <Button
          onPress={() => {
            this.hatomVideo.getPreviewUrl({
              indexCode:    "98f",
              protocol:     "rtsp",
              streamType:   0,
              expand:       "transcode=1&videtype=h264"
            })
            .then(data => {
              Log.info(TAG, "getPreviewUrl", data)
            })
            .catch(err => {
              Log.error(TAG, "getPreviewUrl", err)
            })
          }}
          title="Preview Url"
        />
        <Button
          onPress={() => {
            this.hatomVideo.sound(true)
          }}
          title="声音打开"
        />
        <Button
          onPress={() => {
            this.hatomVideo.sound(false)
          }}
          title="声音关闭"
        />
        <Button
          onPress={() => {
              HatomVideo.getConstants({
              })
                .then(data => {
                Log.info(this.CLASS_NAME, "getConstants", data)
              })
          }}
          title="获取常量"
        />
        <HatomVideo
          ref={(view) => this.hatomVideo = view}
          style={{ height: 200, width: 500 }}
          sdkVersion={SdkVersion.Imou}
          onCapturePicture={this.onCallback}
          onLocalRecord={this.onCallback}
          onPtzControl={this.onCallback}
          // onStreamFlow={this.onCallback}
          onPlayStatus={this.onCallback}
          onTalkStatus={this.onCallback}
        ></HatomVideo>
      </View>
    );
  }
}
