//
//  HikVideoView.swift
//  RNHatomVideo
//
//  Created by 刘彬 on 2023/5/9.
//  Copyright © 2023 Facebook. All rights reserved.
//

import Foundation
import UIKit
import AVKit
import EZOpenSDKFramework
import hatomplayer_core

/**
 * 集成版 View
 *
 * **************************************************
 * 支持海康 SDK V2.1.0 Normal 版本的播放器
 *
 * 资源demo
 * https://open.hikvision.com/download/5c67f1e2f05948198c909700?type=10
 * 综合安防管理平台 -> V2.0.0 -> ios SDK V2.1.0
 *
 *
 * **************************************************
 * 使用原生播放器的控件
 *
 * **************************************************
 * 支持 萤石 SDK
 */
@available(iOS 8.0, *)
@objc(HikVideoView)
class HikVideoView: UITextView, EZPlayerDelegate, HatomPlayerDelegate {
    let TAG = "HikVideoView"
    
    var sdkVersion = SdkVersion.Unknown
    
    // MARK: - 内部方法
    
    /**
     图片保存到手机相册的回调
     */
    @objc func imageSavedToAlbum(_ image: UIImage, didFinishSavingWithError error: Error?, contextInfo: UnsafeRawPointer) {
        onCapturePicture!([
            EventProp.success.rawValue: error == nil,
            EventProp.message.rawValue: "saveAlbum"
        ])
    }
    
    /**
     视频保存到手机相册的回调
     */
    @objc func videoSavedToAlbum(_ image: UIImage, didFinishSavingWithError error: Error?, contextInfo: UnsafeRawPointer) {
        onLocalRecord!([
            EventProp.success.rawValue: error == nil,
            EventProp.message.rawValue: "saveAlbum"
        ])
    }
    
    // MARK: - Events
    @objc var onCapturePicture: RCTDirectEventBlock?
    @objc var onLocalRecord: RCTDirectEventBlock?
    @objc var onPtzControl: RCTDirectEventBlock?
    @objc var onStreamFlow: RCTDirectEventBlock?
    @objc var onPlayStatus: RCTDirectEventBlock?
    @objc var onTalkStatus: RCTDirectEventBlock?
    @objc var onPlayback: RCTDirectEventBlock?
    
    // MARK: - 属性入口配置
    
    // 初始化sdk版本
    @objc var initSdkVersion: NSString? {
        didSet {
            print(TAG, "initSdkVersion", initSdkVersion!)
            self.sdkVersion = SdkVersion.nameToEnum(name: initSdkVersion! as String)
        }
    }
    
    // 初始化播放器
    @objc var initPlayer: NSDictionary? {
        didSet {
            let configDic = initPlayer as! Dictionary<String, Any>
            switch sdkVersion {
            case .Unknown:
                print(TAG, "error 未 initSdkVersion")
                
            case .HikVideo_V2_1_0, .Imou:
                initPlayerHatom()
                
            case .PrimordialVideo:
                initPlayerPrimordial()
                
            case .EzvizVideo:
                // 数据
                let deviceSerial    = configDic["deviceSerial"] as! String
                let cameraNo        = configDic["cameraNo"]     as! Int
                // 配置
                initPlayerEzviz(deviceSerial: deviceSerial, cameraNo: cameraNo)
            }
        }
    }
    
    // 设置视频配置
    @objc var setPlayConfig: NSDictionary? {
        didSet {
            print(TAG, "setPlayConfig", setPlayConfig!)
        }
    }
    
    // 设置视频播放参数
    @objc var setDataSource: NSDictionary? {
        didSet {
            let configDic = setDataSource as! Dictionary<String, Any>
            switch sdkVersion {
            case .Unknown:
                print(TAG, "error 未 initSdkVersion")
                
            case .HikVideo_V2_1_0, .Imou:
                var headers: Dictionary<String, String>? = nil
                if configDic.keys.contains("headers") {
                    headers = configDic["headers"] as? Dictionary<String, String>
                }
                setDataSourceHatom(path: configDic["path"] as! String, headers: headers)
                
            case .PrimordialVideo:
                setDataSourcePrimordial(path: (configDic["path"] as! String))
                
            case .EzvizVideo:
                print(TAG, "EzvizVideo setDataSource")
            }
        }
    }
    
