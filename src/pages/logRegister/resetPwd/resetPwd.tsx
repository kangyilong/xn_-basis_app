import React, {useState, useCallback} from 'react';
import {View, Text, TouchableOpacity, Image, ScrollView} from 'react-native';
import FormSingleItem from '@components/FormItem/FormSingleItem';
import SendSmsCaptcha from '@components/SendSmsCaptcha/SendSmsCaptcha';
import {getMsg, isNone, operationPrompt} from '@methods/util';
import {retrievePwd} from '@methods/api/personalApi';
import {RESET_BACK} from '@methods/requireImage';
import Styles from './Styles';

let H = 0;
setTimeout(() => {
  getMsg('barHeight').then((hi: any) => {
    H = +hi;
  });
}, 1000);

interface Props {
  navigation: any;
}
export default function ResetPwd(props: Props) {
  const [mobile, setMobile] = useState('');
  const [smsCaptcha, setSmsCaptcha] = useState('');
  const [loginPaw, setLoginPaw] = useState('');
  const [loginPaw01, setLoginPaw01] = useState('');
  const getMobile = useCallback(
    (v) => {
      setMobile(v);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mobile],
  );
  const getSmsCaptcha = useCallback(
    (v) => {
      setSmsCaptcha(v);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [smsCaptcha],
  );
  const getLoginPaw = useCallback(
    (v) => {
      setLoginPaw(v);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loginPaw],
  );
  const getLoginPaw01 = useCallback(
    (v) => {
      setLoginPaw01(v);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loginPaw01],
  );
  const _RightBtn = useCallback(
    () => (
      <SendSmsCaptcha
        smsCode="/core/v1/sms_out/permission_none/sms_code"
        bizType="FORGET_LOGINPWD"
        mobile={mobile}
        style={{
          justifyContent: 'center',
          paddingHorizontal: 10,
          marginRight: 10,
          borderWidth: 0,
        }}
      />
    ),
    [mobile],
  );
  const formSubmit = useCallback(() => {
    if (!isNone(mobile, '请正确填写手机号')) {
      return;
    }
    if (!isNone(smsCaptcha, '请填写验证码')) {
      return;
    }
    if (!isNone(loginPaw, '请正确填写密码')) {
      return;
    }
    if (!isNone(loginPaw01, '密码不一致')) {
      return;
    }
    if (loginPaw !== loginPaw01) {
      return operationPrompt('密码不一致');
    }
    retrievePwd({
      mobile,
      loginPwd: loginPaw,
      smsCaptcha,
      userKind: 'C',
    }).then(() => {
      operationPrompt(
        '重置密码成功',
        () => {
          props.navigation.navigate('Login');
        },
        2000,
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobile, smsCaptcha, loginPaw, loginPaw01]);
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={{flex: 1}}>
        <View style={{...Styles.reset_head, marginTop: H + 10}}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={Styles.rh_box}
            onPress={() => props.navigation.navigate('Login')}>
            <Image style={Styles.rh_img} source={RESET_BACK} />
          </TouchableOpacity>
          <Text style={Styles.cz_txt}>重置密码</Text>
        </View>
        <View style={Styles.retrieve_pwd}>
          <FormSingleItem
            getValue={getMobile}
            vValue="mobile"
            keyboardType="numeric"
            placeholder="请输入手机号"
            placeholderTextColor="#ccc"
            style={Styles.retrieve_pwd_single}
            iupStyle={Styles.pwd_single_iup}
            errorBottom={20}
          />
          <FormSingleItem
            getValue={getSmsCaptcha}
            placeholder="输入验证码"
            keyboardType="numeric"
            textContentType="oneTimeCode"
            placeholderTextColor="#ccc"
            style={Styles.retrieve_pwd_single}
            iupStyle={Styles.pwd_single_iup}
            RightBtn={_RightBtn}
          />
          <FormSingleItem
            getValue={getLoginPaw}
            vValue="loginPaw"
            placeholder="英文数字组合8-16位"
            placeholderTextColor="#ccc"
            secureTextEntry={true}
            style={Styles.retrieve_pwd_single}
            iupStyle={Styles.pwd_single_iup}
            errorBottom={20}
          />
          <FormSingleItem
            getValue={getLoginPaw01}
            vValue="loginPaw"
            placeholder="确认密码"
            placeholderTextColor="#ccc"
            secureTextEntry={true}
            style={Styles.retrieve_pwd_single}
            iupStyle={Styles.pwd_single_iup}
            errorBottom={20}
          />
          <TouchableOpacity
            style={Styles.retrieve_foo}
            activeOpacity={0.9}
            onPress={formSubmit}>
            <Text style={Styles.retrieve_btn}>确定</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
