import React, {useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  Dimensions,
  Keyboard,
  Platform,
  ScrollView,
} from 'react-native';
import MToast from '@components/MToast/MToast';
import {MY_YXB_CLOSE} from '@methods/requireImage';
import {isFullScreen} from '@methods/util';

const {height} = Dimensions.get('window');
const IOS = Platform.OS === 'ios';

interface Props {
  title: string;
  tpComponent: any;
  mVisible: boolean;
  cancelModal: Function;
  confirmModal: Function;
  btnText?: string;
  tipMsg: string;
  resetTip: Function;
  bgColor?: string;
}
export default function BtmModal(props: Props) {
  const {
    title,
    mVisible,
    cancelModal,
    confirmModal,
    tpComponent,
    btnText = '确认转账',
    tipMsg,
    resetTip,
    bgColor = 'rgba(0,0,0,0.6)',
  } = props;
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(mVisible);
  }, [mVisible]);
  const [toastMsg, setToastMsg] = useState(tipMsg);
  useEffect(() => {
    if (tipMsg) {
      setToastMsg(tipMsg);
      setTimeout(() => {
        setToastMsg('');
        resetTip();
      }, 2000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tipMsg]);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const _keyboardDidShow = useCallback((ev) => {
    const h = IOS ? ev.startCoordinates.height : ev.endCoordinates.height;
    setKeyboardHeight(+h - 70);
  }, []);
  const _keyboardDidHide = useCallback(() => {
    setKeyboardHeight(0);
  }, []);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      _keyboardDidShow,
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      _keyboardDidHide,
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [_keyboardDidShow, _keyboardDidHide]);
  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <View style={{...styles.tran_paw, backgroundColor: bgColor}}>
        <View style={{height}}>
          <ScrollView
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            style={{...styles.t_paw_con, bottom: keyboardHeight}}>
            <View style={styles.tp_head}>
              <Text style={styles.tp_h_txt}>{title}</Text>
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.close_box}
                onPress={() => cancelModal()}>
                <Image style={styles.tp_img} source={MY_YXB_CLOSE} />
              </TouchableOpacity>
            </View>
            <View style={styles.tp_con}>
              {tpComponent()}
              <TouchableOpacity
                activeOpacity={0.9}
                style={styles.tp_btn}
                onPress={() => confirmModal()}>
                <Text style={styles.btn_txt}>{btnText}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          <MToast toastMsg={toastMsg} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  tran_paw: {
    flex: 1,
  },
  t_paw_con: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F5F5F5',
  },
  tp_head: {
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'solid',
    borderBottomWidth: 0.5,
    borderColor: '#E0E2E4',
    position: 'relative',
  },
  tp_h_txt: {
    color: '#111111',
    fontSize: 18,
    lineHeight: 25,
    fontWeight: '500',
    fontFamily: 'PingFangSC-Medium',
  },
  close_box: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingTop: 20,
    paddingRight: 20,
    paddingLeft: 20,
    paddingBottom: 20,
  },
  tp_img: {
    width: 18,
    height: 18,
  },
  tp_con: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: isFullScreen() ? 66 : 46,
  },
  tp_btn: {
    marginTop: 32,
    height: 52,
    borderRadius: 8,
    backgroundColor: '#0B3254',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn_txt: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    fontFamily: 'PingFangSC-Medium',
  },
});
