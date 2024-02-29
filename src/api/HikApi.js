import { NativeModules } from 'react-native'
import HttpService from './Http'
import Log from "../utils/Log";
import GlobalConfig from '../utils/GlobalConfig';

/**
 * 海康国标平台 api
 */
const TAG = "HikApi"

/**
 * 模块地址
 *
 * 模块地址没有域名地址，将自动在前面添加 GlobalConfig.http.baseUrl
 * 模块地址带有域名地址，将不再使用 GlobalConfig.http.baseUrl
 * 
 * getHikUrl 已赋予域名地址
 */
const modelUrl = {
  video: "/artemis/api/video",
  device: "/artemis/api/ctm01dt/v1/device"
}

/**
 * 请求地址
 * 
 * 注意⚠️
 * 海康服务需要部署在自己的服务器，不像萤石已经提供了公共服务
 * 所以请求地址、请求参数、响应结果可能有所不同
 * 需要根据海康提供的文档自行修改本文件相关配置与代码，再使用 patch-package 记录修改
 */
const url = {
  video: {
    /**
     * 预览 URL
     * https://open.hikvision.com/docs/docId?productId=5c67f1e2f05948198c909700&version=%2F60df74fdc6f24041ac3d2d7f81c32325&tagPath=API列表-视频业务-视频功能
     */
    previewUrl: modelUrl.video + "/v2/cameras/previewURLs",

    /**
     * 对讲 URL
     * https://open.hikvision.com/docs/docId?productId=5c67f1e2f05948198c909700&version=%2F60df74fdc6f24041ac3d2d7f81c32325&tagPath=API列表-视频业务-视频功能#d614fc5f
     */
    talkUrl: modelUrl.video + "/v1/cameras/talkURLs",

    /**
     * 回看 URL
     * https://open.hikvision.com/docs/docId?productId=5c67f1e2f05948198c909700&version=%2F60df74fdc6f24041ac3d2d7f81c32325&tagPath=API列表-视频业务-视频功能#eb47ca72
     */
    playbackUrl: modelUrl.video + "/v2/cameras/playbackURLs",

    /**
     * 云台控制
     * https://open.hikvision.com/docs/docId?productId=5c67f1e2f05948198c909700&version=%2F60df74fdc6f24041ac3d2d7f81c32325&tagPath=API列表-视频业务-视频功能#e30b9484
     */
    ptzControl: modelUrl.video + "/v1/ptzs/controlling",

    /**
     * 设置预置点信息
     * https://open.hikvision.com/docs/docId?productId=5c67f1e2f05948198c909700&version=%2F60df74fdc6f24041ac3d2d7f81c32325&tagPath=API列表-视频业务-视频功能#f0cf5c24
     */
    presetsAddition: modelUrl.video + "/v1/presets/addition",

    /**
     * 查询预置点信息
     * https://open.hikvision.com/docs/docId?productId=5c67f1e2f05948198c909700&version=%2F60df74fdc6f24041ac3d2d7f81c32325&tagPath=API列表-视频业务-视频功能#e4a7676f
     */
    presetsSearches: modelUrl.video + "/v1/presets/searches",

    /**
     * 删除预置点信息
     * https://open.hikvision.com/docs/docId?productId=5c67f1e2f05948198c909700&version=%2F60df74fdc6f24041ac3d2d7f81c32325&tagPath=API列表-视频业务-视频功能#c4281e8b
     */
    presetsDeletion: modelUrl.video + "/v1/presets/deletion",

    /**
     * 批量获取监控点的预置点信息
     */
    presetsGet: modelUrl.video + "/v1/presets/get"
  },

  device: {
    // 全天录像打开
    recordOpen: modelUrl.device + "/configDeviceRecordPlan",
    // 全天录像关闭
    recordClose: modelUrl.device + "/deleteDeviceRecordPlan",
    // 查询是否启用全天录像
    recordStatus: modelUrl.device + "/queryRecordPlanStatus",

    // 获取SD卡状态
    sdStatus: modelUrl.device + "/getSDCardStatus",
    // 格式化SD卡
    format: modelUrl.device + "/formatSDCardStatus",

    // 获取设备版本信息
    getVersionParam: modelUrl.device + "/getVersionParam",

    // 视频画面翻转
    getPictureFlip: modelUrl.device + "/getPictureFlip",
    setPictureFlip: modelUrl.device + "/setPictureFlip",

    // 移动侦测告警音 废弃
    getMotionTrigger: modelUrl.device + "/getMotionTrigger",
    setMotionTrigger: modelUrl.device + "/setMotionTrigger",

    // 移动侦测语音包
    getAudioType: modelUrl.device + "/getAudioType",
    setAudioType: modelUrl.device + "/setAudioType",

    // 获取布防时间计划 入侵检测的时间范围
    getArmingSchedule: modelUrl.device + "/getArmingSchedule",
    // 设置布防时间计划
    setArmingSchedule: modelUrl.device + "/setArmingSchedule",

    // 获取事件检测状态 入侵检测是否开启
    getEventDetect: modelUrl.device + "/event/getConfig",
    // 配置事件检测状态
    setEventDetect: modelUrl.device + "/event/setConfig",
  }
}

