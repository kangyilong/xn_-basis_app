import Fetch from '../fetch';
import {getUserId} from '../util';

// 登录
export function userLogin(params: object) {
  return Fetch('/core/v1/cuser/public/login', params, 'POST', true);
}

// 注册
export function userRegistered(params: object) {
  return Fetch('/core/v1/cuser/public/register', params, 'POST', true);
}

// 用户详情
export function getUserDetail(isShowLoading = false) {
  return Fetch('/core/v1/cuser/my', {}, 'POST', isShowLoading);
}

// 修改个人资料
export function changeUserMsg(params: object) {
  return Fetch('/core/v1/user/edit_profile', params, 'POST', true);
}

//设置支付密码
export function setTradePwd(tradePwd: string, smsCaptcha: string) {
  return Fetch(
    '/core/v1/user/bind_tradePwd',
    {
      tradePwd,
      smsCaptcha,
    },
    'POST',
    true,
  );
}

// 修改支付密码
export async function editTradPwd(newTradePwd: string, smsCaptcha: string) {
  return Fetch(
    '/core/v1/user/bind_tradePwd',
    {
      tradePwd: newTradePwd,
      smsCaptcha,
      userId: await getUserId(),
    },
    'POST',
    true,
  );
}

// 获取验证码 mobile: 630090  email: 630093
export function getSmsCaptcha(code: string, params: object) {
  return Fetch(code, params, 'POST', true);
}

// 找回密码
export function retrievePwd(params: object) {
  return Fetch('/core/v1/user/forget_loginPwd', params, 'POST', true);
}

// 修改登录密码
export async function editLoginPaw(params: object) {
  return Fetch(
    '/core/v1/user/forget_loginPwd',
    {
      ...params,
      userId: await getUserId(),
    },
    'POST',
    true,
  );
}

// 详情查公告
export function noticeDetail(code: string) {
  return Fetch(`/core/v1/sms/detail/${code}`, {}, 'POST', false);
}

// 修改手机
export async function exitPhone(params: object) {
  return Fetch('/core/v1/user/modify_mobile', params, 'POST', true);
}

// 新增银行卡对象
export function bankcardCreate(params: object) {
  return Fetch('/core/v1/bankcard/create', params, 'POST', true);
}

// 修改银行卡对象
export function modifyBankcard(config: object) {
  return Fetch('/core/v1/bankcard/modify', config, 'POST', true);
}

// 查询银行卡对象
export function bankcardDetail(id: string) {
  return Fetch(`/core/v1/bankcard/detail/${id}`, {}, 'POST', true);
}

// 删除银行卡对象
export function bankcardRemove(id: string) {
  return Fetch(`/core/v1/bankcard/remove/${id}`, {}, 'POST', true);
}

// 列表条件查询渠道银行
export function channelBankList(config: object) {
  return Fetch('/core/v1/channel_bank/list', config, 'POST', true);
}

// 列表条件查询银行卡
export async function bankcardList(config = {}) {
  return Fetch(
    '/core/v1/bankcard/list',
    {
      status: '1',
      type: 'C',
      userId: await getUserId(),
      ...config,
    },
    'POST',
    true,
  );
}

// 前端分页条件查询银行卡
export function bankcardPage(isLoading = false) {
  return Fetch(
    '/core/v1/bankcard/page_front',
    {
      status: '1',
      pageSize: 1000,
      pageNum: 1,
    },
    'POST',
    isLoading,
  );
}

// 取现到银行卡
export function withdrawToBankcard(config: object) {
  return Fetch('/core/v1/withdraw/withdrawToBankcard', config, 'POST', true);
}

// 取现
export function withdrawWithdraw(config: object) {
  return Fetch('/core/v1/withdraw/withdraw', config, 'POST', true);
}

// 分页条件查询取现订单
export async function withdrawPage(params: object) {
  return Fetch('/core/v1/withdraw/page', {
    pageNum: 1,
    pageSize: 20,
    applyUser: await getUserId(),
    ...params,
  });
}

// （APP）分页条件查询我的取现订单
export async function withdrawMyPage(params: object) {
  return Fetch('/core/v1/withdraw/my/page', {
    pageNum: 1,
    pageSize: 20,
    ...params,
  });
}

