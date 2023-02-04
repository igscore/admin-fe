import { DepartmentItem } from '../department/data';
import { PositionItem } from '../position/data';
import { UserTypeEnum } from './service';

export type UserTreeType = 'folder' | 'node';

export interface UserTreeItem {
  id: number;
  key: number;
  value: number;
  name: string;
  title: string;
  type: UserTreeType;
  children?: UserTreeItem[];
}

export interface UserListItem {
  id: number;
  name: string;
  account: string;
  jobNumber: string;
  mainDepartmentId: number;
  mainPositionId: number;
  mainDepartment?: DepartmentItem;
  mainPosition?: PositionItem;
  type: UserTypeEnum;
  phone: string;
  roles: {
    id: number;
    name: string;
  }[];
}

export interface UserListData {
  data: UserListItem[];
  total: number;
  success: boolean;
}

export interface FilterUserParams {
  jobNumber?: string;
  name?: string;
  type?: UserTypeEnum;
  departmentId?: number;
  positionId?: number;
  offset?: number;
  limit?: number;
}

export interface AddUserParams {
  jobNumber: string;
  name: string;
  account: string;
  password: string;
  type: UserTypeEnum;
  mainDepartmentId: number;
  mainPositionId: number;
  comment: string;
  avatarId?: number;
}

export interface UpdateUserParams {
  id: number;
  jobNumber?: string;
  name?: string;
  type: UserTypeEnum;
  mainDepartmentId?: number;
  mainPositionId?: number;
  comment?: string;
  entryAt?: number;
  resignAt?: number;
  avatarId?: number;
}
