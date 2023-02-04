// 获取用户可见的应用菜单
import request from '@/utils/request';
import { getJsonSafely, setArrayToTree } from '@/utils/utils';
import {
  QueryAppLevelMenusData,
  AppLevelMenuListItem,
  AppLevelMenuListItemRaw,
  AppLevelMenuTreeItem,
} from '@/models/menuAppLevel';

export enum SysMenuTypeEnum {
  Folder = 1,
  Node = 2,
}

export async function queryAppLevelMenus() {
  let resData: QueryAppLevelMenusData = {
    success: false,
    total: 0,
    data: [],
  };
  const data = await request.get<{ entries: AppLevelMenuListItemRaw[]; total: number }>('/plat/user/app/menus');
  if (Array.isArray(data.entries)) {
    const { entries, total } = data;
    const menuList: AppLevelMenuListItem[] = entries.map(({ url, parent_id, ...rest }) => ({
      ...rest,
      path: url,
      parentId: parent_id,
    }));
    const menuTree = setArrayToTree(menuList, (item) => {
      const meta = getJsonSafely(item.option);
      return {
        ...meta,
        type: item.type,
        icon: item.icon,
        name: item.name,
        path: item.path || '',
        option: item.option,
        depth: item.depth,
        authority: ['admin'],
      };
    });
    resData = {
      total,
      success: true,
      data: menuTree ? [menuTree as AppLevelMenuTreeItem] : [],
    };
  }
  return resData;
}
