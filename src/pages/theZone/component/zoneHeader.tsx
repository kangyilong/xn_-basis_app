import React, {useState, useEffect} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ImageBackground,
    Dimensions,
    Image,
    TouchableOpacity
} from 'react-native';
import {darkContent, getMsg} from '@methods/util';
import {
    THE_ZONE_ZQ_BG,
    THE_ZONE_ZQ_ARROW,
    THE_ZONE_ZQ_GM
} from '@methods/requireImage';
import NavigatorUtil from "@methods/NavigatorUtil";

const {width} = Dimensions.get('window');
let H = 0;
setTimeout(() => {
    getMsg('barHeight').then((hi: any) => {
        H = +hi;
    });
}, 1000);

interface Props {
    navigation: any,
    agentAmount: {
        totalIncomeAmount: '0',
        incomeAmount: '0',
        waitIncomeAmount: '0'
    }
}
export default function ZoneHeader(props: Props) {
    const {agentAmount} = props;
    const {totalIncomeAmount = '0', incomeAmount = '0', waitIncomeAmount = '0'} = agentAmount;
    useEffect(() => {
        const _navListener = props.navigation.addListener('didFocus', () => {
            darkContent('light');
        });
        return () => {
            _navListener.remove();
        };
    }, []);
    const incomeList = totalIncomeAmount.toString().split('.');
    return <ImageBackground source={THE_ZONE_ZQ_BG} style={styles.zone_head}>
        <View style={{height: H + 14}}/>
        <Text style={styles.zone_tit}>专区</Text>
        <View style={styles.zone_con}>
            <View style={styles.z_c_left}>
                <Text style={styles.c_l_tit}>累计收益</Text>
                <View style={styles.c_l_con}>
                    <Text style={styles.c_l_t}>¥</Text>
                    <Text style={styles.c_l_tb}>{incomeList[0]}</Text>
                    {
                        incomeList[1] ? <Text style={styles.c_l_tx}>.{incomeList[1]}</Text> : null
                    }
                </View>
                <TouchableOpacity
                    style={styles.c_l_foo}
                    activeOpacity={0.9}
                    onPress={() => {
                        NavigatorUtil.goPage('ReturnsDetailed')
                    }}
                >
                    <Text style={styles.l_f_txt}>查看明细</Text>
                    <Image source={THE_ZONE_ZQ_ARROW} style={styles.l_f_img}/>
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                style={styles.z_c_right}
                activeOpacity={0.9}
                onPress={() => {
                    NavigatorUtil.goPage('BuyRecord')
                }}
            >
                <Image source={THE_ZONE_ZQ_GM} style={styles.r_img}/>
                <Text style={styles.r_txt}>购买记录</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.zone_foo}>
            <View style={styles.z_f_l}>
                <Text style={styles.z_f_txt}>已结算</Text>
                <Text style={[styles.z_f_tb, {marginRight: 3}]}>¥</Text>
                <Text style={styles.z_f_tb}>{incomeAmount}</Text>
            </View>
            <View style={styles.z_f_l}>
                <Text style={styles.z_f_txt}>待结算</Text>
                <Text style={[styles.z_f_tb, {marginRight: 3}]}>¥</Text>
                <Text style={styles.z_f_tb}>{waitIncomeAmount}</Text>
            </View>
        </View>
    </ImageBackground>;
}

const styles = StyleSheet.create({
    zone_head: {
        width
    },
    zone_tit: {
        textAlign: 'center',
        fontSize: 18,
        color: '#fff',
        lineHeight: 25,
        fontFamily: 'PingFangSC-Medium',
        fontWeight: '500',
        marginBottom: 19
    },
    zone_con: {
        paddingHorizontal: 20,
        marginBottom: 21,
        flexDirection: 'row',
        alignItems: 'center'
    },
    z_c_left: {
        flex: 1
    },
    c_l_tit: {
        fontSize: 14,
        lineHeight: 20,
        color: '#FFFFFF',
        fontFamily: 'PingFangSC-Regular',
        marginBottom: 6
    },
    c_l_con: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 10
    },
    c_l_t: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'DINAlternate-Bold',
        fontWeight: 'bold',
        marginRight: 6,
        paddingBottom: 5
    },
    c_l_tb: {
        fontSize: 35,
        color: '#fff',
        fontFamily: 'DINAlternate-Bold',
        fontWeight: '600'
    },
    c_l_tx: {
        fontSize: 18,
        color: '#fff',
        fontFamily: 'DINAlternate-Bold',
        fontWeight: '600',
        paddingBottom: 5
    },
    c_l_foo: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    l_f_txt: {
        color: '#fff',
        fontSize: 13,
        lineHeight: 18,
        fontFamily: 'PingFangSC-Regular',
        marginRight: 2
    },
    l_f_img: {
        width: 12,
        height: 12
    },
    z_c_right: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 13,
        paddingVertical: 11,
        backgroundColor: '#306089',
        borderRadius: 8
    },
    r_img: {
        width: 22,
        height: 22,
        marginRight: 7
    },
    r_txt: {
        color: '#fff',
        fontSize: 15,
        lineHeight: 22,
        fontWeight: '600',
        fontFamily: 'PingFangSC-Semibold'
    },
    zone_foo: {
        backgroundColor: '#3C72A2',
        opacity: 0.8,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 13
    },
    z_f_l: {
        flex: 1,
        paddingLeft: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    z_f_txt: {
        color: '#fff',
        fontSize: 14,
        lineHeight: 20,
        marginRight: 10,
        fontFamily: 'PingFangSC-Regular'
    },
    z_f_tb: {
        color: '#fff',
        fontSize: 18,
        lineHeight: 21,
        fontFamily: 'DINAlternate-Bold',
        fontWeight: '600'
    },
});