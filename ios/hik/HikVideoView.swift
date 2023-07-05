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
class HikVideoView: UITextView, EZPlayerDelegate {
    let TAG = "HikVideoView"
    
    var sdkVersion = SdkVersion.Unknown
    
    // MARK: - 内部方法
    
    /**
     图片保存到手机相册的回调
     */
    @objc func imageSavedToAlbum(_ image: UIImage, didFinishSavingWithError error: Error?, contextInfo: UnsafeRawPointer) {
        onCapturePicture!([EventProp.success.rawValue: error == nil])
    }
    
    // MARK: - Events
    @objc var onCapturePicture: RCTDirectEventBlock?
    @objc var onLocalRecord: RCTDirectEventBlock?
    @objc var onPtzControl: RCTDirectEventBlock?
    @objc var onStreamFlow: RCTDirectEventBlock?
    
    // MARK: - 属性入口配置
    
    // 初始化sdk版本
    @objc var initSdkVersion: NSString? {
        didSet {
            print(TAG, "initSdkVersion", initSdkVersion!)
            self.sdkVersion = SdkVersion.nameToEnum(name: initSdkVersion as! String)
        }
    }
    
    // 初始化播放器
    @objc var initPlayer: NSDictionary? {
        didSet {
            let configDic = initPlayer as! Dictionary<String, Any>
            switch sdkVersion {
            case .Unknown:
                print(TAG, "error 未 initSdkVersion")
                
            case .HikVideo_V2_1_0:
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
            switch sdkVersion {
            case .Unknown:
                print(TAG, "error 未 initSdkVersion")
                
            case .HikVideo_V2_1_0:
                let sourceDic = setDataSource as! Dictionary<String, Any>
                print(TAG, "setDataSource", sourceDic["path"] as! String)
                
            case .PrimordialVideo:
                let sourceDic = setDataSource as! Dictionary<String, Any>
                setDataSourcePrimordial(path: (sourceDic["path"] as! String))
                
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
                
            case .HikVideo_V2_1_0:
                print(TAG, "HikVideo startPlay")
                
            case .PrimordialVideo:
                startPrimordial()
                
            case .EzvizVideo:
                startRealEzviz()
            }
        }
    }
    
    // 流量获取
    @objc var getStreamFlow: NSString? {
        didSet {
            switch sdkVersion {
            case .Unknown:
                print(TAG, "error 未 initSdkVersion")
                
            case .HikVideo_V2_1_0:
                print(TAG, "HikVideo getStreamFlow")
                
            case .PrimordialVideo:
                print(TAG, "PrimordialVideo getStreamFlow")
                
            case .EzvizVideo:
                getStreamFlowEzviz()
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
                
            case .HikVideo_V2_1_0:
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
    @objc var capturePicture: NSString? {
        didSet {
            switch sdkVersion {
            case .Unknown:
                print(TAG, "error 未 initSdkVersion")
                
            case .HikVideo_V2_1_0:
                print(TAG, "HikVideo capturePicture")
                
            case .PrimordialVideo:
                print(TAG, "PrimordialVideo capturePicture")
                
            case .EzvizVideo:
                capturePictureEzviz()
            }
        }
    }
    
    // 开启录像
    @objc var startLocalRecord: NSDictionary? {
        didSet {
            switch sdkVersion {
            case .Unknown:
                print(TAG, "error 未 initSdkVersion")
                
            case .HikVideo_V2_1_0:
                print(TAG, "HikVideo startLocalRecord")
                
            case .PrimordialVideo:
                print(TAG, "PrimordialVideo startLocalRecord")
                
            case .EzvizVideo:
                startLocalRecordEzviz()
            }
        }
    }
    
    // 结束录像
    @objc var stopLocalRecord: NSString? {
        didSet {
            switch sdkVersion {
            case .Unknown:
                print(TAG, "error 未 initSdkVersion")
                
            case .HikVideo_V2_1_0:
                print(TAG, "HikVideo stopLocalRecord")
                
            case .PrimordialVideo:
                print(TAG, "PrimordialVideo stopLocalRecord")
                
            case .EzvizVideo:
                stopLocalRecordEzviz()
            }
        }
    }
    
    // MARK: - 海康 SDK V2.1.0 播放器
    /**
     * 初始化SDK
     */
    func initSdkHatom() {
        
    }

    /**
     * 初始化播放器
     */
    func initPlayerHatom() {
        
    }

    /**
     * 设置视频配置
     */
    func setPlayConfigHatom() {
        
    }
    
    /// 设置视频播放参数
    /// - Parameter path: 播放url
    func setDataSourceHatom(path: String) {
        
    }

    /**
     * 开始播放
     * 开启视频预览或回放
     */
    func startHatom() {

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
    
    // 视频存储地址的模板
    let FORMAT_RECORD_PATH = NSHomeDirectory() + "/Documents/hatom/record/%@.mp4"
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
    
    // MARK: EZPlayerDelegate
    /**
     播放器播放失败错误回调
     */
    func didPlayFailed(error: NSError) {
        print(TAG, "error didPlayFailed", error)
    }
    
    /**
     播放器消息回调
     */
    func didReceivedMessage(messageCode: NSInteger) {
        print(TAG, "didReceivedMessage", messageCode)
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
    func capturePictureEzviz() {
        let image = ezPlayer.capturePicture(100)
        UIImageWriteToSavedPhotosAlbum(
            image!,
            self,
            #selector(imageSavedToAlbum),
            nil
        )
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
        
        ezPlayer.startLocalRecord(withPathExt: recordPathEzviz)
    }
    
    /**
     * 结束本地直播流录像
     * 与 startLocalRecordEzviz 成对使用
     */
    func stopLocalRecordEzviz() {
        if recordPathEzviz == "" {
            print(TAG, "stopLocalRecordEzviz error 未 开始录像")
            return
        }
        
        ezPlayer.stopLocalRecordExt() {
            ret in
            
            print(self.TAG, "stopLocalRecordEzviz ret", ret)
        }
    }
}
