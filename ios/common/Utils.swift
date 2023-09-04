//
//  Utils.swift
//  RNHatomVideo
//
//  Created by 刘彬 on 2023/9/4.
//  Copyright © 2023 Facebook. All rights reserved.
//

import Foundation

class Utils {
    static let TAG = "Utils"
    // 存储文件夹
    static let FOLDER_RECORD  = "/record"
    static let FOLDER_PICTURE = "/picture"
    // 后缀
    static let SUFFIX_VIDEO     = ".mov"
    static let SUFFIX_PICTURE   = ".png"
    /**
     * 获取文件存储目录
     *
     * @param folder 分类目录，使用本类定义常量
     * @param custom 自定义目录，是分类目录的下级目录，例：aaa/ccc
     */
    class func getSaveFolder(folder: String, custom: String = "") -> String {
        // document
        var saveFolder = NSSearchPathForDirectoriesInDomains(FileManager.SearchPathDirectory.documentDirectory, FileManager.SearchPathDomainMask.userDomainMask, true)[0]
        
        // 分类目录
        saveFolder += folder
        
        // 自定义目录
        if custom.isEmpty {
            saveFolder += "/" + custom
        }
        
        // 创建目录
        let fileManager = FileManager.default
        if !fileManager.fileExists(atPath: saveFolder) {
            if !fileManager.createDirectory(at: saveFolder, withIntermediateDirectories: true) {
                print(TAG, "getSaveFolder", "文件夹创建失败")
            }
        }
        
        return saveFolder
    }
    
    /**
     * 获取视频文件存储文件夹
     * @param custom 自定义目录，视频文件夹下级目录
     */
    class func getRecordFolder(custom: String = "") -> String {
        return getSaveFolder(folder: FOLDER_RECORD, custom: custom)
    }
    
    /**
     * 获取图片文件存储文件夹
     * @param custom 自定义目录，图片文件夹下级目录
     */
    class func getPictureFolder(custom: String = "") -> String {
        return getSaveFolder(folder: FOLDER_PICTURE, custom: custom)
    }
    
    /**
     * 生成文件存储目录
     *
     * @param folder 分类目录，使用本类定义常量
     * @param suffix 文件后缀类型，使用本类定义常量
     * @param custom 自定义目录，folder 下级目录
     */
    class func generateSaveFolder(folder: String, suffix: String, custom: String = "") -> {
        return getSaveFolder(folder: folder, custom: custom) + "/" +  Date().timeIntervalSince1970 * 1000 + suffix
    }
    
    /**
     * 生成视频文件存储路径
     * @param custom 自定义目录，视频文件夹 下级目录
     */
    class func generateRecordPath(custom: String = "") -> {
        return generateSaveFolder(folder: FOLDER_RECORD, suffix: SUFFIX_VIDEO, custom: custom)
    }
    
    /**
     * 生成图片文件存储路径
     * @param custom 自定义目录，图片文件夹 下级目录
     */
    class func generatePicturePath(custom: String = "") -> {
        return generateSaveFolder(folder: FOLDER_PICTURE, suffix: FOLDER_PICTURE, custom: custom)
    }
}