    // 开始播放，"start" 将产生冲突异常，改为 startPlay
    @objc var startPlay: NSString? {
        didSet {
            switch sdkVersion {
            case .Unknown:
                print(TAG, "error 未 initSdkVersion")
                
            case .HikVideo_V2_1_0, .Imou:
                startHatom()
                
            case .PrimordialVideo:
                startPrimordial()
                
            case .EzvizVideo:
                startRealEzviz()
            }
        }
    }
    
    // 停止播放
    @objc var stopPlay: NSString? {
        didSet {
            switch sdkVersion {
            case .Unknown:
                print(TAG, "error 未 initSdkVersion")
                
            case .HikVideo_V2_1_0, .Imou:
                stopHatom()
                
            case .PrimordialVideo:
                print(TAG, "stopPlay", "未实现功能")
                
            case .EzvizVideo:
                stopRealEzviz()
            }
        }
    }
    
    // 释放资源
    @objc var releasePlay: NSString? {
        didSet {
            switch sdkVersion {
            case .Unknown:
                print(TAG, "error 未 initSdkVersion")

            case .HikVideo_V2_1_0, .Imou:
                print(TAG, "release", "未实现功能")

            case .PrimordialVideo:
                print(TAG, "release", "未实现功能")

            case .EzvizVideo:
                print(TAG, "release", "未实现功能")
            }
        }
    }
    
    // 流量获取
    @objc var getStreamFlow: NSString? {
        didSet {
            switch sdkVersion {
            case .Unknown:
                print(TAG, "error 未 initSdkVersion")
                
            case .HikVideo_V2_1_0, .Imou:
                totalTrafficHatom()
                
            case .PrimordialVideo:
                print(TAG, "PrimordialVideo getStreamFlow")
                
            case .EzvizVideo:
                getStreamFlowEzviz()
            }
        }
    }
    
    // 声音控制
    @objc var sound: NSNumber? {
        didSet {
            let isOpen = sound != 0
            
            switch sdkVersion {
            case .Unknown:
                print(TAG, "error 未 initSdkVersion")
                
            case .HikVideo_V2_1_0, .Imou:
                enableAudioHatom(isOpen: isOpen)
                
            case .PrimordialVideo:
                print(TAG, "PrimordialVideo sound")
                
            case .EzvizVideo:
                soundEzviz(isOpen: isOpen)
            }
        }
    }
    
    // 云台控制
    @objc var controlPtz: NSDictionary? {
        didSet {
            let configDic = controlPtz as! Dictionary<String, Any>
            switch sdkVersion {
            case .Unknown:
                print(TAG, "error 未 initSdkVersion")
                
            case .HikVideo_V2_1_0, .Imou:
                print(TAG, "HikVideo controlPtz")
                
            case .PrimordialVideo:
                print(TAG, "PrimordialVideo controlPtz")
                
            case .EzvizVideo:
                let command = EZConstants.PTZCommand[configDic["command"] as! String]!
                let action = EZConstants.PTZAction[configDic["action"] as! String]!
                var speed = EZConstants.PTZSpeed["PTZ_SPEED_DEFAULT"]!
                if configDic.keys.contains("speed") {
                    speed = EZConstants.PTZSpeed[configDic["speed"] as! String]!
                }
                
                controlPtzEzviz(command: command, action: action, speed: speed)
            }
        }
    }
    
    // 截图
    @objc var capturePicture: NSDictionary? {
        didSet {
            let configDic = capturePicture as! Dictionary<String, Any>
            var saveAlbum = true
            if configDic.keys.contains("saveAlbum") {
                saveAlbum = configDic["saveAlbum"] as! Bool
            }
            var saveFolder = true
            if configDic.keys.contains("saveFolder") {
                saveFolder = configDic["saveFolder"] as! Bool
            }
            var deviceSerial = ""
            if configDic.keys.contains("deviceSerial") {
                deviceSerial = configDic["deviceSerial"] as! String
            }
            
            switch sdkVersion {
            case .Unknown:
                print(TAG, "error 未 initSdkVersion")
                
            case .HikVideo_V2_1_0, .Imou:
                capturePictureHatom(saveAlbum: saveAlbum, saveFolder: saveFolder, deviceSerial: deviceSerial)
                
            case .PrimordialVideo:
                print(TAG, "PrimordialVideo capturePicture")
                
            case .EzvizVideo:
                capturePictureEzviz(saveAlbum: saveAlbum, saveFolder: saveFolder, deviceSerial: deviceSerial)
            }
        }
    }
    
