#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>
#import "WXApi.h"
#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate, WXApiDelegate>

@property (nonatomic, strong) UIWindow *window;

@end

@interface RNToolsManager : NSObject <RCTBridgeModule>

@end
