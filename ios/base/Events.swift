//
//  Events.swift
//  RNHatomVideo
//
//  Created by 刘彬 on 2023/7/3.
//  Copyright © 2023 Facebook. All rights reserved.
//

import Foundation

/**
 * 与 js 交互时事件携带的参数
 */
enum EventProp: String {
    /**
     * 是否成功
     * Boolean
     */
    case success = "success"
    
    /**
     * 信息
     * String
     */
    case message = "message"
    
    /**
     * 数据
     * Any
     */
    case data = "data"
    
    /**
     * 编码
     * Int
     */
    case code = "code"
}
