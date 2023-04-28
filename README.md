
# react-native-hatom-video

## Getting started

`$ npm install react-native-hatom-video --save`

### Mostly automatic installation

`$ react-native link react-native-hatom-video`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-hatom-video` and add `RNHatomVideo.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNHatomVideo.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.reactlibrary.RNHatomVideoPackage;` to the imports at the top of the file
  - Add `new RNHatomVideoPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-hatom-video'
  	project(':react-native-hatom-video').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-hatom-video/android')
	
	include ':hatom-video-player-2_1_0_nm'
	project(':hatom-video-player-2_1_0_nm').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-hatom-video/android/hatom-video-player-2_1_0_nm')
  	```
	hatom-video-player-2_1_0_nm 为需要用到的所有sdk

3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      implementation project(':react-native-hatom-video')
  	```


## Usage
```javascript
import RNHatomVideo from 'react-native-hatom-video';

// TODO: What to do with the module?
RNHatomVideo;
```
  