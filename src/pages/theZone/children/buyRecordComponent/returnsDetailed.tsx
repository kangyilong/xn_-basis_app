import React, {useState, useCallback, useEffect} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    RefreshControl,
    Dimensions
} from 'react-native';
import PageHeader from '@components/PageHeader/PageHeader';
import NoData from '@components/noData/NoData';
import LinearGradient from 'react-native-linear-gradient';
import {agentActivityIncomeHead, agentActivityIncomePage} from '@methods/api/theZone';
import {themeColor} from "@methods/config";
import {darkContent, formatDate} from "@methods/util";

const {height} = Dimensions.get('window');
let isScroll = true;
let refreshing: boolean = false;
let _interOut: any = null;
let pageNum = 1;

interface Props {
    navigation: any;
}

export default function ReturnsDetailed(props: Props) {
    const {navigation} = props;
    const [headObj, setHeadObj]: any = useState({});
    const [incomePage, setIncomePage] = useState([]);
    const _getAgentActivityIncomePage = useCallback(() => {
        agentActivityIncomePage({pageNum}, pageNum > 1).then((d: any) => {
            const {list = [], pages} = d;
            let ll = [];
            if (refreshing) {
                ll = list;
            } else if (pageNum < pages + 1) {
                ll = [...incomePage, ...list];
            } else {
                return isScroll = false;
            }
            isScroll = true;
            refreshing = false;
            setIncomePage(ll);
        });
    }, [incomePage]);
    const onPackageScroll = useCallback((ev) => {
        ev.persist();
        if (isScroll) {
            if (_interOut) {
                clearTimeout(_interOut);
            }
            _interOut = setTimeout(() => {
                const {contentOffset} = ev.nativeEvent;
                if (contentOffset.y > (height / 2) * pageNum) {
                    isScroll = false;
                    pageNum++;
                    _getAgentActivityIncomePage();
                }
            }, 300);
        }
    }, [incomePage]);
    const _onRefresh = useCallback(() => {
        refreshing = true;
        isScroll = true;
        pageNum = 1;
        _getAgentActivityIncomePage();
    }, []);
    useEffect(() => {
        const _subscription = props.navigation.addListener('didFocus', () => {
            darkContent('l');
            pageNum = 1;
            agentActivityIncomeHead().then((d: any) => {
                setHeadObj(d);
            });
            _getAgentActivityIncomePage();
        });
        return () => {
            _subscription.remove();
        }
    }, []);
    return <ScrollView
        style={styles.re_detail}
        showsVerticalScrollIndicator={false}
        onScroll={onPackageScroll}
        scrollEventThrottle={16}
        removeClippedSubviews={true}
        refreshControl={
            <RefreshControl
                tintColor={themeColor}
                colors={[themeColor]}
                refreshing={refreshing}
                onRefresh={_onRefresh}
            />
        }
    >
        <LinearGradient
            style={styles.re_head}
            start={{x: 0.0, y: 0.0}}
            end={{x: 1, y: 1}}
            colors={['#154E81', '#0B3254']}
        >
            {PageHeader({navigation, name: '收益明细', isDark: true, bgColor: 'transparent'})}
            <Text style={styles.re_h_lj}>累计收益</Text>
            <View style={styles.re_h_con}>
                <Text style={styles.re_h_t1}>¥</Text>
                <Text style={styles.re_h_t2}>{headObj.totalAmount || 0}</Text>
            </View>
        </LinearGradient>
        <View style={styles.re_h_foo}>
            <View style={styles.re_f_li}>
                <Text style={styles.re_l_t}>银杏果(个)</Text>
                <Text style={styles.re_l_tb}>{headObj.yxgAmount || 0}</Text>
            </View>
            <View style={styles.re_f_li}>
                <Text style={styles.re_l_t}>NAT(个)</Text>
                <Text style={styles.re_l_tb}>{headObj.natCount}</Text>
            </View>
        </View>
        <View style={styles.re_con}>
            <Text style={styles.re_c_tit}>收入明细</Text>
            <View style={incomePage.length ? {flex: 1} : {display: 'none'}}>
                {
                    incomePage.map((item: any) => (<View style={styles.re_single} key={item.id}>
                        <View style={[styles.re_s_head, item.status === '1' ? {backgroundColor: '#ABADAF'} : null]}>
                            <Text style={styles.re_s_txt}>{item.timeDesc}</Text>
                            <Text style={[styles.re_s_txt, styles.re_s_tb]}>
                                {item.status === '0' ? '未结算' : '已结算'}
                            </Text>
                        </View>
                        <View style={styles.re_s_con}>
                            <View style={styles.re_sc_li}>
                                <Text style={styles.sc_li_txt}>折扣回馈</Text>
                                <View style={styles.sc_li_box}>
                                    <Text style={styles.li_pt}>¥</Text>
                                    <Text style={styles.li_ptt}>{item.zkAmount || 0}</Text>
                                </View>
                            </View>
                            <View style={[styles.re_sc_li, styles.c_li_c]}>
                                <Text style={styles.sc_li_txt}>推广佣金</Text>
                                <View style={styles.sc_li_box}>
                                    <Text style={styles.li_pt}>¥</Text>
                                    <Text style={styles.li_ptt}>{item.tgAmount || 0}</Text>
                                </View>
                            </View>
                            <View style={[styles.re_sc_li, styles.sc_li_r]}>
                                <Text style={styles.sc_li_txt}>业绩奖励</Text>
                                <View style={styles.sc_li_box}>
                                    <Text style={styles.li_pt}>¥</Text>
                                    <Text style={styles.li_ptt}>{item.yjAmount || 0}</Text>
                                </View>
                            </View>
                        </View>
                        {
                            item.status !== '0' ? <Text
                                style={styles.re_foo}>结算日期 {formatDate(item.settleTime, 'yyyy/MM/dd hh:mm:ss')}</Text> : null
                        }
                    </View>))
                }
                <View style={{height: 60}}/>
            </View>
            <View style={incomePage.length ? {display: 'none'} : {flex: 1}}>
                <NoData noText="暂无数据" paddingTop={100}/>
            </View>
        </View>
    </ScrollView>
}

