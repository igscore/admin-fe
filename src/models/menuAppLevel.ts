import { CommonTreeData } from '@/utils/utils';
import { SysMenuTypeEnum } from '@/services/menuSysLevel';

export interface AppLevelMenuListItemRaw {
  name: string;
  type: SysMenuTypeEnum;
  icon: string;
  url: string;
  option: string;
  depth: number;
  id: number;
  parent_id: number;
}

export interface AppLevelMenuListItem {
  name: string;
  type: SysMenuTypeEnum;
  icon: string;
  path: string;
  option: string;
  depth: number;
  id: number;
  parentId: number;
  hideInMenu?: boolean;
  authority?: string[];
}

export interface AppLevelMenuTreeItem extends CommonTreeData<AppLevelMenuListItem> {
  type: SysMenuTypeEnum;
  icon: string;
  name: string;
  path: string;
  option: string;
  depth: number;
  hideInMenu?: boolean;
  authority?: string[];
  children: AppLevelMenuTreeItem[];
}

export interface QueryAppLevelMenusData {
  success: boolean;
  total: number;
  data: AppLevelMenuTreeItem[];
}
