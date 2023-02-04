import request from '@/utils/request';
import { getJsonSafely, setArrayToTree } from '@/utils/utils';
import { SysLevelMenuListItem, SysLevelMenuTreeItem, QuerySysLevelMenusData } from '@/models/menuSyslevel';

export enum SysMenuTypeEnum {
  Folder = 1,
  Node = 2,
}

// 获取用户对应级别的系统菜单
export async function querySysLevelMenus() {
  let resData: QuerySysLevelMenusData = {
    success: false,
    total: 0,
    data: [],
  };
  const { entries, total } = await request.get<{
    entries: any[];
    total: number;
  }>('/sys/system/menus/level', {}, { putResponseLineToHump: true });
  if (Array.isArray(entries)) {
    const menuList: SysLevelMenuListItem[] = entries.map(({ url, requiredLevel, ...rest }) => ({
      ...rest,
      path: url,
      requiredLevel: requiredLevel.split(',') as SysLevelMenuListItem['requiredLevel'],
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
        requiredLevel: item.requiredLevel,
      };
    });
    resData = {
      total,
      success: true,
      data: menuTree ? [menuTree as SysLevelMenuTreeItem] : [],
    };
  }
  return resData;
}
