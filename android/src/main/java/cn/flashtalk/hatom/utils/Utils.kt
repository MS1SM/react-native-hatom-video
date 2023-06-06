package cn.flashtalk.hatom.utils

import android.content.Context

class Utils {
    companion object {
        private const val TAG = "Utils"

        // 文件存储文件夹
        private const val FOLDER = "/hatom"
        // 视频存储文件夹
        private const val FOLDER_RECORD = "$FOLDER/record"

        // 视频后缀
        private const val SUFFIX_VIDEO = ".mp4"

        /**
         * 获取文件存储目录
         *
         * @param folder 分类目录，使用本类定义常量
         */
        private fun getSaveFolder(context: Context, folder: String): String {
            return "${context.externalCacheDir}$folder"
        }

        /**
         * 获取视频文件存储文件夹
         */
        fun getRecordFolder(context: Context): String {
            return getSaveFolder(context, FOLDER_RECORD)
        }

        /**
         * 生成文件存储目录
         *
         * @param folder 分类目录，使用本类定义常量
         * @param suffix 文件后缀类型，使用本类定义常量
         */
        private fun generateSaveFolder(context: Context, folder: String, suffix: String): String {
            return "${getSaveFolder(context, folder)}/${System.currentTimeMillis()}$suffix"
        }

        /**
         * 生成视频文件存储路径
         */
        fun generateRecordPath(context: Context): String {
            return generateSaveFolder(context, FOLDER_RECORD, SUFFIX_VIDEO)
        }
    }
}