const styles = StyleSheet.create({
    re_detail: {
        flex: 1,
    },
    re_head: {
        paddingBottom: 33
    },
    re_h_lj: {
        marginTop: 32,
        fontSize: 14,
        color: '#fff',
        lineHeight: 20,
        fontFamily: 'PingFangSC-Regular',
        marginBottom: 6,
        paddingLeft: 20,
    },
    re_h_con: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingLeft: 20,
    },
    re_h_t1: {
        fontSize: 16,
        paddingBottom: 5,
        lineHeight: 19,
        fontWeight: '600',
        color: '#fff',
        fontFamily: 'DINAlternate-Bold',
        marginRight: 6
    },
    re_h_t2: {
        fontSize: 35,
        color: '#fff',
        lineHeight: 38,
        fontWeight: '600',
        fontFamily: 'DINAlternate-Bold',
        marginRight: 1,
    },
    re_h_t3: {
        fontSize: 18,
        lineHeight: 21,
        fontWeight: '600',
        color: '#fff',
        fontFamily: 'DINAlternate-Bold',
        paddingBottom: 5
    },
    re_h_foo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(47,97,141,0.8)',
        paddingTop: 14,
        paddingBottom: 12,
        paddingHorizontal: 20,
    },
    re_f_li: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    re_l_t: {
        color: '#FFFFFF',
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'PingFangSC-Regular',
        marginRight: 5,
    },
    re_l_tb: {
        color: '#FFFFFF',
        fontSize: 18,
        lineHeight: 21,
        fontFamily: 'DINAlternate-Bold',
        fontWeight: '600',
    },
    re_con: {
        flex: 1,
        paddingTop: 13,
        paddingHorizontal: 20,
        paddingBottom: 100
    },
    re_c_tit: {
        color: '#333333',
        fontSize: 18,
        lineHeight: 25,
        fontWeight: '600',
        fontFamily: 'PingFangSC-Semibold',
        marginBottom: 13
    },
    re_single: {
        marginBottom: 14,
        borderRadius: 8,
        borderBottomWidth: 2,
        borderStyle: 'solid',
        borderColor: 'rgba(11, 50, 84, 0.1)',
        paddingBottom: 8,
        overflow: 'hidden',
        backgroundColor: '#fff'
    },
    re_s_head: {
        backgroundColor: '#6998D2',
        paddingVertical: 13,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    re_s_txt: {
        color: '#fff',
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '500',
        fontFamily: 'PingFangSC-Medium',
    },
    re_s_tb: {
        fontWeight: '600',
        fontFamily: 'PingFangSC-Semibold',
    },
    re_s_con: {
        paddingBottom: 12,
        paddingTop: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    re_sc_li: {},
    sc_li_txt: {
        fontSize: 13,
        color: '#939EAD',
        lineHeight: 18,
        fontFamily: 'PingFangSC-Regular',
        marginBottom: 2,
    },
    sc_li_box: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    li_pt: {
        color: '#333333',
        fontSize: 12,
        fontWeight: '600',
        lineHeight: 14,
        fontFamily: 'DINAlternate-Bold',
        paddingBottom: 3
    },
    li_ptt: {
        color: '#111111',
        fontSize: 21,
        lineHeight: 25,
        fontWeight: '600',
        fontFamily: 'DINAlternate-Bold',
    },
    c_li_c: {
        alignItems: 'center'
    },
    sc_li_r: {
        alignItems: 'flex-end'
    },
    re_foo: {
        color: '#BBBBBB',
        fontSize: 12,
        lineHeight: 17,
        fontWeight: '500',
        fontFamily: 'PingFangSC-Medium',
        paddingLeft: 20
    },
});