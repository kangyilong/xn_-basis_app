import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {TO_LOGO} from '@methods/requireImage';
import {darkContent} from '@methods/util';

const {width} = Dimensions.get('window');

interface Props {
  navigation: any;
}
export default class ToLog extends React.PureComponent<Props, any> {
  _navListener: any = null;
  toLogin = () => {
    this.props.navigation.navigate('Login');
  };
  toRegister = () => {
    this.props.navigation.navigate('Register');
  };
  componentDidMount() {
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      darkContent('dark');
    });
  }
  componentWillUnmount() {
    this._navListener.remove();
  }
  render() {
    return (
      <View style={styles.to_log}>
        <View style={styles.log_t}>
          <Image
            source={TO_LOGO}
            style={{width: 70, height: 70, marginBottom: 11}}
          />
          <Text style={styles.t_name}>杏福宝</Text>
          <Text style={styles.t_text}>让幸福如影随形</Text>
        </View>
        <TouchableOpacity
          style={{...styles.btn_box, ...styles.login_btn}}
          activeOpacity={0.9}
          onPress={this.toLogin}>
          <Text style={styles.l_txt}>登录</Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.9}
          style={{...styles.btn_box, ...styles.reg_btn}}
          onPress={this.toRegister}>
          <Text style={styles.r_txt}>注册</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  to_log: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 185,
    alignItems: 'center',
  },
  log_t: {
    marginBottom: 61,
    alignItems: 'center',
  },
  t_name: {
    color: '#111111',
    fontSize: 20,
    lineHeight: 28,
    marginBottom: 2,
    textAlign: 'center',
    fontWeight: '600',
  },
  t_text: {
    color: '#888888',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  btn_box: {
    width: width - 40,
    height: 52,
    lineHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  login_btn: {
    backgroundColor: '#0B3254',
    marginBottom: 20,
  },
  reg_btn: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#0B3254',
  },
  l_txt: {
    color: '#fff',
    fontSize: 18,
  },
  r_txt: {
    color: '#0B3254',
    fontSize: 18,
  },
});
