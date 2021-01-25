import React, {useState, useEffect} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image
} from 'react-native';
import PageHeader from '@components/PageHeader/PageHeader';
import {worshipInfoDetail} from '@methods/api/theZone';

interface Props {
    navigation: any;
}
export default function ByLookDetail(props: Props) {
    const {navigation} = props;
    const {id = ''} = navigation.state.params;
    const [details, setDetails]: any = useState({});
    useEffect(() => {
        worshipInfoDetail({id}).then((d: any) => {
            console.log(d);
            setDetails(d || {});
        });
    }, []);
    return <View style={styles.by_detail}>
        {PageHeader({navigation, name: '查看详情'})}
        {/*<View style={styles.by_top}>*/}
            {/*<Image style={styles.by_t_img} source={null} />*/}
            {/*<Text style={styles.by_t_txt}>浅绿翡翠貔貅吊坠男款玉佩挂件节日礼物 貔貅吊坠 护主转运 发财貔貅</Text>*/}
        {/*</View>*/}
        <View style={styles.by_con}>
            {/*<Text style={styles.by_c_tit}>使用详情</Text>*/}
            <View style={styles.by_c_box}>
                <View style={styles.by_single}>
                    <Text style={styles.by_s_label}>被供奉人姓名</Text>
                    <Text style={styles.by_s_txt}>{details.name || ''}</Text>
                </View>
                <View style={styles.by_single}>
                    <Text style={styles.by_s_label}>身份证号</Text>
                    <Text style={styles.by_s_txt}>{details.idNumber || ''}</Text>
                </View>
                <View style={styles.by_single}>
                    <Text style={styles.by_s_label}>供奉产品</Text>
                    <Text style={styles.by_s_txt}>{details.productName || ''}</Text>
                </View>
                <View style={styles.by_single}>
                    <Text style={styles.by_s_label}>供奉内容</Text>
                    <Text style={styles.by_s_txt}>{details.content || ''}</Text>
                </View>
            </View>
        </View>
    </View>;
}

const styles = StyleSheet.create({
    by_detail: {
        flex: 1,
        backgroundColor: '#F5F5F5'
    },
    by_top: {
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20
    },
    by_t_img: {
        width: 50,
        height: 50,
        marginRight: 12,
    },
    by_t_txt: {
        flex: 1,
        color: '#111111',
        fontSize: 16,
        lineHeight: 22,
        fontWeight: '500',
        fontFamily: 'PingFangSC-Medium',
    },
    by_con: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: 20
    },
    by_c_tit: {
        color: '#111111',
        fontSize: 18,
        lineHeight: 25,
        fontWeight: '500',
        fontFamily: 'PingFangSC-Medium',
    },
    by_c_box: {
        marginTop: 5
    },
    by_single: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderStyle: 'solid',
        borderColor: '#E0E2E4',
        flexDirection: 'row'
    },
    by_s_label: {
        width: 100,
        marginRight: 10,
        color: '#111111',
        fontSize: 16,
        lineHeight: 22,
        fontFamily: 'PingFangSC-Regular',
    },
    by_s_txt: {
        color: '#0B3254',
        fontSize: 16,
        lineHeight: 22,
        fontFamily: 'PingFangSC-Regular',
        flex: 1,
    },
});