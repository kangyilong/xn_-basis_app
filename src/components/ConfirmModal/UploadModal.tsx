import React, {useState, useEffect, useCallback} from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet
} from 'react-native';
import MToast from '@components/MToast/MToast';
import {MY_XHANG_CE, MY_ZHAO_PIAN} from "@methods/requireImage";
import {isFullScreen, operationPrompt, selectPhotoTapped} from "@methods/util";

interface Props {
    mVisible: boolean,
    toastMsg: string,
    uploadFn?: Function,
    sucCallback: Function,
    errCallback: Function,
    cancelCallback: Function
}
export default function UploadModal(props: Props) {
    const {mVisible, toastMsg, uploadFn, sucCallback, errCallback, cancelCallback} = props;
    const _changePhoto = useCallback((type) => {
        const params: any = {
            CALBACK: (data: any) => {
                operationPrompt('上传成功');
                sucCallback(data);
            },
            ERROR: errCallback
        };
        if (typeof uploadFn === 'function') {
            params.FETCH = uploadFn;
        }
        selectPhotoTapped(params, type);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sucCallback]);
    return <Modal visible={mVisible} transparent={true} animationType="fade">
        <TouchableOpacity
            style={styles.m_page}
            activeOpacity={0.9}
            onPress={() => cancelCallback()}
        >
            <TouchableOpacity
                style={styles.m_box}
                activeOpacity={1}
                onPress={(e: any) => {
                    return e.stopPropagation();
                }}
            >
                <View style={styles.m_con}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={[styles.m_c_single, {marginRight: 70}]}
                        onPress={() => _changePhoto('1')}
                    >
                        <Image source={MY_XHANG_CE} style={{width: 45, height: 45}}/>
                        <Text style={styles.m_c_txt}>相册</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        style={styles.m_c_single}
                        onPress={() => _changePhoto('0')}
                    >
                        <Image source={MY_ZHAO_PIAN} style={{width: 45, height: 45}}/>
                        <Text style={styles.m_c_txt}>拍照</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    activeOpacity={0.9}
                    style={styles.m_foo}
                    onPress={() => cancelCallback()}
                >
                    <Text style={styles.m_f_txt}>取消</Text>
                </TouchableOpacity>
            </TouchableOpacity>
            <MToast toastMsg={toastMsg} />
        </TouchableOpacity>
    </Modal>;
}

const styles = StyleSheet.create({
    m_page: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        position: 'relative'
    },
    m_box: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff'
    },
    m_con: {
        backgroundColor: '#F5F5F5',
        paddingTop: 24,
        paddingBottom: 22,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    m_c_single: {
        alignItems: 'center'
    },
    m_c_txt: {
        fontSize: 12,
        color: '#111',
        lineHeight: 17,
        fontWeight: '500',
        marginTop: 5,
        fontFamily: 'PingFangSC-Medium'
    },
    m_foo: {
        paddingTop: 12,
        paddingBottom: isFullScreen() ? 50 : 30,
        alignItems: 'center'
    },
    m_f_txt: {
        fontSize: 16,
        color: '#111',
        fontFamily: 'PingFangSC-Medium',
        fontWeight: '500',
        lineHeight: 22
    },
});