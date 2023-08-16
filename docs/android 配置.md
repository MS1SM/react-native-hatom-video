# 海康配置

海康使用的是本地sdk依赖，所以需要一些配置

#### Android(大概率需要手动链接)

1. Open up `android/app/src/main/java/[...]/MainActivity.java`

  - Add `import com.reactlibrary.RNHatomVideoPackage;` to the imports at the top of the file
  - Add `new RNHatomVideoPackage()` to the list returned by the `getPackages()` method
  - *MainActivity.java 应该是不需要配置的，如果配置后出现重复添加问题，不配置 （1）即可*

2. Append the following lines to `android/settings.gradle`:

  	```
  	include ':react-native-hatom-video'
  	project(':react-native-hatom-video').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-hatom-video/android')
  	
  	include ':hatom-video-player-2_1_0_np'
  	project(':hatom-video-player-2_1_0_np').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-hatom-video/android/hatom-video-player-2_1_0_np')
  	```
  	hatom-video-player-2_1_0_np 为需要用到的sdk

3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:

  	```
  	  implementation project(':react-native-hatom-video')
  	```

4. 需要在应用的  `android/app/build.gradle` 加入如下代码，避免重复引入库

```
android {
    packagingOptions {
        pickFirst 'lib/arm64-v8a/libc++_shared.so'
        pickFirst 'lib/armeabi-v7a/libc++_shared.so'
    }
}
```

# 萤石配置

萤石使用Gradle依赖，无需额外配置

# 权限

Android 无需配置权限（库已经做好了配置），但需要在使用到权限时动态申请

# 混淆

需要自行配置混淆，未配置但启用混淆将有异常