import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {getMsg, removeSaveMsg} from '@methods/util';
import {PERSON_GO_BACK, PERSON_GO_BACK_BAI} from '@methods/requireImage';
import NavigatorUtil from '@methods/NavigatorUtil';

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  head_box: {
    position: 'relative',
    zIndex: 999,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  head_left: {
    paddingLeft: 0.0483 * width,
    paddingRight: 30,
    paddingTop: 4,
    paddingBottom: 18,
  },
  head_icon: {
    width: 13,
    height: 18,
  },
  head_con: {
    position: 'absolute',
    left: 50,
    right: 50,
  },
  head_tit: {
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'PingFangSC-Semibold',
  },
});
let H = 0;
setTimeout(() => {
  getMsg('barHeight').then((hi: any) => {
    H = +hi;
  });
}, 1000);

interface Props {
  name: string;
  navigation?: any;
  bgColor?: string;
  HeadRight?: any;
  leftGoTo?: Function;
  isDark?: boolean; // 黑色背景
  headStyle?: any;
  abTop?: number; // 自定义距离屏幕顶部高度
}
export default function PageHeader(props: Props) {
  const {
    name,
    navigation,
    bgColor,
    HeadRight,
    leftGoTo,
    headStyle,
    isDark = false,
    abTop = 0,
  } = props;
  const HH = abTop || H;
  return (
    HH > 0 && (
      <View
        style={
          headStyle
            ? {
                paddingTop: HH,
                ...styles.head_box,
                ...headStyle,
                backgroundColor: bgColor ? bgColor : isDark ? '#000' : '#fff',
              }
            : {
                paddingTop: HH,
                ...styles.head_box,
                backgroundColor: bgColor ? bgColor : isDark ? '#000' : '#fff',
              }
        }>
        <TouchableOpacity
          style={styles.head_left}
          activeOpacity={0.9}
          onPress={() => {
            typeof leftGoTo === 'function'
              ? leftGoTo()
              : navigation
              ? navigation.goBack()
              : NavigatorUtil.goBack();
          }}>
          <Image
            style={styles.head_icon}
            source={isDark ? PERSON_GO_BACK_BAI : PERSON_GO_BACK}
          />
        </TouchableOpacity>
        <View style={{...styles.head_con, top: HH}}>
          <Text
            style={{...styles.head_tit, color: isDark ? '#fff' : '#333333'}}>
            {name}
          </Text>
        </View>
        {HeadRight ? <HeadRight /> : null}
      </View>
    )
  );
}