    // 设置视频清晰度
    @objc var setVideoLevel: NSDictionary? {
        didSet {
            let configDic = setVideoLevel as! Dictionary<String, Any>
            switch sdkVersion {
            case .Unknown:
                print(TAG, "error 未 initSdkVersion")
                
            case .HikVideo_V2_1_0, .Imou:
                // setDataSource
                if configDic.keys.contains("path") {
                    setDataSourceHatom(path: configDic["path"] as! String, headers: nil)
                }
                // changeStream
                let videoLevel = HikConstants.QualityType[configDic["videoLevel"] as! String]
                if videoLevel != nil {
                    changeStreamHatom(quality: videoLevel!)
                } else {
                    print(TAG, "error setVideoLevel", "参数配置异常，请核对")
                }
                
            case .PrimordialVideo:
                print(TAG, "PrimordialVideo setVideoLevel")
                
            case .EzvizVideo:
                let videoLevel = EZConstants.VideoLevel[configDic["videoLevel"] as! String]!
                setVideoLevelEzviz(videoLevel: videoLevel)
            }
        }
    }
    
    // 开启录像
    @objc var startLocalRecord: NSDictionary? {
        didSet {
            switch sdkVersion {
            case .Unknown:
                print(TAG, "error 未 initSdkVersion")
                
            case .HikVideo_V2_1_0, .Imou:
                startLocalRecordHatom()
                
            case .PrimordialVideo:
                print(TAG, "PrimordialVideo startLocalRecord")
                
            case .EzvizVideo:
                startLocalRecordEzviz()
            }
        }
    }
    
    // 结束录像
    @objc var stopLocalRecord: NSDictionary? {
        didSet {
            let configDic = stopLocalRecord as! Dictionary<String, Any>
            var saveAlbum = true
            if configDic.keys.contains("saveAlbum") {
                saveAlbum = configDic["saveAlbum"] as! Bool
            }
            var saveFolder = true
            if configDic.keys.contains("saveFolder") {
                saveFolder = configDic["saveFolder"] as! Bool
            }
            var deviceSerial = ""
            if configDic.keys.contains("deviceSerial") {
                deviceSerial = configDic["deviceSerial"] as! String
            }
            
            switch sdkVersion {
            case .Unknown:
                print(TAG, "error 未 initSdkVersion")
                
            case .HikVideo_V2_1_0, .Imou:
                stopLocalRecordHatom(saveAlbum: saveAlbum, saveFolder: saveFolder, deviceSerial: deviceSerial)
                
            case .PrimordialVideo:
                print(TAG, "PrimordialVideo stopLocalRecord")
                
            case .EzvizVideo:
                stopLocalRecordEzviz(saveAlbum: saveAlbum, saveFolder: saveFolder, deviceSerial: deviceSerial)
            }
        }
    }
    
    // 对讲控制
    @objc var voiceTalk: NSDictionary? {
        didSet {
            let configDic = voiceTalk as! Dictionary<String, Any>
            let isStart = configDic["isStart"] as! Bool
            
            switch sdkVersion {
            case .Unknown:
                print(TAG, "error 未 initSdkVersion")
                
            case .HikVideo_V2_1_0, .Imou:
                var talkUrl = ""
                if isStart {
                    talkUrl = configDic["talkUrl"] as! String
                }
                voiceTalkHatom(isStart: isStart, talkUrl: talkUrl)
                
            case .PrimordialVideo:
                print(TAG, "PrimordialVideo voiceTalk")
                
            case .EzvizVideo:
                var isDeviceTalkBack = true
                if configDic.keys.contains("isDeviceTalkBack") {
                    isDeviceTalkBack = configDic["isDeviceTalkBack"] as! Bool
                }
                
                voiceTalkEzviz(
                    isStart: isStart,
                    isDeviceTalkBack: isDeviceTalkBack
                )
            }
        }
    }
    
    // 设置播放验证码
    @objc var setVerifyCode: NSString? {
        didSet {
            switch sdkVersion {
            case .Unknown:
                print(TAG, "error 未 initSdkVersion")
                
            case .HikVideo_V2_1_0, .Imou:
                print(TAG, "HikVideo setVerifyCode")
                
            case .PrimordialVideo:
                print(TAG, "PrimordialVideo setVerifyCode")
                
            case .EzvizVideo:
                setVerifyCodeEzviz(verifyCode: setVerifyCode! as String)
            }
        }
    }
    
