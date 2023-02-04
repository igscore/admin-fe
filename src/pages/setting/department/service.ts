import { message } from 'antd';

import request from '@/utils/request';
import { setArrayToTree } from '@/utils/utils';
import type {
  DepartmentItem,
  QueryDepartmentParams,
  UpdateDepartmentParams,
  AddDepartmentParams,
  HandleDepartmentDirectorParams,
  DepartmentDirectorItem,
  DepartmentTreeData,
} from './data';

export enum DepartmentTypeEnum {
  PROJECT = 1, // 项目
  DIVISION = 2, // 部门
  BRANCH = 3, // 子公司
}

export enum DepartmentStateEnum {
  WORK = 1, // 有效
  ABORT = 2, // 废弃
}

export enum DepartmentDirectorTypeEnum {
  LEADER_IN_DIRECT = 1, // 主管
  LEADER_IN_CHARGE = 2, // 上级主管
}

// 获取所有部门
export async function queryDepartmentList(withTree = false, keyMap?: [string, string]) {
  const { entries, total } = await request.get<any>('/plat/departments', {}, { putResponseLineToHump: true });
  const list: DepartmentItem[] = entries;
  let tree = null;
  if (withTree) {
    const keys = keyMap || ['key', 'title'];
    tree = setArrayToTree<DepartmentTreeData>(list, ({ id, name }) => {
      const item = {
        value: id,
        [keys[1]]: name,
      };
      if (keys[0] !== 'value') {
        item[keys[0]] = id;
      }
      return item as DepartmentTreeData;
    });
    if (tree) {
      tree = [tree];
    }
  }
  return {
    list,
    tree: tree as DepartmentTreeData[],
    total,
  };
}

export async function queryDepartmentListByFilter(params: QueryDepartmentParams) {
  try {
    const { entries } = await request.get<any>(
      '/plat/departments/filter',
      { ...params },
      {
        putRequestHumpToLine: true,
        putResponseLineToHump: true
      }
    );
    return entries || [];
  } catch (e) {
    return []
  }
}

export async function askToAddDepartment(params: AddDepartmentParams) {
  try {
    const { id } = await request.post('/plat/department', params, { putRequestHumpToLine: true });
    return {
      success: true,
      id: id as number,
    };
  } catch (e) {
    message.warn(e?.message || '添加失败，请稍后再试');
    return {
      success: false,
    };
  }
}

export async function askToUpdateDepartment({ id, name, parentId, type, sequence, state }: UpdateDepartmentParams) {
  try {
    await request.put('/plat/department', {
      id,
      name,
      type,
      sequence,
      state,
      parent_id: parentId,
    });
    return {
      success: true,
      id: undefined,
    };
  } catch (e) {
    message.warn(e?.message || '保存失败，请稍后再试');
    return {
      success: false,
    };
  }
}

export async function askToDeleteDepartment(departmentId: number, force = false) {
  try {
    await request.delete('/plat/department', {
      department_id: departmentId,
      force,
    });
    return true;
  } catch (e) {
    message.warn(e?.message || '删除失败，请稍后再试');
    return false;
  }
}

// 绑定部门领导
export async function askToHandleDepartmentDirector(params: HandleDepartmentDirectorParams) {
  try {
    const { departmentId, add = [], del = [] } = params;
    await request.post(
      '/plat/department/leadership',
      {
        add: add.map((i) => ({
          ...i,
          departmentId,
        })),
        delete: del.map((leaderId) => ({
          leaderId,
          departmentId,
        })),
      },
      { putRequestHumpToLine: true },
    );
    return true;
  } catch (e) {
    message.warn(e?.message || '修改失败，请稍后再试');
    return false;
  }
}

export async function queryDepartmentDirectors(departmentId: number) {
  try {
    const { entries = [] } = await request.get<any>(
      '/plat/department/leaderships',
      { departmentId },
      {
        putRequestHumpToLine: true,
        putResponseLineToHump: true,
      },
    );
    return entries as DepartmentDirectorItem[];
  } catch (e) {
    return [];
  }
}
