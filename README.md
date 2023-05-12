
# react-native-hatom-video

## Getting started

`$ npm install react-native-hatom-video --save`

### Mostly automatic installation

`$ react-native link react-native-hatom-video`

### Manual installation


#### iOS(大概率不需要手动链接)

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-hatom-video` and add `RNHatomVideo.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNHatomVideo.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

### ios需要的额外配置（必须进行配置，否则会有类似错误：Undefined symbol: _OBJC_CLASS_$_HatomPlayerSDK）

依赖要用到的海康威视frameworks

1. Xcode -> Pods（单击左侧文件树） -> TARGETS -> RNHatomVideo -> Build Settings -> Search Paths -> Framework Search Paths

   $(PROJECT_DIR)/../../node_modules/react-native-hatom-video/Frameworks/hatom-player-2_1_0

   其中hatom-player-2_1_0 为需要使用的版本，已默认添加 hatom-player-2_1_0 版本

   如需修改，请用 **patch-package** 记录修改内容，修改位置为：node_modules/react-native-hatom-video/RNHatomVideo.podspec -> s.pod_target_xcconfig -> FRAMEWORK_SEARCH_PATHS 修改后面的 value 值

2. Xcode -> 你的项目名（单击左侧文件树） -> TARGETS -> 你的项目（ios项目是第一个，tvos是第三个） -> General -> Frameworks, Libraries, and Embedded Content -> + -> Add Other -> Add Files

   找到：

   $(PROJECT_DIR)/../../node_modules/react-native-hatom-video/Frameworks/hatom-player-2_1_0/hatomplayer_core.framework

   添加：

   hatomplayer_core.framework

   其中hatom-player-2_1_0 为实际需要使用的版本，与第一步配置相同

3. Xcode -> 你的项目名（单击左侧文件树） -> TARGETS -> 你的项目（ios项目是第一个，tvos是第三个） -> Build Settings -> Search Paths -> Framework Search Paths

   添加：

   $(PROJECT_DIR)/../node_modules/react-native-hatom-video/Frameworks/hatom-player-2_1_0

   其中hatom-player-2_1_0 为实际需要使用的版本，与第一步配置相同

#### Android(大概率需要手动链接)

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
  	hatom-video-player-2_1_0_nm 为需要用到的sdk

3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:

  	```
  	  implementation project(':react-native-hatom-video')
  	```


## Usage
```javascript
import { HatomVideo, SdkVersion } from 'react-native-hatom-video';

render() {
        return (
          <HatomVideo
            ref={(view) => this.hatomVideo = view}
            style={{height:200, width: 500}}
            sdkVersion={SdkVersion.PrimordialVideo}
          ></HatomVideo>
          );
    }
```

注意⚠️

ios，使用了海康威视库，该库未实现x86_64，所以不支持虚拟机运行。

报错：Undefined symbols for architecture x86_64 和 Undefined symbol: _OBJC_CLASS_$_HatomPlayerSDK