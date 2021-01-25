import Fetch from '../fetch';

// 列表查询用户账户
export function userAccount(currency = '', isLoading = true) {
  return Fetch('802301', {currency}, 'POST', isLoading);
}
