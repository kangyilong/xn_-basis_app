import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
// @ts-ignore
import Orientation from 'react-native-orientation';
import {darkContent, isLogin} from '@methods/util';
import {APP_START_ICON} from '@methods/requireImage';
import NavigatorUtil from '@methods/NavigatorUtil';

interface Props {
  navigation: any;
}
export default class Welcome extends React.PureComponent<Props, any> {
  state = {
    num: 2,
  };
  interval: any = null;
  componentDidMount() {
    Orientation.lockToPortrait && Orientation.lockToPortrait();
    darkContent('1');
    NavigatorUtil.navigation = this.props.navigation;
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.interval = setInterval(async () => {
      if (this.state.num < 1) {
        clearInterval(this.interval);
        if (await isLogin()) {
          return this.props.navigation.navigate('Home');
        }
        return this.props.navigation.navigate('ToLog');
      }
      this.setState((pevState: any) => ({
        num: pevState.num - 1,
      }));
    }, 1000);
  }
  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
  render() {
    return (
      <View style={styles.welcomeBox}>
        <Image style={styles.w_icon} source={APP_START_ICON} />
        <Text style={styles.w_title}>杏福宝</Text>
        <Text style={styles.w_txt}>让幸福如影随形</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  welcomeBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0B3254',
  },
  w_icon: {
    marginTop: -30,
    width: 91,
    height: 91,
    marginBottom: 5,
  },
  w_title: {
    fontSize: 30,
    lineHeight: 42,
    color: '#fff',
    fontWeight: '600',
    fontFamily: 'PingFangSC-Semibold',
    marginBottom: 5,
  },
  w_txt: {
    color: '#fefefe',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
    fontFamily: 'PingFangSC-Semibold',
  },
});
