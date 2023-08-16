# 海康配置

海康使用的是本地sdk依赖，所以需要一些配置

#### iOS(大概率不需要手动链接，所以以下内容大概率不需要操作，留作参考)

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-hatom-video` and add `RNHatomVideo.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNHatomVideo.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<



#### ios需要的额外配置（必须进行配置，否则会有类似错误：Undefined symbol: _OBJC_CLASS_$_HatomPlayerSDK）

依赖要用到的海康威视frameworks

1. Xcode -> Pods（单击左侧文件树） -> TARGETS -> RNHatomVideo -> Build Settings -> Search Paths -> Framework Search Paths

   `$(PROJECT_DIR)/../../node_modules/react-native-hatom-video/Frameworks/hatom-player-2_1_0`

   其中hatom-player-2_1_0 为需要使用的版本，已默认添加 hatom-player-2_1_0 版本

   如需修改，请用 **patch-package** 记录修改内容，修改位置为：node_modules/react-native-hatom-video/RNHatomVideo.podspec -> s.pod_target_xcconfig -> FRAMEWORK_SEARCH_PATHS 修改后面的 value 值

2. Xcode -> 你的项目名（单击左侧文件树） -> TARGETS -> 你的项目（ios项目是第一个，tvos是第三个） -> General -> Frameworks, Libraries, and Embedded Content -> + -> Add Other -> Add Files

   找到：

   `$(PROJECT_DIR)/../../node_modules/react-native-hatom-video/Frameworks/hatom-player-2_1_0/hatomplayer_core.framework`

   添加：

   hatomplayer_core.framework

   其中hatom-player-2_1_0 为实际需要使用的版本，与第一步配置相同

3. Xcode -> 你的项目名（单击左侧文件树） -> TARGETS -> 你的项目（ios项目是第一个，tvos是第三个） -> Build Settings -> Search Paths -> Framework Search Paths

   添加：

   `$(PROJECT_DIR)/../node_modules/react-native-hatom-video/Frameworks/hatom-player-2_1_0`

   其中hatom-player-2_1_0 为实际需要使用的版本，与第一步配置相同

# 萤石配置

需要在 `PROJECT_DIR -> ios -> Podfile -> 对应target`  配置

```
pod 'EZOpenSDK', '~> 5.3' 
```

需要配置权限，详情参考萤石文档 https://open.ys7.com/help/43

# 权限

ios 需要配置权限

详情参考相关库使用到的具体权限

萤石权限可参考`ios/Info.plist`

配网需要

```
Xcode -> Targets -> Signing&Capabilities -> Capability
1. Access WiFi Information（这个权限需要苹果开发证书）
2. BackGround Modes
```

# 混淆

需要自行配置混淆，未配置但启用混淆将有异常

# 注意⚠️

ios，使用了海康威视库，该库未实现x86_64，所以不支持虚拟机运行。

报错：`Undefined symbols for architecture x86_64 和 Undefined symbol: _OBJC_CLASS_$_HatomPlayerSDK`