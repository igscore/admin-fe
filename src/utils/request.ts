/**
 * umiRequest 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import type { RequestOptionsInit } from 'umi-request';
import { message, notification, Modal } from 'antd';
import cacheMng from '@/managers/cacheMng';
import { replaceLineToHump } from './variable';
import { getValidObject, goToLoginPage } from './utils';

let root = '/api';
let accessToken: string | null = null;
// const RAP_URL = 'http://rap2.taobao.org:38080/app/mock/248625'

const MOCK_ON = cacheMng.getItem('mock', false);

if (REACT_APP_ENV === 'prod') {
  root = 'https://api.yiqioa.com/v1';
} else {
  root = MOCK_ON ? '/api' : 'http://api.yiqioa.com/v1';
}

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response }): Response => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;
    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  return response;
};

/**
 * 配置request请求时的默认参数
 */
const umiRequest = extend({
  timeout: 6000,
  errorHandler, // 默认错误处理
  // credentials: 'include', // 默认请求是否带上cookie
});

export interface RequestOptions<R = boolean> extends RequestOptionsInit {
  getResponse?: boolean;
  getRaw?: R;
  filterParams?: boolean; // 是否过滤无效属性，如 null/undefined/''/NaN，默认为true
  mockUrl?: string;
  withToken?: boolean;
  putRequestHumpToLine?: boolean; // 将属性字段转换由驼峰转换为下划线
  putResponseLineToHump?: boolean; // 将属性字段转换由下划线转换为驼峰
}

interface RequestResponse<R> {
  status: 'A000' | 'A005' | string; // A005: 登录过期
  message?: string;
  data: R | null;
}

let isInvalidLogin = false

const isValidToken = () => {
  const cacheToken = cacheMng.getItem('token');

  if (!cacheToken) {
    goToLoginPage()
    return [false, cacheToken]
  }

  if (accessToken && accessToken !== cacheToken) {
    if (!isInvalidLogin) {
      Modal.confirm({
        title: '重复登录',
        content: '网站已在其他页面登录新帐号，当前帐号已失效',
        okText: '访问新帐号',
        cancelText: '退出登录',
        onOk: () => {
          isInvalidLogin = false
          window.location.reload()
        },
        onCancel: () => {
          isInvalidLogin = false
          goToLoginPage()
        }
      });
      isInvalidLogin = true
    }
    return [false, cacheToken]
  }

  return [true, cacheToken]
}

async function request<R = any>(url: string, options?: RequestOptions<false>): Promise<R>;
async function request<R = any>(url: string, options?: RequestOptions<true>): Promise<RequestResponse<R | null>>;
async function request<R = any>(url: string, options?: RequestOptions) {
  const {
    mockUrl,
    getRaw = false,
    filterParams = true,
    withToken = true,
    putRequestHumpToLine,
    putResponseLineToHump,
    headers = {},
    params = {},
    data = {},
    ...restOpts
  } = options || {};
  // 默认请求地址
  const resUrl = `${root}${url}`;

  // 添加token
  if (withToken) {
    const [isValid, token] = isValidToken()
    if (isValid) {
      // @ts-ignore
      headers.Authorization = token;
      accessToken = token;
    } else {
      // eslint-disable-next-line no-throw-literal,@typescript-eslint/no-throw-literal
      throw {
        status: 'error',
        message: '登录已过期，请重新登录',
      };
    }
  }

  let fixedParams = params
  if (typeof putRequestHumpToLine === 'boolean') {
    fixedParams = replaceLineToHump(fixedParams, putRequestHumpToLine);
  }

  let fixedData = data
  if (typeof putRequestHumpToLine === 'boolean') {
    fixedData = replaceLineToHump(fixedData, putRequestHumpToLine);
  }

  let response = await umiRequest<RequestResponse<R>>(resUrl, {
    ...restOpts,
    headers,
    params: filterParams ? getValidObject(fixedParams) : fixedParams,
    data: fixedData,
  });

  if (typeof putResponseLineToHump === 'boolean') {
    response = replaceLineToHump(response, !putResponseLineToHump);
  }

  if (getRaw) {
    return response;
  }

  if (response?.status === 'A000') {
    return response.data;
  }

  if (response?.status === 'A005') {
    message.warn('登录已过期，请重新登录');
    return goToLoginPage();
  }

  // eslint-disable-next-line no-throw-literal,@typescript-eslint/no-throw-literal
  throw {
    status: response?.status || 'error',
    message: response?.message,
  };
}

async function requestGet<R = any>(url: string, params?: Record<string, any>, options?: RequestOptions<false>): Promise<R>;
async function requestGet<R = any>(url: string, params?: Record<string, any>, options?: RequestOptions<true>): Promise<RequestResponse<R | null>>;
async function requestGet<R = any>(url: string, params: any = {}, options: RequestOptions = {}) {
  return request<R>(url, {
    method: 'GET',
    params,
    ...options,
    getRaw: options.getRaw || undefined,
  });
}

async function requestPost<R = any>(url: string, data?: Record<string, any>, options?: RequestOptions<false>): Promise<R>;
async function requestPost<R = any>(url: string, data?: Record<string, any>, options?: RequestOptions<true>): Promise<RequestResponse<R | null>>;
async function requestPost<R = any>(url: string, data: any = {}, options: RequestOptions = {}) {
  return request<R>(url, {
    method: 'POST',
    data,
    ...options,
    getRaw: options.getRaw || undefined,
  });
}

async function requestPut<R = any>(url: string, data?: Record<string, any>, options?: RequestOptions<false>): Promise<R>;
async function requestPut<R = any>(url: string, data?: Record<string, any>, options?: RequestOptions<true>): Promise<RequestResponse<R | null>>;
async function requestPut<R = any>(url: string, data: any = {}, options: RequestOptions = {}) {
  return request<R>(url, {
    method: 'PUT',
    data,
    ...options,
    getRaw: options.getRaw || undefined,
  });
}

async function requestDelete<R = any>(url: string, params?: Record<string, any>, options?: RequestOptions<false>): Promise<R>;
async function requestDelete<R = any>(url: string, params?: Record<string, any>, options?: RequestOptions<true>): Promise<RequestResponse<R | null>>;
async function requestDelete<R = any>(url: string, params: any = {}, options: RequestOptions = {}) {
  return request<R>(url, {
    method: 'DELETE',
    params,
    ...options,
    getRaw: options.getRaw || undefined,
  });
}

export function clearAccessToken() {
  accessToken = null;
  cacheMng.removeItem('token');
  // cacheMng.removeCookie('token');
}

export default {
  get: requestGet,
  post: requestPost,
  put: requestPut,
  delete: requestDelete,
};
