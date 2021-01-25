import {createBottomTabNavigator} from 'react-navigation-tabs';
import {getTabRouters} from '../src/methods/util';
import TabsRouters from './TabsRouters';

const navigatorConfig = getTabRouters(TabsRouters);
const {tabRouter} = navigatorConfig;

// @ts-ignore
const MyTabRouter = createBottomTabNavigator(
  {...tabRouter},
  {
    initialRouteName: 'Home',
    tabBarOptions: {
      activeTintColor: '#0B3254',
      inactiveTintColor: '#909BA8',
      showIcon: true,
      labelStyle: {
        fontSize: 12,
      },
    },
  },
);

export default MyTabRouter;
