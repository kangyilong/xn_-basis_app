import React, {useState, useCallback, useEffect} from 'react';
import {View, Text, TextInput} from 'react-native';

import Styles from './Styles';
import RULES from '../../methods/rulesConfig';

let cTimer: any = null;

interface Props {
  RightBtn?: any;
  vValue?: string;
  style?: object;
  iupStyle?: object;
  placeholder?: string;
  placeholderTextColor?: string;
  clearButtonMode?: any;
  secureTextEntry?: boolean;
  keyboardType?: any;
  defValue?: any;
  errorBottom?: number;
  textContentType?: any;
  getValue: Function;
  onBlur?: Function;
}
export default function FormSingleItem(props: Props) {
  const {
    RightBtn,
    vValue,
    style,
    iupStyle,
    placeholder,
    placeholderTextColor,
    clearButtonMode,
    secureTextEntry,
    keyboardType,
    getValue,
    defValue,
    onBlur,
    errorBottom = 10,
    textContentType = 'none',
  }: any = props;
  const [value, setValue] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const onChangeText = useCallback(
    (v) => {
      setValue(v);
      if (!vValue) {
        getValue(v);
        return;
      }
      if (cTimer) {
        clearTimeout(cTimer);
      }
      cTimer = setTimeout(() => {
        // @ts-ignore
        const regObj = RULES[vValue];
        if (v && regObj && !regObj.rules.test(v)) {
          setErrorMsg(regObj.warnMsg);
          getValue('');
        } else {
          setErrorMsg(null);
          getValue(v);
        }
      }, 500);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value],
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!value && defValue) {
      setValue(defValue);
    }
  });
  return (
    <View style={{...Styles.form_single, ...style}}>
      <View style={Styles.single_iup}>
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          clearButtonMode={clearButtonMode ? clearButtonMode : 'while-editing'}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          value={value}
          style={{flex: 1, ...iupStyle}}
          autoCapitalize="none"
          autoCorrect={false}
          textContentType={textContentType}
          onBlur={onBlur}
        />
        {vValue ? (
          <Text style={{...Styles.item_error, bottom: errorBottom}}>
            {errorMsg}
          </Text>
        ) : null}
      </View>
      {RightBtn && <RightBtn />}
    </View>
  );
}
