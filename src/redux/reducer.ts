import {
  ACTION_TINT_COLOR,
  SHOW_TOAST_MSG,
  SHOW_TOAST_LOADING,
  HIDE_TOAST_MSG,
  HIDE_TOAST_LOADING,
  WS_TODAY_SUMMARY_NOTICE,
  WS_BUY_VIP_MEAL_NOTICE,
  WS_OPEN_VIP_MEAL_NOTICE,
  WS_ERROR,
  CHANGE_TAB,
} from './actionType';
import {combineReducers} from 'redux';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function changeTintColor(state = {}, action: any) {
  switch (action.type) {
    case ACTION_TINT_COLOR:
      return action.color;
    default:
      return '#4BC1D2';
  }
}

// 弹框数据变化处理
function showToastMsg(state = {}, action: any) {
  // 弹框
  switch (action.type) {
    case SHOW_TOAST_MSG:
      return {
        ...state,
        toastMsg: action.toastMsg,
      };
    case HIDE_TOAST_MSG:
      return {
        ...state,
        toastMsg: '',
      };
    case SHOW_TOAST_LOADING: // loading弹框
      return {
        ...state,
        isShowLoading: true,
      };
    case HIDE_TOAST_LOADING:
      return {
        ...state,
        isShowLoading: false,
      };
    default:
      return {...state};
  }
}

// webSocket 数据变化处理
function webSocketDeal(
  state = {
    todaySummary: 0,
    buyVipMealNotice: [],
    mealNotice: [],
    wsErr: false,
  },
  action: any,
) {
  switch (action.type) {
    case WS_TODAY_SUMMARY_NOTICE:
      return {
        ...state,
        todaySummary: action.msg,
      };
    case WS_BUY_VIP_MEAL_NOTICE:
      return {
        ...state,
        buyVipMealNotice: action.msg,
      };
    case WS_OPEN_VIP_MEAL_NOTICE:
      return {
        ...state,
        mealNotice: action.msg,
      };
    case WS_ERROR:
      return {
        ...state,
        wsErr: action.msg,
      };
    default:
      return {...state};
  }
}

function changeTabReducer(state = {}, action: any) {
  switch (action.type) {
    case CHANGE_TAB:
      return {
        ...state,
        tabStore: action.tabs,
      };
    default:
      return {...state};
  }
}

export default combineReducers({
  changeTintColor,
  showToastMsg,
  webSocketDeal,
  changeTabReducer,
});
