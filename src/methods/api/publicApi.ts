import Fetch from '../fetch';

// 上传图片至七牛云
export function upImageToQiNiu() {
  return Fetch('/auth/v1/common/get_qiniu_token');
}

// 获取阿里token
export function upImageToALI() {
  return Fetch('/core/v1/common/public/get_ali_token');
}

// 根据key获取系统参数
export function getSystemParams(key: string) {
  return Fetch('/core/v1/config/public/list', {key}, 'POST', false);
}

// 根据type获取系统参数
export function getSystemType(type: string, isLoading = false) {
  return Fetch('/core/v1/config/public/list', {type}, 'POST', isLoading);
}

// 列表查寻数据字典
export function getDictList(parentKey: string) {
  return Fetch('/core/v1/dict/public/list', {parentKey});
}

// 前端分页条件查询文章
export function articlePageFront(params: object) {
  return Fetch('/core/v1/article/page_front', {
    ...params,
    pageSize: 10,
  });
}

// 前端列表查询公告
export function smsListFront(type = '1') {
  return Fetch('/core/v1/sms/public/list', {
    type,
    status: '1',
  });
}

// 分页条件查询系统公告
export function smsPageFront(params = {}) {
  return Fetch('/core/v1/sms/public/page', {
    status: '1',
    pageSize: 20,
    ...params,
  });
}

// 分页条件查询站内信
export function znxPageFront(params = {}) {
  return Fetch('/core/v1/sms/user_sms', {
    status: '1',
    pageSize: 20,
    ...params,
  });
}

// 我的团队
export function cuserMyTeam(isLoading = false) {
  return Fetch('/core/v1/cuser/myTeam', {}, 'POST', isLoading);
}

// 前端列表条件查询系统客服
export function customerServiceFront() {
  return Fetch('/core/v1/customerService/list_front');
}

// 列表条件查询取现规则
export function withdrawRule() {
  return Fetch('/core/v1/withdraw_rule/list', {kind: 'C'}, 'POST', true);
}

// 前端列表条件查询导航
export function cnavigateList(location: string) {
  return Fetch(
    '/core/v1/cnavigate/public/list_front',
    {location, sort: 'id'},
    'POST',
    false,
  );
}

// 列表条件查询城市
export function getCityList(config = {}) {
  return Fetch('/core/v1/area/list', config);
}

// 一键已读消息
export function smsReadMessages() {
  return Fetch('/core/v1/sms/unified_read_messages', {}, 'POST', true);
}

// 一键已读公告
export function smsReadNotice() {
  return Fetch('/core/v1/sms/unified_read_notice', {}, 'POST', true);
}

// APP未读消息数
export function smsMessageNumber() {
  return Fetch('/core/v1/sms/unread_messages_number');
}

// APP未读公告数
export function smsNoticeNumber() {
  return Fetch('/core/v1/sms/unread_notice_number');
}
