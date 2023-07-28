import { NativeModules } from 'react-native'
import HttpService from './Http'
import Log from "../utils/Log";
import GlobalConfig from '../utils/GlobalConfig';

/**
 * 萤石 api
 */
const TAG = "EzvizApi"

/**
 * 模块地址
 *
 * 模块地址没有域名地址，将自动在前面添加 GlobalConfig.http.baseUrl
 * 模块地址带有域名地址，将不再使用 GlobalConfig.http.baseUrl
 * 
 * getEzvizUrl 已赋予域名地址
 */
const modelUrl = {
    // 设备
    device: "/api/lapp/device",
    // otap
    otap: "/api/v3/otap"
}

// 请求地址
const url = {
    // 设备 模块
    device: {
        /**
         * 单个设备信息
         * 在线状态、设备布撤防状态、是否加密、告警声音模式
         * https://open.ys7.com/help/1479
         */
        info: modelUrl.device + "/info",

        /**
         * 设备状态信息
         * sd硬盘数量
         * https://open.ys7.com/help/1480
         */
        status: modelUrl.device + "/status/get",
        
        /**
         * 镜像翻转
         * https://open.ys7.com/help/681
         */
        mirror: modelUrl.device + "/ptz/mirror",
        
        /**
         * 设备撤/布防
         * https://open.ys7.com/help/701
         */
        defence: modelUrl.device + "/defence/set",
        
        /**
         * 开启视频加密（即验证码）
         * https://open.ys7.com/help/698
         */
        encryptOn: modelUrl.device + "/encrypt/on",
        
        /**
         * 关闭视频加密（即验证码）
         * https://open.ys7.com/help/697
         */
        encryptOff: modelUrl.device + "/encrypt/off",
        
        /**
         * 全天录像
         * https://open.ys7.com/help/713
         */
        recordSet: modelUrl.device + "/fullday/record/switch/set",
        
        /**
         * 全天录像开关状态
         * https://open.ys7.com/help/712
         */
        recordStatus: modelUrl.device + "/fullday/record/switch/status",
        
        /**
         * 设备版本
         * https://open.ys7.com/help/734
         */
        version: modelUrl.device + "/version/info",
        
        /**
         * 告警音
         * https://open.ys7.com/help/717
         */
        sound: modelUrl.device + "/alarm/sound/set"
    },

    // otap 模块
    otap: {
        /**
         * 格式化指定本地硬盘
         * https://open.ys7.com/help/862
         */
        format: modelUrl.otap + "/action/{deviceSerial}/Default/0/HDD/FormatSpecifyHDD"
    }
}

/**
 * @returns 完整url
 */
function getEzvizUrl(url) {
    let baseUrl = GlobalConfig.http.isTest ? GlobalConfig.http.baseUrl : GlobalConfig.http.ezvizUrl
    return baseUrl + url
}

/**
 * @returns 含有token的请求头
 */
function getHeaders() {
    return {
        accessToken: GlobalConfig.http.ezvizToken
    }
}

/**
 * 请求体完善，添加 token and serial
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
            accessToken: GlobalConfig.http.ezvizToken,
            deviceSerial: GlobalConfig.http.ezvizSerial
        }
    )
}

/**
 * 萤石 post 请求封装
 * 
 * 仅成功获取数据才resolve
 * 
 * @return {Promise} 
 * 
 * @return {Object} resolve data
 * 
 * @return {Object} reject
 * @return {Number} error.code
 * @return {String} error.msg
 */
function postEzviz (url, data) {
    return new Promise((resolve, reject) => {
        HttpService.post(
            getEzvizUrl(url),
            {},
            {},
            getBody(data)
        )
        .then(response => {
            if (response.code == 200) {
                resolve(response.data)
            } else {
                reject(response)
            }
        })
        .catch(error => {
            reject({
                code: -10000,
                msg:  "请求异常"
            });
        })
    })
}

/**
 * 萤石 get 请求封装
 * 
 * 仅成功获取数据才resolve
 * 
 * @return {Promise} 
 * 
 * @return {Object} resolve data
 * 
 * @return {Object} reject error
 * @return {Number} error.code
 * @return {String} error.msg
 */
function getEzviz (url, params) {
    return new Promise((resolve, reject) => {
        HttpService.get(
            getEzvizUrl(url),
            getBody(params)
        )
        .then(response => {
            if (response.code == 200) {
                resolve(response.data)
            } else {
                reject(response)
            }
        })
        .catch(error => {
            reject({
                code: -10000,
                msg:  "请求异常"
            });
        })
    })
}

