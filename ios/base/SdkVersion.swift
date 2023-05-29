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
enum SdkVersion {
    // 没有配置，未知。实际使用不得配置此版本，仅用于报错提示。
    case Unknown
    // 支持海康 SDK V2.1.0
    case HikVideo_V2_1_0
    // 支持 Android MediaPlayer 播放器
    case PrimordialVideo
}
