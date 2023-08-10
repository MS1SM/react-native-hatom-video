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
        case .HikVideo_V2_1_0, .Imou:
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
    
    @objc
    func probeDeviceInfo(
        _ config: NSDictionary,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        let configDic   = config as! Dictionary<String, Any>
        
        switch getSdkVersion(config: configDic) {
        case .HikVideo_V2_1_0, .Imou:
            print(TAG, "probeDeviceInfo: HikVideo_V2_1_0")
            
        case .PrimordialVideo:
            print(TAG, "probeDeviceInfo: PrimordialVideo")
            
        case .EzvizVideo:
            let deviceSerial  = configDic["deviceSerial"]   as! String
            let deviceType    = configDic["deviceType"]     as! String
            
            EZOpenSDK.probeDeviceInfo(
                deviceSerial,
                deviceType: deviceType) {
                    (deviceInfo: EZProbeDeviceInfo?, error: Error?) in
                    
                    if error != nil {
                        // 有异常
                        resolve([
                            EventProp.code.rawValue: (error! as NSError).code
                        ])
                    } else {
                        // 设备在线，可添加
                        resolve([])
                    }
                }
            
        case .Unknown:
            print(TAG, "probeDeviceInfo: Unknown")
        }
    }
    
    @objc
    func startConfigWifi(
        _ config: NSDictionary,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        let configDic   = config as! Dictionary<String, Any>
        
        switch getSdkVersion(config: configDic) {
        case .HikVideo_V2_1_0, .Imou:
            print(TAG, "startConfigWifi: probeDeviceInfo")
            
        case .PrimordialVideo:
            print(TAG, "startConfigWifi: PrimordialVideo")
            
        case .EzvizVideo:
            // 路由器ssid
            let routerSsid = configDic["routerSsid"] as! String
            // 路由器密码
            let routerPassword = configDic["routerPassword"] as! String
            // 设备序列号
            let deviceSerial = configDic["deviceSerial"] as! String
            // 设备验证码
            let verifyCode = configDic["verifyCode"] as! String
            
            EZOpenSDK.startAPConfigWifi(
                withSsid:       routerSsid,
                password:       routerPassword,
                deviceSerial:   deviceSerial,
                verifyCode:     verifyCode) {
                    (ret: Bool) in
                    
                    EZOpenSDK.stopAPConfigWifi()
                    
                    if ret {
                        resolve([])
                    } else {
                        reject(self.TAG, "-1", NSError(domain: self.TAG, code: -1, userInfo: nil))
                    }
                }
            
        case .Unknown:
            print(TAG, "startConfigWifi: Unknown")
        }
    }
    
    @objc
    func getConstants(
        _ config: NSDictionary,
        resolve: @escaping RCTPromiseResolveBlock,
        reject: @escaping RCTPromiseRejectBlock
    ) {
        let configDic = config as! Dictionary<String, Any>
        resolve([])
    }
}
