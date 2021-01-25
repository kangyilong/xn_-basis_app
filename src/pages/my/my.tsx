import React from 'react';
import {View, StyleSheet, ScrollView, RefreshControl} from 'react-native';
import MyHead from './myComponent/myHead';
import MyOrder from './myComponent/myOrder';
import MyOptions from './myComponent/myOptions';
import {getUserDetail, cuserDetailWilling} from '@methods/api/personalApi';
import {darkContent, removeMsg, saveMsg} from '@methods/util';
import {themeColor} from '@methods/config';

interface Props {
  navigation: any;
}
export default class My extends React.PureComponent<Props, any> {
  state = {
    refreshing: false,
    userMsg: {},
    ylzData: {
      willingValue: 0,
    },
  };
  _navListener: any = null;
  userDetails = () => {
    getUserDetail()
      .then((data: any) => {
        const {kind} = data;
        saveMsg('kind', kind);
        saveMsg('userDetail', JSON.stringify(data));
        this.setState({
          userMsg: data,
          refreshing: false,
        });
      })
      .catch(() => {
        this.setState({
          refreshing: false,
        });
      });
  };
  _onRefresh = () => {
    this.setState(
      {
        refreshing: true,
      },
      () => this.userDetails(),
    );
  };
  componentDidMount() {
    let num = 0;
    this._navListener = this.props.navigation.addListener('didFocus', () => {
      darkContent('light');
      if (num > 0) {
        return this.userDetails();
      }
      num++;
      this._onRefresh();
      cuserDetailWilling().then((d: any) => {
        this.setState({
          ylzData: d,
        });
      });
      removeMsg('addressMsg');
    });
  }
  componentWillUnmount() {
    this._navListener.remove();
  }
  render() {
    const {refreshing, userMsg, ylzData} = this.state;
    return (
      <View style={styles.my_page}>
        <MyHead userMsg={userMsg} ylz={ylzData.willingValue} />
        <ScrollView
          style={{flex: 1}}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              tintColor={themeColor}
              colors={[themeColor]}
              refreshing={refreshing}
              onRefresh={this._onRefresh}
            />
          }>
          <MyOrder refreshing={refreshing} />
          <MyOptions />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  my_page: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
});