/**
 * @returns 完整url
 */
function getHikUrl(url) {
  let baseUrl = GlobalConfig.http.isTest ? GlobalConfig.http.baseUrl : GlobalConfig.http.hikUrl
  return baseUrl + url
}

/**
 * @returns 含有token的请求头
 */
function getHeaders() {
  return {
    access_token: GlobalConfig.http.hikToken
  }
}

/**
 * 请求体完善，添加 设备序列号 和 摄像头序列号
 * @param {object} data 
 * @return {Object} 完善后的数据
 */
function getData(data) {
    if (!data) data = {}
    return Object.assign(
        {}, 
        data, 
        {
            cameraIndexCode: data.cameraIndexCode || GlobalConfig.http.cameraCode,
            channelIndexCode: data.channelIndexCode || GlobalConfig.http.channelCode,
        }
    )
}

/**
 * 请求体完善，添加 设备序列号
 * 需要调用前使用 setGlobalConfig 配置相关属性
 * 
 * @param {Object} data 
 * @return {Object} 完善后的数据
 */
function getBody(data) {
    if (!data) data = {}
    return Object.assign(
        {}, 
        data, 
        {
            gbDeviceCode: data.gbDeviceCode || GlobalConfig.http.hikDeviceCode,
            deviceIndexCode: data.deviceIndexCode || GlobalConfig.http.hikDeviceCode,
            cameraIndexCode: data.cameraIndexCode || GlobalConfig.http.cameraCode,
            channelIndexCode: data.channelIndexCode || GlobalConfig.http.channelCode,
        }
    )
}

/**
 * 海康国标平台 post 请求封装
 * 添加 headers.access_token
 * 
 * 仅成功获取数据才resolve
 */
function postHik(url, data, param) {
  // 尽量避免无意义参数加入
  // 需要注意，data 或 param 需要追加公共参数的话，他们就不得为null
  if (data) data = getData(data)
  if (param) param = getBody(param)

  return new Promise((resolve, reject) => {
    HttpService.post(
      getHikUrl(url),
      data,
      getHeaders(),
      param
    ).then(response => {
      if (response.code == 0) {
        resolve(response.data)
      } else {
        GlobalConfig.callback.hikApiError(response)
        reject(response)
      }

    }).catch(error => {
      let res = {
        code: -10000,
        msg: "请求异常"
      }
      GlobalConfig.callback.hikApiError(res)
      reject(res)
    })
  })
}

/**
 * 海康国标平台 get 请求封装
 * 添加 headers.access_token
 */
