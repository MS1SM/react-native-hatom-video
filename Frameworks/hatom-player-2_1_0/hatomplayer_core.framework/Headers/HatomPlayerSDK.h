//
//  HatomPlayerSDK.h
//  hatomplayer-core
//
//  Created by chenmengyi on 2021/7/23.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface HatomPlayerSDK : NSObject

/// 初始化
/// @param appKey 萤石appkey
/// @param printLog YES-支持打印 NO-不支持打印
- (instancetype)init:(NSString *)appKey printLog:(BOOL)printLog;

/// 设置萤石accessToken
/// @param accessToken 萤石accessToken
- (void)setAccessToken:(NSString *)accessToken;

/// 获取萤石accessToken
- (nullable NSString *)getAccessToken;

@end

NS_ASSUME_NONNULL_END
