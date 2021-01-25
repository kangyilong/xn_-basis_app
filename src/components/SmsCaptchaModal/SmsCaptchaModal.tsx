import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import ToastMsg from '@components/toastMsg/ToastMsg';
import FormSingleItem from '@components/FormItem/FormSingleItem';
import SendSmsCaptcha from '@components/SendSmsCaptcha/SendSmsCaptcha';
import {isNone} from '@methods/util';

const {width} = Dimensions.get('window');

interface Props {
  modalVisible: boolean;
  smsParams: any;
  getSmsValue: Function;
  closeModal: Function;
}
export default function SmsCaptchaModal(props: Props) {
  const {modalVisible, smsParams, closeModal, getSmsValue} = props;
  const [smsCaptcha, setSmsCaptcha] = useState('');
  const getSmsCaptcha = useCallback(
    (v) => {
      setSmsCaptcha(v);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [smsCaptcha],
  );
  const _submitFrom = useCallback(() => {
    if (!isNone(smsCaptcha, '请填写验证码')) {
      return;
    }
    return getSmsValue(smsCaptcha);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [smsCaptcha]);
  const _RightBtn = useCallback(
    () => (
      <SendSmsCaptcha
        smsCode={smsParams.sendCode}
        bizType={smsParams.bizType}
        mobile={smsParams.loginName}
        sendName={smsParams.send}
        style={{
          height: 26,
          justifyContent: 'center',
          paddingHorizontal: 10,
          borderRadius: 2,
          marginRight: 10,
        }}
        smsParams={{tradePwd: smsParams.tradePwd}}
      />
    ),
    [smsParams],
  );
  return (
    <View style={{flex: 1}}>
      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View style={styles.modal_page}>
          <View style={styles.modal_box}>
            <View style={styles.modal_single}>
              <Text style={styles.modal_single_txt}>{smsParams.loginName}</Text>
            </View>
            <FormSingleItem
              getValue={getSmsCaptcha}
              placeholder="输入验证码"
              keyboardType="numeric"
              textContentType="oneTimeCode"
              placeholderTextColor="#ccc"
              style={styles.modal_single}
              iupStyle={styles.modal_single_iup}
              RightBtn={_RightBtn}
            />
            <TouchableOpacity
              style={styles.modal_btn}
              activeOpacity={0.9}
              onPress={_submitFrom}>
              <Text style={styles.modal_btn_txt}>确定</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modal_btn_g}
              activeOpacity={0.9}
              onPress={() => {
                closeModal();
              }}>
              <Text style={styles.modal_btn_g_txt}>取消</Text>
            </TouchableOpacity>
          </View>
        </View>
        <ToastMsg />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modal_page: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal_box: {
    width: width - 40,
    backgroundColor: '#fff',
    borderRadius: 4,
    paddingVertical: 25,
    paddingHorizontal: 20,
    marginTop: -100,
  },
  modal_single: {
    height: 55,
    borderStyle: 'solid',
    borderColor: '#E3E3E3',
    borderBottomWidth: 0.5,
    marginBottom: 5,
    justifyContent: 'center',
  },
  modal_single_iup: {
    paddingVertical: 10,
    color: '#333333',
  },
  modal_single_txt: {
    color: '#333',
    fontSize: 16,
  },
  modal_btn: {
    backgroundColor: '#D53D3D',
    borderRadius: 4,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  modal_btn_txt: {
    fontSize: 15,
    color: '#fff',
    letterSpacing: 1.5,
  },
  modal_btn_g: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    height: 35,
  },
  modal_btn_g_txt: {
    color: '#666',
    fontSize: 15,
  },
});