function getHik (url, params) {
  return new Promise((resolve, reject) => {
    HttpService.get(
      getHikUrl(url),
      getBody(getData(params)),
      getHeaders()

    ).then(response => {
      if (response.code == 0) {
        resolve(response.data)
      } else {
        GlobalConfig.callback.hikApiError(response)
        reject(response)
      }

    }).catch(error => {
      let res = {
        code: -10000,
        msg: "请求异常"
      }
      GlobalConfig.callback.hikApiError(res)
      reject(res)
    })
  })
}

/**
 * 接口请求
 * 
 * success：返回格式化处理的data，不含msg，code等无用数据
 * error：
 */

/**
 * 获取预览播放串
 * @param {object} data
 * 
 * @param {string} data.cameraIndexCode     "a5a04f5e2c5a4e83a5180545f0cb898f"
 * @param {string} data.protocol?           "rtsp" or "hls" or "rtmp" or "hik"
 * @param {Number} data.streamType?         0:主码流 1:子码流 2:第三码流
 * @param {string} data.expand?             "transcode=1&videtype=h264"
 * @param {Number} data.transmode?          0:UDP 1:TCP
 * @param {string} data.streamform?         "ps"
 * 
 * @return {Promise} resolve
 *  {
      "url": "rtsp://10.2.145.66:655/EUrl/CLJ52BW" 
    }
 */
export function previewUrl(data) {
  return postHik(
    url.video.previewUrl,
    data || {}
  )
}

/**
 * 查询对讲 URL
 * @param {object} data
 * 
 * @param {string} data.cameraIndexCode     "a5a04f5e2c5a4e83a5180545f0cb898f"
 * @param {string} data.expand?             "transcode=1&videtype=h264"
 * @param {Number} data.transmode?          0:UDP 1:TCP
 * @param {string} data.eurlExpand?         扩展字段
 * 
 * @return {Promise} resolve
 *  {
      "url": "rtsp://10.2.145.66:655/EUrl/CLJ52BW" 
    }
 */
export function talkUrl(data) {
  return postHik(
    url.video.talkUrl,
    data || {}
  )
}

/**
 * 回放 URL
 * @param {object} data
 * 
 * @param {string} data.cameraIndexCode     "a5a04f5e2c5a4e83a5180545f0cb898f"
 * @param {Number} data.recordLocation?     0:中心存储 1:设备存储 默认为中心存储
 * @param {string} data.protocol?           "rtsp" or "hls" or "rtmp" or "hik"
 * @param {Number} data.transmode?          0:UDP 1:TCP
 * @param {string} data.beginTime           起始时间，yyyy-MM-dd'T'HH:mm:ss.SSSXXX
 * @param {string} data.endTime             结束时间，yyyy-MM-dd'T'HH:mm:ss.SSSXXX
 * @param {string} data.uuid?               分页查询 id，上一次查询 返回的 uuid，用于继续查 询剩余片段
 * @param {string} data.expand?             "transcode=1&videtype=h264"
 * @param {string} data.streamform?         "ps"
 * @param {Number} data.lockType?           0-查询全部录像;1-查询未锁定录像;2-查询已锁定录像.不传默认值为 0
 * 
 * @return {Promise} resolve
 * {
    "list": [
      {
        // 查询录像的锁定类型，0-全部录像;1-未锁定录像; 2-已锁定录像
        "lockType": 1,
        "beginTime": "2018-08-07T14:44:04.923+08:00", 
        "endTime": "2018-08-07T14:54:18.183+08:00", 
        // 录像片段大小(单位: Byte)
        "size": 66479332
      }
    ],
    "uuid": "e33421g1109046a79b6280bafb6fa5a7", 
    // 取流短 url，注:rtsp 的回放 url 后面要指定 ?playBackMode=1 在 vlc 上才能播放
    "url": "rtsp://10.2.145.66:6304/EUrl/Dib1ErK"
  }
 */
