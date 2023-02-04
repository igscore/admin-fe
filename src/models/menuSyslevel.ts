import { CommonTreeData } from '@/utils/utils';
import { SysMenuTypeEnum } from '@/services/menuSysLevel';

export type MenuLevelType = 'SYSTEM_ADMIN' | 'SYSTEM_USER' | 'TENANT_ADMIN';

export interface SysLevelMenuListItem {
  type: SysMenuTypeEnum;
  name: string;
  icon: string;
  path: string;
  id: number;
  option: string;
  depth: number;
  parentId: number;
  hideInMenu?: boolean;
  authority?: string[];
  requiredLevel: MenuLevelType[];
}

export interface SysLevelMenuTreeItem extends CommonTreeData<SysLevelMenuListItem> {
  type: SysMenuTypeEnum;
  icon: string;
  name: string;
  path: string;
  option: string;
  depth: number;
  authority?: string[];
  requiredLevel: MenuLevelType[];
  children: SysLevelMenuTreeItem[];

  hideInMenu?: boolean;
}

export interface QuerySysLevelMenusData {
  success: boolean;
  total: number;
  data: SysLevelMenuTreeItem[];
}
