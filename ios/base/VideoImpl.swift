//
//  VideoImpl.swift
//  RNHatomVideo
//
//  Created by 刘彬 on 2023/5/10.
//  Copyright © 2023 Facebook. All rights reserved.
//

import Foundation

/**
 * 播放器应该实现的公共方法和属性监听
 * 包含常规的视频播放相关功能：url配置，播放暂停，声音控制等
 *
 * 仅要求默认配置的方法和属性监听，具有特殊参数的同名方法及相关属性，由 VideoView 自行实现提供
 * 此接口是为了说明播放器应有的基础功能和操作流程
 */
protocol VideoImpl {
    // 初始化SDK
    var initSdk: NSDictionary? {get set}
    // 初始化播放器
    var initPlayer: NSString? {get set}
    // 设置视频配置
    var setPlayConfig: NSDictionary? {get set}
    // 设置视频播放参数
    var setDataSource: NSDictionary? {get set}
    // 开始播放
    var startPlay: NSString? {get set}
    
    /**
     * 初始化SDK
     */
    func _initSdk()

    /**
     * 初始化播放器
     */
    func _initPlayer()

    /**
     * 设置视频配置
     */
    func _setPlayConfig()
    
    /// 设置视频播放参数
    /// - Parameter path: 播放url
    func _setDataSource(path: String)

    /**
     * 开始播放
     * 开启视频预览或回放
     */
    func _start()
}
