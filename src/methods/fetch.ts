import NavigatorUtil from './NavigatorUtil';
import {getToken, getUserLang, clearUserMsg} from './util';
import store from '@redux/store';
import {
  toggleToastMsg,
  showLoadingToast,
  hideLoadingToast,
} from '@redux/action';

export default async function Fetch(
  code: string,
  params = {},
  method = 'POST',
  isShowLoading = false,
) {
  if (isShowLoading) {
    store.dispatch(showLoadingToast());
  }
  const token = await getToken();
  const lang = await getUserLang();
  const data = {
    ...params,
  };
  let body = JSON.stringify(data);
  let api = '';
  // http://m.cxtx.info 线上
  // http://m.xfbdev.hichengdai.com 研发
  if (__DEV__) {
    console.log(body, code);
    api = 'http://m.xfbdev.hichengdai.com';
  } else {
    api = 'http://m.cxtx.info';
  }
  return new Promise((reslove, reject) => {
    fetch(api + code, {
      method,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        Authorization: token,
        'Accept-Language': lang,
      },
      body,
    })
      .then(async (response) => {
        store.dispatch(hideLoadingToast());
        if (response.ok) {
          const data = await response.json();
          if (+data.code === 300 && data.errorCode !== '300003') {
            store.dispatch<any>(toggleToastMsg('登录失效, 请重新登录!'));
            setTimeout(() => {
              clearUserMsg();
              NavigatorUtil.goPage('Login');
            }, 1500);
            return;
          } else if (+data.code !== 200) {
            if (__DEV__) {
              console.log(code, params, data);
            }
            store.dispatch<any>(toggleToastMsg(data.errorMsg || '操作失败!'));
            return reject(data.errorMsg);
          } else {
            return reslove(data.data);
          }
        } else {
          const data = await response.json();
          if (__DEV__) {
            console.log(code, params, data);
          }
          store.dispatch(hideLoadingToast());
          store.dispatch<any>(toggleToastMsg(data.errorMsg || '操作失败!'));
          return reject('something went wrong!');
        }
      })
      .catch(() => {
        store.dispatch(hideLoadingToast());
      });
  });
}
