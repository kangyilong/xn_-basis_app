/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect} from 'react';
import {NativeModules, Text} from 'react-native';
// @ts-ignore
import {Provider} from 'react-redux';
import store from '@redux/store';
import AppNavigation from './router/AppNavigation';
import ToastMsg from '@components/toastMsg/ToastMsg';
import ToastLoading from '@components/toastLoading/ToastLoading';
import {toAppUpdate} from '@methods/util';

const {UIManager} = NativeModules;

console.disableYellowBox = true;

UIManager.setLayoutAnimationEnabledExperimental &&
UIManager.setLayoutAnimationEnabledExperimental(true);

// @ts-ignore
Text.defaultProps = {...(Text.defaultProps || {}), allowFontScaling: false, fontFamily:' '};

export default function App() {
    useEffect(() => {
        toAppUpdate();
    }, []);
    return (
        <Provider store={store}>
            <AppNavigation/>
            <ToastMsg/>
            <ToastLoading/>
        </Provider>
    );
}
