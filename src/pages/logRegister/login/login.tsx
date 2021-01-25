import React, {useState, useCallback, useRef} from 'react';
import {StackActions, NavigationActions} from 'react-navigation';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TextInput,
    TouchableOpacity,
    Dimensions,
    LayoutAnimation,
    ScrollView,
} from 'react-native';
import {TO_LOGO} from '@methods/requireImage';
import {isNone, saveUserMsg, getMsg, saveMsg} from '@methods/util';
import {userLogin} from '@methods/api/personalApi';

const {width, height} = Dimensions.get('window');
const resetAction = StackActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({
            routeName: 'TabsBtnNavigation'
        })
    ]
});

interface Props {
    navigation: any;
}

export default function Login(props: Props) {
    const accountRef: any = useRef();
    const [activeType, setActiveType] = useState('0'); // 0 手机登录  1 邮箱登录
    const [account, setAccount] = useState('');
    const [paw, setPaw] = useState('');
    const [keyboardType, setKeyboardType]: any = useState('numeric');
    const [placeholderText, setPlaceholderText] = useState('请输入手机号码');
    const changeLoginType = useCallback((type: string) => {
        setAccount('');
        setPaw('');
        accountRef.current.focus(); // 自动获取焦点
        const obj: any = {
            mobile: {
                activeType: '0',
                type: 'numeric',
                placeholder: '请输入手机号码',
            },
            email: {
                activeType: '1',
                type: 'email-address',
                placeholder: '请输入邮箱号码',
            },
        };
        setKeyboardType(obj[type].type);
        setPlaceholderText(obj[type].placeholder);
        setActiveType(obj[type].activeType);
    }, []);
    const submitLogin = useCallback(
        () => {
            if (!isNone(account, '请正确填写手机号')) {
                return;
            }
            if (!isNone(paw, '请输入登录密码')) {
                return;
            }
            userLogin({loginName: account, loginPwd: paw}).then(async (data: any) => {
                await saveUserMsg(data);
                saveMsg('userDetail', JSON.stringify(data));
                LayoutAnimation.easeInEaseOut();
                const backUrl = await getMsg('backUrl');
                if (backUrl) {
                    props.navigation.navigate(backUrl);
                } else {
                    props.navigation.navigate('Home');
                    props.navigation.dispatch(resetAction);
                }
            });
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [account, paw],
    );
    // @ts-ignore
    return (
        <ScrollView
            style={{flex: 1, backgroundColor: '#FEFEFE'}}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag">
            <View style={styles.login_box}>
                <View style={styles.l_head}>
                    <Image style={styles.h_img} source={TO_LOGO}/>
                    <View style={styles.l_h_type}>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => changeLoginType('mobile')}>
                            <Text
                                style={
                                    activeType === '0'
                                        ? {...styles.h_t_txt, ...styles.h_t_active}
                                        : {...styles.h_t_txt}
                                }>
                                手机登录
                            </Text>
                        </TouchableOpacity>
                        {/*<View style={styles.h_line} />*/}
                        {/*<TouchableOpacity*/}
                        {/*  activeOpacity={0.9}*/}
                        {/*  onPress={() => changeLoginType('email')}>*/}
                        {/*  <Text*/}
                        {/*    style={*/}
                        {/*      activeType === '1'*/}
                        {/*        ? {...styles.h_t_txt, ...styles.h_t_active}*/}
                        {/*        : {...styles.h_t_txt}*/}
                        {/*    }>*/}
                        {/*    邮箱登录*/}
                        {/*  </Text>*/}
                        {/*</TouchableOpacity>*/}
                    </View>
                </View>
                <View style={styles.l_form}>
                    <View style={styles.f_single}>
                        <TextInput
                            ref={accountRef}
                            value={account}
                            style={styles.iup_box}
                            autoCapitalize="none"
                            clearButtonMode="while-editing"
                            keyboardType={keyboardType}
                            placeholder={placeholderText}
                            placeholderTextColor="#888888"
                            onChangeText={(val) => setAccount(val)}
                            // onBlur={blurLogin}
                        />
                    </View>
                    <View style={styles.f_single}>
                        <TextInput
                            value={paw}
                            style={styles.iup_box}
                            secureTextEntry={true}
                            autoCapitalize="none"
                            clearButtonMode="while-editing"
                            placeholder="请输入登录密码"
                            placeholderTextColor="#888888"
                            onChangeText={(val) => setPaw(val)}
                            // onBlur={blurLogin}
                        />
                    </View>
                </View>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={submitLogin}
                    style={styles.l_btn}>
                    <Text style={styles.l_btn_txt}>登录</Text>
                </TouchableOpacity>
                <View style={styles.l_foo}>
                    <Text
                        style={styles.f_txt}
                        onPress={() => props.navigation.navigate('Register')}>
                        注册帐号
                    </Text>
                    <View style={styles.f_line}/>
                    <Text
                        style={styles.f_txt}
                        onPress={() => props.navigation.navigate('ResetPwd')}>
                        忘记密码？
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    login_box: {
        flex: 1,
        alignItems: 'center',
        paddingTop: height / 5,
    },
    l_head: {
        alignItems: 'center',
        marginBottom: 74,
    },
    h_img: {
        width: 70,
        height: 70,
        marginBottom: 30,
    },
    l_h_type: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    h_t_active: {
        color: '#0B3254',
    },
    h_t_txt: {
        color: '#595C61',
        fontSize: 20,
        lineHeight: 28,
        fontWeight: '500',
        fontFamily: 'PingFangSC-Medium',
    },
    h_line: {
        marginLeft: 10,
        marginRight: 10,
        width: 1,
        height: 20,
        backgroundColor: '#888888',
    },
    l_form: {
        marginBottom: 50,
    },
    f_single: {
        width: width - 40,
        paddingLeft: 10,
        borderColor: '#E0E2E4',
        borderBottomWidth: 1,
        borderStyle: 'solid',
    },
    iup_box: {
        height: 56,
        paddingTop: 16,
        paddingBottom: 15,
        color: '#333',
        fontSize: 16,
        fontFamily: 'PingFangSC-Regular',
    },
    l_btn: {
        backgroundColor: '#0B3254',
        width: width - 40,
        borderRadius: 8,
        height: 52,
        alignItems: 'center',
        justifyContent: 'center',
    },
    l_btn_txt: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'PingFangSC-Regular',
    },
    l_foo: {
        marginTop: 29,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    f_line: {
        backgroundColor: '#888888',
        width: 1,
        height: 18,
        marginLeft: 18,
        marginRight: 18,
    },
    f_txt: {
        color: '#888888',
        lineHeight: 22,
        fontFamily: 'PingFangSC-Medium',
    },
});
