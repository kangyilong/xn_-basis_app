import Fetch from '../fetch';

// 分页条件查询一卡通账户
export async function yktPage(params = {}) {
  return Fetch('/core/v1/ykt/app_page', {
    pageSize: 20,
    pageNum: 1,
    ...params,
  });
}

// OSS：分页条件查询取现规则（除流通NAT）
export async function withdrawRulePage(params = {}) {
  return Fetch('/core/v1/withdraw_rule/page_rule', {
    pageSize: 100,
    pageNum: 1,
    ...params,
  });
}
