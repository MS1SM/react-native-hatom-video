# react-native-hatom-video

## 简介

包含 海康（支持所有国标设备）与 萤石 的 RN 库。封装了 ios 与 android 的大部份实用功能。

### 实现的功能

| 海康-国标                    |                            |
| ---------------------------- | -------------------------- |
| **SDK功能** 封装 sdk         | **API功能** 封装 http 接口 |
| 预览对讲：播放暂停           |                            |
| SD卡回放：播放暂停、倍速进度 |                            |
| 本地录像、实时截图           |                            |
| 声音控制、清晰度切换         |                            |
| 流量监听                     |                            |

| 萤石                           |                            |
| ------------------------------ | -------------------------- |
| **SDK功能 ** 封装 sdk          | **API功能** 封装 http 接口 |
| 预览对讲：播放暂停、验证码配置 | 设备信息                   |
| SD卡回放：播放暂停、倍速进度   | 设备状态                   |
| 本地录像、实时截图             | 镜像翻转                   |
| 云台控制                       | 设备撤/布防                |
| 声音控制、清晰度切换           | 视频加密（即验证码）管理   |
| 流量监听                       | 全天录像管理               |
| wifi配置                       | 设备固件管理               |
| 查询设备信息                   | 告警音设置                 |



## Getting started

~~`$ npm install react-native-hatom-video --save`~~

### 暂未上传npm，建议使用

`yarn add https://github.com/MS1SM/react-native-hatom-video.git#main`

### 如果用的是直接下载的本地包引入

注意 node_modules 内的 react-native-hatom-video 应该是复制包，而不是引用包（引用包打开的是本地源文件，而不是复制一份的文件）。如果是引用包会报错找不到 react-native-hatom-video 包。

注意 `project root/node_modules/react-native-hatom-video/node_modules` 最多只能有 react-native 文件夹，否则会出现不断刷日志且应用启动失败的问题，其中安卓端的异常信息和发送某个事件相关。此时可以直接删除  `project root/node_modules/react-native-hatom-video/node_modules`  node_modules 文件夹解决

## 文档

### 配置

因为同时支持海康与萤石，即使仅需要使用海康或萤石一个平台，也需要同时配置海康与萤石两个平台的依赖

#### [Android 配置](./docs/android 配置.md)

#### [iOS 配置](./docs/ios 配置.md)

### 使用

#### [接口](./docs/接口.md)

#### [样例](./example)