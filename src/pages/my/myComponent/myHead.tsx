import React, {useState} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    Dimensions,
    ImageBackground,
    TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
    MY_JIFEN,
    MY_YINXINGGUO,
    MY_YINXINGYE,
    MY_YLZ,
    MY_YUANLI,
    MY_ZUANSHI,
    MY_SET,
    MY_BAIYIN,
    MY_HUANGJIN,
    MY_VIP_ICON
} from '@methods/requireImage';
import {getMsg, isFullScreen} from '@methods/util';
import NavigatorUtil from '@methods/NavigatorUtil';

const {height} = Dimensions.get('window');
const PH = height / 896;
let H = 0;
setTimeout(() => {
    getMsg('barHeight').then((hi: any) => {
        H = +hi;
    });
}, 1000);

interface Props {
    userMsg: any;
    ylz: any;
}

export default function MyHead(props: Props) {
    const {userMsg = {}, ylz} = props;
    const [tabList, setTabList] = useState([
        {
            id: 'tab_01',
            pic: MY_YINXINGGUO,
            name: '银杏果',
            url: 'Yxing',
            origin: 'yxg',
        },
        {
            id: 'tab_02',
            pic: MY_YINXINGYE,
            name: '银杏叶',
            url: 'Yxing',
            origin: 'yxy',
        },
        {
            id: 'tab_03',
            pic: MY_JIFEN,
            name: '商城积分',
            origin: 'jfsc',
            url: 'Yxing',
        },
        {
            id: 'tab_04',
            pic: MY_YUANLI,
            name: '一卡通',
            url: 'Ykt',
        },
    ]);
    const {photo = '', nickname = '', level = '', grade} = userMsg;
    const LEVEL_IMG: any = {
        '1': MY_BAIYIN,
        '2': MY_HUANGJIN,
        '3': MY_ZUANSHI,
    };
    return (
        <ImageBackground
            source={{uri: photo}}
            style={styles.my_head}
            imageStyle={{opacity: 0.5}}>
            <LinearGradient
                style={{
                    ...styles.head_linear,
                    paddingTop: isFullScreen() ? H + 20 * PH : H + 10 * PH,
                }}
                start={{x: 0.0, y: 0.0}}
                end={{x: 1, y: 1}}
                colors={['#0B3254', '#0B3254']}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    style={styles.head_set}
                    onPress={() => NavigatorUtil.goPage('UserMsg')}>
                    <Image style={styles.set_pic} source={MY_SET}/>
                </TouchableOpacity>
                <View style={styles.head_con}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={styles.h_c_left}
                        onPress={() => NavigatorUtil.goPage('UserMsg')}>
                        <Image style={styles.c_l_pic} source={{uri: photo}}/>
                    </TouchableOpacity>
                    <View style={styles.h_c_right}>
                        <Text
                            style={styles.c_r_name}
                            onPress={() => NavigatorUtil.goPage('UserMsg')}>
                            昵称：{nickname}
                        </Text>
                        {/*<Text style={styles.c_r_id}>用户ID:10001</Text>*/}
                        <View style={styles.c_r_box}>
                            {
                                (grade || grade === 0) ? <View style={{position: 'relative'}}>
                                    <Image style={styles.r_pic01} source={MY_VIP_ICON}/>
                                    <Text style={styles.r_pt01}>{grade}</Text>
                                </View> : null
                            }
                            {LEVEL_IMG[level] ? (
                                <Image style={styles.r_pic02} source={LEVEL_IMG[level]}/>
                            ) : null}
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() =>
                                    NavigatorUtil.goPage('MayForceValue', {origin: 'ylz'})
                                }>
                                <ImageBackground
                                    source={MY_YLZ}
                                    style={styles.r_pic03}
                                    resizeMode="stretch">
                                    <Text style={styles.hr_tit}>愿力值：{ylz}</Text>
                                </ImageBackground>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </LinearGradient>
            <View style={styles.tabs_con}>
                {tabList.map((item: any) => (
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={styles.t_single}
                        key={item.id}
                        onPress={() => {
                            if (item.origin) {
                                NavigatorUtil.goPage(item.url, {origin: item.origin});
                            } else {
                                NavigatorUtil.goPage(item.url);
                            }
                        }}
                    >
                        <Image style={styles.t_s_img} source={item.pic}/>
                        <Text style={styles.t_s_txt}>{item.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    my_head: {
        height: height * 0.28,
        position: 'relative',
        marginBottom: 47,
    },
    head_linear: {
        opacity: 0.62,
        paddingLeft: 20,
        paddingRight: 20,
        flex: 1,
    },
    head_set: {
        flexDirection: 'row-reverse',
        marginBottom: isFullScreen() ? 14 * PH : 0,
    },
    set_pic: {
        width: 29,
        height: 25,
    },
    head_con: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    h_c_left: {
        marginRight: 13,
    },
    c_l_pic: {
        width: 69,
        height: 69,
        borderRadius: 69,
    },
    h_c_right: {},
    c_r_name: {
        marginBottom: 10,
        color: '#fff',
        fontSize: 16,
        lineHeight: 22,
        fontWeight: '500',
        fontFamily: 'PingFangSC-Medium',
    },
    c_r_id: {
        color: '#fff',
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '500',
        marginBottom: 2,
        fontFamily: 'PingFangSC-Regular',
    },
    c_r_box: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    r_pic01: {
        width: 41,
        height: 19,
        marginRight: 11,
    },
    r_pt01: {
        position: 'absolute',
        top: 0,
        height: 19,
        lineHeight: 19,
        right: 15,
        color: '#fff',
        fontWeight: '600',
        fontSize: 14
    },
    r_pic02: {
        width: 65,
        height: 19,
        marginRight: 11,
    },
    r_pic03: {
        paddingLeft: 22,
        paddingRight: 10,
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    hr_tit: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
        lineHeight: 18,
        fontFamily: 'PingFangSC-Medium',
    },
    tabs_con: {
        position: 'absolute',
        zIndex: 2,
        bottom: -45,
        left: 20,
        right: 20,
        height: 100 * PH,
        borderRadius: 18,
        borderStyle: 'solid',
        borderColor: '#E0E2E4',
        borderWidth: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
        justifyContent: 'space-around',
        backgroundColor: '#FFFFFF',
    },
    t_single: {
        flex: 1,
        alignItems: 'center'
    },
    t_s_img: {
        width: 50 * PH,
        height: 50 * PH,
        marginBottom: 4,
    },
    t_s_txt: {
        color: '#111111',
        fontSize: 14,
        lineHeight: 20,
        fontWeight: '500',
        fontFamily: 'PingFangSC-Medium',
    },
});
