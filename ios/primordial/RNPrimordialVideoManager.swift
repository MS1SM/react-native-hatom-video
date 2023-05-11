//
//  RNPrimordialVideoManager.swift
//  RNHatomVideo
//
//  Created by 刘彬 on 2023/5/8.
//  Copyright © 2023 Facebook. All rights reserved.
//

import Foundation

/**
 * 支持原生播放器
 */
@available(iOS 8.0, *)
@objc(PrimordialVideo)
class RNPrimordialVideoManager: RCTViewManager {
    override func view() -> UIView! {
        return PrimordialVideoView()
    }
}
