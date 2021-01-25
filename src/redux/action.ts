import {
  ACTION_TINT_COLOR,
  SHOW_TOAST_MSG,
  HIDE_TOAST_MSG,
  SHOW_TOAST_LOADING,
  HIDE_TOAST_LOADING,
  CHANGE_TAB,
} from './actionType';

export function actionTintColor(color: string) {
  return {
    type: ACTION_TINT_COLOR,
    color,
  };
}

function showToastMsg(toastMsg: any) {
  return {
    type: SHOW_TOAST_MSG,
    toastMsg,
  };
}

export function hideToastMsg() {
  return {
    type: HIDE_TOAST_MSG,
  };
}

export function toggleToastMsg(toastMsg: any, time = 2500) {
  return (dispatch: any) => {
    dispatch(showToastMsg(toastMsg));
    setTimeout(() => {
      dispatch(hideToastMsg());
    }, time);
  };
}

export function showLoadingToast() {
  return {
    type: SHOW_TOAST_LOADING,
  };
}

export function hideLoadingToast() {
  return {
    type: HIDE_TOAST_LOADING,
    isShowLoading: false,
  };
}

// 监听webSocket数据变化
export function webSocketNotice(type: string, msg: string) {
  return {type, msg};
}

// 监听设置tab栏变化
export function appTabsBtnChange(key: string, visible: boolean) {
  // key 标志哪个tab  hidden 显示/隐藏
  return {
    type: CHANGE_TAB,
    tabs: {
      key,
      visible,
    },
  };
}
