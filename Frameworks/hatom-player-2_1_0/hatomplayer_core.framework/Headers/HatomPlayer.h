//
//  IHatomPlayer.h
//  hatomplayer-core
//
//  Created by kouhao on 2020/12/18.
//

#import <UIKit/UIKit.h>
#import <Foundation/Foundation.h>
#import "PlayConfig.h"
#import "Constrants.h"

NS_ASSUME_NONNULL_BEGIN

@protocol HatomPlayerDelegate <NSObject>

/// 播放状态回调方法
/// @param status 播放状态
/// @param errorCode 错误码，只有在 status 状态为： FAILED 、EXCEPTION 才有值 ,其他 status 值为 -1
- (void)onPlayerStatus:(PlayStatus)status errorCode:(NSString *)errorCode;


/// 语音对讲状态回调方法
/// @param status 播放状态
/// @param errorCode 错误码，只有在 status 状态为： FAILED 、EXCEPTION 才有值 ,其他 status 值为 -1
- (void)onTalkStatus:(PlayStatus)status errorCode:(NSString *)errorCode;

@end

@interface HatomPlayer : NSObject

@property(nonatomic, weak) id<HatomPlayerDelegate> delegate;

///初始化
- (instancetype)init;

/// 设置playConfig
/// @param playConfig 播放参数
- (void)setPlayConfig:(PlayConfig *)playConfig;

/// 设置播放view
/// @param view 播放view
- (int)setVideoWindow:(UIView *)view;

/// 设置播放参数
/// @param path 播放url
/// @param headers 请求参数
- (void)setDataSource:(nullable NSString *)path headers:(nullable NSDictionary *)headers;

/// 开始播放
- (void)start;

/// 停止播放
- (void)stop;

/// 暂停取流
- (void)stopStream;

/// 恢复取流
- (void)startStream;

/// 切换码流
/// @param quality 码流质量
- (BOOL)changeStream:(QualityType)quality;

/// 定位播放
/// @param seekTime 定位时间,格式为 yyyy-MM-dd'T'HH:mm:ss.SSS
- (int)seekPlayback:(NSString *)seekTime;

/// 设置对讲参数
/// @param path 对讲url
/// @param headers 请求参数
- (void)setVoiceDataSource:(nullable NSString *)path headers:(nullable NSDictionary *)headers;

/// 开启对讲
- (void)startVoiceTalk;

/// 关闭对讲
- (void)stopVoiceTalk;

/// 暂停播放
- (int)pause;

/// 恢复播放
- (int)resume;

/// 获取回放倍速值
- (int)getPlaybackSpeed;

/// 设置回放倍速s
/// 倍速值-8/-4/-2/1/2/4/8，负数为慢放，正数为快放
- (int)setPlaybackSpeed:(float)speed;

/// 获取抓拍数据
- (nullable NSData *)screenshoot;

/// 抓图
/// @param path 大图路径
/// @param thumbnailPath 缩略图路径
- (int)screenshoot:(NSString *)path thumbnail:(NSString *)thumbnailPath;

/// 设置多线程解码线程数（硬解不支持设置解码线程）
/// @param threadNum 线程数（1~8）
- (BOOL)setDecodeThreadNum:(int)threadNum;

/// 获取当前码流帧率
- (int)getFrameRate;

/// 设置期望帧率（硬解不支持）
/// @param frameRate 帧率范围(1~码流最大帧率)，播放成功后可以通过getFrameRate获取当前码流最大帧率
- (BOOL)setExpectedFrameRate:(int)frameRate;

/// 开始录像
/// @param mediaFilePath 录像文件路径
- (int)startRecord:(NSString *)mediaFilePath;

///开始录像同时转码(转码是指转码为系统播放器可以识别的标准 mp4封装）
///@param mediaFilePath 录像文件路径
- (int)startRecordAndConvert:(NSString *)mediaFilePath;

/// 停止录像
- (int)stopRecord;

/// 获取消耗的流量
- (long)getTotalTraffic;

/// 声音操作
/// @param enable YES-开启  NO-关闭
- (int)enableAudio:(BOOL)enable;

/// 电子放大
/// @param original 原有的位置
/// @param current 当前位置
- (int)openDigitalZoom:(CGRect)original current:(CGRect)current;

/// 关闭电子放大
- (int)closeDigitalZoom;

/// 获取系统播放时间
- (long)getOSDTime;

/// 播放本地的录像文件
/// @param path 文件路径
- (void)playFile:(NSString *)path;

/// 获取文件总播放时长
- (int)getTotalTime;

/// 获取当前视频播放时间
- (int)getPlayedTime;

/// 设置当前进度值
/// @param scale 当前播放进度和总进度比  取值范围 0-1.0
- (int)setCurrentFrame:(float)scale;

/// 云台控制操作（需先启动预览）
/// @param action 云台停止动作或开始动作： 0- 开始， 1- 停止
/// @param command 云台控制命令
/// @param speed 云台控制的速度，用户按不同解码器的速度控制值设置。取值范围[1,7]
- (int)ptzControl:(int)action command:(int)command speed:(int)speed;

/// 云台预置点操作（需先启动预览）
/// @param presentCmd 云台预置点操作命令
/// @param presetIndex 预置点的序号（从 1 开始），最多支持 255 个预置点
- (int)ptzPreset:(int)presentCmd presetIndex:(int)presetIndex;

/// 云台巡航操作，需先启动预览
/// @param cruiseCmd 操作云台巡航命令
/// @param index 巡航序号
- (int)ptzCruise:(int)cruiseCmd index:(int)index;

/// 开启/关闭鱼眼
/// @param enable 开启-YES  关闭-NO
- (int)setFishEyeEnable:(BOOL)enable;

/// 设置鱼眼模式
/// @param correctType 矫正方式
/// @param placeType 安装方式
- (int)setFishEyeMode:(FishEyeCorrectType)correctType placeType:(FishEyePlaceType)placeType;

/// 处理鱼眼矫正
/// @param isZoom 是否缩放
/// @param zoom 缩放系数
/// @param originalPoint 原始点（或者上次操作的点）
/// @param currentPoint 当前点
/// @param translationPoint 拖动的距离
- (int)handleFishEyeCorrect:(BOOL)isZoom zoom:(float)zoom originalPoint:(CGPoint)originalPoint currentPoint:(CGPoint)currentPoint translationPoint:(CGPoint)translationPoint;

/// 获取版本号
+ (NSString *)getVersion;

@end

NS_ASSUME_NONNULL_END
