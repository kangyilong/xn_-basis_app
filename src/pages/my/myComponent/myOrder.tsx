import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import {
  MY_ICON_ALL,
  MY_ICON_DAIFAHUO,
  MY_ICON_DAIFUKUAN,
  MY_ICON_DAISHOUHUO,
  MY_ICON_DONE,
  SINGLE_RIGHT_TO,
} from '@methods/requireImage';
import NavigatorUtil from '@methods/NavigatorUtil';
import {ordersNumber} from '@methods/api/product';

const {width} = Dimensions.get('window');

interface Props {
  refreshing: boolean;
}
export default function MyOrder(props: Props) {
  const {refreshing} = props;
  const _flatRef: any = useRef(null);
  const [tabList, setTabList] = useState([
    {
      id: 'task_tab_0',
      key: '-2',
      title: '全部',
      pic: MY_ICON_ALL,
      orderKey: '-2',
    },
    {
      id: 'task_tab_1',
      key: '0',
      title: '待付款',
      pic: MY_ICON_DAIFUKUAN,
      orderKey: '0',
      tipField: 'waitPayment',
    },
    {
      id: 'task_tab_2',
      key: '3',
      title: '待发货',
      pic: MY_ICON_DAIFAHUO,
      orderKey: '3',
      tipField: 'waitDelivery',
    },
    {
      id: 'task_tab_3',
      key: '4',
      title: '待收货',
      pic: MY_ICON_DAISHOUHUO,
      orderKey: '4',
      tipField: 'waitReceivingGoods',
    },
    {
      id: 'task_tab_4',
      key: '5',
      title: '已完成',
      pic: MY_ICON_DONE,
      orderKey: '5',
    },
  ]);
  const [orders, setOrders]: any = useState({});
  useEffect(() => {
    if (refreshing) {
      ordersNumber().then((data: any) => {
        setOrders(data);
      });
    }
  }, [refreshing]);
  return (
    <View style={styles.my_order}>
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.m_o_head}
        onPress={() => NavigatorUtil.goPage('UserOrder')}>
        <Text style={styles.h_txt}>我的订单</Text>
        <Image style={styles.h_img} source={SINGLE_RIGHT_TO} />
      </TouchableOpacity>
      <View style={styles.m_o_tabs}>
        <FlatList
          ref={_flatRef}
          style={{flex: 1}}
          showsHorizontalScrollIndicator={false}
          horizontal={true}
          data={tabList}
          getItemLayout={(data, index) => ({
            length: width / 5,
            offset: (width / 5) * index,
            index,
          })}
          renderItem={({item, index}) => (
            <TouchableOpacity
              key={item.id}
              style={styles.t_single}
              activeOpacity={0.9}
              onPress={() => {
                _flatRef.current.scrollToIndex({index, viewPosition: 0.5});
                NavigatorUtil.goPage('UserOrder', {orderKey: item.orderKey});
              }}>
              <Image style={styles.tab_s_pic} source={item.pic} />
              <Text style={styles.tab_s_txt}>{item.title}</Text>
              {['0', '3', '4'].includes(item.key) &&
              item.tipField &&
              +orders[item.tipField] > 0 ? (
                <View style={styles.tab_tp}>
                  <Text style={styles.tp_txt}>{orders[item.tipField]}</Text>
                </View>
              ) : null}
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  my_order: {
    backgroundColor: '#fff',
    marginBottom: 10,
    marginTop: 10,
  },
  m_o_head: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 45,
    borderStyle: 'solid',
    borderColor: '#DFDFDF',
    borderBottomWidth: 1,
    marginLeft: 20,
    width: width - 40,
  },
  h_txt: {
    color: '#333333',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
    fontFamily: 'PingFangSC-Medium',
  },
  h_img: {
    width: 8,
    height: 13,
  },
  m_o_tabs: {
    width,
  },
  t_single: {
    paddingTop: 18,
    alignItems: 'center',
    width: width / 5,
    paddingBottom: 16,
    position: 'relative',
  },
  tab_s_pic: {
    width: 23,
    height: 23,
    marginBottom: 5,
  },
  tab_s_txt: {
    color: '#333333',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    fontFamily: 'PingFangSC-Medium',
  },
  tab_tp: {
    position: 'absolute',
    right: 20,
    top: 14,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#CFAA8E',
    width: 14,
    height: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  tp_txt: {
    color: '#CFAA8E',
    fontSize: 9,
    lineHeight: 13,
    fontFamily: 'PingFangSC-Medium',
    fontWeight: '500',
  },
});