/**
 * 萤石 meta put 请求封装
 * 
 * 仅成功获取数据才resolve
 * 
 * @return {Promise} 
 * 
 * @return {Object} resolve data
 * 
 * @return {Object} reject error
 * @return {Number} error.code
 * @return {String} error.msg
 */
function putMeta (url, data, params, variables) {
    return new Promise((resolve, reject) => {
        HttpService.put(
            getEzvizUrl(url),
            getBody(data),
            getHeaders(),
            params,
            getBody(variables)
        )
        .then(response => {
            let meta = response.meta
            if (meta.code == 200) {
                resolve(response.meta.moreInfo)
            } else {
                meta.msg = meta.message
                reject(meta)
            }
        })
        .catch(error => {
            reject({
                code: -10000,
                msg:  "请求异常"
            });
        })
    })
}


/**
 * 全天录像开关状态
 * 
 * @return {Promise}
 * @return {Object} resolve data
 * @return {String} data.deviceSerial
 * @return {Number} data.channelNo
 * @return {Number} data.enable  状态：0-关闭，1-开启
 * 
 */
export function recordStatus() {
    return postEzviz(
        url.device.recordStatus
    )
}

/**
 * 全天录像
 * @param {object} data
 * @param {Number} data.enable     状态：0-关闭，1-开启
 * @param {Number} data.channelNo  通道号，不传表示设备本身
 */
export function recordSet(data) {
    return postEzviz(
        url.device.recordSet,
        data
    )
}

/**
 * 设备信息
 * 单个设备信息：设备布撤防状态、是否加密、告警声音模式等
 * 
 * @return {Promise}
 * 
 * @return {Object} resolve data
 * @return {Number} data.defence        具有防护能力的设备布撤防状态：0-睡眠，8-在家，16-外出，普通IPC布撤防状态：0-撤防，1-布防
 * @return {Number} data.isEncrypt      是否加密：0-不加密，1-加密
 * @return {Number} data.alarmSoundMode 告警声音模式：0-短叫，1-长叫，2-静音
 */
export function info() {
    return postEzviz(
        url.device.info
    )
}

/**
 * 设备状态
 * sd卡信息等
 * @param {object} data
 * @param {Number} data.channel?    通道号,默认为1
 * 
 * @return {Promise}
 * @return {Object} resolve data
 * @return {Number} data.diskNum        挂载的sd硬盘数量,-1:设备没有上报或者设备不支持该状态
 * @return {String} data.diskState      sd硬盘状态:0:正常;1:存储介质错;2:未格式化;3:正在格式化;返回形式:一个硬盘表示为"0---------------",两个硬盘表示为"00--------------",以此类推;-1:设备没有上报或者设备不支持该状态
 * @return {Number} data.firstDiskState 第一个sd硬盘状态，状态type同上
 */
export function status(data) {
    return postEzviz(
        url.device.status,
        data
    ).then(data => {
        // 数据处理
        return new Promise((resolve, reject) => {
            // 提取第一个sd卡状态
            let firstDiskState = data.diskState.charAt(0)
            if (firstDiskState == '-') {
                firstDiskState = -1
            }
            data.firstDiskState = firstDiskState

            resolve(data)
        })
    })
}

/**
 * 镜像翻转
 * @param {object} data
 * @param {Number} data.channelNo   通道号
 * @param {Number} data.command     镜像方向：0-上下, 1-左右, 2-中心
 */
export function mirror(data) {
    return postEzviz(
        url.device.mirror,
        data
    )
}

/**
 * 格式化指定本地硬盘
 */
export function format() {
    return putMeta(
        url.otap.format
    )
}

/**
 * 设备撤/布防
 * @param {object} data
 * @param {Number} data.isDefence   具有防护能力设备布撤防状态：0-睡眠，8-在家，16-外出，普通IPC设备布撤防状态：`0-撤防，1-布防
 */
export function defence(data) {
    return postEzviz(
        url.device.defence,
        data
    )
}

/**
 * 开启设备视频加密
 */
export function encryptOn() {
    return postEzviz(
        url.device.encryptOn
    )
}

/**
 * 关闭设备视频加密
 */
export function encryptOff() {
    return postEzviz(
        url.device.encryptOff
    )
}

/**
 * 获取设备版本信息
 * 
 * @return {Promise}
 * @return {Object} resolve data
 * @return {String} data.currentVersion
 */
export function version() {
    return postEzviz(
        url.device.version
    )
}

/**
 * 设置告警声音模式
 * @param {object} data
 * @param {Number} data.type   声音类型：0-短叫，1-长叫，2-静音
 */
export function sound(data) {
    return postEzviz(
        url.device.sound,
        data
    )
}