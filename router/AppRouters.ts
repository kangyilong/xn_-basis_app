// 登录
import Login from '@pages/logRegister/login/login';
import Register from '@pages/logRegister/register/register';
import ResetPwd from '@pages/logRegister/resetPwd/resetPwd';

export default [
    {
        key: 'Login',
        component: Login,
    },
    {
        key: 'Register',
        component: Register,
    },
    {
        key: 'ResetPwd',
        component: ResetPwd,
    },
];
