/*
  适用于 IOS
* */
import React, {useState, useEffect} from 'react';

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Picker,
} from 'react-native';

const {width, height} = Dimensions.get('window');

interface Props {
  setPicker: any;
  pickerData: Array<any>;
  isShowPicker: boolean;
  getPickerValue: Function;
  closeModal: Function;
}
export default function PickerComponent(props: Props) {
  const {
    isShowPicker,
    getPickerValue,
    pickerData,
    setPicker,
    closeModal,
  } = props;
  const [showPicker, setShowPicker] = useState(false);
  const [pickerValue, setPickerValue] = useState('');
  useEffect(() => {
    setShowPicker(isShowPicker);
    setPickerValue(setPicker);
  }, [isShowPicker, setPicker]);
  return (
    <TouchableOpacity
      style={showPicker ? styles.picker_box : {display: 'none'}}
      activeOpacity={1}>
      <TouchableOpacity style={styles.picker} activeOpacity={1}>
        <View style={styles.picker_head}>
          <Text
            style={{...styles.picker_head_txt}}
            onPress={() => {
              setShowPicker(false);
              closeModal();
            }}>
            取消
          </Text>
          <Text
            style={{...styles.picker_head_txt, color: '#4341A6'}}
            onPress={() => {
              getPickerValue(pickerValue);
            }}>
            确定
          </Text>
        </View>
        <Picker
          mode="dropdown"
          enabled={true}
          style={{height: 50, minWidth: width - 50}}
          selectedValue={pickerValue}
          onValueChange={(itemValue) => {
            setPickerValue(itemValue);
          }}>
          {Array.isArray(pickerData) &&
            pickerData.map((item) => (
              <Picker.Item label={item.value} value={item.key} key={item.key} />
            ))}
        </Picker>
      </TouchableOpacity>
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
    justifyContent: 'flex-end',
  },
  picker: {
    height: height / 2.6,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  picker_head: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  picker_head_txt: {
    color: '#666',
    fontSize: 16,
    padding: 10,
  },
});