// 分页条件查询账户流水
export async function accountJourPage(params: object) {
  return Fetch('/core/v1/jour/page', {
    pageNum: 1,
    pageSize: 10,
    type: '1',
    userId: await getUserId(),
    ...params,
  });
}

// APP线上充值
export async function chargeOnlineApp(params: object) {
  return Fetch('/core/v1/charge/charge_online_app', params, 'POST', true);
}

// 分页条件查询用户地址
export async function addressPage(params = {}) {
  return Fetch('/core/v1/address/page', {
    status: '1',
    pageSize: 20,
    userId: await getUserId(),
    ...params,
  });
}

// 新增用户地址
export async function addAddress(params = {}) {
  return Fetch('/core/v1/address/create', params, 'POST', true);
}

// 修改用户地址
export async function editAddress(params = {}) {
  return Fetch('/core/v1/address/modify', params, 'POST', true);
}

// 删除用户地址
export async function deleteAddress(id: string) {
  return Fetch(`/core/v1/address/remove/${id}`, {}, 'POST', true);
}

// 用户地址详情
export async function addressDetail(id: string) {
  return Fetch(`/core/v1/address/detail/${id}`, {}, 'POST', true);
}

// app查询用户默认地址
export async function addressDetailDefault() {
  return Fetch('/core/v1/address/detailDefault');
}

// 新增实名认证记录
export function addUserauth(params = {}) {
  return Fetch('/core/v1/record_userauth/create', params, 'POST', true);
}

// App-根据用户查询账户对象
export function accountDetailByUser(currency: string, isLoading = true) {
  return Fetch('/core/v1/account/detailByUser', {currency}, 'POST', isLoading);
}

// 分页条件查询账户流水
export function jourPage(params = {}) {
  return Fetch('/core/v1/jour/page', {
    pageSize: 20,
    ...params,
  });
}

// 分页查询我的账户流水
export function jourMyPage(params = {}, isLoading = false) {
  return Fetch(
    '/core/v1/jour/my/page',
    {
      pageSize: 20,
      ...params,
    },
    'POST',
    isLoading,
  );
}

// 提币申请
export function turnOutApply(params = {}) {
  return Fetch('/core/v1/turn_out/apply', params, 'POST', true);
}

// 查询区块链充值地址
export function xaddressChargeAddress(accountNumber: string) {
  return Fetch(
    '/core/v1/xaddress/charge_address',
    {accountNumber},
    'POST',
    true,
  );
}

// 列表条件查询一卡通账户
export function yktList(params = {}) {
  return Fetch('/core/v1/ykt/app_list', {
    ...params,
    status: '1',
  });
}

// 查询用户一卡通账户总资产
export function detailTotalAmount() {
  return Fetch('/core/v1/ykt/detail_total_amount');
}

// 查询个人愿力值
export function cuserDetailWilling() {
  return Fetch('/core/v1/cuser/detail_willing');
}

// 分页条件查询愿力值记录
export async function recordWillingPage(params = {}) {
  return Fetch('/core/v1/record_willing/page', {
    pageSize: 20,
    userId: await getUserId(),
    ...params,
  });
}

// （APP）转账
export function transferOrder(params = {}) {
  return Fetch('/core/v1/transfer_order/transfer', params, 'POST', true);
}

// （APP）列表查询可转账币种
export function transferCoinList() {
  return Fetch('/core/v1/coin/transfer/list', {}, 'POST', true);
}

// （APP）我的团队统计
export function teamUser(params = {}) {
  return Fetch('/core/v1/user/team_user', params);
}

// （APP）我的直推明细
export function subUserList(params = {}) {
  return Fetch('/core/v1/user/sub_user_list', params);
}

// 修改个人资料
export function userEditProfile(params = {}) {
  return Fetch('/core/v1/user/edit_profile', params, 'POST', true);
}

// app-经纪人设置
export function userAgentMsg(isShowLoading = false) {
    return Fetch('/core/v1/agent/my', {}, 'POST', isShowLoading);
}

// app-实名认证+绑定邀请人
export function toCreateAgent(params = {}) {
    return Fetch('/core/v1/agent/create', params, 'POST', true);
}

// app-已实名未绑定 ---绑定
export function toBindAgent(params = {}) {
    return Fetch('/core/v1/agent/bind', params, 'POST', true);
}

// app-经纪人推荐人查询
export function toFindAgent(params = {}) {
    return Fetch('/core/v1/agent/find_agent', params, 'POST', true);
}