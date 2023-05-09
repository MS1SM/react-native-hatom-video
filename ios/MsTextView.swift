//
//  MsTextView.swift
//  RNHatomVideo
//
//  Created by 刘彬 on 2023/5/9.
//  Copyright © 2023 Facebook. All rights reserved.
//

import Foundation
import UIKit

@objc(MsTextView)
class MsTextView: UITextView {
    // 下列属性用于监听RN端调用
    @objc var startPlay: NSString = "" {
        didSet {
            print("MsTextView", "startPlay")
        }
    }
}
