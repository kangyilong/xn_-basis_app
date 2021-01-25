import React, {Fragment} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
    TextInput,
    Dimensions,
    Platform,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import PageHeader from '@components/PageHeader/PageHeader';
import PickerComponent from '@components/pickerComponent/PickerComponent';
import ConfirmHeader from '../../home/placeOrder/component/confirmHeader';
import {
    getMsg,
    goBack,
    isFullScreen,
    operationPrompt,
    removeMsg,
    removeSaveMsg,
    toAlipay,
    toWeChat,
    toTradingPaw,
} from '@methods/util';
import NavigatorUtil from '@methods/NavigatorUtil';
import {agentActivityGoodsNat, agentActivityPayOrder} from '@methods/api/theZone';
import {getDictList} from '@methods/api/publicApi';
import Loading from '@components/loading/Loading';
import BtmModal from '@components/ConfirmModal/BtmModal';
import {themeColor} from '@methods/config';
import {
    ORDER_S_RIGHT_TO,
    SHOP_NAT_ICON,
    XUAN_ZE_ICON,
    WEI_XUAN_ZE_ICON
} from "@methods/requireImage";

const {width} = Dimensions.get('window');
const WM = width / 375;
const IOS = Platform.OS === 'ios';

interface Props {
    navigation: any;
}

