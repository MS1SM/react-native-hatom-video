import {requireNativeComponent,View} from 'react-native'

const HatomVideoView = {
   name: "RNHatomVideoView",
   propTypes:{
       ...View.propTypes
   }
}

export default requireNativeComponent('RNHatomVideoView', HatomVideoView)
