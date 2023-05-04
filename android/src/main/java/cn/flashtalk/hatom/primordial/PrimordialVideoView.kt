package cn.flashtalk.hatom.primordial

import android.content.Context
import android.content.res.AssetFileDescriptor
import android.media.MediaPlayer
import cn.flashtalk.hatom.base.BaseVideoView

/**
 * 使用 Android MediaPlayer 播放器的控件
 */
class PrimordialVideoView(context: Context) : BaseVideoView(context) {
    private val mediaPlayer: MediaPlayer by lazy {
        MediaPlayer()
    }

    /**
     * 初始化SDK
     */
    override fun initSdk() {
        TODO("Not yet implemented")
    }

    /**
     * 初始化播放器
     */
    override fun initPlayer() {
    }

    /**
     * 设置视频配置
     */
    override fun setPlayConfig() {
        TODO("Not yet implemented")
    }

    /**
     * 设置视频播放参数
     * @param path      播放url，用于测试，所以仅支持 assets 文件夹下的视频
     */
    override fun setDataSource(path: String) {
        mediaPlayer.setDisplay(this.holder)
        val fd: AssetFileDescriptor = this.context.assets.openFd(path)
        mediaPlayer.setDataSource(fd.fileDescriptor, fd.startOffset, fd.length)
        mediaPlayer.prepareAsync()
    }

    /**
     * 开始播放
     * 开启视频预览或回放
     */
    override fun start() {
        if (!mediaPlayer.isPlaying) {
            mediaPlayer.start()
        }
    }
}