import {
    TABS_HOME,
    TABS_HOME_ACTIVE,
    TABS_MY,
    TABS_MY_ACTIVE,
    THE_ZONE_ZQ,
    THE_ZONE_ZQ_IN
} from '@methods/requireImage';

import Home from '../src/pages/home/home';
import TheZone from '../src/pages/theZone/index';
import My from '../src/pages/my/my';

export default [
    {
        key: 'Home',
        name: '首页',
        iconObj: {
            def: TABS_HOME,
            active: TABS_HOME_ACTIVE,
        },
        component: Home,
    },
    {
        key: 'TheZone',
        name: '专区',
        iconObj: {
            def: THE_ZONE_ZQ,
            active: THE_ZONE_ZQ_IN,
        },
        component: TheZone,
    },
    {
        key: 'My',
        name: '我的',
        iconObj: {
            def: TABS_MY,
            active: TABS_MY_ACTIVE,
        },
        component: My,
    },
];