    // 回放功能
    @objc var playback: NSDictionary? {
        didSet {
            let configDic = playback as! Dictionary<String, Any>
            let command = PlaybackCommand.nameToEnum(name: configDic["command"] as! String)
            
            if command == nil {
                return
            }
            
            switch sdkVersion {
            case .Unknown:
                print(TAG, "error 未 initSdkVersion")
                
            case .HikVideo_V2_1_0, .Imou:
                playbackHatom(command: command!, configDic: configDic)
                
            case .PrimordialVideo:
                print(TAG, "PrimordialVideo voiceTalk")
                
            case .EzvizVideo:
                playbackEzviz(command: command!, configDic: configDic)
                
            }
        }
    }
    
    // MARK: - 海康 SDK V2.1.0 播放器
    
    // 海康操作成功返回码
    let SUCCESS_HATOM = 0
    // 录像文件地址
    var recordPathHatom = ""
    
    // 海康视频播放器
    lazy var hatomPlayer: HatomPlayer = {
        return DefaultHatomPlayer.init()
    }()
    // 海康对讲播放器
    lazy var talkHatomPlayer: HatomPlayer = {
        return DefaultHatomPlayer.init()
    }()
    
    // MARK: HatomPlayerDelegate
    // 播放状态回调
    @objc func onPlayerStatus(_ status: PlayStatus, errorCode: String) {
        print(TAG, "onPlayerStatus", status, errorCode)
        onPlayStatus!([EventProp.code.rawValue: errorCode])
    }
    
    // 对讲状态回调
    @objc func onTalk(_ status: PlayStatus, errorCode: String) {
        print(TAG, "onTalkStatus", status, errorCode)
        onTalkStatus!([EventProp.code.rawValue: errorCode])
    }
    
    // MARK: 播放器方法
    /**
     * 初始化SDK
     */
    func initSdkHatom() {
        
    }

    /**
     * 初始化播放器
     */
    func initPlayerHatom() {
        hatomPlayer.setVideoWindow(self)
        // 默认 PlayConfig
        let playConfig = PlayConfig()
        playConfig.hardDecode = true
        playConfig.privateData = true
        hatomPlayer.setPlayConfig(playConfig)
        // 回调
        hatomPlayer.delegate = self
    }

    /**
     * 设置视频配置
     */
    func setPlayConfigHatom() {
        
    }
    
    /// 设置视频播放参数
    /// - Parameter path: 播放url
    func setDataSourceHatom(path: String, headers: [String : String]?) {
        hatomPlayer.setDataSource(path, headers: headers)
    }

    /**
     * 开始播放
     * 开启视频预览或回放
     */
    func startHatom() {
        hatomPlayer.start()
    }
    
    /**
     * 停止播放
     */
    func stopHatom() {
        hatomPlayer.stop()
    }
    
    /**
     * 对讲控制
     * - Parameter isStart  是否开启对讲
     * - Parameter talkUrl  对讲短链接，通过调用openApi获取
     */
    func voiceTalkHatom(isStart: Bool, talkUrl: String) {
        if isStart {
            talkHatomPlayer.setVoiceDataSource(talkUrl, headers: nil)
            talkHatomPlayer.delegate = self
            talkHatomPlayer.startVoiceTalk()
        } else {
            talkHatomPlayer.stopVoiceTalk()
        }
    }
    
    /**
     * 声音控制
     * - Parameter isOpen 是否打开
     */
    func enableAudioHatom(isOpen: Bool) {
        hatomPlayer.enableAudio(isOpen)
    }
    
    /**
     * 预览码流平滑切换
     * 必须先调用 setDataSource 接口,设置新的取流url
     */
    func changeStreamHatom(quality: QualityType) {
        let result = hatomPlayer.changeStream(quality)
        if !result {
            print(TAG, "changeStreamHatom", result)
        }
    }
    
