package cn.flashtalk.hatom.utils

import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors

class TaskManager {

    private var mExecutorService: ExecutorService? = null

    init {
        mExecutorService = Executors.newCachedThreadPool()
    }

    fun submit(task: Runnable?) {
        mExecutorService!!.submit(task)
    }
}