export default class BuyActive extends React.PureComponent<Props, any> {
    state = {
        refreshing: false,
        mVisible: false,
        details: {
            yktDiscountAmount: 0,
            remainAmount: 0,
            natDiscountAmount: 0,
            natCount: 0,
        },
        productsList: [],
        payList: [],
        pwd: '',
        payType: '',
        payTypeName: '',
        tipMsg: '',
        isNat: true,
        isShow: false,
    };
    isOk: boolean = false;
    _address: any = {};
    yktNumber: any = '';
    yktId: any = '';
    subscription: any = null;
    submitPay = () => {
        if (!this._address.id) {
            return operationPrompt('请选择地址');
        }
        const {remainAmount = 0} = this.state.details;
        const noPay = !!(+remainAmount > 0);
        if (!noPay) {
            toTradingPaw(() => {
                this.setState({
                    mVisible: true,
                });
            });
        } else {
            this.confirmModal();
        }
    };
    confirmModal = () => {
        const {shopId, shopNum} = this.props.navigation.state.params;
        const {remainAmount = 0} = this.state.details;
        const noPay = !!(+remainAmount > 0);
        if (!this.state.pwd && !noPay) {
            return this.setState({
                tipMsg: '请输入支付密码',
            });
        }
        if (!this.isOk) {
            this.isOk = true;
            const {details, pwd, payType = '0', isNat} = this.state;
            const {yktDiscountAmount = 0} = details;
            const config: any = {
                id: shopId,
                payment: noPay ? payType : '',
                isUseNat: isNat ? '1' : '0',
                pwd,
                number: shopNum,
                addressId: this._address.id
            };
            if (yktDiscountAmount > 0) {
                config.yktNumber = this.yktNumber;
            }
            this.setState({
                mVisible: false,
            });
            agentActivityPayOrder(config)
                .then((payConfig: any) => {
                    this.isOk = false;
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
                                    this.isOk = false;
                                },
                            );
                        } else {
                            this.isOk = false;
                            toWeChat(
                                wechatAppPayInfo,
                                () => {
                                    payCallback();
                                },
                                () => {
                                    this.isOk = false;
                                },
                            );
                        }
                    }
                })
                .catch(() => {
                    this.isOk = false;
                });
            function payCallback() {
                operationPrompt('支付成功', () => {
                    removeSaveMsg();
                    NavigatorUtil.goPage('BuyRecord');
                });
            }
        }
    };
    _agentActivityGoodsNat = () => {
        const {shopId, shopNum} = this.props.navigation.state.params;
        const {details, isNat} = this.state;
        const {natCount, natDiscountAmount} = details;
        agentActivityGoodsNat({
            id: shopId,
            number: shopNum,
            yktNumber: this.yktNumber,
            isUseNat: Number(this.state.isNat).toString()
        }).then((d: any) => {
            let dd = null;
            if (!isNat) {
                dd = {
                    ...d,
                    natCount,
                    natDiscountAmount
                };
            } else {
                dd = {...d};
            }
            this.setState({
                details: {
                    ...dd,
                    id: '1'
                },
                refreshing: false
            });
        })
    };
    getOrderDetail = () => {
        getMsg('yktNumber').then((d: any) => {
            if (d) {
                this.yktNumber = d;
            } else {
                this.yktNumber = '';
            }
            this._agentActivityGoodsNat();
        });
        getMsg('yktId').then((d: any) => {
            if (d) {
                this.yktId = d;
            } else {
                this.yktId = '';
                removeMsg('yktAmount');
            }
        });
        getDictList('pay.type').then((data: any) => {
            this.setState({
                payList: data,
                payType: data[0].key,
                payTypeName: data[0].value,
            });
        });
    };
    _onRefresh = () => {
        this.setState(
            {
                refreshing: true,
            },
            this.getOrderDetail,
        );
    };
    payTypeChange = (val: any) => {
        const {payList} = this.state;
        const payObj: any = payList.filter((item: any) => item.key === val)[0];
        this.setState({
            payType: val,
            payTypeName: payObj ? payObj.value : '',
            isShow: false,
        });
    };
    closeModal = () => {
        this.setState({
            isShow: false,
        });
    };
    componentDidMount() {
        this.subscription = this.props.navigation.addListener('didFocus', () => {
            this.getOrderDetail();
        });
    }

    componentWillUnmount() {
        this.subscription.remove();
    }

    render() {
        const {
            details = {orderMoney: 0},
            refreshing,
            payList,
            payType,
            payTypeName,
            mVisible,
            tipMsg,
            isShow,
            isNat
        }: any = this.state;
        const {yktDiscountAmount = 0, remainAmount = 0, natDiscountAmount = 0, natCount = 0} = details;
        const {navigation} = this.props;
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
        return <Fragment>
            <View style={details.id ? styles.check_page : {display: 'none', ...styles.check_page}}>
                {PageHeader({
                    navigation: navigation,
                    name: '收银台',
                    leftGoTo: () => {
                        goBack(navigation);
                    },
                })}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            tintColor={themeColor}
                            colors={[themeColor]}
                            refreshing={refreshing}
                            onRefresh={this._onRefresh}
                        />
                    }
                    style={styles.check_con}>
                    <ConfirmHeader
                        navigation={this.props.navigation}
                        addressCallback={(address: any) => {
                            this._address = address;
                        }}
                    />
                    <View style={styles.check_block}>
                        <TouchableOpacity
                            style={styles.b_single}
                            activeOpacity={0.9}
                            onPress={() => this.setState((pevState: any) => ({
                                isNat: !pevState.isNat
                            }), this._agentActivityGoodsNat)}
                        >
                            <View style={styles.bx_s_left}>
                                <Image
                                    style={styles.bs_pic}
                                    source={SHOP_NAT_ICON}
                                />
                                <Text style={[styles.s_b_txt, {marginRight: 5}]}>可用{natCount}NAT抵扣</Text>
                                <Text style={styles.s_b_txt_h}>{natDiscountAmount}元</Text>
                            </View>
                            <Image
                                style={styles.s_r_pic}
                                source={isNat ? XUAN_ZE_ICON : WEI_XUAN_ZE_ICON}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.check_block}>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            style={styles.b_single}
                            onPress={() =>
                                NavigatorUtil.goPage('AssetDeduction', {
                                    fTotal: remainAmount || yktDiscountAmount,
                                    yktId: this.yktId
                                })
                            }>
                            <Text style={styles.b_s_left}>资产抵扣</Text>
                            <View style={styles.b_s_right}>
                                <Text style={styles.s_r_txt} numberOfLines={1} ellipsizeMode="middle">
                                    {yktDiscountAmount ? `一卡通抵扣 ${this.yktNumber} ￥${yktDiscountAmount}` : '请选择'}
                                </Text>
                                <Image style={styles.s_r_to} source={ORDER_S_RIGHT_TO}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                    {+remainAmount > 0 ? (
                        <View style={styles.check_block}>
                            <View style={styles.b_single}>
                                <Text style={styles.b_s_left}>支付方式</Text>
                                <View style={styles.b_s_right}>
                                    {IOS ? (
                                        <Text
                                            style={{
                                                minWidth: 120,
                                                color: '#111',
                                                lineHeight: 24,
                                                textAlign: 'right',
                                            }}
                                            onPress={() =>
                                                this.setState({
                                                    isShow: true,
                                                })
                                            }>
                                            {payTypeName}
                                        </Text>
                                    ) : (
                                        <Picker
                                            selectedValue={payType}
                                            style={{minWidth: 120}}
                                            onValueChange={(v) => this.payTypeChange(v)}>
                                            {payList.map((item: any) => (
                                                <Picker.Item
                                                    key={item.id}
                                                    label={item.value}
                                                    value={item.key}
                                                />
                                            ))}
                                        </Picker>
                                    )}
                                </View>
                            </View>
                        </View>
                    ) : null}
                </ScrollView>
                <View
                    style={
                        isFullScreen()
                            ? {...styles.order_foo, paddingBottom: 32}
                            : {...styles.order_foo, paddingBottom: 12}
                    }>
                    <View style={styles.o_f_left}>
                        <Text style={styles.f_l_btxt}>应付款：¥{remainAmount}</Text>
                        <Text style={styles.f_l_txt}>已抵扣金额￥{(Math.floor((yktDiscountAmount + (isNat ? natDiscountAmount : 0)) * 1000) / 1000).toFixed(2)}</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.o_f_right}
                        activeOpacity={0.9}
                        onPress={this.submitPay}>
                        <Text style={styles.f_r_txt}>确定支付 </Text>
                    </TouchableOpacity>
                </View>
                <BtmModal
                    title="请输入密码"
                    tpComponent={_tpModal}
                    mVisible={mVisible}
                    cancelModal={() => this.setState({mVisible: false})}
                    confirmModal={this.confirmModal}
                    tipMsg={tipMsg}
                    resetTip={() => this.setState({tipMsg: ''})}
                />
                <PickerComponent
                    setPicker={payType}
                    pickerData={payList}
                    isShowPicker={isShow}
                    getPickerValue={this.payTypeChange}
                    closeModal={this.closeModal}
                />
            </View>
            <Loading title=" " style={details.id ? {display: 'none'} : {backgroundColor: '#fff'}} size="large"/>
        </Fragment>;
    }
}

