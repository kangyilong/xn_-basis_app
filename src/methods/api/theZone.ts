import Fetch from '../fetch';

// app-专区首页-头部
export function agentActivity(isLoading = false) {
    return Fetch('/core/v1/agent_activity/index_head', {}, 'POST', isLoading);
}

// app-专区首页-预展中-已结束-活动
export function agentActivityIndexPage(params = {}, isShow = true) {
    return Fetch('/core/v1/agent_activity/index_page', {
        pageSize: 20,
        pageNum: 1,
        ...params,
    }, 'POST', isShow);
}

// app-专区首页-商品列表
export function agentActivityIndexGoods(params = {}, isShow = true) {
    return Fetch('/core/v1/agent_activity/index_goods2', {
        pageSize: 10,
        pageNum: 1,
        ...params
    }, 'POST', isShow);
}

// app-查询可抵扣价格
export function agentActivityGoodsNat(params = {}, isShow = false) {
    return Fetch('/core/v1/agent_activity_goods/check_discount', params, 'POST', isShow);
}

// app-专区订单-支付
export function agentActivityPayOrder(params = {}, isShow = true) {
    return Fetch('/core/v1/agent_activity_goods/pay_order', params, 'POST', isShow);
}

// app-专区购买记录头部
export function agentAssetsHead(params = {}, isShow = false) {
    return Fetch('/core/v1/assets/head', params, 'POST', isShow);
}

// app-专区购买记录列表
export function agentAssetsPageFront(params = {}, isShow = false) {
    return Fetch('/core/v1/assets/page_front', {
        pageNum: 1,
        pageSize: 10,
        ...params
    }, 'POST', isShow);
}

// app-专区购买记录--续费/管理费页
export function agentAssetsRenewFront(params = {}, isShow = false) {
    return Fetch('/core/v1/assets/renew_info', params, 'POST', isShow);
}

// app-专区购买记录--续费/管理费--支付
export function agentAssetsRenewPay(params = {}, isShow = false) {
    return Fetch('/core/v1/assets/renew_pay', params, 'POST', isShow);
}

// app-专区购买记录--兑换
export function agentAssetsExchange(params = {}, isShow = true) {
    return Fetch('/core/v1/assets/exchange', params, 'POST', isShow);
}

// 使用专区资产新增供奉人信息
export function worshipInfoCreate(params = {}, isShow = true) {
    return Fetch('/core/v1/worship_info/create', params, 'POST', isShow);
}

// app-供奉人信息查看
export function worshipInfoDetail(params = {}, isShow = true) {
    return Fetch('/core/v1/worship_info/detail_ref_id', params, 'POST', isShow);
}

// app-分页收益明细
export function agentActivityIncomePage(params = {}, isShow = false) {
    return Fetch('/core/v1/agent_activity_income/app_page', {
        pageSize: 10,
        pageNum: 1,
        ...params
    }, 'POST', isShow);
}

// app-收益明细-头部
export function agentActivityIncomeHead(params = {}, isShow = true) {
    return Fetch('/core/v1/agent_activity_income/head', params, 'POST', isShow);
}

// app-我的团队-头部
export function agentMyTeam(params = {}, isShow = false) {
    return Fetch('/core/v1/agent/my_team', params, 'POST', isShow);
}

// app-我的团队直推明细
export function agentTeamDetail(params = {}, isShow = false) {
    return Fetch('/core/v1/agent/team_detail', {
        pageSize: 10,
        pageNum: 1,
        ...params
    }, 'POST', isShow);
}