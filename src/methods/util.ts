import {
    Platform,
    Dimensions,
    Alert,
    NativeModules,
    StatusBar,
    LayoutAnimation,
    Linking,
    Share,
} from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import CameraRoll from '@react-native-community/cameraroll';
import {StackActions, NavigationActions} from 'react-navigation';
import {
    check,
    request,
    PERMISSIONS,
    RESULTS,
    openSettings,
} from 'react-native-permissions';
import {BigDecimal, MathContext} from './libs/BigDecimal.js';
import AsyncStorage from '@react-native-community/async-storage';
// @ts-ignore
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import * as WeChat from 'react-native-wechat-lib';
// @ts-ignore
import AliyunOSS from 'aliyun-oss-react-native';
// @ts-ignore
import RNHeicConverter from 'react-native-heic-converter';
// @ts-ignore
import KcosZfb from 'kcos-zf-zfb';
// @ts-ignore
import KcosWx from 'kcos-rn-wx';
// @ts-ignore
import KcosAppUpdate from 'kcos-app-update';
import TabBarIcon from '@components/tabBarIcon/TabBarIcon';
import store from '../redux/store';
import {
    toggleToastMsg,
    showLoadingToast,
    hideLoadingToast,
} from '@redux/action';
import {
    upImageToQiNiu,
    upImageToALI,
    getSystemType,
} from '@methods/api/publicApi';
// import CITY from '../assets/city';
import {QINIU_UP, WX_CONFIG} from './config';
import {getUserDetail} from '@methods/api/personalApi';
import NavigatorUtil from '@methods/NavigatorUtil';

WeChat.registerApp(WX_CONFIG.appId, WX_CONFIG.url);
const {width, height} = Dimensions.get('window');
const ReactNative = require('react-native');

export async function getUserId() {
    return await AsyncStorage.getItem('userId');
}

export async function isLogin() {
    return !!(await getUserId());
}

export async function saveUserMsg({token, userId}: any) {
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('userId', userId);
    removeMsg('cityData');
}

export async function getToken() {
    return (await AsyncStorage.getItem('token')) || '';
}

export async function getUserLang() {
    return (await AsyncStorage.getItem('lang')) || 'zh_CN';
}

export async function saveAsyncMsg(key: string, value: string) {
    return await AsyncStorage.setItem(key, value);
}

export function saveMsg(key: string, value: string) {
    return AsyncStorage.setItem(key, value);
}

export async function getMsg(key: string) {
    return await AsyncStorage.getItem(key);
}

export function removeMsg(key: string) {
    return AsyncStorage.removeItem(key);
}

export async function removeAsyncMsg(key: string) {
    return await AsyncStorage.removeItem(key);
}

// 退出登录
export function clearUserMsg() {
    removeMsg('token');
    removeMsg('userId');
    removeMsg('msgType');
}

// 城市数据处理
export function cityDataFn(data: Array<any>) {
    const cityData: any = [];
    let pObj = {};
    let cList: any = [];
    let list: any = [];
    const ll: any = [];
    for (let i = 0, len = data.length; i < len; i++) {
        const {id, pid: parentId, deep: levelType} = data[i];
        if (+levelType === 2) {
            pObj = {
                value: id.toString(),
                parentId: parentId.toString(),
                label: data[i].name,
                children: [],
            };
            cityData.push(pObj);
        } else if (+levelType === 3) {
            cList.push({
                value: id.toString(),
                parentId: parentId.toString(),
                label: data[i].name,
                children: [],
            });
        } else if (+levelType === 4) {
            list.push({
                value: id.toString(),
                parentId: parentId.toString(),
                label: data[i].name,
            });
        }
    }
    for (let i = 0, len = cityData.length; i < len; i++) {
        for (let j = 0, cLen = cList.length; j < cLen; j++) {
            if (cityData[i].value === cList[j].parentId) {
                cityData[i].children.push(cList[j]);
            }
        }
    }
    for (let j = 0, cLen = cList.length; j < cLen; j++) {
        for (let k = 0, l = list.length; k < l; k++) {
            if (cList[j].value === list[k].parentId) {
                cList[j].children.push(list[k]);
            }
        }
    }

    function delFn(arr: Array<any>, ll: Array<any>) {
        arr.forEach((item: any) => {
            const obj = {[item.label]: []};
            if (Array.isArray(item.children)) {
                ll.push(obj);
                return delFn(item.children, obj[item.label]);
            } else {
                ll.push(item.label);
            }
        });
    }

    delFn(cityData, ll);
    saveMsg('cityData', JSON.stringify(ll));
}

