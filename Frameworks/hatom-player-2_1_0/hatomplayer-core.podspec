Pod::Spec.new do |s|
  s.name             = 'hatomplayer-core'
  s.version          = '2.1.0'
  s.summary          = 'A short description of hatomplayer-core.'
  s.description      = <<-DESC
TODO: Add long description of the pod here.
                       DESC

  s.homepage         = 'https://github.com/chenmengyi/hatomplayer-core'
  s.license          = { :type => 'MIT', :file => 'LICENSE' }
  s.author           = { 'chenmengyi' => 'chenmengyi@hikvision.com.cn' }
  s.source           = { :git => 'https://github.com/chenmengyi/hatomplayer-core.git', :tag => s.version.to_s }

  s.ios.deployment_target = '8.0'
  s.ios.frameworks  = 'UIKit','Foundation', 'VideoToolbox', 'OpenGLES', 'OpenAL','CoreVideo', 'CoreMedia', 'AudioToolbox', 'GLKit', 'OpenAL', 'SystemConfiguration', 'CoreTelephony','AVFoundation'
  s.library    = 'c++','iconv', 'stdc++.6.0.9', 'bz2', 'z'
    
  s.source_files = 'hatomplayer_core.framework/Headers/*.h'
  s.public_header_files = 'hatomplayer_core.framework/Headers/*.h'
  s.ios.vendored_frameworks = 'hatomplayer_core.framework'

  s.pod_target_xcconfig  = {
    'FRAMEWORK_SEARCH_PATHS'                => '$(inherited) ${PODS_ROOT}/**',
    'LIBRARY_SEARCH_PATHS'                  => '$(inherited) ${PODS_ROOT}/ ${PODS_ROOT}/../',
    'ENABLE_BITCODE'                        => 'NO',
    'OTHER_LDFLAGS'                         => '$(inherited) -ObjC',
    'STRINGS_FILE_OUTPUT_ENCODING'          => 'UTF-8',
    'ONLY_ACTIVE_ARCH'                      => 'NO',
    'CLANG_WARN_OBJC_IMPLICIT_RETAIN_SELF'  => 'NO',
    'CLANG_WARN_STRICT_PROTOTYPES'          => 'NO'
  }

end
