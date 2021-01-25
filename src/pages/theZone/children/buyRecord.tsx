import React, {Fragment} from 'react';
import {
    StyleSheet,
    ScrollView,
    View,
    Text,
    ImageBackground,
    FlatList,
    Dimensions,
    TouchableOpacity,
    RefreshControl,
    TextInput
} from 'react-native';
import PageHeader from '@components/PageHeader/PageHeader';
import NoData from '@components/noData/NoData';
import BtmModal from '@components/ConfirmModal/BtmModal';
import LinearGradient from 'react-native-linear-gradient';
import NavigatorUtil from "@methods/NavigatorUtil";
import {BY_HEAD_BG} from '@methods/requireImage';
import ByLookDetail from "@pages/theZone/children/buyRecordComponent/lookDetail";
import Renewal from "@pages/theZone/children/buyRecordComponent/renewal";
import {agentAssetsHead, agentAssetsPageFront, agentAssetsExchange} from '@methods/api/theZone';
import {themeColor} from "@methods/config";
import {darkContent, formatDate, operationPrompt, toTradingPaw} from "@methods/util";

const {width, height} = Dimensions.get('window');
const tagColors: any = {
    '0': ['#6998D2', '#4A79B3'],
    '1': ['#EECBB0', '#CFAA8E'],
    '2': ['#EECBB0', '#CFAA8E'],
    '3': ['#CBCED2', '#9BA1A9'],
    '4': ['#CBCED2', '#9BA1A9'],
};
const cpObj: any = {
    '0': {
        btnTxt: '使用',
        path: 'YxbQsy',
        params: {
            origin: 'zq'
        }
    },
    '1': {
        visField: 'type',
        btnTxtObj: {
            '0': {
                txt: '续费',
                params: {
                    type: '0'
                }
            },
            '1': {
                txt: '管理费',
                params: {
                    type: '1'
                }
            }
        },
        path: 'Renewal',
        params: {}
    },
    '2': {
        visField: 'type',
        btnTxtObj: {
            '0': {
                txt: '续费',
                params: {
                    type: '0'
                }
            },
            '1': {
                txt: '管理费',
                params: {
                    type: '1'
                }
            }
        },
        path: 'Renewal',
        params: {}
    },
    '3': {
        btnTxt: '管理费',
        path: 'Renewal',
        params: {
            type: '1'
        }
    },
};

