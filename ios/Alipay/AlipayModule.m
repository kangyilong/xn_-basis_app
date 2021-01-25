#import <Foundation/Foundation.h>
#import "AlipayModule.h"
#import <AlipaySDK/AlipaySDK.h>
#import <React/RCTEventDispatcher.h>
#import <React/RCTBridge.h>
#import <React/RCTLog.h>
#import <React/RCTImageLoader.h>

@implementation AlipayMoudle{
  RCTPromiseResolveBlock relustBlock;
}
@synthesize bridge = _bridge;
- (instancetype)init
{
    self = [super init];
    if (self) {
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(handleOpenURL:) name:@"RCTOpenURLNotification" object:nil];
    }
    return self;
}


   RCT_EXPORT_METHOD(pay:(NSString *)orderInfo
    resolver:(RCTPromiseResolveBlock)resolve
    rejecter:(RCTPromiseRejectBlock)reject){
     relustBlock = resolve;
    //应用注册scheme,在AliSDKDemo-Info.plist定义URL types
    NSString *appScheme = @"xfbAlipay";
     if ([NSThread isMainThread]) {
       [[AlipaySDK defaultService] payOrder:orderInfo fromScheme:appScheme callback:^(NSDictionary *resultDic) {
         resolve(resultDic);
       }];
     }else{
       dispatch_async(dispatch_get_main_queue(), ^{
         [[AlipaySDK defaultService] payOrder:orderInfo fromScheme:appScheme callback:^(NSDictionary *resultDic) {
           resolve(resultDic);
         }];
       });
     }
    
 }

- (BOOL)handleOpenURL:(NSNotification *)aNotification
{
    NSString * aURLString =  [aNotification userInfo][@"url"];
  if (![aURLString containsString:@"alisdkdemo"]) {
    return NO;
  }
    NSArray *relustArr = [aURLString componentsSeparatedByString:@"?"];
  if (relustArr.lastObject) {
    NSString *jsonStr = (__bridge_transfer NSString *)CFURLCreateStringByReplacingPercentEscapesUsingEncoding(NULL,(__bridge CFStringRef)relustArr.lastObject,CFSTR(""),CFStringConvertNSStringEncodingToEncoding(NSUTF8StringEncoding));
    NSData *jsonData = [jsonStr dataUsingEncoding:NSUTF8StringEncoding];

    NSDictionary *dict = [NSJSONSerialization JSONObjectWithData:jsonData
                                                        options:NSJSONReadingMutableContainers
                                                          error:nil];
    relustBlock(dict);
  }
  return YES;
}
 
RCT_EXPORT_MODULE(Alipay);
 
@end
