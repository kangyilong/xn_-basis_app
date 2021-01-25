import * as React from 'react';

import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';
import {themeColor} from '@methods/config';

interface Props {
  title?: string;
  size?: any;
  style?: object;
  noText?: boolean;
}
export default function Loading(props: Props) {
  const {title = 'Loading...', size = 'small', style, noText = false} = props;
  return (
    <View style={{...styled.loadBox, ...style}}>
      <ActivityIndicator
        style={styled.indicator}
        animating={true}
        size={size}
        color={themeColor}
      />
      {!noText ? <Text style={styled.loadText}>{title}</Text> : null}
    </View>
  );
}

const styled = StyleSheet.create({
  loadBox: {
    flex: 1,
    paddingTop: 180,
  },
  indicator: {
    marginBottom: 6,
  },
  loadText: {
    textAlign: 'center',
    fontSize: 14,
    color: themeColor,
  },
});
