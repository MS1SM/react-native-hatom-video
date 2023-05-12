//
//  RNHatomVideoModule.swift
//  RNHatomVideo
//
//  Created by 刘彬 on 2023/5/9.
//

import Foundation
import hatomplayer_core

@objc(RNHatomVideo)
class RNHatomVideoModule: NSObject {
    let TAG = "RNHatomVideoModule"
    
    @objc(initSdk:::)
    func initSdk(sdkVsrsion: String, appKey: String, pringLog: Bool) {
        print(TAG, sdkVsrsion, appKey, pringLog)
        let _ = HatomPlayerSDK.init("", printLog: true)
    }
}
