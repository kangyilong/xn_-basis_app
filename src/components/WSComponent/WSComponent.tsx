import React from 'react';
import {AppState} from 'react-native';
// @ts-ignore
import {connect} from 'react-redux';
import {
  WS_TODAY_SUMMARY_NOTICE,
  WS_BUY_VIP_MEAL_NOTICE,
  WS_OPEN_VIP_MEAL_NOTICE,
  WS_ERROR,
} from '@redux/actionType';
import {webSocketNotice} from '@redux/action';
import {getUserId} from '@methods/util';

function mapDispatchToProps(dispatch: any) {
  return {
    webSocketDeal: (type: string, msg: string) =>
      dispatch(webSocketNotice(type, msg)),
  };
}

interface Props {
  webSocketDeal: Function;
}
class WSComponent extends React.PureComponent<Props, any> {
  isWsSuccess = true;
  ws: any = null;
  initWsEvent = async () => {
    const userId = (await getUserId()) || new Date().getTime();
    const {webSocketDeal} = this.props;
    this.ws = new WebSocket(
      `ws://m.taskwall.hichengdai.com/ws/${userId}/${userId}`,
    );
    this.ws.onmessage = (evt: any) => {
      this.isWsSuccess = true;
      const wsMsg = evt.data;
      if (wsMsg) {
        const socketData = JSON.parse(wsMsg);
        const obj: any = {
          'today.summary.notice': () => {
            webSocketDeal(
              WS_TODAY_SUMMARY_NOTICE,
              socketData.data.onlineCount || 0,
            );
          },
          'buy.vip.meal.notice': () => {
            webSocketDeal(WS_BUY_VIP_MEAL_NOTICE, socketData.data);
          },
          'buy.member.meal.notice': () => {
            webSocketDeal(WS_OPEN_VIP_MEAL_NOTICE, socketData.data);
          },
        };
        // setTimeout(() => { webSocketDeal(WS_TODAY_SUMMARY_NOTICE, 100); }, 20000);
        obj[socketData.ch] && obj[socketData.ch]();
      }
    };
    this.ws.onopen = () => {
      if (__DEV__) {
        console.log('open');
      }
      webSocketDeal(WS_ERROR, false);
    };
    this.ws.onerror = () => {
      if (__DEV__) {
        console.log('err');
      }
      webSocketDeal(WS_ERROR, true);
    };
    this.ws.onclose = () => {
      if (__DEV__) {
        console.log('close');
      }
    };
  };
  componentDidMount() {
    this.initWsEvent();
    AppState.addEventListener('change', (appState) => {
      if (this.isWsSuccess) {
        switch (appState) {
          case 'active':
            this.isWsSuccess = false;
            this.initWsEvent();
            break;
          case 'background':
            this.ws.close();
            break;
        }
      }
    });
  }
  render() {
    return null;
  }
}

export default connect(null, mapDispatchToProps)(WSComponent);
