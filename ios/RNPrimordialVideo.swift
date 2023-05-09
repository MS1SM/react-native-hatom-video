//
//  RNPrimordialVideoManager.swift
//  RNHatomVideo
//
//  Created by 刘彬 on 2023/5/8.
//  Copyright © 2023 Facebook. All rights reserved.
//

import Foundation

@objc(PrimordialVideo)
class RNPrimordialVideo: RCTViewManager {
    override func view() -> UIView! {
        var textView = MsTextView()
        textView.text = "9897"
        return textView
    }
}
