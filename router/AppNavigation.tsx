// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {
    createStackNavigator,
    CardStyleInterpolators,
} from 'react-navigation-stack';
import TabsBtnNavigation from './TabsBtnNavigation';
import AppRouters from './AppRouters';
import {getAppRouters} from '@methods/util';

import Welcome from '../src/pages/welcome/welcome';
import ToLog from '@pages/logRegister/toLog/toLog';

const AppNavigatorConfig = getAppRouters(AppRouters);

const AppNavigator = createStackNavigator(
    {
        ToLog: {
            screen: ToLog,
        },
        TabsBtnNavigation: {
            screen: TabsBtnNavigation,
            navigationOptions: {
                header: () => null,
            },
        },
        ...AppNavigatorConfig,
    },
    {
        headerMode: 'none',
        navigationOptions: () => ({
            gesturesEnabled: true,
            animationEnabled: true,
        }),
        defaultNavigationOptions: () => ({
            cardStyleInterpolator: (props) =>
                CardStyleInterpolators.forHorizontalIOS(props),
        }),
    },
);

const SwitchNavigator = createSwitchNavigator({
    Welcome: {
        screen: Welcome,
    },
    AppNavigator: {
        screen: AppNavigator,
    },
});

export default createAppContainer(SwitchNavigator);
