//
//  PlayConfig.h
//  hatom-player-core
//
//  Created by chenmengyi on 2020/11/3.
//

#import "Constrants.h"
#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/// player需要的参数
@interface PlayConfig : NSObject

/// 是否开启硬解码 true-开启 false-关闭
@property(nonatomic, assign) BOOL hardDecode;

/// 是否显示智能信息 true-显示 false-不显示
@property(nonatomic, assign) BOOL privateData;

/// 取流超时时间，默认20s
@property(nonatomic, assign) int timeout;

/// 码流解密key
@property(nonatomic, copy) NSString *secretKey;

/// 水印信息
@property(nonatomic, strong) NSArray<NSString*> *waterConfigs;

/// 流缓冲区大小，默认为5M   格式：5*1024*1024
@property(nonatomic, assign) int bufferLength;

/*********** 萤石参数 萤石播放需要的信息**********/
/// 通道号
@property(nonatomic, assign) int channelNum;
/// 序列号
@property(nonatomic, copy) NSString *deviceSerial;
/// 验证码
@property(nonatomic, copy) NSString *verifyCode;

@end

NS_ASSUME_NONNULL_END
