import Fetch from '../fetch';

// app查询银杏宝界面
export function yxbabyApp(isLoading = false) {
  return Fetch('/core/v1/yxbaby/appPage', {}, 'POST', isLoading);
}

// 分页查询：基金会银杏宝
export function yxbabyAppPage(params = {}, isShow = false) {
  return Fetch(
    '/core/v1/yxbaby/app_yxBaby_page',
    {
      pageSize: 20,
      pageNum: 1,
      ...params,
    },
    'POST',
    isShow,
  );
}

// app赎回
export function yxbabyRedeem(params = {}) {
  return Fetch('/core/v1/yxbaby/app_redeem', params, 'POST', true);
}

// 转入矿场
export function yxbabyInvestment(params = {}) {
  return Fetch('/core/v1/yxbaby/investment_mine', params, 'POST', true);
}

// 分页查询：基金会-质押NAT
export function yxbabyPledgeNat(params = {}, isShow = false) {
  return Fetch(
    '/core/v1/yxbaby/list_pledge_nat',
    {
      pageSize: 20,
      pageNum: 1,
      ...params,
    },
    'POST',
    isShow,
  );
}

// 分页查询：质押NAT-矿场资产
export function yxbabyOreDetail(params = {}) {
  return Fetch('/core/v1/yxbaby/ore_detail', {
    pageSize: 20,
    pageNum: 1,
    ...params,
  });
}

// 转出到流通NAT
export function yxbabyTransferOut(params = {}) {
  return Fetch('/core/v1/yxbaby/transfer_out', params, 'POST', true);
}

// 查询赎回银杏宝需要的NAT
export function yxbabyRedeemDetail(id: string) {
  return Fetch(`/core/v1/yxbaby/redeem_detail/${id}`, {}, 'POST', true);
}

// 分页查询:基金会-NAT解锁钱包
export function unlockAppPage(params = {}, isShow = false) {
  return Fetch(
    '/core/v1/unlock/app_page',
    {
      pageNum: 1,
      pageSize: 20,
      ...params,
    },
    'POST',
    isShow,
  );
}

// （APP）根据兑出币种查询可兑入币种
export function myexchangeSymbolInList(symbolOut: string) {
  return Fetch(
    '/core/v1/exchange_symbol_pair/symbol_in/list',
    {symbolOut},
    'POST',
    true,
  );
}

// （APP）查询可兑出币种
export function myexchangeSymbolOutList() {
  return Fetch(
    '/core/v1/exchange_symbol_pair/symbol_out/list',
    {},
    'POST',
    true,
  );
}

// （APP）新增闪兑记录
export function exchangeOrderCreate(params = {}) {
  return Fetch('/core/v1/exchange_order/create', params, 'POST', true);
}

// APP查询质押NAT总资产
export function appPledgeNat() {
  return Fetch('/core/v1/yxbaby/app_pledge_nat', {}, 'POST', false);
}

// 矿基资产
export function kjOreAssets() {
  return Fetch('/core/v1/activity_join_record/ore_assets');
}

// 分页条件查询-APP矿基资产
export function kjOreBasePage(params = {}) {
  return Fetch('/core/v1/activity_join_record/app_ore_base', {
    pageNum: 1,
    pageSize: 20,
    ...params,
  });
}

// APP分页条件查询：矿基资产详情
export function activiityOreBasePage(params = {}) {
  return Fetch('/core/v1/activity_profit_plan/activiity_ore_base_page', {
    pageNum: 1,
    pageSize: 20,
    ...params,
  });
}

// 活动投入详情
export function activiityOreBaseDetail(id: string) {
  return Fetch(
    `/core/v1/activity_profit_plan/activiity_ore_base_detail/${id}`,
    {},
    'POST',
    true,
  );
}

// NAT解锁钱包-NAT解锁包总资产
export function unlockTotalNat() {
  return Fetch('/core/v1/unlock/total_nat');
}

// 使用银杏宝
export function toUseYxbaby(params = {}) {
  return Fetch('/core/v1/yxbaby/yxbaby_use', params, 'POST', true);
}

// 置换银杏宝
export function exchangeYxbaby(params = {}) {
  return Fetch('/core/v1/yxbaby/yxbaby_exchange', params, 'POST', true);
}

// 置换方式
export function replacementModeList() {
  return Fetch(
    '/core/v1/replacement_mode/list',
    {
      state: '1',
    },
    'POST',
    true,
  );
}

// 质押银杏宝
export function pledgeYxbaby(params = {}) {
  return Fetch('/core/v1/yxbaby/yxbaby_pledge', params, 'POST', true);
}

// 查询质押银杏宝可获得的NAT
export function pledgeObtainNumber(id: string) {
  return Fetch(`/core/v1/yxbaby/pledge_obtain_number/${id}`, {}, 'POST', true);
}

// 查询银杏宝置换可获得的NAT
export function replacementObtainNumber(params = {}) {
  return Fetch(
    '/core/v1/yxbaby/replacement_obtain_number',
    params,
    'POST',
    true,
  );
}

// APP分页条件查询活动
export function activityAppPage(params = {}) {
  return Fetch('/core/v1/activity/app_page', {
    pageNum: 1,
    pageSize: 20,
    ...params,
  });
}

// APP:查询活动管理
export function activityAppDetail(id: string) {
  return Fetch(`/core/v1/activity/app_detail/${id}`, {}, 'POST', true);
}

// app:用户参加活动
export function activityJoin(params = {}) {
  return Fetch('/core/v1/activity/join_activity', params, 'POST', true);
}

// app:判读用户是否参与过活动
export function activityIsJoin(id: string) {
  return Fetch('/core/v1/activity_join_record/is_join', {id});
}

// 查询提币手续费
export function withdrawRuleFee(params = {}, isLoading = false) {
  return Fetch('/core/v1/withdraw_rule/detail_fee', params, 'POST', isLoading);
}
