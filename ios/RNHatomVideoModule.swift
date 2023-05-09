//
//  RNHatomVideoModule.swift
//  RNHatomVideo
//
//  Created by 刘彬 on 2023/5/9.
//

import Foundation

@objc(RNHatomVideo)
class RNHatomVideoModule: NSObject {
    @objc(initSdk:::)
    func initSdk(sdkVsrsion: String, appKey: String, pringLog: Bool) {
        print("RNHatomVideoModule", pringLog)
    }
}
