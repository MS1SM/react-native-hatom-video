import { NativeModules } from 'react-native'
import HttpService from './Http'
import Log from "../utils/Log";
import Config from "../utils/Config";

/**
 * 海康国标平台 api
 */
const CLASS_NAME = "HikApi"

// 海康国标平台基础地址
const baseUrl = Config.http.isTest ? Config.http.baseUrl : Config.http.HikUrl

/**
 * 模块地址
 *
 * 模块地址没有域名地址，将自动在前面添加 Config.http.baseUrl
 * 模块地址带有域名地址，将不再使用 Config.http.baseUrl
 */
const modelUrl = {
  artemis: baseUrl + "/artemis/api"
}

// 请求地址
const url = {
  // artemis 模块
  artemis: {
    // token
    token: modelUrl.artemis + "/v1/oauth/token"
  }
}

/**
 * 海康国标平台 post 请求封装
 * 添加 headers.Authorization
 */
function postHik (url, data, accessToken) {
  return new Promise((resolve, reject) => {
    HttpService.post(
      url,
      data,
      {
        access_token: accessToken
      }
    ).then(response => {
      resolve(response)
    }).catch(error => {
      reject(error);
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
      url,
      params,
      {
        access_token: accessToken
      }
    ).then(response => {
      resolve(response);
    }).catch(error => {
      reject(error);
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

