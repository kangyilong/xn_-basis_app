//

yarn install

yarn link

cd ios
pod install

// 添加插件 yarn add -
// 需要 link 的插件都需要到ios目录下执行 pod install

// 项目清除缓存
rm -rf ~/.rncache
rm -rf package-lock.json
sudo rm $TMPDIR/*
sudo rm -rf $TMPDIR/*
watchman watch-del-all
rm -rf yarn.lock node_modules ios/build
yarn install
// 0.6以下
react-native link

cd ios
rm -rf Pods Podfile.lock kcos.xcworkspace
pod install
cd ..
yarn ios

// ios
// 运行模拟器
yarn ios

// XCode打包 手动发布

1、 yarn build-ios
2、xcode -> AppDelegate.m 中 将 (NSURL *)sourceURLForBridge:(RCTBridge *)bridge 中的代码 执行 '打包' 向下代码 // 可忽略
3、ios正常打包发布流程

//  pushy 第一次发布

1、xcode -> AppDelegate.m 中 将 (NSURL *)sourceURLForBridge:(RCTBridge *)bridge 中的代码 执行 '热更新' 向下代码
2、ios正常打包发布流程
3、将.ipa放入 ios/release 目录下
4、执行 yarn release-ios

// pushy 热更新发布

1、pushy bundle --platform ios

// android  mac 调试

adb devices
1、source .bash_profile
2、react-native start
3、adb reverse tcp:8081 tcp:8081
4、yarn android

// android pushy发布 (默认 app-armeabi-v7a-release.apk 包)

执行 yarn release-android

// android pushy 热更新发布

pushy bundle --platform android

// 支付宝支付
https://blog.csdn.net/TanHao8/article/details/104142098
// 微信支付
https://github.com/little-snow-fox/react-native-wechat-lib
