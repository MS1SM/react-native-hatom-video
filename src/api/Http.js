import axios from 'axios-https-proxy-fix';
import Log from '../utils/Log';
import GlobalConfig from '../utils/GlobalConfig';

const CLASS_NAME = "Http"

const __instance = axios.create({
  baseURL: GlobalConfig.http.baseUrl,
  timeout: GlobalConfig.http.timeout
});

// 请求数据拦截处理
__instance.interceptors.request.use(config => {
  // 当前请求的url
  let url = GlobalConfig.http.baseUrl + config.url
  // 已有基础地址
  if (config.url.slice(0, 4) == "http") {
    url = config.url
  }

  // 信息显示
  Log.info(CLASS_NAME, 'request url', "[" + config.method + "] " + url);
  Log.info(CLASS_NAME, 'request data', config.data);
  if (config.headers && config.headers.Authorization) {
    Log.info(CLASS_NAME, 'request headers.Authorization', config.headers.Authorization)
  }

  return config;

}, error => {
  Log.info(this.CLASS_NAME, "request", JSON.stringify(error))
  return Promise.reject(error);
});

// 请求返回数据拦截处理
__instance.interceptors.response.use(response => {
  // 信息显示
  Log.info(CLASS_NAME, 'response url', "[" + response.config.method + "] " + response.config.url);
  Log.info(CLASS_NAME, 'response data', response.data);

  // 请求正常，返回数据
  return response.data;

}, error => {
  // 请求错误的拦截处理

  // 信息显示
  Log.error(CLASS_NAME, 'response url', "[" + error.config.method + "] " + error.config.url);
  Log.error(CLASS_NAME, 'response reqdata', error.config.data);
  Log.error(CLASS_NAME, 'response _response', error.request._response)
  // 拦截处理，返回请求异常
  const errResp = error.request._response
  return Promise.reject({
    code: errResp.code ? errResp.code : -10000,
    msg: errResp.msg ? errResp.msg : errResp
  });
});

/**
 * param 将要转为URL参数字符串的对象
 * key URL参数字符串的前缀
 * encode true/false 是否进行URL编码,默认为true
 *
 * return URL参数字符串
 */
var urlEncode = function (param, key, encode) {
  if (param == null) return '';
  var paramStr = '';
  var t = typeof (param);
  if (t == 'string' || t == 'number' || t == 'boolean') {
    paramStr += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
  } else {
    for (var i in param) {
      var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
      paramStr += urlEncode(param[i], k, encode);
    }
  }
  return paramStr;
};

/**
 * Http 服务
 *
 * TODO 暂无 delete put 等方法，需要再添加
 *
 * success：返回完整数据，含code，msg，data
 * error：
 */
export default HttpService = {
  /**
   *
   * @param {string} url
   * @param {object} data
   * @param {object} headers
   * @param {object} params
   * @returns {Promise<any> | Promise}
   *
   * 实例
   * HttpService.post('/user', {
      firstName: 'Fred',
      lastName: 'Flintstone'
    })
   .then(function (response) {
      console.log(response);
    })
   .catch(function (error) {
      console.log(error);
    });
   */
  post: (url, data, headers, params) => {
    // 将参数编码到链接中，去除第一位多余的 & 符号
    if (params) {
      url = `${url}?${urlEncode(params).substring(1)}`
    }

    return new Promise((resolve, reject) => {
      __instance({
        method: 'post',
        url,
        data,
        headers
      })
        .then(response => {
          resolve(response);
        }).catch(error => {
          reject(error);
        });
    });
  },

  /**
   * @param {string} url
   * @param {object} params
   * @param {object} headers
   * @returns {Promise<Promise<any> | Promise>}
   * 实例
   * HttpService.get('/user', {
      ID: '1234'
    })
   .then(function (response) {
      console.log(response);
    })
   .catch(function (error) {
      console.log(error);
    });
   */
  get: (url, param, headers) => {
    // 将参数编码到链接中，去除第一位多余的 & 符号
    url = `${url}?${urlEncode(param).substring(1)}`;
    // 请求
    return new Promise((resolve, reject) => {
      __instance({
        method: 'get',
        url,
        headers
      }).then(response => {
        resolve(response);
      }).catch(error => {
        reject(error);
      });
    });
  },

  /**
   *
   * @param httpArray: HttpService的get或是post
   * @returns {Promise<any[]>}
   * HttpService.all([HttpService.get(url1[, params]), HttpService.get(url2[, params])])
   */
  all: (httpArray = []) => {
    if (Object.prototype.toString.call(httpArray).slice(8, -1) != 'Array' || httpArray.length == 0) {
      throw new Error('HttpService all arg error!');
    } else {
      return Promise.all(httpArray);
    }
  },

  asyncPost: async (url, data, headers) => {
    return await new Promise((resolve, reject) => {
      __instance({
        method: 'post',
        url,
        data,
        headers
      }).then(response => {
        resolve(response);
      }).catch(error => {
        reject(error);
      });
    });
  },

  asyncGet: async (url, param, headers) => {
    // 将参数编码到链接中，去除第一位多余的 & 符号
    url = `${url}?${urlEncode(param).substring(1)}`;
    return await new Promise((resolve, reject) => {
      __instance({
        method: 'get',
        url,
        headers
      }).then(response => {
        resolve(response);
      }).catch(error => {
        reject(error);
      });
    });
  },

  asyncAll: async (httpArray = []) => {
    if (Object.prototype.toString.call(httpArray).slice(8, -1) != 'Array' || httpArray.length == 0) {
      throw new Error('HttpService all arg error!');
    } else {
      return await Promise.all(httpArray);
    }
  },
};
