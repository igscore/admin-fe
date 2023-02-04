import request from '@/utils/request';
import { isObj } from '@/utils/variable';

import type { UserDetailInfo } from './data';

export async function queryUserDetail(id: number) {
  let resData = {
    data: null as UserDetailInfo | null,
    success: false,
  };
  try {
    const data = await request.get<any>('/plat/user', { user_id: id }, { putResponseLineToHump: true });
    if (isObj(data)) {
      resData = {
        data: data as UserDetailInfo,
        success: true,
      };
    }
    return resData;
  } catch (e) {
    return resData;
  }
}