export function isUnDefined(value: any) {
    if (value === undefined || value === null || value === '') {
        return true;
    }
    return false;
}

// 操作后提示
export function operationPrompt(
    msg = '操作成功',
    callback: any = null,
    time = 2000,
) {
    if (callback && typeof callback === 'function') {
        setTimeout(() => {
            callback();
        }, time);
    }
    return store.dispatch<any>(toggleToastMsg(msg, time));
}

// 判断必填项
export function isNone(value: number | string, errTxt: string) {
    if (!value && value !== 0) {
        operationPrompt(errTxt);
        return false;
    }
    return true;
}

/**
 * 金额格式转化 根据币种格式化金额
 * @param money 金额
 * @param format 小数点后几位
 * @param coin 币种
 * @param isRe 是否去零
 */
export async function moneyFormat(
    money: any,
    format: number | string,
    coin = '',
    isRe = false,
) {
    if (+money === 0) {
        const num = format ? +format : 8;
        return (+money).toFixed(num);
    }
    const coinObj: any = await AsyncStorage.getItem('coinData');
    let unit = coin ? JSON.parse(coinObj)[coin].unit : '1000';
    let flag = false; // 是否是负数
    if (isNaN(money)) {
        return '-';
    } else {
        Number(money);
    }
    if (money < 0) {
        money = -1 * money;
        flag = true;
    }
    // 如果有币种coin 则默认为8位  如果没有则默认格式为2位小数
    if (coin && isUndefined(format)) {
        format = 8;
    } else if (isUndefined(format) || typeof format === 'object') {
        format = 2;
    }
    // 金额格式化 金额除以unit并保留format位小数
    money = new BigDecimal(money.toString());
    // @ts-ignore
    money = money
        .divide(new BigDecimal(unit), format, MathContext.ROUND_DOWN)
        .toString();
    // 是否去零
    if (isRe) {
        var re = /\d{1,3}(?=(\d{3})+$)/g;
        money = money.replace(
            /^(\d+)((\.\d+)?)$/,
            (s: any, s1: any, s2: any) => s1.replace(re, '$&,') + s2,
        );
    }
    if (flag) {
        money = '-' + money;
    }
    return money;
}

/**
 * 金额减法 s1 - s2
 * @param s1
 * @param s2
 * @param coin 币种
 */
export async function formatMoneySubtract(
    s1: any,
    s2: any,
    format: any,
    coin: string,
) {
    if (+s1 === 0) {
        const num = format ? +format : 8;
        return (+s1).toFixed(num);
    }
    if (isUnDefined(s1) || isUnDefined(s2) || s1 === '' || s2 === '') {
        return '-';
    } else {
        s1 = Number(s1);
        s2 = Number(s2);
    }
    let num1 = new BigDecimal(s1.toString());
    let num2 = new BigDecimal(s2.toString());
    // @ts-ignore
    return await moneyFormat(num1.subtract(num2).toString(), format, coin);
}

// 币种放大
export async function formatMoneyMultiply(money: any, rate: any, coin: string) {
    const coinObj: any = await AsyncStorage.getItem('coinData');
    let unit = coin ? JSON.parse(coinObj)[coin].unit : '1000';
    if (isUnDefined(money) || money === '') {
        return '-';
    } else {
        money = Number(money).toString();
    }
    rate = rate || new BigDecimal(unit);
    money = new BigDecimal(money);
    money = money.multiply(rate).toString();
    return money;
}

