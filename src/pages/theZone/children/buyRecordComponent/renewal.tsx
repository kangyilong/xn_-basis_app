import React, {useState, useEffect, useCallback} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    Platform,
    Dimensions,
    TextInput,
    ScrollView
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import PageHeader from '@components/PageHeader/PageHeader';
import PickerComponent from '@components/pickerComponent/PickerComponent';
import BtmModal from '@components/ConfirmModal/BtmModal';
import {SHOP_NAT_ICON, XUAN_ZE_ICON, SINGLE_RIGHT_TO, WEI_XUAN_ZE_ICON} from "@methods/requireImage";
import NavigatorUtil from "@methods/NavigatorUtil";
import {getDictList} from '@methods/api/publicApi';
import {agentAssetsRenewPay, agentAssetsRenewFront} from '@methods/api/theZone';
import {
    darkContent, getMsg,
    isFullScreen,
    operationPrompt,
    removeSaveMsg,
    toAlipay,
    toTradingPaw,
    toWeChat
} from "@methods/util";

const {width} = Dimensions.get('window');
const WM = width / 375;
const IOS = Platform.OS === 'ios';
let firstNum = 0;

interface Props {
    navigation: any;
}
export default function Renewal(props: Props) {
    const {navigation} = props;
    const {type = '0', id} = navigation.state.params;
    const [payList, setPayList] = useState([]);
    const [payType, setPayType] = useState('');
    const [payTypeName, setPayTypeName] = useState('');
    const [pwd, setPwd] = useState('');
    const [tipMsg, setTipMsg] = useState('');
    const [amountInfo, setAmountInfo]: any = useState({});
    const [mVisible, setMVisible] = useState(false);
    const [isShow, setIsShow] = useState(false);
    const [isOk, setIsOk] = useState(false);
    const [isUseNat, setIsUseNat] = useState(true);
    const [yktNumber, setYktNumber] = useState('');
    const [yktId, setYktId] = useState('');
    const getAgentAssetsRenewFront = useCallback(() => {
        agentAssetsRenewFront({
            type,
            isUseNat: Number(isUseNat).toString(),
            yktNumber
        }).then((d: any) => {
            let dd = {};
            if (!isUseNat) {
                const {natCount, natDiscountAmount} = amountInfo;
                dd = {
                    ...d,
                    natCount,
                    natDiscountAmount
                }
            } else {
                dd = {...d}
            }
            setAmountInfo(dd);
        });
    }, [type, isUseNat, yktNumber, amountInfo]);
    useEffect(() => {
        getDictList('pay.type').then((data: any) => {
            setPayList(data);
            setPayType(data[0].key);
            setPayTypeName(data[0].value);
        });
        const _navListener = props.navigation.addListener('didFocus', () => {
            darkContent('dark');
            Promise.all([
                getMsg('yktNumber'),
                getMsg('yktId')
            ]).then(([number, id]: any) => {
                if (number) {
                    setYktNumber(number);
                } else {
                    setYktNumber('');
                }
                if (id) {
                    setYktId(id);
                } else {
                    setYktId('');
                }
                if (firstNum === 0) {
                    getAgentAssetsRenewFront();
                }
                firstNum++;
            });
        });
        return () => {
            _navListener.remove();
        };
    }, []);
    useEffect(() => {
        if (firstNum > 0) {
            getAgentAssetsRenewFront();
        }
    }, [isUseNat, yktNumber]);
    const payTypeChange = useCallback((val) => {
        const payObj: any = payList.filter((item: any) => item.key === val)[0];
        setPayTypeName(payObj ? payObj.value : '');
        setPayType(val);
        setIsShow(false);
    }, [payList]);
    const closeModal = useCallback(() => {
        setIsShow(false);
    }, []);
    const submitPay = useCallback(() => {
        const {remainAmount = 0} = amountInfo;
        const noPay = !!(+remainAmount > 0);
        if (!noPay) {
            toTradingPaw(() => {
                setMVisible(true)
            });
        } else {
            confirmModal();
        }
    }, [amountInfo, payType]);
    const confirmModal = useCallback(() => {
        const {remainAmount = 0, yktDiscountAmount = 0} = amountInfo;
        const noPay = !!(+remainAmount > 0);
        if (!pwd && !noPay) {
            return setTipMsg('请输入支付密码');
        }
        if (!isOk) {
            setIsOk(true);
            setMVisible(false);
            const config: any = {
                id,
                payment: noPay ? payType : '',
                isUseNat: isUseNat ? '1' : '0',
                pwd
            };
            if (yktDiscountAmount > 0) {
                config.yktNumber = yktNumber;
            }
            agentAssetsRenewPay(config)
                .then((payConfig: any) => {
                    setIsOk(false);
                    if (!noPay) {
                        payCallback();
                    } else {
                        const {wechatAppPayInfo = {}, alipayPayOrderRes = {}} =
                        payConfig || {};
                        if (payType === '1') {
                            const signOrder = alipayPayOrderRes.signOrder;
                            return toAlipay(
                                signOrder,
                                () => {
                                    payCallback();
                                },
                                () => {
                                    setIsOk(false);
                                },
                            );
                        } else {
                            setIsOk(false);
                            toWeChat(
                                wechatAppPayInfo,
                                () => {
                                    payCallback();
                                },
                                () => {
                                    setIsOk(false);
                                },
                            );
                        }
                    }
                })
                .catch(() => {
                    setIsOk(false);
                });

            function payCallback() {
                operationPrompt('支付成功', () => {
                    removeSaveMsg();
                    navigation.goBack();
                });
            }
        }
    }, [amountInfo, pwd, id, payType]);
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
                onChangeText={(v) => setPwd(v)}
            />
        </View>
    );
    return <View style={styles.renewal_page}>
        {
            PageHeader({
                navigation,
                name: type === '1' ? '管理费' : '续费',
                leftGoTo: () => {
                    removeSaveMsg();
                    navigation.goBack();
                }
            })
        }
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
            <View style={styles.renewal_con}>
                <View style={styles.r_single}>
                    <Text style={styles.r_s_l}>支付总金额</Text>
                    <Text style={[styles.r_s_l, styles.r_s_h]}>￥{amountInfo.price || 0}</Text>
                </View>
                <View style={styles.r_single}>
                    <Text style={styles.r_s_l}>有效期限</Text>
                    <Text style={[styles.r_s_l, styles.r_s_c]}>1年</Text>
                </View>
                <TouchableOpacity
                    style={styles.r_single}
                    activeOpacity={0.9}
                    onPress={() => setIsUseNat(!isUseNat)}
                >
                    <View style={styles.r_s_left}>
                        <Image
                            style={styles.bs_pic}
                            source={SHOP_NAT_ICON}
                        />
                        <Text style={[styles.s_b_txt, {marginRight: 5}]}>可用{amountInfo.natCount || 0}NAT抵扣</Text>
                        <Text style={styles.s_b_txt_h}>{amountInfo.natDiscountAmount || 0}元</Text>
                    </View>
                    <Image
                        style={styles.s_r_pic}
                        source={isUseNat ? XUAN_ZE_ICON : WEI_XUAN_ZE_ICON}
                    />
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                style={styles.r_s_li}
                activeOpacity={0.9}
                onPress={() => {
                    NavigatorUtil.goPage('AssetDeduction', {
                        fTotal: amountInfo.remainAmount || amountInfo.yktDiscountAmount,
                        yktId
                    })
                }}
            >
                <Text style={styles.r_s_l}>资产抵扣</Text>
                <View style={styles.r_li_r}>
                    {
                        !yktId
                            ? <Text style={styles.li_r_txt}>请选择</Text>
                            : IOS ? <Text style={[styles.li_r_txt, {color: '#CFAA8E'}]} numberOfLines={1} ellipsizeMode="middle">
                                一卡通抵扣 {yktNumber} 减 ¥{amountInfo.yktDiscountAmount || 0}
                            </Text> : <Text style={[styles.li_r_txt, {color: '#CFAA8E'}]}>
                                一卡通抵扣 {yktNumber} 减 ¥{amountInfo.yktDiscountAmount || 0}
                            </Text>
                    }
                    <Image style={styles.r_t_icon} source={SINGLE_RIGHT_TO}/>
                </View>
            </TouchableOpacity>
            {
                (amountInfo.remainAmount && +amountInfo.remainAmount > 0) ? <View style={styles.r_s_li}>
                    <Text style={styles.r_s_l}>支付方式</Text>
                    <View style={styles.r_li_r}>
                        {IOS ? (
                            <Text style={styles.li_r_txt} onPress={() => setIsShow(true)}>{payTypeName}</Text>
                        ) : (
                            <Picker
                                selectedValue={payType}
                                style={{minWidth: 120}}
                                onValueChange={payTypeChange}>
                                {payList.map((item: any) => (
                                    <Picker.Item
                                        key={item.id}
                                        label={item.value}
                                        value={item.key}
                                    />
                                ))}
                            </Picker>
                        )}
                        <Image style={styles.r_t_icon} source={SINGLE_RIGHT_TO}/>
                    </View>
                </View> : null
            }
            <View style={styles.rmk_box}>
                <Text style={styles.rmk_txt}>
                    {
                        type === '1' ? '说明：到期后若未准时续费，已经上供的产品则会被下供。继续续费，则重新上供' : '说明：续费最晚截止到商品到期过后1个月，若到期后1个月内未续费则视为放弃续费将不可再续费。'
                    }
                </Text>
            </View>
        </ScrollView>
        <View
            style={
                isFullScreen()
                    ? {...styles.order_foo, paddingBottom: 32}
                    : {...styles.order_foo, paddingBottom: 12}
            }>
            <View style={styles.o_f_left}>
                <Text style={styles.f_l_btxt}>应付款：¥{amountInfo.remainAmount || 0}</Text>
                <Text style={styles.f_l_txt}>已抵扣金额￥{
                    (Math.floor((amountInfo.yktDiscountAmount || 0) * 10000 + (isUseNat ? (amountInfo.natDiscountAmount || 0) : 0) * 10000) / 10000).toFixed(2)
                }</Text>
            </View>
            <TouchableOpacity
                style={styles.o_f_right}
                activeOpacity={0.9}
                onPress={submitPay}>
                <Text style={styles.f_r_txt}>确定支付 </Text>
            </TouchableOpacity>
        </View>
        <BtmModal
            title="请输入密码"
            tpComponent={_tpModal}
            mVisible={mVisible}
            cancelModal={() => setMVisible(false)}
            confirmModal={confirmModal}
            tipMsg={tipMsg}
            resetTip={() => setTipMsg('')}
        />
        <PickerComponent
            setPicker={payType}
            pickerData={payList}
            isShowPicker={isShow}
            getPickerValue={payTypeChange}
            closeModal={closeModal}
        />
    </View>;
}

