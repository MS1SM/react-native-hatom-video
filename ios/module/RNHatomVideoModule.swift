//
//  RNHatomVideoModule.swift
//  RNHatomVideo
//
//  Created by 刘彬 on 2023/5/9.
//

import Foundation
import hatomplayer_core
import EZOpenSDKFramework

@objc(RNHatomVideo)
class RNHatomVideoModule: NSObject {
    let TAG = "RNHatomVideoModule"
    
    func getSdkVersion(config: Dictionary<String, Any>) -> SdkVersion {
        var sdkVersion = ""
        if config.keys.contains("sdkVersion") {
            sdkVersion = config["sdkVersion"] as! String
        }
        
        return SdkVersion.nameToEnum(name: sdkVersion)
    }
    
    @objc(initSdk:)
    func initSdk(config: NSDictionary) {
        let configDic   = config                    as! Dictionary<String, Any>
        let appKey      = configDic["appKey"]       as! String
        let printLog    = configDic["printLog"]     as! Bool
        
        switch getSdkVersion(config: configDic) {
        case .HikVideo_V2_1_0:
            let _ = HatomPlayerSDK.init(appKey, printLog: true)
            
        case .PrimordialVideo:
            print(TAG, "initSdk: PrimordialVideo")
            
        case .EzvizVideo:
            let accessToken = configDic["accessToken"]  as! String
            
            EZOpenSDK.setDebugLogEnable(printLog)
            EZOpenSDK.initLib(withAppKey: appKey)
            EZOpenSDK.setAccessToken(accessToken)
            
        case .Unknown:
            print(TAG, "initSdk: Unknown")
        }
    }
}