/**
 * 是否是空
 * @param value
 */
export function isUndefined(value: any) {
    return value === undefined || value === null || value === '';
}

// 判断是否为全面屏
export function isFullScreen() {
    return height / width > 2;
}

// 日期格式化
export function formatDate(date: any, fmt = 'yyyy-MM-dd hh:mm:ss') {
    if (!date) {
        return '-';
    }
    date = new Date(date);
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(
            RegExp.$1,
            (date.getFullYear() + '').substr(4 - RegExp.$1.length),
        );
    }
    let o: any = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(
                RegExp.$1,
                RegExp.$1.length === 1 ? str : padLeftZero(str),
            );
        }
    }
    return fmt;
}

function padLeftZero(str: string) {
    return ('00' + str).substr(str.length);
}

/**
 * 拍照或相册 上传到七牛云
 *  @param response 文件内容
 *  @param RNHeicConverter 处理.heic或.HEIC文件
 *  @param Platform 平台
 * */
export async function ImageToNiuYun(
    response: any,
    RNHeicConverter: any,
    Platform: any,
) {
    if (response.didCancel) {
        return Promise.reject('已取消~');
    } else if (response.error) {
        return Promise.reject('ImagePicker Error: ' + response.error);
    } else if (response.customButton) {
        return Promise.reject('用户点击自定义按钮: ' + response.customButton);
    } else {
        let source: any = {};
        if (
            Platform.OS === 'ios' &&
            response.fileName &&
            (response.fileName.endsWith('.heic') ||
                response.fileName.endsWith('.HEIC'))
        ) {
            const heicData = await RNHeicConverter.convert({path: response.origURL});
            const {success, path, error} = heicData;
            if (!error && success && path) {
                let name = response.fileName;
                name = name.replace('.heic', '.jpg');
                name = name.replace('.HEIC', '.jpg');
                source = {uri: path, name};
            } else {
                return Promise.reject('图片上传失败!');
            }
        } else {
            source = {
                uri: response.uri,
                type: response.type,
                name: response.fileName || 'IMG.JPG',
            };
        }
        if (source.uri) {
            return uplpadAlOss(source);
        } else {
            return Promise.reject('图片上传失败!');
        }
    }
}

// 上传到七牛云
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function uploadQiNiu(source: any) {
    const qniuData: any = await upImageToQiNiu();
    let formData = new FormData();
    const randomNum = new Date().getTime() + Math.random() * 10000;
    formData.append('key', randomNum + source.name);
    formData.append('token', qniuData);
    formData.append('file', source);
    return fetch(QINIU_UP, {
        // 上传至七牛云
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        body: formData,
    })
        .then(async (param) => {
            if (param.ok) {
                return await param.json();
            } else {
                return Promise.reject('图片上传失败!');
            }
        })
        .catch((err) => {
            return Promise.reject(err);
        });
}

// 上传到阿里云oss
async function uplpadAlOss(source: any) {
    const alData: any = await upImageToALI();
    const {
        accessKeyId,
        accessKeySecret,
        bucket,
        endpoint,
        filePath,
        securityToken,
    } = alData;
    const configuration = {
        maxRetryCount: 3,
        timeoutIntervalForRequest: 30,
        timeoutIntervalForResource: 24 * 60 * 60,
    };
    AliyunOSS.enableDevMode();
    AliyunOSS.initWithSecurityToken(
        securityToken,
        accessKeyId,
        accessKeySecret,
        endpoint,
        configuration,
    );
    const objectKey = new Date().getTime() + Math.random() * 10000 + source.name;
    return AliyunOSS.asyncUpload(bucket, objectKey, source.uri)
        .then(() => {
            return Promise.resolve(`${filePath}/${objectKey}`);
        })
        .catch((err: any) => {
            if (__DEV__) {
                console.log('error', err);
            }
            return Promise.reject('图片上传失败!');
        });
}

