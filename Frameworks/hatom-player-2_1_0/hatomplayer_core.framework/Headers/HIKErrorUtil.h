//
//  HIKErrorUtil.h
//  Pods
//
//  Created by westke on 2017/12/22.
//
//

#import <Foundation/Foundation.h>

@interface HIKErrorUtil : NSObject

/**
 根据错误码获取错误描述

 @param errorCode 错误码
 @return NSString 错误描述
 */
+ (NSString *)errorMsgWithErrorCode:(NSUInteger)errorCode;

@end
