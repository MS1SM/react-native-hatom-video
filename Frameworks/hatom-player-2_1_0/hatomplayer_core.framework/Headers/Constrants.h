//
//  Constrants.h
//  Pods
//
//  Created by chenmengyi on 2020/11/3.
//

#ifndef Constrants_h
#define Constrants_h

// 流数据类型
#define STREAM_HEAD                   0x0001     // 系统头数据
#define STREAM_DATA                   0x0002     // 流数据
#define STREAM_SDP                    0x000A     // SDP信息
#define STREAM_ALL_FRAME_INDEX        0x000B     // 回放全帧索引信息
#define STREAM_SINGLE_FRAME_INFO      0x000C     // 回放单帧信息
#define VOICE_DATA                    0x0012     // 语音音频流
#define STREAM_PLAYBACK_FINISH        0x0064     // 回放、下载或倒放结束标识

#define OPTION_SUCCESS 0
#define OPTION_FAILED  -1

/// 安全认证token
static NSString * const TOKEN = @"token";
/// 开始时间
static NSString * const START_TIME = @"startTime";
/// 结束时间
static NSString * const END_TIME = @"endTime";
/// 录像片段类型
static NSString * const RECORD_TYPE = @"recordType";

///播放状态
typedef NS_ENUM(NSUInteger, PlayStatus) {
    SUCCESS,
    FAILED,
    EXCEPTION,
    FINISH,
};

/**
 取流类型
 
 - FetchStreamTypePreview: 预览
 - FetchStreamTypeReplay: 回放
 - FetchStreamTypeIntercom: 对讲
 */
typedef NS_ENUM(NSUInteger, FetchStreamType) {
    FetchStreamTypePreview,
    FetchStreamTypeReplay,
    FetchStreamTypeIntercom
};


/**
 视频清晰度

 - QualityTypeHD: 高清
 - QualityTypeSD: 标清
 - QualityTypeFL: 流畅
 */
typedef NS_ENUM(NSUInteger, QualityType) {
    QualityTypeHD = 0,
    QualityTypeSD,
    QualityTypeFL
};

/**
 云台action

 - PTZActionTypeStart: 开始
 - PTZActionTypeStop: 结束
 */
typedef NS_ENUM(NSUInteger, PTZActionType) {
    PTZActionTypeStart = 0,
    PTZActionTypeStop
};

/**
 云台操作类型
 
 - PTZCommandTypeSetPreset: 设置预置点
 - PTZCommandTypeClearPreset: 清楚预置点
 - PTZCommandTypeZoomIn: 焦距增大(倍率变大)
 - PTZCommandTypeZoomOut: 焦距变小(倍率变小)
 - PTZCommandTypeFocusNear: 焦点前调
 - PTZCommandTypeFocusFar: 焦点后调
 - PTZCommandTypeApertureOpen: 光圈扩大
 - PTZCommandTypeApertureClose: 光圈缩小
 - PTZCommandTypeTiltUP: 上
 - PTZCommandTypeTiltDown: 下
 - PTZCommandTypePanLeft: 左
 - PTZCommandTypePanRight: 右
 - PTZCommandTypeUpLeft: 上左
 - PTZCommandTypeUpRight: 上右
 - PTZCommandTypeDownLeft: 下左
 - PTZCommandTypeDownRight: 下右
 - PTZCommandTypeGotoPreset: 转到预置点
 - PTZCommandTypeAutoCruise: 自动扫描
 */
typedef NS_ENUM(NSUInteger, PTZCommandType) {
    PTZCommandTypeSetPreset = 8,
    PTZCommandTypeZoomIn = 11,
    PTZCommandTypeZoomOut,
    PTZCommandTypeFocusNear,
    PTZCommandTypeFocusFar,
    PTZCommandTypeApertureOpen,
    PTZCommandTypeApertureClose,
    PTZCommandTypeTiltUP = 21,
    PTZCommandTypeTiltDown,
    PTZCommandTypePanLeft,
    PTZCommandTypePanRight,
    PTZCommandTypeUpLeft,
    PTZCommandTypeUpRight,
    PTZCommandTypeDownLeft,
    PTZCommandTypeDownRight,
    PTZCommandTypeAutoCruise,
    PTZCommandTypeGotoPreset = 39
};

