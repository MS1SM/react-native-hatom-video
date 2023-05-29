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

/**
 * 集成版 View
 *
 * **************************************************
 * 支持海康 SDK V2.1.0 版本的播放器
 *
 * 资源demo
 * https://open.hikvision.com/download/5c67f1e2f05948198c909700?type=10
 * 综合安防管理平台 -> V2.0.0 -> ios SDK V2.1.0
 *
 *
 * **************************************************
 * 使用原生播放器的控件
 */
@available(iOS 8.0, *)
@objc(HikVideoView)
class HikVideoView: UITextView {
    let TAG = "HikVideoView"
    
    var sdkVersion = SdkVersion.Unknown
    
    /*--------------- 属性入口配置 ---------------*/
    // 初始化sdk版本
    @objc var initSdkVersion: NSString? {
        didSet {
            print(TAG, "initSdkVersion", initSdkVersion!)
            switch initSdkVersion {
            case "HikVideo_V2_1_0":
                sdkVersion = SdkVersion.HikVideo_V2_1_0
                break
                
            case "PrimordialVideo":
                sdkVersion = SdkVersion.PrimordialVideo
                break
                
            default :
                sdkVersion = SdkVersion.Unknown
                break
            }
        }
    }
    
    // 初始化SDK
    @objc var initSdk: NSDictionary? {
        didSet {
            print(TAG, "initSdk", initSdk!)
        }
    }
    
    // 初始化播放器
    @objc var initPlayer: NSString? {
        didSet {
            print(TAG, "initPlayer", initPlayer!)
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
            print(TAG, "setDataSource", setDataSource!)
            switch sdkVersion {
            case .Unknown:
                print(TAG, "error SdkVersion 未配置")
                
            case .HikVideo_V2_1_0:
                let sourceDic = setDataSource as! Dictionary<String, Any>
                text = sourceDic["path"] as? String
                
            case .PrimordialVideo:
                let sourceDic = setDataSource as! Dictionary<String, Any>
                setDataSourcePrimordial(path: (sourceDic["path"] as? String)!)
            }
        }
    }
    
    // 开始播放，"start" 将产生冲突异常，改为 startPlay
    @objc var startPlay: NSString? {
        didSet {
            print(TAG, "startPlay", startPlay!)
            switch sdkVersion {
            case .Unknown:
                print(TAG, "error SdkVersion 未配置")
                
            case .HikVideo_V2_1_0:
                print(TAG, "HikVideo startPlay")
                
            case .PrimordialVideo:
                startPrimordial()
            }
        }
    }
    
    /*--------------- 海康 SDK V2.1.0 播放器 ---------------*/
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
    
    /*--------------- 原生播放器 ---------------*/
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
}
