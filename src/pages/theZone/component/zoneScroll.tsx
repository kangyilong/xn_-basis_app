import React, {useState, useCallback, useEffect, Fragment} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ImageBackground,
    Image,
    Dimensions,
    TouchableOpacity
} from 'react-native';
import NoData from '@components/noData/NoData';
import LinearGradient from 'react-native-linear-gradient';
import {THE_ZONE_C_ARROW} from '@methods/requireImage';
import NavigatorUtil from "@methods/NavigatorUtil";
import {agentActivityIndexGoods} from "@methods/api/theZone";
import {formatDate, saveMsg} from "@methods/util";

const {width} = Dimensions.get('window');
const tagColors: any = {
    '2': {
        tit: '',
        colors: ['#1A618D', '#0B3254']
    },
    '1': {
        tit: '马上围观',
        colors: ['#B47741', '#8B572A']
    },
    '3': {
        tit: '已结束',
        colors: ['#D1D4D6', '#A4A9AC']
    },
};
let fIndex = 0;

interface Props {
    navigation: any;
    pageNum: number;
    refreshing: boolean;
    isRefresh?: boolean;
    resetPageNum: Function;
    refreshOk: Function;
    scrollTopFn: Function;
}
export default function ZoneScroll(props: Props) {
    const {pageNum, refreshing, isRefresh, resetPageNum, refreshOk, scrollTopFn} = props;
    const [tabIndex, setTabIndex] = useState('2'); // 2 抢购中  1 预展中  3 已结束
    const [activeList, setActiveList] = useState([]);
    const _getAgentActivityIndexPage = useCallback((config?: {
        arr?: Array<any>,
        isShow?: boolean
    }) => {
        const {arr, isShow} = config || {};
        agentActivityIndexGoods({
            pageNum,
            status: tabIndex
        }, isShow).then((data: any) => {
            fIndex++;
            const {list, pages} = data;
            const ll: any = arr ? [...arr, ...list] : [...activeList, ...list];
            refreshOk(pageNum < pages);
            setActiveList(ll);
        })
    }, [pageNum, tabIndex, activeList]);
    useEffect(() => {
        if (fIndex > 0) {
            _getAgentActivityIndexPage({
                isShow: pageNum > 1
            });
        }
    }, [pageNum]);
    useEffect(() => {
        if(refreshing || isRefresh) {
            _getAgentActivityIndexPage({
                arr: [],
                isShow: false
            });
        }
    }, [refreshing, isRefresh]);
    useEffect(() => {
        if (fIndex > 0) {
            _getAgentActivityIndexPage({
                arr: [],
                isShow: false
            });
        }
    }, [tabIndex]);
    const _tabClick = useCallback((index: string) => {
        setTabIndex(index);
        resetPageNum();
        refreshOk(true);
        scrollTopFn();
    }, [resetPageNum, refreshOk, scrollTopFn]);
    return <View style={styles.zone_scroll}>
        <View style={styles.scroll_tab}>
            <TouchableOpacity
                style={styles.t_click}
                activeOpacity={0.9}
                onPress={() => {
                    _tabClick('2');
                }}
            >
                <View style={[styles.t_single, tabIndex === '2' ? styles.t_single_active : null]}>
                    <Text style={[styles.ts_txt, tabIndex === '2' ? styles.ts_txt_active : null]}>抢购中</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.t_click}
                activeOpacity={0.9}
                onPress={() => _tabClick('1')}
            >
                <View style={[styles.t_single, tabIndex === '1' ? styles.t_single_active : null]}>
                    <Text style={[styles.ts_txt, tabIndex === '1' ? styles.ts_txt_active : null]}>预展中</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.t_click}
                activeOpacity={0.9}
                onPress={() => _tabClick('3')}
            >
                <View style={[styles.t_single, tabIndex === '3' ? styles.t_single_active : null]}>
                    <Text style={[styles.ts_txt, tabIndex === '3' ? styles.ts_txt_active : null]}>已结束</Text>
                </View>
            </TouchableOpacity>
        </View>
        <View style={styles.s_con}>
            <View style={{height: 12}} />
            <View style={activeList.length ? null : {display: 'none'}}>
                {
                    activeList.map((item: any) => (
                        <ImageBackground
                            key={item.id + tabIndex}
                            source={{uri: item.thumb || item.image}}
                            style={[styles.c_single, {height: width - 40}]}
                        >
                            <TouchableOpacity
                                style={[{flex: 1}]}
                                activeOpacity={0.9}
                                onPress={() => {
                                    saveMsg('zoneActiveItem', JSON.stringify(item)).then(() => {
                                        NavigatorUtil.goPage('ShopDetail', {
                                            id: item.id,
                                            origin: 'z',
                                            type: tabIndex
                                        });
                                    });
                                }}
                            >
                                <View style={styles.c_top}>
                                    <LinearGradient
                                        style={styles.ct_tag}
                                        start={{x: 0.0, y: 0.0}}
                                        end={{x: 1, y: 1}}
                                        colors={tagColors[tabIndex].colors}
                                    >
                                        <Text style={styles.ct_txt}>{item.timeDesc}</Text>
                                    </LinearGradient>
                                    <Text style={[styles.ct_txt, styles.ct_ts]}>
                                        {
                                            tabIndex === '2'
                                                ? item.activityStatusName
                                                : tabIndex === '1'
                                                ? `开始时间 ${formatDate(item.startTime, 'MM月dd日 hh:mm:ss')}`
                                                : `结束时间 ${formatDate(item.endTime, 'MM月dd日 hh:mm:ss')}`
                                        }
                                    </Text>
                                    {
                                        tabIndex === '2' ? <Text style={styles.ct_num}>{item.lookNumber}人围观</Text> : null
                                    }
                                </View>
                                <LinearGradient
                                    locations={[0, 1]}
                                    colors={['rgba(103,78,56,0.5)', 'rgba(139,87,42,0.6)']}
                                    style={styles.s_c_foo}
                                >
                                    <View style={styles.cf_l}>
                                        <Text style={styles.cf_l_tit}>{item.name}</Text>
                                        {
                                            tabIndex === '2' ? <Text style={styles.cf_l_txt}>¥{item.price}</Text> : <Text
                                                style={
                                                    [
                                                        styles.cf_rt,
                                                        {
                                                            fontSize: tabIndex === '2' ? 12 : 14,
                                                            lineHeight: tabIndex === '2' ? 17 : 20
                                                        }
                                                    ]
                                                }>{item.totalNumber}尊 年供 | {item.lookNumber}人围观</Text>
                                        }
                                    </View>
                                    <View style={styles.cf_r}>
                                        <Text
                                            style={
                                                [
                                                    styles.cf_rt,
                                                    {
                                                        fontSize: tabIndex === '2' ? 12 : 14,
                                                        lineHeight: tabIndex === '2' ? 17 : 20
                                                    }
                                                ]
                                            }
                                        >
                                            {tagColors[tabIndex].tit || `已抢${item.salesNumber}尊/${item.totalNumber}尊`}
                                        </Text>
                                        {
                                            tabIndex === '1' ? <Image
                                                style={{width: 20, height: 20, marginLeft: 5}}
                                                source={THE_ZONE_C_ARROW}
                                            /> : null
                                        }
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>
                        </ImageBackground>
                    ))
                }
            </View>
            {
                activeList.length ? <View style={{height: 100}} /> : <NoData noText="暂无数据" paddingTop={100} />
            }
        </View>
    </View>;
}

