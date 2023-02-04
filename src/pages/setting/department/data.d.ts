import type { TreeNodeNormal } from 'antd/lib/tree/Tree';
import type { DepartmentTypeEnum, DepartmentStateEnum, DepartmentDirectorTypeEnum } from './service';

export interface DepartmentTreeData extends TreeNodeNormal {
  value: number;
  // parentId: string
  // children: DepartmentTreeData[]
}

export interface DepartmentItem {
  id: number;
  name: string;
  fullName: string;
  nameSort: string;
  parentId: number;
  type: DepartmentTypeEnum;
  sequence: number;
  state: DepartmentStateEnum;
}

export interface QueryDepartmentParams {
  offset: number;
  limit: number;
  type?: DepartmentTypeEnum;
  name?: string;
  parentId?: number;
}

export interface AddDepartmentParams {
  name: string;
  parentId: number;
  type: DepartmentTypeEnum;
  sequence?: number;
}

export interface UpdateDepartmentParams {
  id: number;
  name?: string;
  parentId?: number;
  sequence?: number;
  type?: DepartmentTypeEnum;
  state?: DepartmentStateEnum;
}

export interface HandleDepartmentDirectorParams {
  departmentId?: number;
  add?: {
    leaderId: number;
    type: DepartmentDirectorTypeEnum;
  }[];
  del?: number[];
}

export interface DepartmentDirectorItem {
  type: DepartmentDirectorTypeEnum;
  leaderId: number;
  departmentId: number;
}
