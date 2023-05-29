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

// module
@interface RCT_EXTERN_MODULE(RNHatomVideo, NSObject)

// 初始化sdk 三个: 即三个参数
RCT_EXTERN_METHOD(initSdk:::(BOOL))

@end

// HikVideo
@interface RCT_EXTERN_MODULE(HikVideo, RCTViewManager)

/**
 初始化sdk版本
 */
RCT_EXPORT_VIEW_PROPERTY(initSdkVersion, NSString)

/**
 初始化SDK
 NSDictionary.appKey      (String)        保留字段
 NSDictionary.printLog    (Boolean)       是否打印sdk日志
 */
RCT_EXPORT_VIEW_PROPERTY(initSdk, NSDictionary)

/**
 初始化播放器
 NSString 占位，无实际意义
 */
RCT_EXPORT_VIEW_PROPERTY(initPlayer, NSString)

/**
 设置视频配置
 设置视频配置。在开始播放前设置。
 */
RCT_EXPORT_VIEW_PROPERTY(setPlayConfig, NSDictionary)

/**
 设置视频播放参数
 设置视频参数，开启播放前设置
 NSDictionary.path          (String)                    播放url
 NSDictionary.headers    (NSDictionary)         其他请求参数
 */
RCT_EXPORT_VIEW_PROPERTY(setDataSource, NSDictionary)

/**
 开始播放
 开启视频预览或回放
 name = "start" 将产生冲突异常，name 改为 startPlay
 NSString 占位，无实际意义
 */
RCT_EXPORT_VIEW_PROPERTY(startPlay, NSString)

@end