async function checkFn() {
    if (Platform.OS !== 'ios') {
        const result = await check(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
        switch (result) {
            // @ts-ignore
            case RESULTS.UNAVAILABLE:
                //不支持该功能
                Alert.alert('', '您的设备不支持该功能', [{text: '确定'}]);
                return;
            // @ts-ignore
            case RESULTS.DENIED:
                //该权限尚未被请求、被拒绝，但可请求
                let req = await request(PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE);
                // @ts-ignore
                if (req == RESULTS.DENIED) {
                    Alert.alert('', '您已经拒绝授权', [{text: '我知道了'}]);
                    return;
                }
                break;
            // @ts-ignore
            case RESULTS.GRANTED:
                //授予权限
                break;
            // @ts-ignore
            case RESULTS.BLOCKED:
                //该权限被拒绝
                Alert.alert('提示', '您已经禁用APP读写手机储存权限,图片文件访问受限', [
                    {
                        text: '关闭',
                        onPress: () => {
                        },
                    },
                    {
                        text: '去设置开启权限',
                        onPress: () => {
                            openSettings();
                        },
                    },
                ]);
                return;
        }
    }
}

/*
 * 上传图片操作
 * */
export async function selectPhotoTapped(CONFIG: any, type = '0') { // type 0 相机  1 相册
    await checkFn();
    // ImagePicker, FETCH, CALBACK
    const options: any = {
        title: '选择图片',
        cancelButtonTitle: '取消',
        takePhotoButtonTitle: '拍照',
        chooseFromLibraryButtonTitle: '选择照片',
        cameraType: 'back',
        mediaType: 'photo',
        videoQuality: 'medium',
        durationLimit: 10, //
        maxWidth: 800, // 图片大小
        maxHeight: 800, // 图片大小
        quality: 1,
        angle: 0,
        allowsEditing: false,
        noData: false,
        storageOptions: {
            skipBackup: true,
        },
    };
    const showImagePicker = type === '0' ? launchCamera : launchImageLibrary;
    showImagePicker(options, (response: any) => {
        const {errorCode = ''} = response;
        if (errorCode === 'camera_unavailable') return CONFIG.ERROR('相机不可用');
        store.dispatch<any>(showLoadingToast());
        ImageToNiuYun(response, RNHeicConverter, Platform)
            .then((data: any) => {
                store.dispatch<any>(hideLoadingToast());
                if (CONFIG.FETCH) {
                    CONFIG.FETCH({photo: data}).then(() => {
                        CONFIG.CALBACK(data);
                    });
                } else {
                    CONFIG.CALBACK(data);
                }
            })
            .catch((err) => {
                store.dispatch<any>(hideLoadingToast());
                CONFIG.ERROR(err);
            });
    });
}

/**
 * 保存图片至本地
 * (xcode自行百度设置)
 * @param refImageBox 想要保存的View或其他元素
 * @param ReactNative.takeSnapshot 将该元素转为图片
 * @param CameraRoll.saveToCameraRoll 将图片保存到本地
 * */
export async function takePhoto(refImageBox: any) {
    try {
        const URI = await ReactNative.takeSnapshot(refImageBox, {
            format: 'png',
            quality: 1,
        });
        CameraRoll.saveToCameraRoll(URI)
            .then(() => {
                store.dispatch<any>(toggleToastMsg('保存成功'));
            })
            .catch(() => {
                store.dispatch<any>(toggleToastMsg('保存失败'));
            });
        return URI;
    } catch (err) {
        store.dispatch<any>(toggleToastMsg('保存失败'));
        return err;
    }
}

// 保存图片至本地
export function takeSnapshot(eleRef: any) {
    store.dispatch<any>(showLoadingToast());
    ReactNative.takeSnapshot(eleRef, {format: 'png', quality: 1})
        .then((uri: string) => {
            const saveResult = CameraRoll.saveToCameraRoll(uri);
            saveResult
                .then(function () {
                    store.dispatch<any>(hideLoadingToast());
                    operationPrompt('图片已保存至相册');
                })
                .catch(function () {
                    store.dispatch<any>(hideLoadingToast());
                    operationPrompt('保存失败');
                });
        })
        .catch((error: any) => {
            if (__DEV__) {
                console.log(error);
            }
            store.dispatch<any>(hideLoadingToast());
        });
}

// 保存到本地
export async function savePicToLocalhost(uri: string) {
    await checkFn();
    const saveResult = CameraRoll.saveToCameraRoll(uri);
    fn(saveResult);
    function fn(saveResult: any) {
        saveResult
            .then(function () {
                store.dispatch<any>(hideLoadingToast());
                operationPrompt('图片已保存至相册');
            })
            .catch(function (err: any) {
                if (__DEV__) {
                    console.log(err);
                }
                store.dispatch<any>(hideLoadingToast());
                operationPrompt('保存失败');
            });
    }
}

export function dealWithFour(num: number | string) {
    return (Math.floor(+num * 10000) / 10000).toFixed(4);
}

export function dealWithTwo(num: number | string) {
    return (Math.floor(+num * 100) / 100).toFixed(2);
}

// 倒计时
export function countdown(t: number, nowTime: number) {
    const time = t - nowTime;
    let th = '0',
        tm = '0',
        ts = '0',
        td = '0';
    if (time > 0) {
        td = Math.floor(time / (60 * 60 * 24 * 1000)).toString();
        th = Math.floor((time / (1000 * 60 * 60)) % 24).toString();
        tm = Math.floor((time / (1000 * 60)) % 60).toString();
        ts = Math.floor((time / 1000) % 60).toString();
    }
    return {
        td,
        th,
        tm,
        ts,
    };
}

// 同步状态栏高度
export function statusAsyncBarHeight() {
    return new Promise(async (reslove) => {
        const {StatusBarManager} = NativeModules;
        if (Platform.OS === 'ios') {
            StatusBarManager.getHeight(async (obj: any) => {
                const h = +obj.height < 40 ? '24' : obj.height.toString();
                await saveAsyncMsg('barHeight', h);
                reslove(false);
            });
        } else {
            // @ts-ignore
            await saveAsyncMsg('barHeight', StatusBar.currentHeight.toString());
            reslove(false);
        }
    });
}

statusBarHeight();

// 状态栏高度
export function statusBarHeight() {
    const {StatusBarManager} = NativeModules;
    if (Platform.OS === 'ios') {
        StatusBarManager.getHeight((obj: any) => {
            const h = +obj.height < 40 ? '24' : obj.height.toString();
            saveMsg('barHeight', h);
        });
    } else {
        // StatusBar.currentHeight.toString()  15
        // @ts-ignore
        saveMsg('barHeight', StatusBar.currentHeight.toString());
    }
}

// 复制 string
export async function clipboardFn(Str: string, isShow = true) {
    Clipboard.setString(Str);
    const str = await Clipboard.getString();
    if (str) {
        isShow && operationPrompt('复制成功');
    }
}

// 拨打电话
export function callMobile(mobile: string) {
    Linking.openURL('tel:' + mobile.trim());
}

export function toLogin(navigation: any) {
    const {routeName} = navigation.state;
    saveMsg('backUrl', routeName);
    const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({routeName: 'Login'})],
    });
    LayoutAnimation.easeInEaseOut();
    navigation.dispatch(resetAction);
    // navigation.replace('Login');
}

