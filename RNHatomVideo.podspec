
Pod::Spec.new do |s|
  s.name         = "RNHatomVideo"
  s.version      = "1.0.0"
  s.summary      = "RNHatomVideo"
  s.description  = <<-DESC
                  RNHatomVideo
                   DESC
  s.homepage     = "https://github.com/MS1SM/react-native-hatom-video"
  s.license      = "MIT"
  # s.license      = { :type => "MIT", :file => "FILE_LICENSE" }
  s.author             = { "ms" => "2623237650@qq.com" }
  s.platform     = :ios, "7.0"
  s.source       = { :git => "https://github.com/MS1SM/react-native-hatom-video.git", :tag => "master" }
  s.source_files  = "ios/**/*.{h,m,swift}"
  s.requires_arc = true

  s.dependency "React"
  #s.dependency "others"
  
  s.pod_target_xcconfig  = {
      'FRAMEWORK_SEARCH_PATHS'                => '$(PROJECT_DIR)/../../node_modules/react-native-hatom-video/Frameworks/hatom-player-2_1_0 $(PROJECT_DIR)/../../ios/Pods/EZOpenSDK/dist/EZOpenSDK/dynamicSDK'
    }

end

  