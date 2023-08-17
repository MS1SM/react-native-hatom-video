import React, { Component } from 'react';
import {
  Button,
  Image,
  StatusBar,
  PermissionsAndroid,
  View,
  ScrollView
} from 'react-native';
import { HatomVideo, SdkVersion, EZPTZCommand, EZPTZAction, EzPtzSpeed, EzMirror, EzSwitch, EzAlarm, EZPlaybackRate } from 'react-native-hatom-video';
import { observer } from "mobx-react";
import Log from "../../../utils/Log";
import Utils from '../../../utils/Utils';

@observer
export default class Test2Page extends Component {
  CLASS_NAME = 'Test2Page';
  constructor(props) {
    super(props);
  }

  onCallback = (params) => {
    Log.info(this.CLASS_NAME, "onCallback params", params)
  }

  render () {
    return (
      <ScrollView>
      <View>
        <Button
          onPress={() => {
            this.onPress()
          }}
          title="跳转TestPage"
        />
        <Button
          onPress={() => {
            // 萤石 appkey
            HatomVideo.initSdk({
              sdkVersion: SdkVersion.EzvizVideo,
              accessToken: "at-231e7mfcdu-10y3pm0-rqxbeki2t",
              appKey: "01af97b55b29b4",
              printLog: true
            })
          }}
          title="初始化sdk"
        />
        <Button
          onPress={() => {
            // 萤石 初始化player 所需参数
            this.hatomVideo.initPlayer({
              deviceSerial: "F",
              cameraNo: 1
            })
          }}
          title="initPlayer"
        />
        <Button
          onPress={() => {
            this.hatomVideo.start()
          }}
          title="start"
        />
        <Button
          onPress={() => {
              this.hatomVideo.setVerifyCode("TSFQQC")
              this.hatomVideo.start()
          }}
          title="验证码"
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
              HatomVideo.getConstants({
              deviceSerial: "F"
              })
                .then(data => {
                Log.info(this.CLASS_NAME, "getConstants", data)
              })
          }}
          title="获取常量"
        />
        <Button
            onPress={() => {
              
            // 安卓动态权限获取
            Utils.PermissionUtil(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
              .then(() => {
                
                this.hatomVideo.startLocalRecord({
                  deviceSerial: "F"
                })
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
          
          {/* 回放功能 */}

        <Button
            onPress={() => {
              this.hatomVideo.startPlayback({
                startTime: 1692086400000,
                endTime: 1692115201000
              })
          }}
          title="回放 Start"
          />

        <Button
            onPress={() => {
              this.hatomVideo.stopPlayback()
          }}
          title="回放 Stop"
          />

        <Button
            onPress={() => {
              this.hatomVideo.pausePlayback()
          }}
          title="回放 Pause"
          />

        <Button
            onPress={() => {
              this.hatomVideo.resumePlayback()
          }}
          title="回放 Resume"
          />

        <Button
            onPress={() => {
              this.hatomVideo.speedPlayback(EZPlaybackRate.EZ_PLAYBACK_RATE_16)
          }}
          title="回放 Speed"
          />

        <Button
            onPress={() => {
              this.hatomVideo.seekPlayback(1692104400000)
          }}
          title="回放 Seek"
          />

        <Button
            onPress={() => {
              this.hatomVideo.statusPlayback()
          }}
          title="回放 Status"
          />

        <Button
          onPress={() => {
            HatomVideo._probeDeviceInfo({
              sdkVersion: SdkVersion.EzvizVideo,
              deviceSerial: "F",
              deviceType: "FJGY1"
            })
              .then((data) => {
                Log.info(this.CLASS_NAME, "_probeDeviceInfo typeof", typeof(data))
                Log.info(this.CLASS_NAME, "_probeDeviceInfo success", data)
                Log.info(this.CLASS_NAME, "_probeDeviceInfo message", data.message)
              })
              .catch((error) => {
                Log.error(this.CLASS_NAME, "_probeDeviceInfo error", error)
                Log.error(this.CLASS_NAME, "_probeDeviceInfo error", error.message)
              })
          }}
          title="设备信息"
        />
        <Button
          onPress={() => {
            // 安卓动态权限获取
            Utils.PermissionUtil(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
              .then(() => {
                HatomVideo._startConfigWifi({
                  sdkVersion: SdkVersion.EzvizVideo,
                  deviceSsid: "FJGDWL_F",
                  devicePassword: "FMPD",
                  deviceSerial: "F",
                  verifyCode: "PNAMPD",
                  routerSsid: "TP-LC99",
                  routerPassword: "?",
                  isAutoConnect: true
                })
                  .then(() => {
                    Log.trace(this.CLASS_NAME, "wifi success")
                  })
                  .catch((error) => {
                    Log.error(this.CLASS_NAME, "wifi", error.message)
                  })
              })
              .catch(() => {

              })
          }}
          title="wifi 配网"
        />
        <Button
          onPress={() => {
            // 安卓动态权限获取
            Utils.PermissionUtil(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO)
              .then(() => {
                this.hatomVideo.voiceTalk({
                  isStart: true
                })
              })
              .catch(() => {

              })
          }}
          title="开始对讲"
        />
        <Button
            onPress={() => {
              HatomVideo._searchRecordFile({
                sdkVersion: SdkVersion.EzvizVideo,
                isSd: true,
                deviceSerial: "F",
                cameraNo: 1,
                startTime: 1691596800000,
                endTime: 1691683200000
              })
          }}
          title="录像列表sdk"
        />

        {/* 萤石 Htpp 请求功能 */}
        <Button
          onPress={() => {
            HatomVideo.setGlobalConfig({
              http: {
                isTest: false,
                ezvizToken: "at-231e7mfcdu-10y3pm0-rqxbeki2t",
                ezvizSerial: "F"
              },
              sdk: {
                version: SdkVersion.EzvizVideo
              }
            })
          }}
          title="set Config"
        />
        <Button
          onPress={() => {
            HatomVideo.recordStatus()
            .then((data) => {
              Log.log(this.CLASS_NAME, "recordStatus", data)
            })
            .catch((error) => {
              Log.error(this.CLASS_NAME, "recordStatus", error)
            })
          }}
          title="获取全天录像开关状态"
        />
        <Button
          onPress={() => {
            HatomVideo.recordSet({
              enable: 0
            })
            .then((data) => {
              Log.log(this.CLASS_NAME, "recordSet", data)
            })
            .catch((error) => {
              Log.error(this.CLASS_NAME, "recordSet", error)
            })
          }}
          title="设置全天录像"
        />
        <Button
          onPress={() => {
            HatomVideo.info()
            .then((data) => {
              Log.log(this.CLASS_NAME, "info", data)
            })
            .catch((error) => {
              Log.error(this.CLASS_NAME, "info", error)
            })
          }}
          title="设备信息"
        />
        <Button
          onPress={() => {
            HatomVideo.status()
            .then((data) => {
              Log.log(this.CLASS_NAME, "status", data)
            })
            .catch((error) => {
              Log.error(this.CLASS_NAME, "status", error)
            })
          }}
          title="设备状态"
        />
        <Button
          onPress={() => {
            HatomVideo.mirror({
              channelNo: 1,
              // 当前设备仅支持 中心镜像
              command: EzMirror.Center
            })
            .then((data) => {
              Log.log(this.CLASS_NAME, "mirror", data)
            })
            .catch((error) => {
              Log.error(this.CLASS_NAME, "mirror", error)
            })
          }}
          title="镜像翻转"
        />
        <Button
          onPress={() => {
            HatomVideo.format()
            .then((data) => {
              Log.log(this.CLASS_NAME, "format", data)
            })
            .catch((error) => {
              Log.error(this.CLASS_NAME, "format", error)
            })
          }}
          title="TF卡格式化"
        />
        <Button
          onPress={() => {
            HatomVideo.defence({
              isDefence: EzSwitch.Close
            })
            .then((data) => {
              Log.log(this.CLASS_NAME, "defence", data)
            })
            .catch((error) => {
              Log.error(this.CLASS_NAME, "defence", error)
            })
          }}
          title="设备撤/布防"
        />
        <Button
          onPress={() => {
            HatomVideo.encryptOn()
            .then((data) => {
              Log.log(this.CLASS_NAME, "encryptOn", data)
            })
            .catch((error) => {
              Log.error(this.CLASS_NAME, "encryptOn", error)
            })
          }}
          title="开启设备视频加密"
        />
        <Button
          onPress={() => {
            HatomVideo.encryptOff()
            .then((data) => {
              Log.log(this.CLASSc_NAME, "encryptOff", data)
            })
            .catch((error) => {
              Log.error(this.CLASS_NAME, "encryptOff", error)
            })
          }}
          title="关闭设备视频加密"
        />
        <Button
          onPress={() => {
            HatomVideo.version()
            .then((data) => {
              Log.log(this.CLASS_NAME, "version", data)
            })
            .catch((error) => {
              Log.error(this.CLASS_NAME, "version", error)
            })
          }}
          title="获取设备版本信息"
        />
        <Button
          onPress={() => {
            HatomVideo.upgrade()
            .then((data) => {
              Log.log(this.CLASS_NAME, "upgrade", data)
            })
            .catch((error) => {
              Log.error(this.CLASS_NAME, "upgrade", error)
            })
          }}
          title="设备升级固件"
        />
        <Button
          onPress={() => {
            HatomVideo.upgradeStatus()
            .then((data) => {
              Log.log(this.CLASS_NAME, "upgradeStatus", data)
            })
            .catch((error) => {
              Log.error(this.CLASS_NAME, "upgradeStatus", error)
            })
          }}
          title="获取设备升级状态"
        />
        <Button
          onPress={() => {
            HatomVideo.sound({
              type: EzAlarm.Silent
            })
            .then((data) => {
              Log.log(this.CLASS_NAME, "sound", data)
            })
            .catch((error) => {
              Log.error(this.CLASS_NAME, "sound", error)
            })
          }}
          title="设置告警声音模式"
        />
        <Button
          onPress={() => {
            HatomVideo.searchRecord({
            })
            .then((data) => {
              Log.log(this.CLASS_NAME, "searchRecord", data)
            })
            .catch((error) => {
              Log.error(this.CLASS_NAME, "searchRecord", error)
            })
          }}
          title="录像列表api"
        />

        <HatomVideo
          ref={(view) => this.hatomVideo = view}
          style={{ height: 200, width: 400 }}
          // backgroundColor="#558899"
          sdkVersion={SdkVersion.EzvizVideo}
          onCapturePicture={this.onCallback}
          onLocalRecord={this.onCallback}
          onPtzControl={this.onCallback}
          // onStreamFlow={this.onCallback}
          onPlayStatus={this.onCallback}
          onTalkStatus={this.onCallback}
          onPlayback={this.onCallback}
        ></HatomVideo>
      </View>
      </ScrollView>
    );
  }
}