// tabs路由数据
export function getTabRouters(routers: Array<any>) {
    const rObj: any = {};
    routers.forEach((item) => {
        rObj[item.key] = {
            screen: item.component,
            swipeEnabled: true,
            navigationOptions: () => ({
                tabBarLabel: item.name,
                tabBarIcon: ({focused}: any) => {
                    const {active, def} = item.iconObj;
                    const source = focused ? active : def;
                    const style = {width: 21, height: 21};
                    return TabBarIcon({source, style});
                },
            }),
        };
    });
    return {
        tabRouter: rObj,
    };
}

// 普通路由数据
export function getAppRouters(routers: Array<any>) {
    const obj: any = {};
    routers.forEach((item) => {
        obj[item.key] = {
            screen: item.component,
            navigationOptions: {
                header: () => null,
            },
        };
    });
    return obj;
}

// 头黑/头白
export function darkContent(type: string) {
    const content = type === 'dark' ? 'dark-content' : 'light-content';
    StatusBar.setBarStyle(content);
    StatusBar.setBackgroundColor('transparent');
    StatusBar.setTranslucent(true);
}

// 返回 goBack
export function goBack(navigation: any) {
    navigation.goBack();
}

// 清除页面临时数据
export function removeSaveMsg() {
    removeMsg('yktAmount');
    removeMsg('yktNumber');
    removeMsg('yktId');
}

