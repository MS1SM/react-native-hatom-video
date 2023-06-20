//
//  SdkVersion.swift
//  RNHatomVideo
//
//  Created by 刘彬 on 2023/5/29.
//  Copyright © 2023 Facebook. All rights reserved.
//

import Foundation

/**
 * sdk 版本枚举
 */
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
