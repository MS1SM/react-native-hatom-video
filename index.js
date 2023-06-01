import HatomVideo from './src/HatomVideo'
import { SdkVersionEnum, EZPTZCommand, EZPTZAction, EzPtzSpeed } from './src/common';

module.exports.HatomVideo = HatomVideo;
module.exports.SdkVersion = new SdkVersionEnum();
module.exports.EZPTZCommand = new EZPTZCommand();
module.exports.EZPTZAction = new EZPTZAction();
module.exports.EzPtzSpeed = new EzPtzSpeed();
module.exports.default = HatomVideo;