// 支付宝-支付
export function toAlipay(
    signOrder: any,
    payCallback: Function,
    errCallback: Function,
) {
    return KcosZfb({
        NativeModules,
        Platform,
        operationPrompt,
        signOrder,
        payCallback,
        errCallback,
    });
}

// 微信-支付
export function toWeChat(
    wechatAppPayInfo: any,
    payCallback: Function,
    errCallback: Function,
) {
    return KcosWx({
        WeChat,
        operationPrompt,
        wechatAppPayInfo,
        payCallback,
        errCallback,
    });
}

// 获取路由参数
export function getRouteParams(key: any, params: any) {
    return params[key] ? params[key] : '';
}

// APP更新
export function toAppUpdate(isLoading = false, isShow = false) {
    return KcosAppUpdate({
        Platform,
        Linking,
        Alert,
        NativeModules,
        getSystemType,
        saveMsg,
        isLoading,
        isShow,
        appName: '杏福宝',
    });
}

// 是否设置支付密码
export function toTradingPaw(sucCallback?: Function) {
    return getUserDetail(true).then((data: any) => {
        saveMsg('userDetail', JSON.stringify(data));
        const {tradePwdFlag: pwdFlag, loginName} = data;
        if (!pwdFlag || pwdFlag === '0') {
            operationPrompt('请先设置支付密码');
            return setTimeout(() => {
                NavigatorUtil.goPage('TradingPaw', {
                    backUrl: '',
                    pwdFlag,
                    loginName,
                });
            }, 2000);
        }
        sucCallback && sucCallback();
    });
}

// 阿里云oss图片-质量处理
export function delImgQuality(uri: string, q = 60) {
    return `${uri}?x-oss-process=image/interlace,1/quality,q_${q}`;
}

// 身份证*号处理
export function starIdCard(str: string) {
    if (str && str.length > 0) {
        return str.replace(/^(.{6})(?:\d+)(.{4})$/, '$1****$2');
    }
    return str;
}

// 手机号*号处理
export function starMobile(str: string) {
    if (str && str.length > 0) {
        return str.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
    }
    return str;
}

/*
  appShare({
    message: '去分享',
    url: 'http://www.baidu.com',
    title: 'RN 分享',
    dialogTitle: 'android 分享',
  });
* */

// APP分享
export function appShare(shareParams = {}, sucFn?: Function, errFn?: Function) {
    const {
        message = '',
        url,
        title = '',
        dialogTitle = '',
        excludedActivityTypes = ['com.apple.UIKit.activity.PostToTwitter'],
        tintColor = 'blue',
    }: any = shareParams;
    Share.share(
        {
            message,
            url,
            title,
        },
        {
            dialogTitle,
            excludedActivityTypes,
            tintColor,
        },
    )
        .then((res) => {
            sucFn && sucFn(res);
        })
        .catch((error) => {
            errFn && errFn(error);
        });
}

// 换行切割
export function splitStr(str: string) {
    if (!str) {
        return [];
    }
    return str.split(/[\n]/);
}
