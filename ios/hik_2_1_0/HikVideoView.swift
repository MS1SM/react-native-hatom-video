//
//  HikVideoView.swift
//  RNHatomVideo
//
//  Created by 刘彬 on 2023/5/9.
//  Copyright © 2023 Facebook. All rights reserved.
//

import Foundation
import UIKit

/**
 使用原生播放器的控件
 */
@objc(HikVideoView)
class HikVideoView: UITextView, VideoImpl {
    let TAG = "HikVideoView"
    
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
            text = sourceDic["path"] as? String
        }
    }
    // 开始播放，"start" 将产生冲突异常，改为 startPlay
    @objc var startPlay: NSString? {
        didSet {
            print(TAG, "startPlay", startPlay!)
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
        
    }

    /**
     * 开始播放
     * 开启视频预览或回放
     */
    func _start() {

    }
}
