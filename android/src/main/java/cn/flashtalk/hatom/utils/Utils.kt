package cn.flashtalk.hatom.utils

import android.content.Context
import android.os.Environment
import android.text.TextUtils
import android.util.Log
import java.io.File


class Utils {
    companion object {
        private const val TAG = "Utils"

        // 文件存储文件夹
        private const val FOLDER = "/hatom"
        // 视频存储文件夹
        private const val FOLDER_RECORD = "$FOLDER/record"
        // 图片存储文件夹
        private const val FOLDER_PICTURE = "$FOLDER/picture"

        // 视频后缀
        private const val SUFFIX_VIDEO = ".mp4"
        // 图片后缀
        private const val SUFFIX_PICTURE = ".jpg"

        /**
         * 获取文件存储目录
         *
         * @param folder 分类目录，使用本类定义常量
         * @param custom 自定义目录，是分类目录的下级目录，例：aaa/ccc
         */
        private fun getSaveFolder(context: Context, folder: String, custom: String? = ""): String {
            // 目录
            var saveFolder = "${Environment.getExternalStorageDirectory().path}$folder"
            // 自定义目录
            if (!TextUtils.isEmpty(custom)) {
                saveFolder = "$saveFolder/$custom"
            }
            // 创建目录
            val directory = File(saveFolder)
            if (!directory.exists()) {
                if (!directory.mkdirs()) {
                    Log.e(TAG, "文件夹创建失败")
                }
            }
            // 返回目录
            return saveFolder
        }

        /**
         * 获取视频文件存储文件夹
         * @param custom 自定义目录，视频文件夹下级目录
         */
        fun getRecordFolder(context: Context, custom: String? = ""): String {
            return getSaveFolder(context, FOLDER_RECORD, custom)
        }

        /**
         * 获取图片文件存储文件夹
         * @param custom 自定义目录，图片文件夹下级目录
         */
        fun getPictureFolder(context: Context, custom: String? = ""): String {
            return getSaveFolder(context, FOLDER_PICTURE, custom)
        }

        /**
         * 生成文件存储目录
         *
         * @param folder 分类目录，使用本类定义常量
         * @param suffix 文件后缀类型，使用本类定义常量
         * @param custom 自定义目录，folder 下级目录
         */
        private fun generateSaveFolder(context: Context, folder: String, suffix: String, custom: String? = ""): String {
            return "${getSaveFolder(context, folder, custom)}/${System.currentTimeMillis()}$suffix"
        }

        /**
         * 生成视频文件存储路径
         * @param custom 自定义目录，视频文件夹 下级目录
         */
        fun generateRecordPath(context: Context, custom: String? = ""): String {
            return generateSaveFolder(context, FOLDER_RECORD, SUFFIX_VIDEO, custom)
        }

        /**
         * 生成图片文件存储路径
         * @param custom 自定义目录，图片文件夹 下级目录
         */
        fun generatePicturePath(context: Context, custom: String? = ""): String {
            return generateSaveFolder(context, FOLDER_PICTURE, SUFFIX_PICTURE, custom)
        }

        // 萤石部份操作需要加保护，规避CAS库小概率出现的10S死锁导致的ANR问题
        private var ezvizTaskManager: TaskManager? = null
        @Synchronized
        fun getEzvizTaskManager(): TaskManager {
            if (ezvizTaskManager == null) {
                ezvizTaskManager = TaskManager()
            }

            return ezvizTaskManager!!
        }
    }
}