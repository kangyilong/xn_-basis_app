import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {getSmsCaptcha} from '@methods/api/personalApi';
import {isNone} from '@methods/util';

interface Props {
  smsCode: string;
  bizType: string;
  mobile: string;
  style?: object;
  sendName?: string;
  modalCatchError?: Function;
  smsParams?: object;
}
export default class SendSmsCaptcha extends React.PureComponent<Props, any> {
  private interTimer: any;
  constructor(props: any) {
    super(props);
    this.state = {
      timer: 59,
      isSend: false,
    };
    this.interTimer = null;
  }
  toSmsCaptcha = () => {
    let {timer, isSend} = this.state;
    const {
      smsCode,
      mobile,
      bizType,
      sendName,
      modalCatchError,
      smsParams,
    } = this.props;
    if (typeof modalCatchError === 'function' && !mobile) {
      return modalCatchError('请正确填写手机号');
    }
    if (!isNone(mobile, '请正确填写手机号')) {
      return;
    }
    if (!isSend) {
      this.setState({
        isSend: true,
      });
      const name = sendName ? sendName : 'mobile';
      const config = smsParams
        ? {
            ...smsParams,
            bizType,
            [name]: mobile,
          }
        : {
            bizType,
            [name]: mobile,
          };
      getSmsCaptcha(smsCode, config)
        .then(() => {
          if (this.interTimer) {
            clearInterval(this.interTimer);
          }
          this.interTimer = setInterval(() => {
            this.setState({
              timer: timer--,
            });
            if (timer < 1) {
              clearInterval(this.interTimer);
              this.setState({
                timer: 59,
                isSend: false,
              });
            }
          }, 1000);
        })
        .catch(() => {
          this.setState({
            isSend: false,
          });
        });
    }
  };
  componentWillUnmount() {
    if (this.interTimer) {
      clearInterval(this.interTimer);
    }
  }
  render() {
    const {isSend, timer} = this.state;
    const {style} = this.props;
    return isSend ? (
      <View style={{...Styles.ret_sms, ...style}}>
        <Text style={{...Styles.sms_txt, ...Styles.ret_txt}}>
          重新获取({timer}s)
        </Text>
      </View>
    ) : (
      <TouchableOpacity
        style={{...Styles.get_sms, ...style}}
        activeOpacity={0.9}
        onPress={this.toSmsCaptcha}>
        <Text style={{...Styles.sms_txt, ...Styles.get_txt}}>获取验证码</Text>
      </TouchableOpacity>
    );
  }
}

const Styles = StyleSheet.create({
  get_sms: {
    borderColor: '#4341A6',
    borderStyle: 'solid',
    borderWidth: 0.5,
    backgroundColor: '#fff',
  },
  ret_sms: {
    // backgroundColor: '#CCCCCC',
  },
  sms_txt: {
    fontSize: 16,
  },
  get_txt: {
    color: '#0B3254',
  },
  ret_txt: {
    color: '#C2C2C2',
  },
});