/**
 鱼眼安装类型
 
 - FishEyePlaceTypeNone: 不矫正
 - FishEyePlaceTypeWall: 壁装（法线水平）
 - FishEyePlaceTypeFloor: 地面安装（法线向上）
 - FishEyePlaceTypeCeiling: 顶装方式（法线向下）
 */
typedef NS_ENUM(NSInteger, FishEyePlaceType)
{
    FishEyePlaceTypeNone = 0x0,
    FishEyePlaceTypeWall = 0x1,
    FishEyePlaceTypeFloor = 0x2,
    FishEyePlaceTypeCeiling = 0x3
};

/**
 鱼眼矫正类型
 
 - FishEyeCorrectTypeDefault:        默认普通模式
 - FishEyeCorrectTypePTZ:            PTZ模式
 - FishEyeCorrectType180:            180度矫正（对于2P）
 - FishEyeCorrectType360:            360度矫正（对应1P）
 - FishEyeCorrectTypeLat:            纬度拉伸
 - FishEyeCorrectTypeHemisphere:     半球模式
 - FishEyeCorrectTypeCylinder:       圆柱模式
 - FishEyeCorrectTypePlanet:         星球
 - FishEyeCorrectTypeCylinderCut:    圆柱剪开模式
 */
typedef NS_ENUM(NSInteger, FishEyeCorrectType) {
    FishEyeCorrectTypeDefault    = 0x000,
    FishEyeCorrectTypePtz        = 0x100,
    FishEyeCorrectType180        = 0x200,
    FishEyeCorrectType360        = 0x300,
    FishEyeCorrectTypeLat        = 0x400,
    FishEyeCorrectTypeHemisphere = 0x500,
    FishEyeCorrectTypeCylinder   = 0x600,
    FishEyeCorrectTypePlanet     = 0x700,
    FishEyeCorrectTypeCylinderCut= 0x800
};

///对讲状态
typedef NS_ENUM(int, AudioEngineState){
    AudioEngineSuccess = 0,
    /** 语音编码库开启失败 */
    AudioEngineStartFailed = 0x3d10011,
    /** 音频格式不支持 */
    EncodeTypeNotSupport,
    /** 音频引擎打开失败 */
    AudioEngineOpenFailed,
    /** 语音播放模式设置失败 */
    SetAudioPlayModeFailed,
    /** 语音录制模式设置失败 */
    SetAudioRecordModeFailed,
    /** 设置语音数据回调失败 */
    SetAudioDataCallBackFailed,
    /** 语音引擎开启播放失败 */
    AudioEngineStartToPlayFailed,
    /** 语音引擎开启录制失败 */
    AudioEngineStartToRecordFailed,
    /** 语音缓冲区初始化失败 */
    AudioBufferInitFailed,
    /** 语音缓冲区分配内存失败 */
    AudioBufferAllocMemoryFailed,
    /** 设备编码变化 */
    DeviceChangedEncode,
};

/**
 HPSClient错误码定义
 */
