import React, {useState, useCallback, useEffect} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import RULES from '../../methods/rulesConfig';

const Styles = StyleSheet.create({
  form_item: {
    position: 'relative',
  },
  item_error: {
    position: 'absolute',
    right: 25,
    bottom: 8,
    marginTop: 'auto',
    marginBottom: 'auto',
    fontSize: 13,
    color: '#d53d3f',
  },
});

let cTimer: any = null;

interface Props {
  getValue: Function;
  vValue?: string;
  style?: object;
  placeholder?: string;
  placeholderTextColor?: string;
  clearButtonMode?: any;
  secureTextEntry?: boolean;
  keyboardType?: any;
}

export default function FormItem(props: Props) {
  const {
    style,
    placeholder,
    clearButtonMode,
    secureTextEntry,
    vValue,
    getValue,
    keyboardType,
  } = props;
  const [value, setValue]: any = useState(null);
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
      }, 300);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [value],
  );
  return (
    <View style={{...Styles.form_item, ...style}}>
      <TextInput
        placeholder={placeholder}
        clearButtonMode={clearButtonMode}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        placeholderTextColor="#888"
        value={value}
        style={{paddingVertical: 5, fontSize: 16}}
        autoCorrect={false}
      />
      <Text style={Styles.item_error}>{errorMsg}</Text>
    </View>
  );
}
