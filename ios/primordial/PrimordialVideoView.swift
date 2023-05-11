//
//  PrimordialVideoView.swift
//  RNHatomVideo
//
//  Created by 刘彬 on 2023/5/9.
//  Copyright © 2023 Facebook. All rights reserved.
//

import Foundation
import UIKit
import AVKit

/**
 使用原生播放器的控件
 */
@available(iOS 8.0, *)
@objc(PrimordialVideoView)
class PrimordialVideoView: UIView, VideoImpl {
    let TAG = "PrimordialVideoView"
    
    lazy var playerVc: AVPlayerViewController = {
        let playerVc = AVPlayerViewController()
        return playerVc
    }()
    
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
            let sourceDic = setDataSource as! Dictionary<String, Any>
            _setDataSource(path: (sourceDic["path"] as? String)!)
        }
    }
    // 开始播放，"start" 将产生冲突异常，改为 startPlay
    @objc var startPlay: NSString? {
        didSet {
            print(TAG, "startPlay", startPlay!)
            _start()
        }
    }
    
    /**
     * 初始化SDK
     */
    func _initSdk() {
        
    }

    /**
     * 初始化播放器
     */
    func _initPlayer() {
        
    }

    /**
     * 设置视频配置
     */
    func _setPlayConfig() {
        
    }
    
    /// 设置视频播放参数
    /// - Parameter path: 播放url
    func _setDataSource(path: String) {
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
    func _start() {
        print(TAG, "_start")
        playerVc.player?.play()
    }
}
