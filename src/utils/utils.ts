/* eslint-disable no-continue */
/* eslint-disable no-plusplus */
/* eslint-disable no-nested-ternary */
import { parse } from 'querystring';
import pathRegexp from 'path-to-regexp';
import type { Route } from '@/models/connect';
import { cloneByJSON } from '@/utils/variable';
import cacheMng from '@/managers/cacheMng';

export type ListDataMap = Record<
  number,
  {
    text: string;
    display?: string;
  }
>;

const urlReg = /^https?:\/\/.+/;

export const isUrl = (path: string): boolean => urlReg.test(path);

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

/**
 * props.route.routes
 * @param history [{}]
 * @param pathname string
 */
export const getAuthorityFromRouter = <T extends Route>(history: T[] = [], pathname: string): T | undefined => {
  const authority = history.find(
    ({ routes, path = '/' }) =>
      (path && pathRegexp(path).exec(pathname)) || (routes && getAuthorityFromRouter(routes, pathname)),
  );
  if (authority) return authority;
  return undefined;
};

export const getRouteAuthority = (path: string, routeData: Route[]) => {
  let authorities: string[] | string = '';
  routeData.forEach((route) => {
    // match prefix
    if (pathRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
      if (route.authority) {
        authorities = route.authority;
      }
      // exact match
      if (route.path === path) {
        authorities = route.authority || authorities;
      }
      // get children authority recursively
      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities;
      }
    }
  });
  return authorities;
};

export interface RawTreeData {
  id: number;
  parentId: number | null;

  [prop: string]: any;
}

export interface CommonTreeData<R extends RawTreeData = any> {
  id: number;
  parentId: number | null;
  children: CommonTreeData[];
  raw: R;
}

export interface TreeFormatterFn<Raw, Extra> {
  (item: Raw, childIds: number[]): Extra;
}

const findTreeChildren = <Extra extends Record<string, any>, Raw extends RawTreeData = any>(
  parentId: number,
  list: Raw[],
  formatter: TreeFormatterFn<Raw, Extra>,
): (Extra & CommonTreeData)[] => {
  const tree: (Extra & CommonTreeData)[] = [];
  const { length } = list;
  for (let i = 0; i < length; i++) {
    if (list[i].parentId === parentId) {
      const data = list[i];
      const children = findTreeChildren(data.id, list, formatter);
      const childIds = children.map(({ id }) => id);
      const customData = formatter(data, childIds);
      tree.push({
        ...customData,
        id: data.id,
        parentId,
        children,
        raw: { ...data },
      });
    }
  }
  return tree;
};

export const setArrayToTree = <Extra extends Record<string, any>, Raw extends RawTreeData = any>(
  rawList: Raw[],
  formatter: TreeFormatterFn<Raw, Extra> = () => ({} as any),
) => {
  const list = cloneByJSON(rawList);
  const topData = list.find(({ parentId }) => !parentId);
  // 必须含有父节点
  if (topData) {
    const children = findTreeChildren<Extra, Raw>(topData.id, list, formatter);
    const childIds = children.map(({ id }) => id);
    const customData = formatter(topData, childIds);
    return {
      ...customData,
      id: topData.id,
      parentId: null,
      children,
      raw: { ...topData },
    };
  }
  return null;
};

export const flattenTree = <T extends CommonTreeData>(data: T[]): Omit<T, 'children'>[] =>
  data.reduce(
    // @ts-ignore
    (arr, { children = [], ...rest }) => arr.concat([{ ...rest }], flattenTree(children)),
    [],
  );

/* 生成组件随机id */
export const generateUuid = (prefix: string, length?: number) => {
  const uuidStr = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
  const len = !length ? uuidStr.length : length;
  let date = Date.now();
  const uuid = uuidStr.replace(/[xy]/g, (c) => {
    const r = (date + Math.random() * 16) % 16 | 0; // eslint-disable-line no-bitwise
    date = Math.floor(date / 16);
    // eslint-disable-next-line no-mixed-operators
    return (c === 'x' ? r : (r & 0x7) | 0x8).toString(16); // eslint-disable-line no-bitwise
  });
  return `${!prefix ? '' : prefix}${uuid.slice(0, len)}`;
};

// 筛除object中的无效属性 null/undefined/空字符串/NaN
export const getValidObject = (raw: Record<string, any>) => {
  return Object.keys(raw).reduce((obj, key) => {
    const value = raw[key];
    if (value !== null && value !== undefined && value !== '' && !Number.isNaN(value)) {
      // eslint-disable-next-line no-param-reassign
      obj[key] = value;
    }
    return obj;
  }, {} as typeof raw);
};

export const goToLoginPage = () => {
  const urlParams = new URL(window.location.href);
  if (!urlParams.pathname.includes('/user/login')) {
    cacheMng.removeItem('token');
    // cacheMng.removeCookie('token');
    window.location.href = '/user/login';
  }
};

// 记忆函数
export const memorize = (fn: (...args: any[]) => any, hasher?: any, recalculate?: (value: any) => boolean) => {
  const cache = {};
  return (...args: any[]) => {
    const key = typeof hasher === 'string' ? hasher : typeof hasher === 'function' ? hasher(...args) : args[0];
    if (!key && key !== 0) {
      return fn(...args);
    }
    if (!{}.hasOwnProperty.call(cache, key)) {
      cache[key] = fn(...args);
    } else if (recalculate) {
      const result = recalculate(JSON.parse(JSON.stringify(cache[key])));
      if (result) {
        cache[key] = fn(...args);
      }
    }
    return cache[key];
  };
};

export const getJsonSafely = (str: string) => {
  let obj: Record<string, any>;
  try {
    obj = str ? JSON.parse(str) : {};
  } catch (e) {
    obj = {};
  }
  return obj;
};

// export const toUpperHumpCase = (obj: object | object[]) => {
//   const arr = Array.isArray(obj) ? obj : [obj]
//
// }

// 向右移位
const shiftRight = (number: number, digit: number) => {
  const value = number.toString().split('e');
  return +`${value[0]}e${value[1] ? +value[1] + digit : digit}`;
};
// 向左移位
const shiftLeft = (number: number, digit: number) => {
  const value = number.toString().split('e');
  return +`${value[0]}e${value[1] ? +value[1] - digit : -digit}`;
};

// 数字转汉字大写金额
export const digitUppercase = (num: number) => {
  if (!/^(-)?(0|[1-9]\d*)(.\d+)?$/.test(String(num))) return '';

  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟'],
  ];
  let n = num;
  const head = n < 0 ? '(负数)' : '';
  n = Math.abs(n);
  let s = '';
  for (let i = 0; i < fraction.length; i++) {
    s += (digit[Math.floor(shiftRight(n, 1 + i)) % 10] + fraction[i]).replace(/零./, '');
  }
  s = s || '整';
  n = Math.floor(n);
  for (let i = 0; i < unit[0].length && n > 0; i++) {
    let p = '';
    for (let j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p;
      n = Math.floor(shiftLeft(n, 1));
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }

  return (
    head +
    s
      .replace(/(零.)*零元/, '元')
      .replace(/(零.)+/g, '零')
      .replace(/^整$/, '零元整')
  );
};

export const formatListToMap = <T extends { id: number; name: string }>(
  list: T[],
  formatter?: (current: T) => ListDataMap[number],
) =>
  list.reduce((maps, current) => {
    const { id, name } = current;
    // eslint-disable-next-line
    maps[id] = formatter
      ? formatter(current)
      : {
          text: name,
        };
    return maps;
  }, {} as ListDataMap);