    /**
     * 截图
     * 通过 Events.onCapturePicture 通知结果
     */
    func capturePictureHatom(saveAlbum: Bool, saveFolder: Bool, deviceSerial: String) {
        // 截图结果
        let imageData = hatomPlayer.screenshoot()
        if imageData == nil {
            print(TAG, "capturePictureHatom", "截图失败")
            onCapturePicture!([
                EventProp.success.rawValue: false,
                EventProp.message.rawValue: "截图失败"
            ])
            return
        }
        // 保存
        let image = UIImage(data: imageData!)
        if image != nil {
            // 保存到系统相册
            if saveAlbum {
                UIImageWriteToSavedPhotosAlbum(
                    image!,
                    self,
                    #selector(imageSavedToAlbum),
                    nil
                )
            }
            
            // 保存到文件夹
            if saveFolder {
                let filePath = Utils.generatePicturePath(custom: deviceSerial)
                let result   = Utils.saveFolder(image: image!, path: filePath)
                
                onCapturePicture!([
                    EventProp.success.rawValue: result,
                    EventProp.message.rawValue: "saveFolder",
                    EventProp.data.rawValue:    filePath
                ])
            }
            
        } else {
            // 生成失败
            print(TAG, "capturePictureHatom", "截图失败")
            onCapturePicture!([
                EventProp.success.rawValue: false,
                EventProp.message.rawValue: "截图失败"
            ])
        }
    }
    
    /**
     * 开启录像
     * 通过 Events.onLocalRecord 通知结果。仅失败通知；成功由 stopLocalRecordHatom 调用后通知
     */
    func startLocalRecordHatom() {
        // 文件名
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = FORMAT_FILE_NAME
        
        // 文件路径
        recordPathHatom = String(
            format: FORMAT_RECORD_PATH,
            dateFormatter.string(from: Date())
        )
        
        // 开始录制
        let result = hatomPlayer.startRecordAndConvert(recordPathHatom)
        if result != SUCCESS_HATOM {
            print(TAG, "error startLocalRecordHatom", result)
            recordPathHatom = ""
            // 失败回调
            onLocalRecord!([
                EventProp.success.rawValue: false,
                EventProp.code.rawValue: result,
                EventProp.message.rawValue: "开始录像失败"
            ])
        }
    }
    
    /**
     * 结束本地直播流录像
     * 与 startLocalRecordHatom 成对使用
     * 通过 Events.onLocalRecord 通知结果
     */
    func stopLocalRecordHatom(saveAlbum: Bool, saveFolder: Bool, deviceSerial: String) {
        // 路径为空
        if recordPathHatom == "" {
            print(TAG, "stopLocalRecordHatom error 未 开始录像")
            // 失败回调
            onLocalRecord!([
                EventProp.success.rawValue: false,
                EventProp.code.rawValue:    -1,
                EventProp.message.rawValue: "未开始录像"
            ])
            return
        }
        
        // 录制失败
        let result = hatomPlayer.stopRecord()
        if result != SUCCESS_HATOM {
            print(TAG, "error stopLocalRecordHatom", result)
            // 失败回调
            onLocalRecord!([
                EventProp.success.rawValue: false,
                EventProp.code.rawValue:    result,
                EventProp.message.rawValue: "录制失败"
            ])
            return
        }
        
        // 录制成功
        // 保存到相册，由 videoSavedToAlbum 回调结果
        if saveAlbum {
            UISaveVideoAtPathToSavedPhotosAlbum(
                recordPathHatom,
                self,
                #selector(self.videoSavedToAlbum),
                nil
            )
        }
        
        // 保存到文件夹
        if saveFolder {
            let filePath    = Utils.generateRecordPath(custom: deviceSerial)
            let result      = Utils.copyItem(at: recordPathHatom, to: filePath)
            onLocalRecord!([
                EventProp.success.rawValue: result,
                EventProp.message.rawValue: "saveFolder",
                EventProp.data.rawValue:    filePath
            ])
        }
        
        // 清理路径
        recordPathHatom = ""
    }
    
    /**
     * 获取总流量值
     *
     * 通过 Events.onStreamFlow 通知结果
     */
    func totalTrafficHatom() {
        onStreamFlow!([EventProp.data.rawValue: hatomPlayer.getTotalTraffic()])
    }
    
