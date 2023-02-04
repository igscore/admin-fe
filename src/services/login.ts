import { history } from 'umi';
import request, { clearAccessToken, RequestOptions } from '@/utils/request';
import cacheMng from '@/managers/cacheMng';
import { host } from '@/services/host';
import { getPageQuery } from '@/utils/utils';
import { removeAuthority } from '@/utils/authority';
import { stringify } from 'querystring';

export interface LoginParamsType {
  tenantId: string;
  account: string;
  password: string;
}

export async function goToLogin(params: LoginParamsType) {
  const postData: any = {
    tenant_id: params.tenantId,
    account: params.account,
    password: params.password,
  };
  const options: RequestOptions<true> = {
    withToken: false,
    getRaw: true,
  };
  const { status, data } = await request.post<{ token: string }>(host.LOGIN.LOGIN, postData, options);
  if (status === 'A000' && data?.token) {
    cacheMng.setItem('token', `token ${data.token}`);
    // cacheMng.setCookie('token', data.token, 1);
    return {
      status,
      token: data.token,
    };
  }
  return {
    status: 'error',
    token: null,
  };
}

export async function getFakeCaptcha(mobile: string) {
  return request.get(host.LOGIN.CAPTCHA, { mobile });
}

export async function logout() {
  const { redirect } = getPageQuery();
  // todo: 可能有安全问题
  if (window.location.pathname !== '/user/login' && !redirect) {
    clearAccessToken();
    removeAuthority();
    history.replace({
      pathname: '/user/login',
      search: stringify({
        redirect: window.location.href,
      }),
    });
  }
}
