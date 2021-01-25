import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  Dimensions,
  TouchableOpacity,
  LayoutAnimation,
  ScrollView,
} from 'react-native';
import {
  REGISTER_GOUXUAN,
  REGISTER_GOUXUAN_SHI,
  REGISTER_HUADONG,
  REGISTER_MIMA_ICON,
  REGISTER_MOBILE_ICON,
  REGISTER_XIANSHI,
  REGISTER_YANZHENMA,
  REGISTER_YAOQINGMA,
  REGISTER_YAOQIXUAN,
} from '@methods/requireImage';
import {
  isNone,
  operationPrompt,
  saveUserMsg,
  getMsg,
  saveMsg,
  removeMsg,
} from '@methods/util';
import {
  userRegistered,
  userLogin,
  getSmsCaptcha,
} from '@methods/api/personalApi';

const {width, height} = Dimensions.get('window');

interface Props {
  navigation: any;
}
export default class Register extends React.PureComponent<Props, any> {
  state = {
    isSecure: true,
    isSecure02: true,
    isAgree: true,
    isSend: false,
    cTime: 59,
    params: {
      mobile: '',
      smsCode: '',
      inviteCode: '',
      loginPwd: '',
      loginPwd01: '',
    },
  };
  interval: any = null;
  onChangeText = (v: string, field: string) => {
    this.setState((pevState: any) => ({
      params: {
        ...pevState.params,
        [field]: v,
      },
    }));
  };
  selectedAgree = () => {
    this.setState((pevState: any) => ({
      isAgree: !pevState.isAgree,
    }));
  };
  sendCodeFn = () => {
    const {isSend, params} = this.state;
    if (isSend) {
      return;
    }
    if (!isNone(params.mobile, '请正确填写手机号')) {
      return false;
    }
    this.setState({
      isSend: true,
    });
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(() => {
      if (this.state.cTime < 1) {
        clearInterval(this.interval);
        return this.setState({
          isSend: false,
          cTime: 59,
        });
      }
      this.setState((pevState: any) => ({
        cTime: pevState.cTime - 1,
      }));
    }, 1000);
    getSmsCaptcha('/core/v1/sms_out/permission_none/sms_code', {
      bizType: 'C_REG_MOBILE',
      mobile: params.mobile,
    }).catch(() => {
      this.setState({
        isSend: false,
        cTime: 59,
      });
    });
  };
  toRegistered = () => {
    const {isAgree, params} = this.state;
    if (!isAgree) {
      return operationPrompt('请先同意用户协议及隐私条款');
    }
    const {mobile, smsCode, inviteCode, loginPwd, loginPwd01} = params;
    const mRule = /^1[2|3|4|5|6|7|8|9]\d{9}$/;
    if (!isNone(mobile, '请填写手机号')) {
      return;
    } else if (!mRule.test(mobile)) {
      return operationPrompt('请正确填写手机号');
    }
    if (!isNone(smsCode, '请填写验证码')) {
      return;
    }
    const pwdRule = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
    if (!isNone(loginPwd, '请填写密码')) {
      return;
    } else if (!pwdRule.test(loginPwd)) {
      return operationPrompt('请正确填写密码');
    }
    if (loginPwd !== loginPwd01) {
      return operationPrompt('密码不一致, 请确认');
    }
    userRegistered({
      mobile,
      smsCode,
      loginPwd,
      inviteCode,
    }).then(() => {
      operationPrompt(
        '注册成功，将自动为您登录',
        () => {
          userLogin({
            loginName: mobile,
            loginPwd,
          }).then(async (data: any) => {
            await saveUserMsg(data);
            saveMsg('userDetail', JSON.stringify(data));
            LayoutAnimation.easeInEaseOut();
            const backUrl = await getMsg('backUrl');
            if (backUrl) {
              this.props.navigation.navigate(backUrl);
            } else {
              this.props.navigation.navigate('Home');
            }
          });
        },
        2000,
      );
    });
  };
  saveRegMsg = () => {
    const {params} = this.state;
    return saveMsg('regMsg', JSON.stringify(params));
  };
  _navListener: any = null;
  componentDidMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      getMsg('regMsg').then((msg: any) => {
        if (msg) {
          this.setState({
            params: JSON.parse(msg),
          });
          removeMsg('regMsg');
        }
      });
    });
  }
  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this._navListener.remove();
  }
  render() {
    const {isSecure, isAgree, isSecure02, isSend, cTime, params} = this.state;
    const {mobile, smsCode, inviteCode, loginPwd, loginPwd01} = params;
    return (
      <ScrollView
        style={{flex: 1, backgroundColor: '#F5F5F5'}}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag">
        <View style={styles.reg_box}>
          <View style={styles.reg_head}>
            <View style={styles.r_h_single}>
              <Text style={{...styles.h_s_txt, ...styles.h_s_txt_active}}>
                手机注册
              </Text>
              <Image
                style={{...styles.h_s_btm, ...styles.h_s_btm_active}}
                source={REGISTER_HUADONG}
              />
            </View>
            {/*<View style={styles.r_h_single}>*/}
            {/*  <Text style={styles.h_s_txt}>邮箱注册</Text>*/}
            {/*  <Image style={styles.h_s_btm} source={null} />*/}
            {/*</View>*/}
          </View>
          <View style={styles.reg_form}>
            <View style={styles.f_single}>
              <View style={styles.f_single_l}>
                <Image
                  source={REGISTER_MOBILE_ICON}
                  style={{...styles.s_iup_l, height: 23}}
                />
                <Text style={styles.s_iup_t}>+86</Text>
                <TextInput
                  style={{...styles.s_iup, marginBottom: 3}}
                  placeholder="请输入手机号"
                  placeholderTextColor="#CCCCCC"
                  keyboardType="numeric"
                  autoCapitalize="none"
                  clearButtonMode="while-editing"
                  onChangeText={(v) => this.onChangeText(v, 'mobile')}
                  value={mobile}
                />
              </View>
            </View>
            <View style={styles.f_single}>
              <View style={styles.f_single_l}>
                <Image
                  source={REGISTER_MIMA_ICON}
                  style={{...styles.s_iup_l, height: 21}}
                />
                <TextInput
                  style={styles.s_iup}
                  placeholder="英文数字组合8-16位"
                  placeholderTextColor="#CCCCCC"
                  secureTextEntry={isSecure}
                  autoCapitalize="none"
                  clearButtonMode="while-editing"
                  onChangeText={(v) => this.onChangeText(v, 'loginPwd')}
                  value={loginPwd}
                />
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() =>
                    this.setState((pevState: any) => ({
                      isSecure: !pevState.isSecure,
                    }))
                  }>
                  <Image
                    source={isSecure ? REGISTER_GOUXUAN_SHI : REGISTER_XIANSHI}
                    style={
                      isSecure
                        ? {...styles.s_iup_r, height: 9}
                        : {...styles.s_iup_r, height: 14}
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.f_single}>
              <View style={styles.f_single_l}>
                <Image
                  source={REGISTER_MIMA_ICON}
                  style={{...styles.s_iup_l, height: 21}}
                />
                <TextInput
                  style={styles.s_iup}
                  placeholder="请再次输入密码"
                  placeholderTextColor="#CCCCCC"
                  secureTextEntry={isSecure02}
                  autoCapitalize="none"
                  clearButtonMode="while-editing"
                  onChangeText={(v) => this.onChangeText(v, 'loginPwd01')}
                  value={loginPwd01}
                />
                <TouchableOpacity
                  activeOpacity={0.9}
                  onPress={() =>
                    this.setState((pevState: any) => ({
                      isSecure02: !pevState.isSecure02,
                    }))
                  }>
                  <Image
                    source={
                      isSecure02 ? REGISTER_GOUXUAN_SHI : REGISTER_XIANSHI
                    }
                    style={
                      isSecure02
                        ? {...styles.s_iup_r, height: 9}
                        : {...styles.s_iup_r, height: 14}
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.f_single}>
              <View style={styles.f_single_l}>
                <Image
                  source={REGISTER_YANZHENMA}
                  style={{...styles.s_iup_l, height: 20}}
                />
                <TextInput
                  style={styles.s_iup}
                  placeholder="输入手机验证码"
                  placeholderTextColor="#CCCCCC"
                  autoCapitalize="none"
                  keyboardType="numeric"
                  textContentType="oneTimeCode"
                  clearButtonMode="while-editing"
                  onChangeText={(v) => this.onChangeText(v, 'smsCode')}
                  value={smsCode}
                />
              </View>
              <TouchableOpacity
                activeOpacity={0.9}
                style={
                  isSend
                    ? {...styles.f_single_r, backgroundColor: '#BDBDBD'}
                    : styles.f_single_r
                }
                onPress={this.sendCodeFn}>
                <Text style={styles.f_s_rt}>
                  {isSend ? `(${cTime})s` : '获取'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.f_single}>
              <View style={styles.f_single_l}>
                <Image
                  source={REGISTER_YAOQINGMA}
                  style={{...styles.s_iup_l, height: 18}}
                />
                <TextInput
                  style={styles.s_iup}
                  placeholder="请输入邀请码"
                  placeholderTextColor="#CCCCCC"
                  autoCapitalize="none"
                  clearButtonMode="while-editing"
                  onChangeText={(v) => this.onChangeText(v, 'inviteCode')}
                  value={inviteCode}
                />
              </View>
            </View>
          </View>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.reg_agree}
            onPress={this.selectedAgree}>
            <Image
              source={isAgree ? REGISTER_YAOQIXUAN : REGISTER_GOUXUAN}
              style={styles.agree_img}
            />
            <Text style={styles.agree_txt}>我已阅读并同意</Text>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.agree__line}
              onPress={() => {
                this.saveRegMsg().then(() => {
                  this.props.navigation.navigate('SystemParams', {
                    ckey: 'registered_agreement_textarea',
                    name: '用户协议及隐私条款',
                    backUrl: 'Register',
                  });
                });
              }}>
              <Text style={{...styles.agree_txt, ...styles.agree__tk}}>
                用户协议及隐私条款
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.reg_btn}
            onPress={this.toRegistered}>
            <Text style={styles.r_btn_txt}>注册</Text>
          </TouchableOpacity>
          <View style={styles.reg_foo}>
            <Text style={styles.reg_f_txt}>已经注册？</Text>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.agree__line}
              onPress={() => {
                this.props.navigation.navigate('Login');
              }}>
              <Text style={{...styles.reg_f_txt, ...styles.reg_f_to}}>
                去登录
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  reg_box: {
    flex: 1,
    alignItems: 'center',
    paddingTop: height * 0.15,
  },
  reg_head: {
    flexDirection: 'row',
    width: width - 132,
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  r_h_single: {
    alignItems: 'center',
  },
  h_s_txt_active: {
    color: '#0B3254',
  },
  h_s_txt: {
    color: '#111111',
    fontSize: 18,
    lineHeight: 25,
    marginBottom: 3,
  },
  h_s_btm_active: {
    width: 20,
  },
  h_s_btm: {
    height: 4,
    width: 0,
  },
  reg_form: {
    width: width - 40,
  },
  f_single: {
    width: width - 40,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 7,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#E0E2E4',
    paddingLeft: 10,
    height: 51,
    alignItems: 'center',
    marginTop: 11,
  },
  f_single_l: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  f_single_r: {
    minWidth: 104,
    width: 104,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0B3254',
    borderBottomRightRadius: 7,
    borderTopRightRadius: 7,
  },
  f_s_rt: {
    color: '#FFFFFF',
    fontSize: 18,
    lineHeight: 25,
    fontFamily: 'PingFangSC-Regular',
  },
  s_iup_l: {
    width: 16,
    marginRight: 12,
  },
  s_iup_t: {
    color: '#0B3254',
    fontSize: 14,
    marginRight: 7,
    marginTop: 3,
  },
  s_iup: {
    color: '#333',
    paddingTop: 12,
    paddingBottom: 12,
    paddingRight: 10,
    fontSize: 14,
    lineHeight: 20,
    flex: 1,
  },
  s_iup_r: {
    width: 20,
    marginRight: 12,
  },
  reg_agree: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    width: width - 40,
  },
  agree_img: {
    width: 16,
    height: 16,
    marginRight: 10,
  },
  agree_txt: {
    color: '#111111',
    fontSize: 14,
    lineHeight: 20,
  },
  agree__line: {
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderColor: '#0B3254',
  },
  agree__tk: {
    color: '#0B3254',
  },
  reg_btn: {
    width: width - 40,
    backgroundColor: '#0B3254',
    height: 51,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginTop: 30,
  },
  r_btn_txt: {
    color: '#fff',
    fontSize: 18,
    lineHeight: 25,
  },
  reg_foo: {
    marginTop: 20,
    flexDirection: 'row',
  },
  reg_f_txt: {
    color: '#888888',
    fontSize: 16,
    lineHeight: 22,
  },
  reg_f_to: {
    color: '#0B3254',
  },
});