    /**
     回看控制
     */
    func playbackHatom(command: PlaybackCommand, configDic: Dictionary<String, Any>) {
        switch command {
        case .Start, .Stop:
            print(TAG, "playbackHatom", "Strat Stop 未实现功能")
            
        case .Pause:
            hatomPlayer.pause()
            
        case .Resume:
            hatomPlayer.resume()
            
        case .Speed:
            let speed = HikConstants.PlaybackSpeed[configDic["speed"] as! String]!
            hatomPlayer.setPlaybackSpeed(speed)
            
        case .Seek:
            // 时间
            let seekTime = configDic["seekTime"] as! Int
            let seekDate = Date(timeIntervalSince1970: TimeInterval(seekTime / 1000))
            let dateFormatter = DateFormatter()
            dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
            let seekString = dateFormatter.string(from: seekDate)
            // 调整
            hatomPlayer.seekPlayback(seekString)
            
        case .Status:
            // 查询速度对应的枚举名
            let speed = hatomPlayer.getPlaybackSpeed()
            var speedStr = ""
            for (key, value) in HikConstants.PlaybackSpeed {
                if Int(value) == speed {
                    speedStr = key
                }
            }
            // 回调
            onPlayback!([
                EventProp.speed.rawValue: speedStr,
                EventProp.seek.rawValue: hatomPlayer.getOSDTime() * 1000
            ])
        }
    }
    
    // MARK: - 原生播放器
    lazy var playerVc: AVPlayerViewController = {
        let playerVc = AVPlayerViewController()
        return playerVc
    }()
    
    /**
     * 初始化SDK
     */
    func initSdkPrimordial() {
        
    }

    /**
     * 初始化播放器
     */
    func initPlayerPrimordial() {
        
    }

    /**
     * 设置视频配置
     */
    func setPlayConfigPrimordial() {
        
    }
    
    /// 设置视频播放参数
    /// - Parameter path: 播放url
    func setDataSourcePrimordial(path: String) {
        print(TAG, "_setDataSource", path)
        playerVc.player = AVPlayer(url: URL(string: path)!)
        addSubview(playerVc.view)
        playerVc.videoGravity = .resizeAspectFill
        playerVc.view.frame = self.bounds
    }

    /**
     * 开始播放
     * 开启视频预览或回放
     */
    func startPrimordial() {
        print(TAG, "_start")
        playerVc.player?.play()
    }
    
    // MARK: - 萤石播放器
    
    /**
     视频存储地址的模板
     视频文件最终需要拷贝到相册，所以直接存放到tmp目录
     */
    let FORMAT_RECORD_PATH = NSHomeDirectory() + "/tmp/hatom_record_%@.mov"
    // 用于生成文件名的时间格式
    let FORMAT_FILE_NAME = "yyyyMMddHHmmss"
    
    // 录像文件地址
    var recordPathEzviz = ""
    
    // 设备序列号
    var deviceSerialEzviz = ""
    // 通道号
    var cameraNoEzviz = -1
    // 萤石视频播放器
    lazy var ezPlayer: EZPlayer = {
        if self.deviceSerialEzviz.isEmpty || self.cameraNoEzviz == -1 {
            print(TAG, "error", "ezPlayer: 必须先使用正确参数调用initPlayer，初始化播放器，才可以调用其他方法")
        }
        return EZOpenSDK.createPlayer(withDeviceSerial: self.deviceSerialEzviz, cameraNo: self.cameraNoEzviz)
    }()
    // 萤石对讲播放器
    lazy var talkEzPlayer: EZPlayer = {
        if self.deviceSerialEzviz.isEmpty || self.cameraNoEzviz == -1 {
            print(TAG, "error", "ezPlayer: 必须先使用正确参数调用initPlayer，初始化播放器，才可以调用其他方法")
        }
        return EZOpenSDK.createPlayer(withDeviceSerial: self.deviceSerialEzviz, cameraNo: self.cameraNoEzviz)
    }()
    
    // MARK: EZPlayerDelegate
    /**
     播放器播放失败错误回调
     */
    @objc func player(_ player: EZPlayer, didPlayFailed error: NSError) {
        print(TAG, "error didPlayFailed", error)
        
        if player == ezPlayer {
            // 预览
            onPlayStatus!([
                // 103 对应 Android MSG_REALPLAY_PLAY_FAIL
                EventProp.code.rawValue: 103,
                EventProp.data.rawValue: [
                    EventProp.code.rawValue: error.code,
                    EventProp.message.rawValue: error.userInfo
                ]
            ])
            
        } else {
            // 对讲
            onTalkStatus!([EventProp.code.rawValue: error.code])
        }
    }