interface Props {
    navigation: any;
}
export default class BuyRecord extends React.PureComponent<Props, any> {
    state = {
        refreshing: false,
        headObj: {},
        tabList: [{
            id: '0',
            title: '已使用年供',
            field: 'use'
        }, {
            id: '1',
            title: '已到期年供',
            field: 'expires'
        }, {
            id: '2',
            title: '已过期年供',
            field: 'over'
        }, {
            id: '3',
            title: '已兑换年供',
            field: 'merge'
        }, {
            id: '4',
            title: '已下供年供',
            field: 'down'
        }],
        pageNum: 1,
        pageFront: [],
        mVisible: false,
        pwd: '',
        tipMsg: '',
    };
    isOk: boolean = false;
    isScroll: boolean = true;
    _interOut: any = null;
    _flatRef: any = null;
    _subscription: any = null;
    _scrollRef: any = null;
    onPackageScroll = (ev: any) => {
        ev.persist();
        if (this.isScroll) {
            if (this._interOut) {
                clearTimeout(this._interOut);
            }
            this._interOut = setTimeout(() => {
                const {contentOffset} = ev.nativeEvent;
                let {pageNum} = this.state;
                if (contentOffset.y > (height / 2) * pageNum) {
                    this.isScroll = false;
                    this.setState({
                        pageNum: ++pageNum,
                    }, this._getAgentAssetsPageFront);
                }
            }, 300);
        }
    };
    _getAgentAssetsHead = () => {
        agentAssetsHead().then((d: any) => {
            this.setState({
                headObj: d
            })
        });
    };
    _getAgentAssetsPageFront = () => {
        const {pageNum, refreshing, pageFront} = this.state;
        agentAssetsPageFront({pageNum}).then((data: any) => {
            const {list, pages} = data;
            let ll = [];
            if (refreshing) {
                ll = list;
            } else if (pageNum < pages + 1) {
                ll = [...pageFront, ...list];
            } else {
                return this.isScroll = false;
            }
            this.isScroll = true;
            this.setState({
                refreshing: false,
                pageFront: ll
            });
        });
    };
    _init = () => {
        this._getAgentAssetsHead();
        this._getAgentAssetsPageFront();
    };
    _onRefresh = () => {
        this.setState(
            {
                refreshing: true,
                pageNum: 1
            },
            this._init
        );
    };
    confirmModal = () => {
        if (!this.state.pwd) {
            return this.setState({
                tipMsg: '请输入支付密码',
            });
        }
        if (!this.isOk) {
            this.isOk = true;
            agentAssetsExchange({pwd: this.state.pwd}).then(() => {
                operationPrompt('兑换成功');
                this.isOk = false;
                this.setState({
                    mVisible: false,
                    pageNum: 1,
                    refreshing: true
                }, this._init);
            }).catch(() => {
                this.isOk = false;
                this.setState({
                    mVisible: false
                });
            });
        }
    };
    componentDidMount() {
        this._subscription = this.props.navigation.addListener('didFocus', () => {
            darkContent('l');
            this.setState({
                pageNum: 1,
                refreshing: true
            }, this._init);
        });
    }
    componentWillUnmount() {
        this._subscription.remove();
    }
    render() {
        const {navigation} = this.props;
        const {tabList, refreshing, headObj, pageFront, mVisible, tipMsg}: any = this.state;
        const _tpModal = () => (
            <View style={styles.c_iup_box}>
                <TextInput
                    style={styles.tp_iup}
                    autoCapitalize="none"
                    clearButtonMode="while-editing"
                    secureTextEntry={true}
                    keyboardType="numeric"
                    placeholder="请输入支付密码"
                    placeholderTextColor="#888888"
                    onChangeText={(v) => this.setState({pwd: v})}
                />
            </View>
        );
        return <View style={{flex: 1, backgroundColor: '#F5F5F5'}}>
            <ScrollView
                style={{flex: 1}}
                showsVerticalScrollIndicator={false}
                ref={(el) => (this._scrollRef = el)}
                onScroll={this.onPackageScroll}
                scrollEventThrottle={16}
                removeClippedSubviews={true}
                refreshControl={
                    <RefreshControl
                        tintColor={themeColor}
                        colors={[themeColor]}
                        refreshing={refreshing}
                        onRefresh={this._onRefresh}
                    />
                }
            >
                <ImageBackground source={BY_HEAD_BG} style={styles.by_head}>
                    {PageHeader({navigation, name: '购买记录', isDark: true, bgColor: 'transparent', leftGoTo: () => NavigatorUtil.goPage('TheZone')})}
                    <View style={styles.by_h_con}>
                        <View style={styles.by_hc_l}>
                            <Text style={styles.hc_t01}>待使用年供</Text>
                            <Text style={styles.hc_t02}>{headObj.waitUse || 0}</Text>
                            <Text style={styles.hc_t03}>20尊待使用年供商品可兑换一尊长期供奉商品</Text>
                        </View>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            style={headObj.waitUse < 20 ? [styles.by_hc_r, {backgroundColor: '#bbb'}] : styles.by_hc_r}
                            onPress={() => {
                                if (headObj.waitUse < 20) {
                                    return operationPrompt('兑换数最少为20尊');
                                }
                                toTradingPaw(() => {
                                    this.setState({
                                        mVisible: true
                                    });
                                });
                            }}
                        >
                            <Text style={headObj.waitUse < 20 ? [styles.hr_bt, {color: '#fff'}] : styles.hr_bt}>兑 换</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
                <View style={styles.ng_view}>
                    <FlatList
                        ref={(val) => this._flatRef = val}
                        style={{flex: 1, backgroundColor: '#CFAA8E'}}
                        showsHorizontalScrollIndicator={false}
                        horizontal={true}
                        data={tabList}
                        getItemLayout={(data, index) => ({
                            length: width / 4,
                            offset: (width / 4) * index,
                            index,
                        })}
                        renderItem={({item}: any) => (
                            <TouchableOpacity
                                key={item.id}
                                activeOpacity={0.9}
                                style={styles.t_single}
                            >
                                <Text style={styles.t_s_tit}>{item.title}</Text>
                                <Text style={styles.t_s_txt}>{headObj[item.field] || 0}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
                <View style={pageFront.length > 0 ? styles.by_scroll : {display: 'none', ...styles.by_scroll}}>
                    <View style={{height: 15}}/>
                    {
                        pageFront.map((item: any) => (
                            <View style={styles.by_single} key={item.id}>
                                <View style={styles.s_top}>
                                    <View style={styles.s_top_l}>
                                        <LinearGradient
                                            style={styles.ct_tag}
                                            start={{x: 0.0, y: 0.0}}
                                            end={{x: 1, y: 1}}
                                            colors={tagColors[item.status]}
                                        >
                                            <Text style={styles.ct_txt}>{(item.status === '1' && +item.surplusDay < 31) ? `${item.surplusDay}天后到期` : item.statusName}</Text>
                                        </LinearGradient>
                                        {
                                            item.status === '3' ? <Text style={styles.stl_txt}>待续管理费</Text> : null
                                        }
                                    </View>
                                    <Text style={styles.by_code}>编号: {item.id}</Text>
                                </View>
                                <View style={styles.s_head}>
                                    <View style={styles.s_h_box}>
                                        <Text style={styles.s_h_tit} numberOfLines={1}>{item.name}</Text>
                                        <LinearGradient
                                            style={styles.s_ct_tag}
                                            start={{x: 0.0, y: 0.0}}
                                            end={{x: 1, y: 1}}
                                            colors={['#E9C394', '#BA8F65']}
                                        >
                                            <Text style={styles.s_ct_txt}>{item.typeName}</Text>
                                        </LinearGradient>
                                    </View>
                                    <Text style={styles.s_h_txt}>来源：{item.remark}</Text>
                                </View>
                                <View style={styles.by_s_con}>
                                    {
                                        item.type === '0' ? <Fragment>
                                            <View style={styles.s_c_top}>
                                                <Text style={styles.sct_p_t}>¥</Text>
                                                <Text style={styles.sct_p_p}>{item.payPrice}</Text>
                                            </View>
                                            <Text style={styles.sct_txt}>购买价格</Text>
                                        </Fragment> : null
                                    }
                                    {
                                        item.status !== '0' ? <View style={styles.sct_con}>
                                            <View style={styles.sct_c_li}>
                                                <Text style={styles.s_li_tit}>购买日期</Text>
                                                <Text style={styles.s_li_txt}>{formatDate(item.obtainTime, 'yyyy/MM/dd')}</Text>
                                                <Text style={styles.s_li_txt}>{formatDate(item.obtainTime, 'hh:mm:ss')}</Text>
                                            </View>
                                            <View style={[styles.sct_c_li, styles.sct_center]}>
                                                <Text style={styles.s_li_tit}>使用日期</Text>
                                                <Text style={styles.s_li_txt}>{formatDate(item.useTime, 'yyyy/MM/dd')}</Text>
                                                <Text style={styles.s_li_txt}>{formatDate(item.useTime, 'hh:mm:ss')}</Text>
                                            </View>
                                            <View style={[styles.sct_c_li, styles.sct_right]}>
                                                <Text style={styles.s_li_tit}>到期日期</Text>
                                                <Text style={styles.s_li_txt}>{formatDate(item.expiresTime, 'yyyy/MM/dd')}</Text>
                                                <Text style={styles.s_li_txt}>{formatDate(item.expiresTime, 'hh:mm:ss')}</Text>
                                            </View>
                                        </View> : null
                                    }
                                </View>
                                <View style={[styles.by_s_foo, {marginTop: 18, justifyContent: item.status === '4' ? 'flex-end' : 'space-between'}]}>
                                    {
                                        item.status === '0' ? <View style={styles.s_f_left}>
                                            <Text style={styles.s_li_tit}>{item.type === '0' ? '购买' : '兑换'}日期</Text>
                                            <Text style={styles.s_li_txt}>{formatDate(item.obtainTime, 'yyyy/MM/dd')}</Text>
                                            <Text style={styles.s_li_txt}>{formatDate(item.obtainTime, 'hh:mm:ss')}</Text>
                                        </View> : null
                                    }
                                    {
                                        (item.status === '1' || item.status === '3' || item.status === '4' || item.status === '2') ? <TouchableOpacity
                                            activeOpacity={0.9}
                                            style={[styles.s_f_btn]}
                                            onPress={() => {
                                                NavigatorUtil.goPage('ByLookDetail', {id: item.id})
                                            }}
                                        >
                                            <Text style={[styles.sf_r_txt]}>查看详情</Text>
                                        </TouchableOpacity> : null
                                    }
                                    {
                                        (item.status === '0' || item.status === '1' || item.status === '3' || item.status === '2') ? <TouchableOpacity
                                            style={[styles.s_f_btn, styles.s_f_btn_b]}
                                            activeOpacity={0.9}
                                            onPress={() => {
                                                const config = cpObj[item.status].visField
                                                    ? {id: item.id, ...cpObj[item.status].btnTxtObj[item[cpObj[item.status].visField]].params}
                                                    : {id: item.id, ...cpObj[item.status].params}
                                                NavigatorUtil.goPage(cpObj[item.status].path, config);
                                            }}
                                        >
                                            <Text style={[styles.sf_r_txt, styles.sf_r_txt_b]}>
                                                {
                                                    cpObj[item.status].visField
                                                        ? cpObj[item.status].btnTxtObj[item[cpObj[item.status].visField]].txt
                                                        : cpObj[item.status].btnTxt
                                                }
                                            </Text>
                                        </TouchableOpacity> : null
                                    }
                                </View>
                            </View>
                        ))
                    }
                </View>
                <View style={pageFront.length ? {display: 'none'} : {flex: 1}}>
                    <NoData noText="暂无数据" paddingTop={100} />
                </View>
                <View style={{height: 50}} />
            </ScrollView>
            <BtmModal
                btnText="确认兑换"
                title="请输入密码"
                tpComponent={_tpModal}
                mVisible={mVisible}
                cancelModal={() => this.setState({mVisible: false})}
                confirmModal={this.confirmModal}
                tipMsg={tipMsg}
                resetTip={() => this.setState({tipMsg: ''})}
            />
        </View>;
    }
}

const styles = StyleSheet.create({
    by_head: {},
    by_h_con: {
        marginTop: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 26
    },
    by_hc_l: {
        paddingTop: 5,
        flex: 1
    },
    hc_t01: {
        color: '#fff',
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'PingFangSC-Regular',
        marginBottom: 2
    },
    hc_t02: {
        fontSize: 35,
        color: '#fff',
        fontFamily: 'DINAlternate-Bold',
        fontWeight: '600',
        lineHeight: 38,
        marginBottom: 4
    },
    hc_t03: {
        opacity: 0.6,
        color: '#fff',
        fontSize: 12,
        lineHeight: 17,
        fontFamily: 'PingFangSC-Regular',
    },
    by_hc_r: {
        backgroundColor: '#fff',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        height: 0.1 * width,
        width: 0.2 * width
    },
    hr_bt: {
        color: '#0B3254',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'PingFangSC-Semibold',
    },
    ng_view: {
        backgroundColor: '#CFAA8E',
        paddingHorizontal: 20,
        minHeight: 68,
    },
    t_single: {
        width: width / 5,
        paddingVertical: 12,
        alignItems: 'center'
    },
    t_s_tit: {
        color: '#fff',
        fontSize: 13,
        lineHeight: 18,
        fontFamily: 'PingFangSC-Regular',
        marginBottom: 3
    },
    t_s_txt: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 18,
        lineHeight: 21,
        fontFamily: 'DINAlternate-Bold'
    },
    by_scroll: {
        flex: 1
    },
    by_single: {
        width: width - 40,
        marginLeft: 20,
        paddingTop: 12,
        paddingBottom: 20,
        paddingRight: 20,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 14
    },
    s_top: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    s_top_l: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    stl_txt: {
        color: '#CFAA8E',
        fontSize: 15,
        lineHeight: 21,
        fontFamily: 'PingFangSC-Regular',
        marginLeft: 5
    },
    ct_tag: {
        paddingTop: 3,
        paddingBottom: 2,
        paddingLeft: 7,
        paddingRight: 8,
        borderTopRightRadius: 13,
        borderBottomRightRadius: 13,
    },
    ct_txt: {
        color: '#fff',
        fontSize: 15,
        lineHeight: 21,
        fontWeight: '600',
        fontFamily: 'PingFangSC-Semibold',
    },
    by_code: {
        color: '#C5C8CC',
        fontSize: 12,
        lineHeight: 17,
        fontFamily: 'PingFangSC-Regular',
    },
    s_head: {
        marginBottom: 11,
        alignItems: 'center',
        width: width - 80,
        marginLeft: 20
    },
    s_h_box: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        maxWidth: 240,
        marginBottom: 2,
    },
    s_h_tit: {
        color: '#333',
        fontSize: 18,
        lineHeight: 25,
        fontWeight: '500',
        fontFamily: 'PingFangSC-Medium',
        marginRight: 7,
    },
    s_ct_tag: {
        borderRadius: 3,
        paddingHorizontal: 3,
        marginBottom: 5
    },
    s_ct_txt: {
        fontSize: 10,
        lineHeight: 15,
        fontWeight: '500',
        fontFamily: 'PingFangSC-Medium',
        color: '#fff'
    },
    s_h_txt: {
        color: '#939EAD',
        fontSize: 13,
        lineHeight: 16,
        fontFamily: 'PingFangSC-Regular',
    },
    by_s_con: {
        width: width - 80,
        alignItems: 'center',
        marginLeft: 20,
    },
    s_c_top: {
        alignItems: 'flex-end',
        flexDirection: 'row',
        marginBottom: 2,
    },
    sct_p_t: {
        fontSize: 16,
        color: '#0B3254',
        lineHeight: 19,
        fontWeight: '600',
        fontFamily: 'DINAlternate-Bold',
        marginRight: 6,
        marginBottom: 5
    },
    sct_p_p: {
        fontSize: 35,
        lineHeight: 38,
        color: '#0B3254',
        fontWeight: '600',
        fontFamily: 'DINAlternate-Bold',
        marginRight: 1,
    },
    sct_p_d: {
        fontSize: 18,
        lineHeight: 21,
        color: '#0B3254',
        fontWeight: '600',
        fontFamily: 'DINAlternate-Bold',
        marginBottom: 5
    },
    sct_txt: {
        color: '#939EAD',
        fontSize: 13,
        lineHeight: 16,
        fontFamily: 'PingFangSC-Regular'
    },
    sct_con: {
        width: width - 80,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10
    },
    sct_c_li: {},
    s_li_tit: {
        color: '#C1BEBE',
        fontSize: 12,
        lineHeight: 17,
        fontFamily: 'PingFangSC-Regular',
        marginBottom: 4,
    },
    s_li_txt: {
        fontSize: 13,
        color: '#8D9297',
        lineHeight: 15,
        fontWeight: '600',
        fontFamily: 'DINAlternate-Bold',
    },
    sct_center: {
        alignItems: 'center'
    },
    sct_right: {
        alignItems: 'flex-end'
    },
    by_s_foo: {
        flexDirection: 'row',
        alignItems: 'center',
        width: width - 80,
        marginLeft: 20,
    },
    s_f_left: {
        width: (width - 100) / 2,
    },
    s_f_btn: {
        width: (width - 100) / 2,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        height: 38,
        borderWidth: 1,
        borderColor: '#0D2E58',
        borderStyle: 'solid',
    },
    s_f_btn_b: {
        backgroundColor: '#0D2E58',
    },
    sf_r_txt: {
        color: '#0D2E58',
        fontSize: 16,
        lineHeight: 22,
        fontWeight: '500',
        fontFamily: 'PingFangSC-Medium',
    },
    sf_r_txt_b: {
        color: '#fff'
    },
    c_iup_box: {
        height: 52,
        backgroundColor: '#fff',
        borderStyle: 'solid',
        borderColor: '#E8EAEB',
        borderWidth: 1,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tp_iup: {
        width: width - 40,
        paddingBottom: 10,
        paddingTop: 10,
        paddingLeft: 12,
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'PingFangSC-Regular',
    },
});