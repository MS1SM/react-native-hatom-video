import HatomVideo from './src/HatomVideo'
import { SdkVersionEnum, EZPTZCommand, EZPTZAction, EzPtzSpeed, EZVideoLevel } from './src/common';

module.exports.HatomVideo = HatomVideo;
module.exports.SdkVersion = new SdkVersionEnum();
module.exports.EZPTZCommand = new EZPTZCommand();
module.exports.EZPTZAction = new EZPTZAction();
module.exports.EzPtzSpeed = new EzPtzSpeed();
module.exports.EZVideoLevel = new EZVideoLevel();
module.exports.default = HatomVideo;