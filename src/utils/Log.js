import Config from './Config';

const Levels = {
	OFF:    0,
	ERROR:  1,
	WARN:   2,
	INFO:   3,
	DEBUG:  4,
	LOG:    5,
};

export default Log = {
	level:      Config.log.level,
	showTime:   Config.log.showTime,

	spliceLog: function (className, funcName, msg) {
		let tag = `${className}:${funcName}`;
		return [
			this.showTime ? `[${new Date().toJSON()}][${tag}]` : `[${tag}]`,
			msg
		];
	},

	error: function (className, funcName, msg) {
		return ((this.level >= Levels.ERROR)
			&& console.error.apply(console, this.spliceLog(className, funcName, msg)));
	},

	warn: function (className, funcName, msg) {
		return ((this.level >= Levels.WARN)
			&& console.warn.apply(console, this.spliceLog(className, funcName, msg)));
	},

	info: function (className, funcName, msg) {
		return ((this.level >= Levels.INFO)
			&& console.info.apply(console, this.spliceLog(className, funcName, msg)));
	},

	debug: function (className, funcName, msg) {
		return ((this.level >= Levels.DEBUG)
			&& console.debug.apply(console, this.spliceLog(className, funcName, msg)));
	},

	log: function (className, funcName, msg) {
		return ((this.level >= Levels.LOG)
			&& console.log.apply(console, this.spliceLog(className, funcName, msg)));
	},

	trace: function (className, funcName) {
		return this.log(className, funcName, '')
	}
};