// 是否打开debug模式，将影响日志的控制台打印
const debug = {
	enable: true
};

// 全局配置，不是静态配置，将会修改，注意应当实时获取使用
let GlobalConfig = {
	debug:      debug,

    // 日志控制
	log: {
        // TODO MS 23.4.4 开发阶段日志全面打开
		level:      debug.enable ? 5 : 5,
		showTime:   true
	},

    // http 默认配置
	http: {
		// 是否启用测试地址
		isTest: true,
		// 基础地址，用于测试地址
		baseUrl: 'http://192.168.1.101:4523/m1/2947114-0-default',
		// 超时时间
		timeout: 5 * 1000,

		// 海康国标地址
		hikUrl: 'https://10.26.0.13:1443',
		// token
		hikToken: "",

		// 萤石地址
		ezvizUrl: 'https://open.ys7.com',
		// token
		ezvizToken: "",
		// 设备序列号
		ezvizSerial: ""
	},

	// sdk 配置
	sdk: {
		version: "EzvizVideo"
	}
};

export default GlobalConfig;

/**
 * 设置配置
 * 参数皆可为空，未配置的使用默认配置
 * 不建议直接调用本函数，请使用 HatomVideo.setGlobalConfig 调用
 */
export function setGlobalConfig(config) {
	if (!config) return

	// http
	if (config.http) {
		if (config.http.hasOwnProperty("isTest")) GlobalConfig.http.isTest = config.http.isTest
		// 其他参数
		GlobalConfig.http.baseUrl     = config.http.baseUrl  || GlobalConfig.http.baseUrl
		GlobalConfig.http.timeout     = config.http.timeout  || GlobalConfig.http.timeout

		GlobalConfig.http.hikUrl      = config.http.hikUrl   || GlobalConfig.http.hikUrl
		GlobalConfig.http.hikToken    = config.http.hikToken || GlobalConfig.http.hikToken
		
		GlobalConfig.http.ezvizUrl    = config.http.ezvizUrl   || GlobalConfig.http.ezvizUrl
		GlobalConfig.http.ezvizToken  = config.http.ezvizToken || GlobalConfig.http.ezvizToken
		GlobalConfig.http.ezvizSerial = config.http.ezvizSerial || GlobalConfig.http.ezvizSerial
	}

	// 日志
	if (config.log) {
		if (config.log.hasOwnProperty("showTime")) GlobalConfig.log.showTime = config.log.showTime
		// 其他参数
		GlobalConfig.log.level = config.log.level  || GlobalConfig.log.level
	}

	// sdk
	if (config.sdk) {
		GlobalConfig.sdk.version = config.sdk.version  || GlobalConfig.sdk.version
	}
}