//
//  RNPrimordialVideoManager.m
//  RNHatomVideo
//
//  Created by 刘彬 on 2023/5/6.
//  Copyright © 2023 Facebook. All rights reserved.
//

#import "RNPrimordialVideoManager.h"
#import <React/RCTBridge.h>
#import <React/RCTUIManager.h>
#import <AVFoundation/AVFoundation.h>

@implementation RNPrimordialVideoManager

RCT_EXPORT_MODULE(HikVideo_V2.1.0);

- (UIView *)view
{
  UITextView *textview = [[UITextView alloc] init];
  textview.text = @"ms";
  return textview;
}

@end
