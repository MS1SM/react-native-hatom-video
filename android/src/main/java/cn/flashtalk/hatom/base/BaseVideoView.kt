package cn.flashtalk.hatom.base

import android.content.Context
import android.util.Log
import android.view.SurfaceView

/**
 * VideoView 的基类
 */
abstract class BaseVideoView(context: Context) : SurfaceView(context), VideoImpl {
    override fun setTest(value: String) {
        Log.d(TAG, "setTest: $value")
    }

    companion object {
        private const val TAG = "BaseVideoView"
    }
}