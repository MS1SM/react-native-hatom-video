//
//  RNHatomVideoPackage.m
//  RNHatomVideo
//
//  Created by 刘彬 on 2023/5/8.
//  Copyright © 2023 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTViewManager.h>
#import <RNHatomVideo-Swift.h>

#pragma mark - module
@interface RCT_EXTERN_MODULE(RNHatomVideo, NSObject)

/**
 初始化 SDK
 一个冒号表示一个参数
 
 .sdkVersion    (String)        sdk 版本
 .appKey         (String)        appKey
 .printLog        (Boolean)    是否打开日志，仅限 SDK 的日志，本封装库的日志不受控
 
 **************************************************
 Ezviz
 .accessToken  (String)  token
 */
RCT_EXTERN_METHOD(initSdk:)

/**
 * 查询设备信息
 *
 * config.sdkVersion     (String)    sdk 版本
 *
 ***************************************************
 * Ezviz
 * config.deviceSerial   (String)    设备序列号
 * config.deviceType     (String)    设备型号
 *
 * 使用 Promise 回调结果
 * resolve      (WritableMap)   操作结果，返回数据对象。成功与失败都通过此方式返回结果，通过code判断。
 *         resolve.code         (Int?)          不存在时表示查询成功，需要添加对象；存在时根据错误码确定设备状态。参考 设备添加流程：https://open.ys7.com/help/36
 * reject         未使用
 */
RCT_EXTERN_METHOD(
                  probeDeviceInfo: (NSDictionary*)config
                  resolve: (RCTPromiseResolveBlock)resolve
                  reject: (RCTPromiseRejectBlock)reject
)

/**
 * wifi 配网
 *
 * config.sdkVersion     (String)       sdk 版本
 * resolve and reject     (Promise)   使用 Promise 回调结果
 *
 ***************************************************
 * Ezviz
 * config.deviceSerial                   (String)    设备序列号
 * config.verifyCode                     (String)    设备验证码
 * config.routerSsid                      (String)    路由器ssid
 * config.routerPassword             (String)    路由器密码
 */
RCT_EXTERN_METHOD(
                  startConfigWifi: (NSDictionary*)config
                  resolve: (RCTPromiseResolveBlock)resolve
                  reject: (RCTPromiseRejectBlock)reject
)

@end

#pragma mark - UI
/**
 * 集成版播放器
 *
 * **************************************************
 * 支持海康 SDK V2.1.0
 * 支持 原生 播放器
 * 支持 萤石 SDK
 */
@interface RCT_EXTERN_MODULE(HikVideo, RCTViewManager)

/**
 初始化sdk版本
 */
RCT_EXPORT_VIEW_PROPERTY(initSdkVersion, NSString)

/**
 初始化播放器
 *
 ***************************************************
 * HikVideo
 *
 ***************************************************
 * Primordial
 *
 ***************************************************
 * Ezviz
 *
 * @param  NSDictionary.deviceSerial     (String) 设备序列号
 * @param  NSDictionary.cameraNo              (int)       通道号
 */
RCT_EXPORT_VIEW_PROPERTY(initPlayer, NSDictionary)

/**
 * 设置视频配置
 * 设置视频配置。在开始播放前设置。
 *
 ***************************************************
 * HikVideo
 *
 * @Nullable NSDictionary.hardDecode  (Boolean)   是否使用硬解码，默认false
 * @Nullable NSDictionary.privateData   (Boolean)   是否显示智能信息,默认false
 * @Nullable NSDictionary.timeout         (int)             取流超时时间，单位秒，默认20s
 * @Nullable NSDictionary.secretKey     (String)        解码秘钥。如果码流进行了加密，需要设置解码秘钥
 *
 ***************************************************
 * Primordial
 */
RCT_EXPORT_VIEW_PROPERTY(setPlayConfig, NSDictionary)

/**
 * 设置视频播放参数
 * 设置视频参数，开启播放前设置。实时预览、录像回放开启播放时，需要用到的取流url及其他请求参数。
 *
 ***************************************************
 * HikVideo
 * @param NSDictionary.path             (String)                            播放url
 * @param NSDictionary.headers      (ReadableNativeMap)     其他请求参数
 *
 * headers.TOKEN                (String)  用于headers中传递token的key
 * headers.START_TIME       (String)  用于headers中传递回放开始时间的key
 * headers.END_TIME          (String)  用于headers中传递回放结束时间的key
 *
 ***************************************************
 * Primordial
 * @param configMap.path    (String)                播放文件名
 */
RCT_EXPORT_VIEW_PROPERTY(setDataSource, NSDictionary)

/**
 开始播放
 开启视频预览或回放
 name = "start" 将产生冲突异常，name 改为 startPlay
 NSString 占位，无实际意义
 */
RCT_EXPORT_VIEW_PROPERTY(startPlay, NSString)

/**
 停止播放
 NSString 占位，无实际意义
 */
