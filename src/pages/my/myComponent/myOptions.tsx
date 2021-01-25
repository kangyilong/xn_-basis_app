import React from 'react';
import {StyleSheet, View, Text, Image, TouchableOpacity} from 'react-native';
import {
  ORDER_S_RIGHT_TO,
  MY_OPTIONS_ABOUT,
  MY_OPTIONS_EXCHANGE,
  MY_OPTIONS_HELP,
  MY_OPTIONS_INVITE,
  MY_OPTIONS_SAFETY,
  MY_OPTIONS_TUANDUI,
} from '@methods/requireImage';
import NavigatorUtil from '@methods/NavigatorUtil';
import {agentActivity} from "@methods/api/theZone";

export default function MyOptions() {
  return (
    <View style={styles.my_options}>
      <View style={styles.op_box}>
        <TouchableOpacity
          style={styles.op_single}
          activeOpacity={0.9}
          onPress={() => NavigatorUtil.goPage('ZcExchange')}>
          <View style={styles.op_s_left}>
            <Image style={styles.op_s_pic} source={MY_OPTIONS_EXCHANGE} />
            <Text style={styles.op_s_txt}>资产互兑</Text>
          </View>
          <Image style={styles.op_r_pic} source={ORDER_S_RIGHT_TO} />
        </TouchableOpacity>
      </View>
      <View style={styles.op_box}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.op_single}
          onPress={() => {
              agentActivity(true).then((d: any) => {
                  if (d.status !== '2') {
                      NavigatorUtil.goPage('Authentication', {origin: 'smrz'});
                  }else {
                      NavigatorUtil.goPage('MyTeam');
                  }
              });
          }}>
          <View style={styles.op_s_left}>
            <Image style={styles.op_s_pic} source={MY_OPTIONS_TUANDUI} />
            <Text style={styles.op_s_txt}>我的团队</Text>
          </View>
          <Image style={styles.op_r_pic} source={ORDER_S_RIGHT_TO} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.op_single}
          onPress={() => NavigatorUtil.goPage('InviteFriends')}>
          <View style={styles.op_s_left}>
            <Image style={styles.op_s_pic} source={MY_OPTIONS_INVITE} />
            <Text style={styles.op_s_txt}>邀请好友</Text>
          </View>
          <Image style={styles.op_r_pic} source={ORDER_S_RIGHT_TO} />
        </TouchableOpacity>
      </View>
      <View style={styles.op_box}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.op_single}
          onPress={() => NavigatorUtil.goPage('AccountSecurity')}>
          <View style={styles.op_s_left}>
            <Image style={styles.op_s_pic} source={MY_OPTIONS_SAFETY} />
            <Text style={styles.op_s_txt}>安全中心</Text>
          </View>
          <Image style={styles.op_r_pic} source={ORDER_S_RIGHT_TO} />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.op_single}
          onPress={
            () =>
              NavigatorUtil.goPage('SystemParams', {
                ckey: 'help_center_textarea',
                name: '帮助及反馈',
              })
            // NavigatorUtil.goPage('HelpCenter')
          }>
          <View style={styles.op_s_left}>
            <Image style={styles.op_s_pic} source={MY_OPTIONS_HELP} />
            <Text style={styles.op_s_txt}>帮助及反馈</Text>
          </View>
          <Image style={styles.op_r_pic} source={ORDER_S_RIGHT_TO} />
        </TouchableOpacity>
      </View>
      <View style={styles.op_box}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.op_single}
          onPress={() => NavigatorUtil.goPage('AboutUs')}>
          <View style={styles.op_s_left}>
            <Image style={styles.op_s_pic} source={MY_OPTIONS_ABOUT} />
            <Text style={styles.op_s_txt}>关于我们</Text>
          </View>
          <Image style={styles.op_r_pic} source={ORDER_S_RIGHT_TO} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  my_options: {
    paddingBottom: 30,
  },
  op_box: {
    backgroundColor: '#fff',
    marginBottom: 12,
    paddingLeft: 20,
    paddingRight: 20,
  },
  op_single: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 65,
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#F5F5F5',
  },
  op_s_left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  op_s_pic: {
    width: 22,
    height: 22,
    marginRight: 12,
  },
  op_s_txt: {
    color: '#111111',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
    fontFamily: 'PingFangSC-Medium',
  },
  op_r_pic: {
    width: 8,
    height: 13,
  },
});
