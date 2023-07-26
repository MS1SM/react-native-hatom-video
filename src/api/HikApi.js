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
  artemis: "/artemis/api"
}

// 请求地址
const url = {
  // artemis 模块
  artemis: {
    // token
    token: modelUrl.artemis + "/v1/oauth/token",
    // 视频预览
    preview: modelUrl.artemis + "/ctm01dt/v1/video/preview"
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
 * 海康国标平台 post 请求封装
 * 添加 headers.Authorization
 * 
 * 仅成功获取数据才resolve
 */
function postHik (url, data, accessToken) {
  return new Promise((resolve, reject) => {
    HttpService.post(
      getHikUrl(url),
      data,
      getHeaders()

    ).then(response => {
      if (response.code == 200) {
        resolve(response.data)
      } else {
        reject(response)
      }

    }).catch(error => {
      reject({
        code: -10000,
        msg:  "请求异常"
      });
    })
  })
}

/**
 * 海康国标平台 get 请求封装
 * 添加 headers.Authorization
 */
function getHik (url, params, accessToken) {
  return new Promise((resolve, reject) => {
    HttpService.get(
      getHikUrl(url),
      params,
      getHeaders()

    ).then(response => {
      if (response.code == 200) {
        resolve(response.data)
      } else {
        reject(response)
      }

    }).catch(error => {
      reject({
        code: -10000,
        msg:  "请求异常"
      });
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
 * 获取token
 * @returns {Promise}
 */
export function getToken () {
  return postHik(
    url.artemis.token
  ).then(data => {
    return Promise.resolve(data)
  })
}

/**
 * get 测试接口
 * @param abandon 第一个参数
 * @param banana 第二个参数
 * @param country 第三个参数
 * @returns {Promise}
 */
export function getTest (abandon, banana, country) {
  return getHik(
    url.artemis.token,
    { abandon, banana, country },
    "8848"
  ).then(data => {
    return Promise.resolve(data.data)
  })
}

/**
 * 获取预览播放串
 * @param {object} data
 * 
 * @param {string} data.indexCode     "a5a04f5e2c5a4e83a5180545f0cb898f"
 * @param {string} data.protocol      "rtsp" or "hls"
 * @param {number} data.streamType    0
 * @param {string} data.expand        "transcode=1&videtype=h264"
 */
export function preview(data) {
  return postHik(
    url.artemis.preview,
    data
  )
}