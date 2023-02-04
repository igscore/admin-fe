/* eslint-disable no-restricted-syntax */
import { getPageQuery, goToLoginPage, memorize } from '@/utils/utils';
import cacheMng from '@/managers/cacheMng';
import { message } from 'antd';

// export function getSign(param: object, secretKey: string = 'NKebb0M17dC5ihNSoTlX') {
//   // 对参数字典排序
//   const keys = Object.keys(param).sort();
//   const sign = `${keys.map(k => `${k}=${param[k]}`).join('|')}|${secretKey}`;
//   return md5(sign);
// }

/**
 * 格式化参数
 * 将值类型为数组的参数格式化为','连接的字符串
 * 将值类型为undefined/null/empty string的参数删除
 * @param params {object}
 * @returns {object}
 */
export const formatObjToQuery = (params: object = {}) => {
  const o = {};
  Object.keys(params).forEach((k) => {
    const v = params[k];
    if (v !== undefined && v !== null && v !== '') {
      o[k] = v;
    }
  });
  return o;
};

const isLoginPage = window.location.pathname === '/user/login';

export const getCompanyId = memorize(
  () => {
    const name = window.location.hostname.toLowerCase().replace(/\.admin\.\w+\.com/, '');

    if (name && !name.includes('.')) return name;

    let value = '';
    if (!isLoginPage) {
      value = cacheMng.getItem<string>('CompanyId', '');
    }
    if (!value) {
      const query = getPageQuery();
      value = (query as { route: string }).route || '';
      cacheMng.setItem('CompanyId', value);
    }
    if (!value) {
      if (!isLoginPage) {
        goToLoginPage();
      }
      message.warn('请在URL地址后添加 route 参数用于指定公司', 0);
    }
    return value;
  },
  'CompanyId',
  (value) => !value,
);
