import request from '@/utils/request';
import { host } from '@/services/host';
import { getCompanyId } from '@/utils/urlUtils';
import type { CurrentCompany } from '@/models/user';

// 获取后台系统的用户信息
export async function queryCurrentUser() {
  try {
    const { plat, user } = await request.get<any>(host.USER.MINE, {}, { putResponseLineToHump: true });
    return {
      plat,
      ...user,
    };
  } catch (e) {
    return null;
  }
}

/**
 * 查询当前租户信息
 */
export async function queryCurrentCompany() {
  return request.get<CurrentCompany>(
    host.USER.COMPANY,
    { route: getCompanyId() },
    {
      withToken: false,
      putResponseLineToHump: true,
    },
  );
}

export async function queryNotices() {
  return request.get(host.USER.NOTICE);
}
