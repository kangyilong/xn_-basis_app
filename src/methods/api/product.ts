import Fetch from '../fetch';

// 分页条件查询产品
export function productPage(params = {}) {
  return Fetch('/core/v1/product/public/page', {
    pageSize: 20,
    pageNum: 1,
    ...params,
    status: '1',
  });
}

// 列表查询产品
export function productList(params = {}) {
  return Fetch('/core/v1/product/list', {
    ...params,
    status: '1',
  });
}

// 详情查询产品
export function productDetail(id: string) {
  return Fetch(`/core/v1/product/public/app_detail/${id}`);
}

// 列表条件查询产品类型
export function productTypeList() {
  return Fetch('/core/v1/product_type/public/small_list');
}

// 新增订单
export function createOrder(params = {}) {
  return Fetch('/core/v1/orders/create', params, 'POST', true);
}

// 查询订单
export function orderDetail(id: string, isLoading = true) {
  return Fetch(`/core/v1/orders/order_detail/${id}`, {}, 'POST', isLoading);
}

// 订单发货
export function orderDelivery(params = {}) {
  return Fetch(`/core/v1/orders/order_delivery`, params, 'POST', true);
}

// 分页条件查询订单
export function orderPage(params = {}) {
  return Fetch(`/core/v1/orders/my/page`, {
    pageSize: 20,
    pageNum: 1,
    ...params,
  });
}

// 支付订单
export function payOrder(params = {}) {
  return Fetch(`/core/v1/orders/pay_order`, params, 'POST', true);
}

// 取消订单
export function removeOrder(id: string) {
  return Fetch(`/core/v1/orders/cancel_order`, {id}, 'POST', true);
}

// 订单确认收货
export function confirmOrder(id: string) {
  return Fetch(`/core/v1/orders/confirm_order`, {id}, 'POST', true);
}

// 我的订单数
export function ordersNumber() {
  return Fetch('/core/v1/orders/Orders_number');
}
