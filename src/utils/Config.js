// 是否打开debug模式，将影响日志的控制台打印
const debug = {
	enable: true
};

let Config = {
	version:    '0.0.1',
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
		// 海康国标地址
		HikUrl: 'https://10.26.0.13:1443',
		// 超时时间
		timeout: 5 * 1000
	}
};

export default Config;
