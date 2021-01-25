import React, {useState, useEffect} from 'react';

import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import {PACKAGE_JING_GAO, PACKAGE_CHENG_GONG} from '@methods/requireImage';

const {width} = Dimensions.get('window');

interface Props {
  isShow: boolean;
  closeModal: Function;
  closeCallback: Function;
  modalText: string;
  modalType?: string;
}
export default function ConfirmModal(props: Props) {
  const {isShow, closeModal, closeCallback, modalText, modalType = 's'} = props;
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(isShow);
  }, [isShow]);
  const picObj: any = {
    s: PACKAGE_CHENG_GONG,
    w: PACKAGE_JING_GAO,
  };
  return (
    <TouchableOpacity
      style={visible ? styles.picker_box : {display: 'none'}}
      activeOpacity={1}
      onPress={() => {
        closeModal();
      }}>
      <View style={styles.confirm_con}>
        <Image style={{width: 28, height: 28}} source={picObj[modalType]} />
        <Text style={styles.confirm_txt}>{modalText}</Text>
        <TouchableOpacity
          style={styles.confirm_foo}
          activeOpacity={0.9}
          onPress={() => {
            closeCallback();
          }}>
          <Text style={styles.confirm_foo_txt}>确认</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  picker_box: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirm_con: {
    backgroundColor: '#fff',
    borderRadius: 8,
    width: width - 84,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 35,
    paddingBottom: 30,
  },
  confirm_txt: {
    color: '#333333',
    fontSize: 18,
    marginTop: 13,
    marginBottom: 22,
  },
  confirm_foo: {
    width: width - 164,
    borderRadius: 8,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0B3254',
  },
  confirm_foo_txt: {
    color: '#fff',
    fontSize: 14,
  },
});
