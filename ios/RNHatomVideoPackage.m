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

@interface RCT_EXTERN_MODULE(RNHatomVideo, NSObject)
// 初始化sdk 三个: 即三个参数
RCT_EXTERN_METHOD(initSdk:::(BOOL))
@end

@interface RCT_EXTERN_MODULE(PrimordialVideo, RCTViewManager)
RCT_EXPORT_VIEW_PROPERTY(startPlay, NSString)
@end