RCT_EXPORT_VIEW_PROPERTY(stopPlay, NSString)

/**
 释放资源
 NSString 占位，无实际意义
 */
RCT_EXPORT_VIEW_PROPERTY(release, NSString)

/**
 * 开启录像
 *
 ***************************************************
 * Ezviz
 */
RCT_EXPORT_VIEW_PROPERTY(startLocalRecord, NSDictionary)

/**
 * 结束本地直播流录像
 * 与 startLocalRecord 成对使用
 * NSString 占位，无实际意义
 *
 * 通过 Events.onLocalRecord 通知结果
 */
RCT_EXPORT_VIEW_PROPERTY(stopLocalRecord, NSString)

/**
 * 声音控制
 * @param BOOL 是否打开
 */
RCT_EXPORT_VIEW_PROPERTY(sound, BOOL)

/**
 * 云台 PTZ 控制接口
 * 通过 Events.onPtzControl 通知结果
 *
 ***************************************************
 * Ezviz
 *
 * @param  NSDictionary.command    (String)    参考 enum EZConstants.EZPTZCommand
 * @param  NSDictionary.action     (String)     参考 enum EZConstants.EZPTZAction
 * @param  NSDictionary.speed      (String)      可为空，EzPtzSpeed, 默认：PTZ_SPEED_DEFAULT
 */
RCT_EXPORT_VIEW_PROPERTY(controlPtz, NSDictionary)

/**
 * 对讲控制
 *
 ***************************************************
 * Ezviz
 *
 * @param  NSDictionary.isStart                       (Boolean)    是否开启对讲
 * @param  NSDictionary.isDeviceTalkBack   (Boolean)    可为空，默认true。用于判断对讲的设备，true表示与当前设备对讲，false表示与NVR设备下的IPC通道对讲。
 */
RCT_EXPORT_VIEW_PROPERTY(voiceTalk, NSDictionary)

/**
 * 截图
 * 通过 Events.onCapturePicture 通知结果
 */
RCT_EXPORT_VIEW_PROPERTY(capturePicture, NSString)

/**
 * 设置视频清晰度
 *
 ***************************************************
 * Ezviz
 *
 * @param  NSDictionary.videoLevel     (String)    参考 enum EZConstants.EZVideoLevel
 */
RCT_EXPORT_VIEW_PROPERTY(setVideoLevel, NSDictionary)

/**
 * 获取总流量值
 * NSString 占位，无实际意义
 *
 * 通过 Events.onStreamFlow 通知结果
 */
RCT_EXPORT_VIEW_PROPERTY(getStreamFlow, NSString)

/**
 * 设置播放验证码
 * NSString verifyCode
 */
RCT_EXPORT_VIEW_PROPERTY(setVerifyCode, NSString)

#pragma mark Events

/**
 * 截图回调
 * success： (Boolean)   是否成功，只有保存到系统相册才算成功
 */
RCT_EXPORT_VIEW_PROPERTY(onCapturePicture, RCTDirectEventBlock)

/**
 * 录像结果回调
 * success： (Boolean)   是否成功
 * message： (String?)   信息，失败时的信息
 * data：    (String?)   文件路径，成功时
 */
RCT_EXPORT_VIEW_PROPERTY(onLocalRecord, RCTDirectEventBlock)

/**
 * 云台控制回调
 * 暂时只有失败才做回调
 * success： (Boolean)   操作是否成功
 * message： (String?)   信息，失败时的信息
 */
RCT_EXPORT_VIEW_PROPERTY(onPtzControl, RCTDirectEventBlock)

/**
 * 流量使用回调，总流量
 * data:    (Double)  总流量值，单位：B
 */
RCT_EXPORT_VIEW_PROPERTY(onStreamFlow, RCTDirectEventBlock)

/**
 * 播放器状态回调
 *
 ***************************************************
 * HikVideo
 * code: (String) (code == '-1') 成功，(code == 其他) 错误码。参考海康文档
 *
 ***************************************************
 * Ezviz
 * code: (Int)          状态。参考萤石文档，EZConstants.EZRealPlayConstants
 *
 * data: (Object?)      (code == MSG_REALPLAY_PLAY_FAIL<103>) data = { code, message }
 *                          (data.code = 400035 || 400036) 需要输入验证码 || 验证码错误
 *
 *                      (code == 其他) data 暂无数据
 */
RCT_EXPORT_VIEW_PROPERTY(onPlayStatus, RCTDirectEventBlock)

/**
 * 对讲状态回调
 *
 ***************************************************
 * HikVideo
 * code: (String) (code == '-1') 成功，(code == 其他) 错误码。参考海康文档
 *
 ***************************************************
 * Ezviz
 * code: (Int)          状态。参考萤石文档，EZConstants.EZRealPlayConstants
 */
RCT_EXPORT_VIEW_PROPERTY(onTalkStatus, RCTDirectEventBlock)
@end