export function playbackUrl(data) {
  return postHik(
    url.video.playbackUrl,
    data || {}
  )
}

/**
 * 云台操作
 * @param {object} data
 * 
 * @param {string} data.cameraIndexCode     "a5a04f5e2c5a4e83a5180545f0cb898f"
 * @param {Number} data.action              0-开始 ，1-停止
 * @param {string} data.command             控制指令
 * @param {Number} data.speed?              云台速度, [1, 100], default = 50
 * @param {Number} data.presetIndex?        预置点编号，通过查询预置点信息接口获取
 */
export function ptzControl(data) {
  return postHik(
    url.video.ptzControl,
    data || {}
  )
}

/**
 * 设置预置点信息
 * @param {object} data
 * 
 * @param {string} data.cameraIndexCode     "a5a04f5e2c5a4e83a5180545f0cb898f"
 * @param {string} data.presetName          预置点名称
 * @param {number} data.presetIndex         预置点编号
 */
export function presetsAddition(data) {
  return postHik(
    url.video.presetsAddition,
    data || {}
  )
}

/**
 * 查询预置点信息
 * @param {object} data
 * @param {string} data.cameraIndexCode     "a5a04f5e2c5a4e83a5180545f0cb898f"
 */
export function presetsSearches(data) {
  return postHik(
    url.video.presetsSearches,
    data || {}
  )
}

/**
 * 删除预置点信息
 * @param {object} data
 * @param {string} data.cameraIndexCode  "a5a04f5e2c5a4e83a5180545f0cb898f"
 * @param {number} data.presetIndex      预置点编号
 */
export function presetsDeletion(data) {
  return postHik(
    url.video.presetsDeletion,
    data || {}
  )
}

/**
 * 批量获取监控点的预置点信息
 * 暂时用不上，不封装到 HatomVideo
 * @param {object} data
 * @param {Array} data.cameraIndexCodes  ["a5a04f5e2c5a4e83a5180545f0cb898f"]
 */
export function presetsGet(data) {
  return postHik(
    url.video.presetsGet,
    data || {}
  )
}

/**
 * 全天录像打开
 * @param {object} data
 * 
 * @param {string} data.gbDeviceCode     设备国标编码
 * @param {Number} data.channelNum       通道号
 */
export function recordOpen(data) {
  return postHik(
    url.device.recordOpen,
    null,
    data || {}
  )
}

/**
 * 全天录像关闭
 * @param {object} data
 * 
 * @param {string} data.gbDeviceCode     设备国标编码
 * @param {Number} data.channelNum       通道号
 */
export function recordClose(data) {
  return postHik(
    url.device.recordClose,
    null,
    data || {}
  )
}

/**
 * 查询是否启用全天录像
 * @param {object} data
 * 
 * @param {string} data.cameraIndexCode   通道号 "a5a04f5e2c5a4e83a5180545f0cb898f"
 * 
 * @return {Promise} resolve true or false
 */
export function recordStatusHik(data) {
  return postHik(
    url.device.recordStatus,
    null,
    data || {}
  )
}

/**
 * 获取SD卡状态
 * @param {object} data
 * 
 * @param {string} data.deviceIndexCode     设备国标编码
 * 
 * @return {Promise} resolve
 * {
		"SDCardStatusInfo": [
			{
        // 存储容量，单位：MB
				"Capacity": 0,
        // 格式化进度（可选）0-100，百分比
				"FormatProgress": 0,
        // 剩余存储容量，单位：MB
				"FreeSpace": 0,
        // SD卡名称
				"HddName": "",
        // SD卡编号
				"ID": 0,
        // 状态，ok-正常，formatting-格式化，unformatted-未格式化，idle-空闲，error-错误
				"Status": ""
			}
		]
	}
 */
export function sdStatus(data) {
  return postHik(
    url.device.sdStatus,
    null,
    data || {}
  )
}

