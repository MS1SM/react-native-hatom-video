package cn.flashtalk.hatom.base

/**
 * ViewManager 应该实现的公共方法
 * 与 VideoImpl 配套使用，而所有实际VideoView应该实现 VideoImpl
 */
interface ManagerImpl<T: VideoImpl> {
    fun setTest(videoImpl: T, value: String)
}