const styles = StyleSheet.create({
    check_page: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    check_con: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingTop: 10,
    },
    shop_list: {
        backgroundColor: '#fff',
        paddingTop: 12,
        paddingLeft: 20,
        paddingRight: 20,
    },
    shop_single: {
        paddingBottom: 14,
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderColor: '#f5f5f5',
    },
    single_head: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    s_h_left: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    s_h_btxt: {
        color: '#111111',
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 22,
        marginRight: 6,
        fontFamily: 'System'
    },
    s_hl_txt: {
        color: '#888888',
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '500',
        fontFamily: 'System'
    },
    s_hr_txt: {
        color: '#0B3254',
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '500',
        fontFamily: 'System'
    },
    single_con: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    s_con_l: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingRight: 10,
        flex: 1,
    },
    s__l_pic: {
        width: 50,
        height: 50,
        marginRight: 12,
    },
    s__l_txt: {
        color: '#111111',
        fontWeight: '500',
        fontSize: 16,
        lineHeight: 22,
        flex: 1,
        fontFamily: 'System'
    },
    s__r_txt: {
        color: '#999',
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '500',
        fontFamily: 'System'
    },
    shop_all: {
        flexDirection: 'row-reverse',
        height: 57,
        alignItems: 'center',
    },
    s_all_box: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    s_all_txt: {
        color: '#111111',
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 22,
        fontFamily: 'System'
    },
    s_all_btxt: {
        color: '#0B3254',
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 22,
        fontFamily: 'System'
    },
    check_block: {
        marginTop: 10,
        backgroundColor: '#fff',
        paddingLeft: 20,
        paddingRight: 20,
    },
    b_single: {
        height: 57,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderColor: '#f5f5f5',
    },
    bx_s_left: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bs_pic: {
        width: 24,
        height: 24,
        marginRight: 6
    },
    s_r_pic: {
        width: 20,
        height: 20,
    },
    s_b_txt_h: {
        color: '#CFAA8E',
        fontSize: 16,
        lineHeight: 22,
        fontWeight: '500',
        fontFamily: 'System'
    },
    s_b_txt: {
        color: '#0B3254',
        fontSize: 16,
        lineHeight: 22,
        fontWeight: '500',
        fontFamily: 'System'
    },
    b_s_left: {
        color: '#111111',
        fontSize: 16,
        fontWeight: '600',
        lineHeight: 22,
    },
    b_s_right: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    s_r_xpic: {
        width: 20,
        height: 20,
    },
    s_r_txt: {
        color: '#888888',
        fontSize: 14,
        lineHeight: 20,
        width: width / 2,
        textAlign: 'right'
    },
    s_r_to: {
        width: 7,
        height: 12,
        marginLeft: 10,
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
});
