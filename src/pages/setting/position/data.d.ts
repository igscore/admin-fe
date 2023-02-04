import type { DepartmentItem } from '@/pages/setting/department/data';
import type { CommonTreeData } from '@/utils/utils';

import type { PositionTypeEnum } from './service';

export interface PositionItem {
  id: number;
  name: string;
  description: string;
  duty: string;
  type: PositionTypeEnum;
  departmentId: number;
  department?: DepartmentItem;
  sequence: number; // 序号
}

export interface DepartmentTree extends CommonTreeData {
  name: string;
}

export interface FilterPositionData {
  data: PositionItem[];
  total: number;
  success: boolean;
}

export interface FilterPositionParams {
  name?: string;
  type?: PositionTypeEnum;
  departmentId?: number;
  offset?: number;
  limit?: number;
}

export interface AddPositionParams {
  type: PositionTypeEnum;
  departmentId: number;
  name: string;
  duty: string;
  description: string;
  sequence: number;
}

export interface UpdatePositionParams {
  id: number;
  type?: PositionTypeEnum;
  departmentId?: number;
  name?: string;
  duty?: string;
  description?: string;
  sequence?: number;
}
