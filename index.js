import HatomVideo from './src/HatomVideo'
import { 
    SdkVersionEnum, 
    EZPTZCommand, 
    EZPTZAction, 
    EzPtzSpeed, 
    EZVideoLevel, 
    EzSwitch, 
    EzMirror, 
    EzAlarm,
    EzSdStatus,
    EzUpgradeStatus,
    HikVideoLevel
} from './src/common';

module.exports.HatomVideo = HatomVideo;
module.exports.SdkVersion = new SdkVersionEnum();

module.exports.EZPTZCommand = new EZPTZCommand();
module.exports.EZPTZAction = new EZPTZAction();
module.exports.EzPtzSpeed = new EzPtzSpeed();
module.exports.EZVideoLevel = new EZVideoLevel();
module.exports.EzSwitch = new EzSwitch();
module.exports.EzMirror = new EzMirror();
module.exports.EzAlarm = new EzAlarm();
module.exports.EzSdStatus = new EzSdStatus();
module.exports.EzUpgradeStatus = new EzUpgradeStatus();
module.exports.HikVideoLevel = new HikVideoLevel();

module.exports.default = HatomVideo;