/**
 * 格式化SD卡
 * @param {object} data
 * 
 * @param {string} data.deviceIndexCode     设备国标编码
 * @param {string} data.sDCardId            SD卡编码，该值为0时，对所有存储卡进行格式化
 * 
 * @return {Promise}
 * @return {boolean} resolve 
 * {
	"code": "",
	"data": {
		"softwareVer": "2.800.174I000.0.T 2023-08-30"
	},
	"msg": ""
}
 */
export function formatHik(data) {
  return postHik(
    url.device.format,
    null,
    data || {}
  )
}

/**
 * 获取设备版本信息
 * @param {object} data
 * 
 * @param {string} data.deviceIndexCode     设备国标编码
 * 
 * @return {Promise}
 * @return {boolean} resolve data 操作是否成功
 */
export function getVersionParam(data) {
  return postHik(
    url.device.getVersionParam,
    null,
    data || {}
  )
}

/**
 * 获取画面翻转配置
 * @param {object} data
 * 
 * @param {string} data.deviceIndexCode     设备国标编码
 * @param {string} data.channelIndexCode    设备通道号
 * 
 * @return {Promise}
 * {
    "flipType": 0 // 翻转类型：0-不启用，1-水平镜像（左右翻转），2-上下镜像（上下翻转），3-中心镜像（上下左右都翻转）
  }
 */
export function getPictureFlip(data) {
  return postHik(
    url.device.getPictureFlip,
    null,
    data || {}
  )
}

/**
 * 视频画面翻转配置
 * @param {object} data
 * 
 * @param {string} data.deviceIndexCode     设备国标编码
 * @param {string} data.channelIndexCode    设备通道号
 * @param {number} data.flipType            翻转类型：0-不启用，1-水平镜像（左右翻转），2-上下镜像（上下翻转），3-中心镜像（上下左右都翻转）
 * 
 * @return {Promise}
 */
export function setPictureFlip(data) {
  return postHik(
    url.device.setPictureFlip,
    null,
    data || {}
  )
}

/**
 * 视频移动侦测联动方式获取
 * @param {object} data
 * 
 * @param {string} data.deviceIndexCode     设备国标编码
 * @param {string} data.channelIndexCode    设备通道号
 * 
 * @return {Promise}
 * {
    "sound": 0 // 声音警告，0：不启用，1：启用
  }
 */
export function getMotionTrigger(data) {
  return postHik(
    url.device.getMotionTrigger,
    null,
    data || {}
  )
}

/**
 * 视频移动侦测联动方式设置
 * @param {object} data
 * 
 * @param {string} data.deviceIndexCode     设备国标编码
 * @param {string} data.channelIndexCode    设备通道号
 * @param {number} data.sound               声音警告，0：不启用，1：启用
 * 
 * @return {Promise}
 */
export function setMotionTrigger(data) {
  return postHik(
    url.device.setMotionTrigger,
    null,
    data || {}
  )
}

/**
 * 查询移动侦测联动语音包设置
 * @param {object} data
 * 
 * @param {string} data.deviceIndexCode     设备国标编码
 * 
 * @return {Promise}
 * {
    "audioType": 0 // 声音警告，1：不启用，2：简单提示, 3:强烈提示
  }
 */
export function getAudioType(data) {
  return postHik(
    url.device.getAudioType,
    null,
    data || {}
  )
}

/**
 * 配置移动侦测联动语音包
 * @param {object} data
 * 
 * @param {string} data.deviceIndexCode     设备国标编码
 * @param {number} data.audioType           声音警告，1：不启用，2：简单提示, 3:强烈提示
 * 
 * @return {Promise}
 */
export function setAudioType(data) {
  return postHik(
    url.device.setAudioType,
    null,
    data || {}
  )
}

