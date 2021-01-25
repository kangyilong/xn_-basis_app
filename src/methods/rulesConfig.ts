export default {
  mobile: {
    rules: /^1[2|3|4|5|6|7|8|9]\d{9}$/,
    warnMsg: '手机号错误',
  },
  email: {
    rules: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
    warnMsg: '邮箱号错误',
  },
  idCard: {
    rules: /^([1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3})|([1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X|x))$/,
    warnMsg: '身份证号错误',
  },
  loginPaw: {
    rules: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/,
    warnMsg: '密码格式错误',
  },
  tradingPaw: {
    rules: /^[0-9]{6}$/,
    warnMsg: '密码格式错误',
  },
};