    /**
     播放器消息回调
     */
    @objc func player(_ player: EZPlayer, didReceivedMessage messageCode: NSInteger) {
        print(TAG, "didReceivedMessage", messageCode)
        let code = messageCode as Int
        
        if player == ezPlayer {
            // 预览
            // 播放开始重置定义
//            if code == EZMessageCode.PLAYER_REALPLAY_START.rawValue {
//                // 102 对应 Android MSG_REALPLAY_PLAY_SUCCESS
//                code = 102
//            }
            onPlayStatus!([EventProp.code.rawValue: code])
            
        } else {
            // 对讲
            onTalkStatus!([EventProp.code.rawValue: code])
        }
    }
    
    // MARK: 播放器方法
    /**
     初始化
     */
    func initPlayerEzviz(deviceSerial: String, cameraNo: Int) {
        // data
        self.deviceSerialEzviz   = deviceSerial
        self.cameraNoEzviz       = cameraNo
        // EZPlayerDelegate
        ezPlayer.delegate = self
        // view
        ezPlayer.setPlayerView(self)
    }
    
    /**
     开始直播
     */
    func startRealEzviz() {
        ezPlayer.startRealPlay()
    }
    
    /**
     * 停止直播
     */
    func stopRealEzviz() {
        ezPlayer.stopRealPlay()
    }
    
    /**
     * 获取总流量值
     *
     * 通过 Events.OnStreamFlow 通知结果
     */
    func getStreamFlowEzviz() {
        onStreamFlow!([EventProp.data.rawValue: ezPlayer.getStreamFlow()])
    }
    
    
    /**
     * 云台 PTZ 控制接口
     *
     * @param command   ptz控制命令
     * @param action         控制启动/停止
     * @param speed         速度（0-2）
     *
     * 通过 Events.onPtzControl 通知失败结果
     */
    func controlPtzEzviz(command:EZPTZCommand, action:EZPTZAction, speed: Int) {
        EZOpenSDK.controlPTZ(
            deviceSerialEzviz,
            cameraNo: cameraNoEzviz,
            command: command,
            action: action,
            speed: speed) {
                (error: Error?) in
                
                if (error != nil) {
                    print(self.TAG, "controlPtzEzviz error", error!)
                    self.onPtzControl!([
                        EventProp.success.rawValue: false,
                        EventProp.message.rawValue: error!.localizedDescription
                    ])
                } else {
                    print(self.TAG, "controlPtzEzviz success")
                }
            }
    }
    
    /**
     * 截图
     * 通过 Events.onCapturePicture 通知结果
     */
    func capturePictureEzviz(saveAlbum: Bool, saveFolder: Bool, deviceSerial: String) {
        let image = ezPlayer.capturePicture(100)
        // 保存到系统相册
        if saveAlbum {
            UIImageWriteToSavedPhotosAlbum(
                image!,
                self,
                #selector(imageSavedToAlbum),
                nil
            )
        }
        
        // 保存到文件夹
        if saveFolder {
            let filePath    = Utils.generatePicturePath(custom: deviceSerial)
            let result      = Utils.saveFolder(image: image!, path: filePath)
            onCapturePicture!([
                EventProp.success.rawValue: result,
                EventProp.message.rawValue: "saveFolder",
                EventProp.data.rawValue: filePath
            ])
        }
    }
    
    /**
     * 开启录像
     */
    func startLocalRecordEzviz() {
        // 文件名
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = FORMAT_FILE_NAME
        
        // 文件路径
        recordPathEzviz = String(
            format: FORMAT_RECORD_PATH,
            dateFormatter.string(from: Date())
        )
        
        // 开始录制
        let startLocal = ezPlayer.startLocalRecord(withPathExt: recordPathEzviz)
        print(TAG, "startLocalRecordEzviz startLocal", startLocal)
    }
    