const styles = StyleSheet.create({
    renewal_page: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    renewal_con: {
        backgroundColor: '#FFFFFF',
        marginTop: 16,
    },
    r_single: {
        paddingVertical: 18,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderColor: '#E9ECEE',
        justifyContent: 'space-between',
    },
    r_s_l: {
        color: '#111111',
        fontSize: 16,
        lineHeight: 22,
        fontWeight: '500',
        fontFamily: 'PingFangSC-Medium',
    },
    r_s_h: {
        color: '#CFAA8E',
    },
    r_s_c: {
        color: '#888888',
    },
    r_s_left: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bs_pic: {
        width: 24,
        height: 24,
        marginRight: 6,
    },
    s_b_txt: {
        color: '#111111',
        fontSize: 16,
        lineHeight: 22,
        fontFamily: 'PingFangSC-Regular',
        marginRight: 4
    },
    s_b_txt_h: {
        color: '#CFAA8E',
        fontSize: 16,
        lineHeight: 22,
        fontFamily: 'PingFangSC-Semibold',
    },
    s_r_pic: {
        width: 20,
        height: 20
    },
    r_s_box: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingVertical: 18,
        paddingHorizontal: 20
    },
    r_s_bt: {
        color: '#0B3254',
    },
    r_s_tt: {
        color: '#111111',
        fontSize: 16,
        lineHeight: 22,
        fontWeight: '500',
        fontFamily: 'PingFangSC-Medium',
    },
    r_s_li: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        paddingHorizontal: 20,
        backgroundColor: '#fff'
    },
    r_li_r: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    li_r_txt: {
        color: '#888888',
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '500',
        fontFamily: 'PingFangSC-Medium',
        marginRight: 10,
        width: width / 2,
        textAlign: 'right'
    },
    r_t_icon: {
        width: 7,
        height: 12
    },
    order_foo: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
    },
    o_f_left: {},
    f_l_btxt: {
        color: '#0B3254',
        fontSize: 18,
        lineHeight: 25,
        fontWeight: '500',
        fontFamily: 'System'
    },
    f_l_txt: {
        color: '#CFAA8E',
        fontSize: 12,
        lineHeight: 17,
        fontWeight: '500',
        fontFamily: 'System'
    },
    o_f_right: {
        width: 152 * WM,
        height: 52,
        borderRadius: 8,
        backgroundColor: '#0B3254',
        alignItems: 'center',
        justifyContent: 'center',
    },
    f_r_txt: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '500',
        lineHeight: 25,
        fontFamily: 'System'
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
    rmk_box: {
        paddingHorizontal: 20,
        paddingTop: 19,
    },
    rmk_txt: {
        color: '#888888',
        fontSize: 14,
        lineHeight: 20,
        fontFamily: 'PingFangSC-Regular',
    }
});