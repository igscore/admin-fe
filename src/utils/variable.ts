/* eslint-disable no-plusplus */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-continue */
/**
 * Created by liuzhimeng.
 * @date 2019-10-20
 * @description 处理变量相关工具
 */

type VarType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'math'
  | 'date'
  | 'array'
  | 'object'
  | 'function'
  | 'bigint'
  | 'symbol'
  | 'null'
  | 'undefined'
  | 'NaN'
  | 'Infinity';

// deep clone by json
export const cloneByJSON = <T = any>(v: T): T => (v ? JSON.parse(JSON.stringify(v)) : null);

/**
 * 获取变量类型
 * @param value
 * @returns {} 已校验 string/number/array/object/function/null/undefined/NaN/Infinity
 */
export const getVarType = (value: any): VarType => {
  if (Number.isNaN(value)) return 'NaN';
  if (typeof value === 'number' && !Number.isFinite(value)) return 'Infinity';
  if (value === null) return 'null';
  if (typeof value !== 'object') return typeof value;
  // @ts-ignore
  return Object.prototype.toString
    .call(value)
    .toLowerCase()
    .match(/\[\s*object\s*([^\]]*)\s*]/)[1];
};

/* 判断是否是字符串 */
export const isStr = (value: any) => Object.prototype.toString.call(value) === '[object String]';

/* 判断是否是布尔值 */
export const isBool = (value: any) => Object.prototype.toString.call(value) === '[object Boolean]';

/* 判断是否是数字 */
export const isNum = (value: any) => Object.prototype.toString.call(value) === '[object Number]';

/* 判断是否是函数 */
export const isFunc = (value: any) => Object.prototype.toString.call(value) === '[object Function]';

/* 判断是否是对象 */
export const isObj = (val: any) => getVarType(val) === 'object';

export const isNullOrUndefined = (value: any): boolean => value === null || value === undefined;

// 检测是否是 DOM 元素
export const isElement = (obj: { nodeType: number }) => {
  if (obj && (typeof HTMLElement === 'function' || typeof HTMLElement === 'object') && obj instanceof HTMLElement) {
    return true;
  }
  return obj && obj.nodeType && obj.nodeType === 1;
};

/**
 * 判断对象是否为空（不查询原型链上的key）
 * @param obj
 * @returns {boolean}
 */
export const isOwnEmptyObj = (obj: Record<string, any>): boolean => {
  for (const name in obj) {
    if ({}.hasOwnProperty.call(obj, name)) {
      return false;
    }
  }
  return true;
};

/**
 * 安全地获取对象或数组的值
 * @param {object | any[]} obj，原始对象或数组
 * @param {string} keyStr，对象的key，以点号连接
 * @param {any} defaultValue，默认值
 * @returns {any} 返回对象key的值
 const obj = {
    a: {b: {c: 1}},
    d: [3, 4, {f: [5]}]
  }
 const arr = [{
    a: {b: {c: 1}},
    d: [3, 4, {f: [5]}]
  }]
 getObjValueSafely(obj, 'a.b.c') // 1
 getObjValueSafely(obj, 'd.2.f.0') // 5
 getObjValueSafely(arr, '0.a.b.c') // 1
 getObjValueSafely(arr, '0.d.2.f.0') // 5
 */
// @ts-ignore
export const getObjValueSafely = <T = any>(
  obj: Record<string, any> | any[],
  keyStr: string,
  // @ts-ignore
  defaultValue: T = null,
): T => {
  try {
    if (keyStr && isStr(keyStr) && (isObj(obj) || Array.isArray(obj))) {
      const keys = keyStr.split('.');
      const { length } = keys;
      // @ts-ignore
      let value: T = obj;
      for (let i = 0; i < length; i++) {
        const k = keys[i];
        if (isObj(value) && {}.hasOwnProperty.call(value, k)) {
          value = value[k];
        } else {
          const nk = Number(k);
          if (Array.isArray(value) && !Number.isNaN(nk) && nk >= 0) {
            value = value[nk];
          } else {
            return defaultValue;
          }
        }
      }
      return value;
    }
    return defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

export const setObjValueSafely = <T>(obj: Record<string, any>, keyStr: string, value: T): void => {
  if (keyStr) {
    const keyPath = keyStr.split('.');
    const lastKeyIndex = keyPath.length - 1;

    for (let i = 0; i < lastKeyIndex; i++) {
      const key = keyPath[i];
      if (!(key in obj)) {
        // eslint-disable-next-line no-param-reassign
        obj[key] = {};
      }
      // eslint-disable-next-line no-param-reassign
      obj = obj[key];
    }
    // eslint-disable-next-line no-param-reassign
    obj[keyPath[lastKeyIndex]] = value;
  }
};

const lineToHump = (prop: string) => prop.replace(/_(\w)/g, (_, letter) => letter.toUpperCase());

const humpToLine = (prop: string) => prop.replace(/([A-Z])/g, '_$1').toLowerCase();

export const replaceLineToHump = <T = any>(raw: T, reverse = false): T => {
  if (isObj(raw)) {
    return Object.keys(raw).reduce((obj, p) => {
      let prop: string;
      if (reverse) {
        prop = humpToLine(p);
      } else {
        prop = p.includes('_') ? lineToHump(p) : p;
      }
      // eslint-disable-next-line no-param-reassign
      obj[prop] = isObj(raw[p]) || Array.isArray(raw[p]) ? replaceLineToHump(raw[p], reverse) : raw[p];
      return obj;
    }, {} as any);
  }
  if (Array.isArray(raw)) {
    return raw.map((i) => replaceLineToHump(i, reverse)) as any;
  }
  return raw;
};
