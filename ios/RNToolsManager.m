#import "RNToolsManager.h"
@implementation RNToolsManager

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE(RNToolsManager);
//  对外提供调用方法,Callback
RCT_EXPORT_METHOD(getAppVersion:(RCTResponseSenderBlock)callback)
{
  NSString *version = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"];//获取项目版本号
  callback(@[[NSNull null],version]);
}

@end