const styles = StyleSheet.create({
    zone_scroll: {
        flex: 1,
        backgroundColor: '#F5F5F5'
    },
    scroll_tab: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    t_click: {
        flex: 1,
        paddingTop: 12,
        alignItems: 'center',
    },
    t_single: {
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderColor: 'transparent'
    },
    t_single_active: {
        borderColor: '#888'
    },
    ts_txt: {
        color: '#888888',
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'PingFangSC-Semibold',
        fontWeight: '600'
    },
    ts_txt_active: {
        color: '#111111'
    },
    s_con: {
        alignItems: 'center'
    },
    c_single: {
        width: width - 40,
        borderRadius: 10,
        overflow: 'hidden',
        position: 'relative'
    },
    c_top: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderRadius: 7,
        position: 'absolute',
        top: 14,
        left: 20,
        overflow: 'hidden',
        paddingRight: 8
    },
    ct_tag: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
        paddingVertical: 5,
        marginRight: 7
    },
    ct_txt: {
        color: '#fff',
        fontSize: 13,
        lineHeight: 18,
        fontFamily: 'PingFangSC-Regular'
    },
    ct_ts: {
        fontWeight: '600',
        fontFamily: 'PingFangSC-Semibold',
        marginRight: 6,
    },
    ct_num: {
        color: '#fff',
        fontSize: 11,
        lineHeight: 18,
        fontFamily: 'PingFangSC-Regular'
    },
    s_c_foo: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingTop: 38,
        paddingHorizontal: 20,
        paddingBottom: 11,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },
    cf_l: {},
    cf_l_tit: {
        fontSize: 18,
        color: '#fff',
        fontFamily: 'PingFangSC-Semibold',
        fontWeight: '600',
        lineHeight: 25,
        marginBottom: 3
    },
    cf_l_txt: {
        fontSize: 22,
        color: '#fff',
        fontWeight: '600',
        lineHeight: 26,
        fontFamily: 'DINAlternate-Bold'
    },
    cf_r: {
        alignItems: 'center',
        flexDirection: 'row'
    },
    cf_rt: {
        color: '#fff',
        fontWeight: '600',
        fontFamily: 'PingFangSC-Semibold'
    }
});