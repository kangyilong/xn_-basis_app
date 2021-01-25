import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
    FlatList
} from 'react-native';
import Swiper from '@components/swiper/Swiper';
import Marquee from '@components/marquee/Marquee';
import {
    HOME_FL,
    HOME_DD,
    HOME_GG,
    HOME_GR,
    HOME_HR,
    HOME_JJH,
    HOME_SHOP_HUO,
    HOME_SHOP_HR,
    HOME_SHOP_HUA,
} from '@methods/requireImage';
import NavigatorUtil from '@methods/NavigatorUtil';
import {
    darkContent,
    getMsg,
    isLogin,
    cityDataFn,
    removeMsg,
    saveMsg,
    delImgQuality,
} from '@methods/util';
import {cnavigateList, smsListFront} from '@methods/api/publicApi';
import {productList} from '@methods/api/product';
import {getCityList} from '@methods/api/publicApi';
import {agentActivity} from '@methods/api/theZone';
import NoData from '@components/noData/NoData';
import {themeColor} from '@methods/config';

const {width} = Dimensions.get('window');
let HH = 0;
setTimeout(() => {
    getMsg('barHeight').then((hi: any) => {
        HH = +hi;
    });
}, 1000);

interface Props {
    navigation: any;
}

export default class Home extends React.PureComponent<Props, any> {
    state = {
        swiperData: [],
        activeData: [],
        msgList: [],
        tabActive: '0', // 0 热卖产品  1 纪念堂
        hotList: [],
        refreshing: false,
        tabList: [{
            id: '1',
            icon: HOME_FL,
            text: '分类',
            uri: 'SearchTypes'
        }, {
            id: '2',
            icon: HOME_DD,
            text: '订单',
            uri: 'UserOrder'
        }, {
            id: '3',
            icon: HOME_JJH,
            text: '基金会',
            uri: 'Jijinhui'
        }, {
            id: '4',
            icon: HOME_GR,
            text: '个人中心',
            uri: 'My'
        // }, {
        //     id: '5',
        //     icon: HOME_XQ_ICON,
        //     text: '孝亲礼包',
        //     uri: 'SearchTypes'
        // }, {
        //     id: '6',
        //     icon: HOME_lP_ICON,
        //     text: '链·祭祀',
        //     uri: 'UserOrder'
        // }, {
        //     id: '7',
        //     icon: HOME_RSDA_ICON,
        //     text: '人生档案',
        //     uri: 'Jijinhui'
        // }, {
        //     id: '8',
        //     icon: HOME_lS_ICON,
        //     text: '链·家谱',
        //     uri: 'My'
        }]
    };
    _flatRef: any = null;
    _navListener: any = null;
    _navBlur: any = null;
    onMsgClick = (item: any) => {
        NavigatorUtil.goPage('MessageDetail', {
            msgType: '1',
            code: item.label,
        });
    };
    sellingActive = () => {
        this.setState({
            tabActive: '0',
        });
    };
    memorialActive = () => {
        this.setState({
            tabActive: '1',
        });
    };
    _sellingProducts = (item: any) => {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                style={styles.it_box}
                key={item.id}
                onPress={() => {
                    NavigatorUtil.goPage('ShopDetail', {id: item.id});
                }}>
                <Image
                    source={{uri: delImgQuality(item.thumb)}}
                    style={styles.it_b_img}
                />
                <View style={styles.it_foo}>
                    <Text style={styles.it_f_tit}>{item.productName}</Text>
                    <Text style={styles.it_f_price}>￥{item.price}</Text>
                </View>
            </TouchableOpacity>
        );
    };
    _memorialHall = (item: any) => {
        return (
            <View style={styles.hall_box} key={item.id}>
                <View style={styles.hall_l}>
                    <View style={styles.h_pic_box}>
                        <Image style={styles.hall_l_pic} source={HOME_SHOP_HUO}/>
                    </View>
                    <Text style={styles.hall_l_txt}>1893-1976</Text>
                </View>
                <View style={styles.hall_r}>
                    <Text style={styles.hall_r_h}>爱因斯坦</Text>
                    <View style={styles.hr_single}>
                        <Image style={styles.hr_s_pic} source={HOME_SHOP_HUO}/>
                        <Text style={styles.hall_r_txt}>123.12万</Text>
                    </View>
                    <View style={styles.hr_single}>
                        <Image style={styles.hr_s_pic} source={HOME_SHOP_HR}/>
                        <Text style={styles.hall_r_txt}>12345</Text>
                    </View>
                    <View style={styles.hr_single}>
                        <Image style={styles.hr_s_pic} source={HOME_SHOP_HUA}/>
                        <Text style={styles.hall_r_txt}>782374</Text>
                    </View>
                </View>
            </View>
        );
    };
    _flatItem = (item: any) => {
        const {tabActive} = this.state;
        return tabActive === '0'
            ? this._sellingProducts(item)
            : this._memorialHall(item);
    };
    getCnavigateList = (location: string) => {
        cnavigateList(location).then((data: any) => {
            const ll = location === '0' ? 'swiperData' : 'activeData';
            this.setState({
                [ll]: data,
            });
        });
    };
    getSmsListFront = () => {
        smsListFront().then((data: any) => {
            this.setState({
                msgList: data.map((item: any) => ({
                    value: item.title,
                    label: item.id,
                })),
            });
        });
    };
    getProductPage = () => {
        productList({position: '0'}).then((data: any) => {
            this.setState({
                hotList: data || [],
                refreshing: false,
            });
        });
    };
    _onRefresh = () => {
        this.getCnavigateList('0');
        this.getCnavigateList('1');
        this.getSmsListFront();
        this.setState(
            {
                refreshing: true,
            },
            () => {
                this.getProductPage();
            },
        );
    };

    componentDidMount() {
        let num = 0;
        this._navListener = this.props.navigation.addListener('didFocus', () => {
            darkContent('light');
            removeMsg('addressMsg');
            this.getCnavigateList('0');
            this.getCnavigateList('1');
            this.getSmsListFront();
            isLogin().then((isOk: boolean) => {
                if (isOk) {
                    getMsg('cityData').then((d: any) => {
                        if (!d) {
                            getCityList().then((data: any) => {
                                if (data) {
                                    cityDataFn(data);
                                }
                            });
                        }
                    });
                }
            });
            if (num > 0) {
                return this.getProductPage();
            }
            num++;
            this.setState(
                {
                    refreshing: true,
                },
                this.getProductPage,
            );
            agentActivity().then((d: any) => {
                if (d.status === '2') {
                    saveMsg('isZone', '1');
                } else {
                    removeMsg('isZone');
                }
            });
        });
    }

    componentWillUnmount() {
        this._navListener && this._navListener.remove();
    }

    render() {
        const {
            swiperData,
            msgList,
            tabActive,
            refreshing,
            hotList,
            activeData,
            tabList
        } = this.state;
        return (
            <View style={{...styles.home_page, paddingTop: HH}}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={styles.home_con}
                    refreshControl={
                        <RefreshControl
                            tintColor={themeColor}
                            colors={[themeColor]}
                            refreshing={refreshing}
                            onRefresh={this._onRefresh}
                        />
                    }>
                    <Swiper
                        swiperHeight={170}
                        autoplayTimeout={3}
                        swiperData={swiperData}
                    />
                    <View style={styles.home_types}>
                        <FlatList
                            ref={(val) => this._flatRef = val}
                            style={{flex: 1}}
                            showsHorizontalScrollIndicator={false}
                            horizontal={true}
                            data={tabList}
                            getItemLayout={(data, index) => ({
                                length: width / 4,
                                offset: (width / 4) * index,
                                index,
                            })}
                            renderItem={({item, index}: any) => (
                                <TouchableOpacity
                                    key={item.id}
                                    activeOpacity={0.9}
                                    onPress={() => {
                                        this._flatRef.scrollToIndex({index, viewPosition: 0.5});
                                        setTimeout(() => {
                                            NavigatorUtil.goPage(item.uri, item.params || {});
                                        }, 100 * (Math.floor(tabList.length / 2)));
                                    }}
                                    style={styles.t_single}
                                >
                                    <Image style={styles.t_s_img} source={item.icon}/>
                                    <Text style={styles.t_s_txt}>{item.text}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                    <View style={styles.home_ggao}>
                        <View style={styles.gg_left}>
                            <Image source={HOME_GG} style={styles.gg_img}/>
                            {msgList.length > 0 && (
                                <Marquee
                                    textList={msgList}
                                    width={width - 175}
                                    height={30}
                                    textStyle={{
                                        fontSize: 14,
                                        color: '#111111',
                                        fontWeight: '500',
                                        fontFamily: 'PingFang SC',
                                    }}
                                    onTextClick={this.onMsgClick}
                                />
                            )}
                        </View>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            style={styles.gg_right}
                            onPress={() => {
                                saveMsg('msgType', '1').then(() => {
                                    NavigatorUtil.goPage('XiaoXi');
                                });
                            }}>
                            <Text style={styles.gg_r_txt}>更多</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.xc_box}>
                        <Swiper
                            swiperWidth={width - 16}
                            swiperHeight={84}
                            autoplayTimeout={5}
                            swiperData={activeData}
                            autoplay={false}
                            borderRadius={8}
                            indicatorWidth={0}
                        />
                    </View>
                    <View style={styles.shop_box}>
                        <View style={styles.shop_tabs}>
                            <TouchableOpacity
                                style={styles.tab_single}
                                activeOpacity={0.9}
                                onPress={this.sellingActive}>
                                {tabActive === '0' ? (
                                    <Image style={styles.tab_img} source={HOME_HR}/>
                                ) : null}
                                <Text
                                    style={
                                        tabActive === '0'
                                            ? {...styles.tab_txt, ...styles.tab_txt_active}
                                            : styles.tab_txt
                                    }>
                                    热卖产品
                                </Text>
                            </TouchableOpacity>
                            {/*<View style={styles.tab_line}/>*/}
                            {/*<TouchableOpacity*/}
                                {/*style={styles.tab_single}*/}
                                {/*activeOpacity={0.9}*/}
                                {/*onPress={this.memorialActive}>*/}
                                {/*{tabActive === '1' ? (*/}
                                    {/*<Image style={styles.tab_img} source={HOME_JTL_ICON}/>*/}
                                {/*) : null}*/}
                                {/*<Text*/}
                                    {/*style={*/}
                                        {/*tabActive === '1'*/}
                                            {/*? {...styles.tab_txt, ...styles.tab_txt_active}*/}
                                            {/*: styles.tab_txt*/}
                                    {/*}>*/}
                                    {/*纪念堂*/}
                                {/*</Text>*/}
                            {/*</TouchableOpacity>*/}
                        </View>
                    </View>
                    {hotList.length > 0 ? (
                        <View style={styles.shop_list}>
                            {hotList.map((item) => this._flatItem(item))}
                        </View>
                    ) : (
                        <NoData noText="暂无商品"/>
                    )}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    home_page: {
        flex: 1,
        backgroundColor: '#0B3254',
    },
    home_con: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    home_types: {
        backgroundColor: '#fff',
        width,
        paddingTop: 12,
        paddingLeft: 22,
        paddingRight: 25,
        paddingBottom: 9,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    t_single: {
        alignItems: 'center',
        width: (width - 22 - 25) / 4
    },
    t_s_img: {
        width: 45,
        height: 45,
        marginBottom: 3,
    },
    t_s_txt: {
        color: '#111111',
        fontSize: 14,
        lineHeight: 20,
    },
    home_ggao: {
        height: 42,
        alignItems: 'center',
        flexDirection: 'row',
        paddingLeft: 20,
        paddingRight: 20,
        justifyContent: 'space-between',
        backgroundColor: '#fff',
    },
    gg_left: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    gg_img: {
        width: 20,
        height: 20,
        marginRight: 17,
    },
    gg_right: {
        borderRadius: 10,
        width: 40,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#CFAA8E',
    },
    gg_r_txt: {
        color: '#CFAA8E',
        fontSize: 12,
        lineHeight: 17,
    },
    xc_box: {
        backgroundColor: '#fff',
        paddingTop: 8,
        paddingLeft: 8,
        paddingBottom: 13,
    },
    shop_box: {
        width,
        paddingTop: 22,
        paddingLeft: 8,
        paddingRight: 8,
    },
    shop_tabs: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    tab_single: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    tab_img: {
        width: 20,
        height: 20,
        marginRight: 6,
    },
    tab_txt: {
        color: '#333333',
        fontSize: 17,
        lineHeight: 24,
        fontWeight: '500',
        fontFamily: 'PingFangSC-Medium'
    },
    tab_txt_active: {
        color: '#CFAA8E',
    },
    tab_line: {
        width: 1,
        height: 20,
        backgroundColor: '#DFDFDF',
        marginLeft: 23,
        marginRight: 22,
    },
    shop_list: {
        flex: 1,
        paddingBottom: 40,
        paddingRight: 8,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    it_box: {
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingBottom: 12,
        width: (width - 24) / 2,
        marginLeft: 8,
        marginBottom: 15,
        overflow: 'hidden',
    },
    it_b_img: {
        width: (width - 24) / 2,
        height: (width - 24) / 2,
    },
    it_foo: {
        paddingTop: 9,
        paddingLeft: 11,
    },
    it_f_tit: {
        color: '#111111',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 7,
    },
    it_f_price: {
        color: '#CFAA8E',
        fontSize: 18,
    },
    hall_box: {
        marginLeft: 8,
        width: (width - 24) / 2,
        backgroundColor: '#fff',
        borderRadius: 8,
        paddingTop: 12,
        paddingBottom: 8,
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: 'row',
        marginBottom: 15
    },
    hall_l: {
        alignItems: 'center',
        marginRight: 10,
    },
    h_pic_box: {
        borderRadius: 4,
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: '#CFAA8E',
        marginBottom: 6
    },
    hall_l_pic: {
        width: 80,
        height: 90
    },
    hall_l_txt: {
        color: '#333333',
        fontSize: 12,
        lineHeight: 16,
        fontWeight: '500',
        fontFamily: 'PingFangSC-Regular'
    },
    hall_r: {},
    hall_r_h: {
        color: '#333333',
        fontSize: 16,
        lineHeight: 20,
        marginBottom: 3,
        fontWeight: '500',
        fontFamily: 'PingFangSC-Medium'
    },
    hr_single: {
        marginTop: 6,
        flexDirection: 'row',
        alignItems: 'center',
    },
    hr_s_pic: {
        width: 16,
        height: 16,
        marginRight: 8,
    },
    hall_r_txt: {
        color: '#999999',
        fontSize: 13,
        lineHeight: 18,
        fontWeight: '500',
        fontFamily: 'PingFangSC-Medium'
    },
});
