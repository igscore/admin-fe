import { message } from 'antd';

import type { DepartmentItem } from '@/pages/setting/department/data';
import { queryDepartmentList } from '@/pages/setting/department/service';
import type { DepartmentTree } from '@/pages/setting/position/data';

import request from '@/utils/request';
import { setArrayToTree } from '@/utils/utils';
import type {
  UserListData,
  AddUserParams,
  UpdateUserParams,
  UserListItem,
  UserTreeItem,
  FilterUserParams,
} from './data';

export enum UserTypeEnum {
  WORKING = 1,
  LEAVE = 2,
  RETIRE = 3,
}

export const UserTypeMaps = {
  [UserTypeEnum.WORKING]: {
    tag: 'green',
    text: '在职',
    status: 'Success',
  },
  [UserTypeEnum.LEAVE]: {
    tag: 'red',
    text: '离职',
    status: 'Error',
  },
  [UserTypeEnum.RETIRE]: {
    tag: 'gold',
    text: '退休',
    status: 'Warning',
  },
};

const formatToTableList = (treeData: DepartmentTree['children'], userList: UserListItem[]): UserTreeItem[] => {
  const users = [...userList];
  const { length } = treeData;
  const { length: userLens } = users;
  const tableList = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < length; i++) {
    // @ts-ignore
    const { id: depId, parentId, name: depName, children } = treeData[i];
    const node: UserTreeItem = {
      id: depId,
      key: depId,
      value: depId,
      name: depName,
      title: depName,
      type: 'folder',
      children: formatToTableList(children, users),
    };
    // eslint-disable-next-line no-plusplus
    for (let j = 0; j < userLens; j++) {
      const { id, name, mainDepartmentId } = users[j];
      if (mainDepartmentId === depId) {
        (node.children || []).push({
          id,
          key: id,
          value: id,
          name,
          title: name,
          type: 'node',
        });
      }
    }
    if (!parentId || node?.children?.length) {
      tableList.push(node);
    }
  }
  return tableList;
};

export async function queryUserList() {
  let resData: UserListData = {
    data: [],
    total: 0,
    success: false,
  };
  const data = await request.get('/plat/users', {}, { putResponseLineToHump: true });

  if (Array.isArray(data?.entries)) {
    const { total, entries } = data;
    resData = {
      total: total || 0,
      success: true,
      data: entries,
    };
  }

  return resData;
}

export async function queryUserListByFilter(params?: FilterUserParams) {
  let resData: UserListData = {
    data: [],
    total: 0,
    success: false,
  };
  const { type, departmentId, positionId, ...rest } = params || {};
  const data = await request.get(
    '/plat/users/filter',
    {
      ...rest,
      departmentId: departmentId ? Number(departmentId) : null,
      positionId: positionId ? Number(positionId) : null,
      type: type ? Number(type) : null,
    },
    {
      putRequestHumpToLine: true,
      putResponseLineToHump: true,
    },
  );

  if (Array.isArray(data?.entries)) {
    const { total, entries } = data;
    resData = {
      total: total || 0,
      success: true,
      data: entries,
    };
  }

  return resData;
}

export async function queryUsersWithDepartment() {
  const [{ list: departments }, { data: users }] = await Promise.all([queryDepartmentList(), queryUserList()]);
  const treeData = setArrayToTree<{ name: string }>(departments, ({ name }) => ({ name }));
  return {
    data: treeData ? formatToTableList([treeData], users) : [],
    departments: departments as DepartmentItem[],
    users: users as UserListItem[],
  };
}

export async function askToAddUser(params: AddUserParams) {
  const resData = {
    success: false,
  };
  try {
    await request.post('/plat/tenant/user', params, { putRequestHumpToLine: true });
    resData.success = true;
    return resData;
  } catch (e) {
    message.error(e?.message || `添加用户信息失败，请稍后再试`);
    return resData;
  }
}

export async function askToUpdateUser(data: UpdateUserParams) {
  const resData = {
    success: false,
  };
  try {
    await request.put('/plat/user', data, { putRequestHumpToLine: true });
    resData.success = true;
    return resData;
  } catch (e) {
    message.error(e?.message || `修改用户信息失败，请稍后再试`);
    return resData;
  }
}

export async function askToDeleteUser(userId: number) {
  const resData = {
    success: false,
  };
  try {
    await request.delete('/plat/user', { userId }, { putRequestHumpToLine: true });
    resData.success = true;
    return resData;
  } catch (e) {
    message.error(e?.message || `删除用户失败，请稍后再试`);
    return resData;
  }
}