/**
 * 获取布防时间计划
 * @param {object} data
 * 
 * @param {string} data.channelIndexCode     通道号 报警通道ID
 * @param {number} data.eventType            事件类型。移动侦测是：131331。默认移动侦测
 * 
 * @return {Promise}
 * {
		"TimeBlockList": [
			{
				"dayOfWeek": 1,
				"endTime": "00:00:00",
				"startTime": "23:59:59"
			},
			{
				"dayOfWeek": 2,
				"endTime": "00:00:00",
				"startTime": "23:59:59"
			},
			{
				"dayOfWeek": 3,
				"endTime": "00:00:00",
				"startTime": "23:59:59"
			},
			{
				"dayOfWeek": 4,
				"endTime": "00:00:00",
				"startTime": "23:59:59"
			},
			{
				"dayOfWeek": 5,
				"endTime": "00:00:00",
				"startTime": "23:59:59"
			},
			{
				"dayOfWeek": 6,
				"endTime": "00:00:00",
				"startTime": "23:59:59"
			},
			{
				"dayOfWeek": 7,
				"endTime": "00:00:00",
				"startTime": "23:59:59"
			}
		]
	}
 */
export function getArmingSchedule(data) {
  if (!data) data = {}
  data.eventType = data.eventType || 131331

  return postHik(
    url.device.getArmingSchedule,
    null,
    data || {}
  )
}

/**
 * 设置布防时间计划
 * @param {object} data
 * 
 * @param {Array}  data.TimeBlockList        参考 getArmingSchedule TimeBlockList。默认全天布防护
 * @param {string} data.channelIndexCode     通道号 报警通道ID
 * @param {number} data.eventType            事件类型。移动侦测是：131331。默认移动侦测
 * 
 * @return {Promise}
 */
export function setArmingSchedule(data) {
  if (!data) data = {}
  let timeDefault = [
			{
				"dayOfWeek": 1,
				"endTime": "00:00:00",
				"startTime": "23:59:59"
			},
			{
				"dayOfWeek": 2,
				"endTime": "00:00:00",
				"startTime": "23:59:59"
			},
			{
				"dayOfWeek": 3,
				"endTime": "00:00:00",
				"startTime": "23:59:59"
			},
			{
				"dayOfWeek": 4,
				"endTime": "00:00:00",
				"startTime": "23:59:59"
			},
			{
				"dayOfWeek": 5,
				"endTime": "00:00:00",
				"startTime": "23:59:59"
			},
			{
				"dayOfWeek": 6,
				"endTime": "00:00:00",
				"startTime": "23:59:59"
			},
			{
				"dayOfWeek": 7,
				"endTime": "00:00:00",
				"startTime": "23:59:59"
			}
		]
  data.TimeBlockList = data.TimeBlockList || timeDefault
  data.eventType = data.eventType || 131331

  return postHik(
    url.device.setArmingSchedule,
    data || {},
    null
  )
}

/**
 * 获取事件检测状态 入侵检测是否开启
 * @param {object} data
 * 
 * @param {string} data.channelIndexCode     通道号 报警通道ID
 * @param {number} data.eventType            事件类型。移动侦测是：131331。默认移动侦测
 * 
 * @return {Promise}
 * {
		"channelIndexCode": " bae2f5d2796545a79790868dd685c768",
		"eventType": 131331,
    // status 是否启用。0关闭，1开启。
		"status": 0
	}
 */
export function getEventDetect(data) {
  if (!data) data = {}
  data.eventType = data.eventType || 131331

  return postHik(
    url.device.getEventDetect,
    null,
    data || {}
  )
}

/**
 * 配置事件检测状态
 * @param {object} data
 * 
 * @param {string} data.channelIndexCode     通道号 报警通道ID
 * @param {number} data.eventType            事件类型。移动侦测是：131331。默认移动侦测
 * @param {number} data.enabled              是否启用。0关闭，1开启
 * 
 * @return {Promise}
 */
export function setEventDetect(data) {
  if (!data) data = {}
  data.eventType = data.eventType || 131331

  return postHik(
    url.device.setEventDetect,
    data || {},
    null
  )
}