//
//  Events.swift
//  RNHatomVideo
//
//  Created by 刘彬 on 2023/7/3.
//  Copyright © 2023 Facebook. All rights reserved.
//

import Foundation
import EZOpenSDKFramework

// MARK: - 与 js 交互时事件携带的参数
enum EventProp: String {
    /**
     * 是否成功
     * Boolean
     */
    case success = "success"
    
    /**
     * 信息
     * String
     */
    case message = "message"
    
    /**
     * 数据
     * Any
     */
    case data = "data"
    
    /**
     * 编码
     * Int | String
     */
    case code = "code"
    
    /**
     * 录像路径
     */
    case recordPath = "recordPath"
}

// MARK: - sdk 版本枚举
enum SdkVersion: String {
    // 没有配置，未知。实际使用不得配置此版本，仅用于报错提示。
    case Unknown = "Unknown"
    // 支持海康 SDK V2.1.0
    case HikVideo_V2_1_0 = "HikVideo_V2_1_0"
    // 支持 Android MediaPlayer 播放器
    case PrimordialVideo = "PrimordialVideo"
    // 支持萤石 SDK。萤石使用 pod 获得，不强调版本。
    case EzvizVideo = "EzvizVideo"
    
    static func nameToEnum(name: String) -> SdkVersion {
        let TAG = "SdkVersion"
        
        var sdk = SdkVersion(rawValue: name)
        if (sdk == nil) {
            sdk = SdkVersion.Unknown
        }
        if (sdk == SdkVersion.Unknown) {
            print(TAG, "nameToEnum 请使用枚举中记录的Sdk版本，请勿使用 Unknown")
        }
        
        return sdk ?? SdkVersion.Unknown
    }
}

// MARK: - 萤石常量
final class EZConstants {
    private init() {}
    
    // 云台控制
    static let PTZCommand: [String: EZPTZCommand] = [
        "EZPTZCommandLeft":     .left,
        "EZPTZCommandRight":    .right,
        "EZPTZCommandUp":       .up,
        "EZPTZCommandDown":     .down,
        "EZPTZCommandZoomIn":   .zoomIn,
        "EZPTZCommandZoomOut":  .zoomOut
    ]
    
    // 云台动作
    static let PTZAction: [String: EZPTZAction] = [
        "EZPTZActionSTART":   .start,
        "EZPTZActionSTOP":    .stop
    ]
    
    // 云台速度
    static let PTZSpeed: [String: Int] = [
        "PTZ_SPEED_SLOW":       0,
        "PTZ_SPEED_DEFAULT":    1,
        "PTZ_SPEED_FAST":       2
    ]
    
    // 视频画质
    static let VideoLevel: [String: EZVideoLevelType] = [
        "VIDEO_LEVEL_FLUNET":       .low,
        "VIDEO_LEVEL_BALANCED":     .middle,
        "VIDEO_LEVEL_HD":           .high,
        "VIDEO_LEVEL_SUPERCLEAR":   .superHigh
    ]
}