    /**
     * 结束本地直播流录像
     * 与 startLocalRecordEzviz 成对使用
     *
     * videoSavedToAlbum 回调结果
     */
    func stopLocalRecordEzviz(saveAlbum: Bool, saveFolder: Bool, deviceSerial: String) {
        if recordPathEzviz == "" {
            print(TAG, "stopLocalRecordEzviz error 未 开始录像")
            // 失败回调
            onLocalRecord!([
                EventProp.success.rawValue: false,
                EventProp.code.rawValue:    -1,
                EventProp.message.rawValue: "未开始录像"
            ])
            return
        }
        
        ezPlayer.stopLocalRecordExt() {
            (ret: Bool) in
            
            if ret {
                // 录制成功
                // 保存到相册，由 videoSavedToAlbum 回调结果
                if saveAlbum {
                    UISaveVideoAtPathToSavedPhotosAlbum(
                        self.recordPathEzviz,
                        self,
                        #selector(self.videoSavedToAlbum),
                        nil
                    )
                }
                
                // 保存到文件夹
                if saveFolder {
                    let filePath    = Utils.generateRecordPath(custom: deviceSerial)
                    let result      = Utils.copyItem(at: self.recordPathEzviz, to: filePath)
                    self.onLocalRecord!([
                        EventProp.success.rawValue: result,
                        EventProp.message.rawValue: "saveFolder",
                        EventProp.data.rawValue:    filePath
                    ])
                }
            } else {
                // 录制失败，回调失败信息
                self.onLocalRecord!([
                    EventProp.success.rawValue: false,
                    EventProp.code.rawValue:    -1,
                    EventProp.message.rawValue: "录制失败"
                ])
            }
            self.recordPathEzviz = ""
        }
    }
    
    /**
     * 对讲控制
     * @param isStart           是否开启对讲
     * @param isDeviceTalkBack  (安卓使用的参数，ios并未使用）用于判断对讲的设备，true表示与当前设备对讲，false表示与NVR设备下的IPC通道对讲。
     */
    func voiceTalkEzviz(isStart: Bool, isDeviceTalkBack: Bool) {
        if isStart {
            talkEzPlayer.delegate = self
            talkEzPlayer.startVoiceTalk()
        } else {
            talkEzPlayer.stopVoiceTalk()
        }
    }
    
    /**
     * 设置播放验证码
     */
    func setVerifyCodeEzviz(verifyCode: String) {
        ezPlayer.setPlayVerifyCode(verifyCode)
    }
    
    /**
     * 声音控制
     * - Parameter isOpen 是否打开
     */
    func soundEzviz(isOpen: Bool) {
        if isOpen {
            ezPlayer.openSound()
        } else {
            ezPlayer.closeSound()
        }
    }
    
    /**
     * 设置视频清晰度
     *
     * 此调节可以在视频播放前设置也可以在视频播放成功后设置
     * 视频播放成功后设置了清晰度需要先停止播放 stopRealPlay 然后重新开启播放 startRealPlay 才能生效
     */
    func setVideoLevelEzviz(videoLevel: EZVideoLevelType) {
        EZOpenSDK.setVideoLevel(
            deviceSerialEzviz,
            cameraNo: cameraNoEzviz,
            videoLevel: videoLevel) {
                (error: Error?) in
                
                if (error != nil) {
                    print(self.TAG, "setVideoLevelEzviz error", error!)
                } else {
                    print(self.TAG, "setVideoLevelEzviz success")
                }
            }
    }
    
    /**
     回看控制
     */
    func playbackEzviz(command: PlaybackCommand, configDic: Dictionary<String, Any>) {
        switch command {
        case .Start:
            // 时间
            let startTime = configDic["startTime"] as! Int
            let startDate = Date(timeIntervalSince1970: TimeInterval(startTime / 1000))
            let endTime = configDic["endTime"] as! Int
            let endDate = Date(timeIntervalSince1970: TimeInterval(endTime / 1000))
            // 录像文件信息
            let recordFile = EZDeviceRecordFile()
            recordFile.startTime = startDate
            recordFile.stopTime = endDate
            // 开始回放
            ezPlayer.startPlayback(fromDevice: recordFile)
            
        case .Stop:
            ezPlayer.stopPlayback()
            
        case .Pause:
            ezPlayer.pausePlayback()
            
        case .Resume:
            ezPlayer.resumePlayback()
            
        case .Speed:
            let speed = EZConstants.PlaybackSpeed[configDic["speed"] as! String]!
            ezPlayer.setPlaybackRate(speed, mode: 0)
            
        case .Seek:
            // 时间
            let seekTime = configDic["seekTime"] as! Int
            let seekDate = Date(timeIntervalSince1970: TimeInterval(seekTime / 1000))
            // 调整
            ezPlayer.seekPlayback(seekDate)
            
        case .Status:
            onPlayback!([
                EventProp.seek.rawValue: ezPlayer.getOSDTime().timeIntervalSince1970 * 1000
            ])
        }
    }
}
