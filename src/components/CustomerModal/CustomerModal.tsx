import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import {CLOSE_MODAL} from '@methods/requireImage';
import {callMobile} from '@methods/util';
import {getSystemParams} from '@methods/api/publicApi';

const {width} = Dimensions.get('window');

interface Props {
  initVisible: boolean;
  closeModal: Function;
}
export default function CustomerModal(props: Props) {
  const {initVisible, closeModal} = props;
  const [visible, setVisible] = useState(initVisible);
  const [customerService, setCustomerService] = useState('');
  useEffect(() => {
    setVisible(initVisible);
    getSystemParams('service').then((data: any) => {
      const {service} = data;
      setCustomerService(service);
    });
  }, [initVisible]);
  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <TouchableOpacity
        style={styles.modal_page}
        activeOpacity={1}
        onPress={() => closeModal()}>
        <View style={styles.modal_con}>
          <TouchableOpacity
            style={styles.close_box}
            activeOpacity={0.9}
            onPress={() => closeModal()}>
            <Image style={styles.rm_icon} source={CLOSE_MODAL} />
          </TouchableOpacity>
          <Text style={styles.modal_tit}>收不到验证码</Text>
          <Text style={styles.m_txt}>请联系客服热线</Text>
          <Text style={styles.m_txt_b}>{customerService}</Text>
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.m_foo}
            onPress={() => {
              closeModal();
              callMobile(customerService);
            }}>
            <Text style={styles.m_foo_txt}>点击拨打电话</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal_page: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal_con: {
    width: width - 114,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    position: 'relative',
    paddingTop: 20,
    paddingBottom: 12,
  },
  close_box: {
    position: 'absolute',
    right: 12,
    top: 11,
  },
  rm_icon: {
    width: 8,
    height: 8,
  },
  modal_tit: {
    color: '#333333',
    fontSize: 16,
    fontWeight: Platform.OS !== 'ios' ? '400' : '500',
    lineHeight: 23,
    marginBottom: 20,
  },
  m_txt: {
    color: '#999999',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 4,
  },
  m_txt_b: {
    color: '#333333',
    fontSize: 15,
    lineHeight: 21,
    marginBottom: 29,
  },
  m_foo: {
    width: width - 114,
    borderTopWidth: 1,
    borderStyle: 'solid',
    borderColor: '#DFDFDF',
    paddingTop: 13,
  },
  m_foo_txt: {
    color: '#4341A6',
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
  },
});