typedef NS_ENUM(NSInteger, HPSClientErrorCode) {
    /** 创建socket失败 */
    HPSClientErrorCodeSocketCreateFailed = 0x173EA60,
    /** 设置socket地址重用失败 */
    HPSClientErrorCodeSocketSetReuseAddrFailed,
    /** 生成socket地址失败 */
    HPSClientErrorCodeSocketMakeAddrFailed,
    /** 设置socket缓冲区失败 */
    HPSClientErrorCodeSocketSetBufferSizeFailed,
    /** 绑定socket端口失败 */
    HPSClientErrorCodeSocketBindFailed,
    /** 监听socket失败 */
    HPSClientErrorCodeSocketListenFailed,
    /** 连接socket失败 */
    HPSClientErrorCodeSocketConnectFailed,
    /** socket句柄无效 */
    HPSClientErrorCodeSocketHandleFailed,
    /** 绑定IO完成端口队列失败 */
    HPSClientErrorCodeAsyncIOBindIOQueueFailed,
    /** IOCP发送数据失败 */
    HPSClientErrorCodeAsyncIOSendDataFailed,
    /** IOCP接收数据失败 */
    HPSClientErrorCodeAsyncIOReceDataFailed,
    /** 投递IOCP完成状态失败 */
    HPSClientErrorCodeAsyncIOPostIOStatusFailed,
    /** IOCP接收连接失败 */
    HPSClientErrorCodeAsyncIOAcceptFailed,
    /** 绑定IO完成端口句柄失败 */
    HPSClientErrorCodeAsyncIOBindIOHandleFailed,
    /** 内存申请失败 */
    HPSClientErrorCodeMallocMemoryFailed,
    /** 函数参数无效 */
    HPSClientErrorCodeFuncParamsInvalid,
    /** 功能不支持或未实现 */
    HPSClientErrorCodeFuncNotSupport,
    /** 身份认证token无效 */
    HPSClientErrorCodeIdentifyTokenInvalid,
    /** 会话handle无效 */
    HPSClientErrorCodeSessionHandleInvalid,
    /** URL格式错误 */
    HPSClientErrorCodeURLFormatInvalid,
    /** 数据长度超出限制范围 */
    HPSClientErrorCodeLengthOutLimit,
    /** RTSP协议报文异常 */
    HPSClientErrorCodeRTSPRSPError,
    /** 传输方式无效或不支持（client与server之间） */
    HPSClientErrorCodeTransMethodInvalid,
    /** 埋点库调用异常 */
    HPSClientErrorCodeTraceFuncFailed,
    /** 重复打开传输连接 */
    HPSClientErrorCodeTransRepeatOpenFailed,
    /** 设置socket多播TTL失败 */
    HPSClientErrorCodeTransSocketSetMuliTTLFailed,
    /** 接口参数无效(参数为NULL */
    HPSClientErrorCodeParamsInvalid,
    /** RSA公钥初始化失败 */
    HPSClientErrorCodeRTSPRSAKeyInitFailed,
    /** RSA公钥加密失败 */
    HPSClientErrorCodeRTSPRSAEncryptFailed,
    /** AES公钥加密失败 */
    HPSClientErrorCodeRTSPAESEncryptFailed,
    /** Basic编码失败 */
    HPSClientErrorCodeRTSPBasicEncodeFailed,
    /** 获取随机数失败 */
    HPSClientErrorCodeRTSPGetRandNumFailed,
    /** 异步消息回调异常 */
    HPSClientErrorCodeRTSPAsyncCBException,
    /** RTSP会话状态无效 */
    HPSClientErrorCodeRTSPSessionStateInvalid,
    /** RTSP异步会话信息无效 */
    HPSClientErrorCodeRTSPAsyncInfoInvalid,
    /** 会话配置信息无效 */
    HPSClientErrorCodeRTSPConfigSessionInvalid,
    /** 传输方式无效 */
    HPSClientErrorCodeRTSPTransMethodInvalid,
    /** IP/域名转换IP失败 */
    HPSClientErrorCodeRTSPIpConvertFailed,
    /** 发送DESCRIBE失败 */
    HPSClientErrorCodeRTSPSendDescribeError,
    /** 接收DESCRIBE超时 */
    HPSClientErrorCodeRTSPRecvDescribeTimeOut,
    /** 发送SETUP失败 */
    HPSClientErrorCodeRTSPSendSetupError,
    /** 接收SETUP超时 */
    HPSClientErrorCodeRTSPRecvSetupTimeOut,
    /** 发送PLAY失败 */
    HPSClientErrorCodeRTSPSendPlayError,
    /** 接收PLAY超时 */
    HPSClientErrorCodeRTSPRecvPlayTimeOut,
    /** 发送TEARDOWN失败 */
    HPSClientErrorCodeRTSPSendTearDownError,
    /** 接收TEARDOWN超时 */
    HPSClientErrorCodeRTSPRecvTearDownTimeOut,
    /** 发送OPTIONS失败 */
    HPSClientErrorCodeRTSPSendOptionsError,
    /** 接收OPTIONS超时 */
    HPSClientErrorCodeRTSPRecvOptionsTimeOut,
    /** 发送PAUSE失败 */
    HPSClientErrorCodeRTSPSendPauseError,
    /** 接收PAUSE超时 */
    HPSClientErrorCodeRTSPRecvPauseTimeOut,
    /** 发送FORCEIFRAME失败 */
    HPSClientErrorCodeRTSPSendForceIFrameError,
    /** 接收FORCEIFRAME超时 */
    HPSClientErrorCodeRTSPRecvForceIFrameTimeOut,
    /** 发送SETPARAMETER失败 */
    HPSClientErrorCodeRTSPSendSetParameterError,
    /** 接收SETPARAMETER超时 */
    HPSClientErrorCodeRTSPRecvSetParameterTimeOut,
    /** 异步接收超时 */
    HPSClientErrorCodeRTSPAsyncRecvTimeOut,
    /** 数据接收不完整 */
    HPSClientErrorCodeRTSPRecvNotFull,
    /** 解析RTSP报文失败 */
    HPSClientErrorCodeRTSPParseRTSPFailed,
    /** 心跳超时（client与server之间） */
    HPSClientErrorCodeRTSPHeartBeatTimeOut,
    /** 处理接收到的数据异常 */
    HPSClientErrorCodeRTSPProcRecvDataException,
    /** 获取server端UDP端口失败 */
    HPSClientErrorCodeRTSPGetServerUDPPortFailed,
    /** 创建UDP传输失败 */
    HPSClientErrorCodeRTSPCreateUDPTransFailed,
    /** 创建TCP传输失败 */
    HPSClientErrorCodeRTSPCreateTCPTransFailed,
    /** 开启UDP传输失败 */
    HPSClientErrorCodeRTSPOpenUDPTransFailed,
    /** 开启TCP传输失败 */
    HPSClientErrorCodeRTSPOpenTCPTransFailed,
    /** socket设置失败 */
    HPSClientErrorCodeRTSPSocketSetOptFailed,
    /** 当前服务不是vtm */
    HPSClientErrorCodeRTSPServerNotVTM,
    /** 线程句柄无效 */
    HPSClientErrorCodeRTSPThreadHandleInvalid,
    /** 无可用会话句柄 */
    HPSClientErrorCodeRTSPNoRTSPSession,
    /** 会话句柄已经在句柄队列中 */
    HPSClientErrorCodeRTSPHandleAlreadyInQueue,
    /** 创建异步队列失败 */
    HPSClientErrorCodeRTSPCreateAsyncQueueFailed,
    /** 回调线程出现阻塞 */
    HPSClientErrorCodeStreamCallBackBlock,
    /** 转封装库接口调用失败 */
    HPSClientErrorCodeStreamSysTransFailed,
    /** 获取当前运行路径失败 */
    HPSClientErrorCodeStreamGetCurrentPathFailed,
    /** 文件打开失败 */
    HPSClientErrorCodeStreamFileOpenFailed,
    /** json解析失败 */
    HPSClientErrorCodeStreamJsonParseFailed,
    /** SDP解析失败 */
    HPSClientErrorCodeStreamSDPParseFailed,
    /** SDK未初始化 */
    HPSClientErrorCodeStreamSDKNotInit,
    /** RTSP协议栈未初始化 */
    HPSClientErrorCodeStreamRTSPClientInitFailed,
    /** SDP媒体信息少于等于0 */
    HPSClientErrorCodeStreamMediaAccountLessZero,
    /** 绝对时间转换失败 */
    HPSClientErrorCodeStreamABSTimeError,
    /** buffer长度 */
    HPSClientErrorCodeStreamBufferTooShort,
    /** 多次尝试取流后依旧失败 */
    HPSClientErrorCodeStreamTryTimesFailed
};

/**
 萤石回放源，1-云存储，2-本地录像

 - HatomEZRectypeTypeCloud: 云存储
 - HatomEZRectypeTypeSD: 本地录像
 */
typedef NS_ENUM(NSUInteger, HatomEZRectypeType) {
    HatomEZRectypeTypeCloud = 1,
    HatomEZRectypeTypeSD
};

/**
 流数据类型

 - StreamDataTypeHeader: 头数据
 - StreamDataTypeHBody: body数据
 */
typedef NS_ENUM(NSUInteger, StreamDataType) {
    StreamDataTypeHeader = 1,
    StreamDataTypeBody = 2
};


#endif /* Constrants_h */
