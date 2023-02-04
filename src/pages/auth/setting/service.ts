import { message } from 'antd';

import { queryUserList } from '@/pages/setting/user/service';
import type { UserListItem } from '@/pages/setting/user/data';

import request from '@/utils/request';
import type { MenuAuthInfo, MenuRoleInfo } from './data';

/**
 * 获取权限列表
 */
export async function queryAuthList() {
  let resData: MenuAuthInfo[] = [];
  try {
    const { entries } = await request.get<{ entries: MenuAuthInfo[] }>(
      '/plat/app/menu/permissions',
    );
    resData = entries;
    return resData;
  } catch (e) {
    return resData;
  }
}

/**
 * 新增权限
 */
export async function askToAddAuth(name: string) {
  try {
    await request.post<boolean>('/plat/app/menu/permission', { name });
    return true;
  } catch (e) {
    message.error(e?.message || '权限添加失败，请稍后再试');
    return false;
  }
}

/**
 * 编辑权限
 */
export async function askToUpdateAuth(id: number, name: string) {
  try {
    await request.put<boolean>('/plat/app/menu/permission', { id, name });
    return true;
  } catch (e) {
    message.error(e?.message || '修改权限失败，请稍后再试');
    return false;
  }
}

/**
 * 删除权限
 */
export async function askToDeleteAuth(id: number) {
  try {
    await request.delete<boolean>('/plat/app/menu/permission', { permission_id: id });
    return true;
  } catch (e) {
    message.error(e?.message || '删除权限失败，请稍后再试');
    return false;
  }
}

/**
 * 查看权限下所有菜单资源
 */
export async function queryMenusOfAuth(id: number) {
  try {
    const { entries } = await request.get<{
      entries: { id: number; app_menu_id: number; permission_id: number }[];
    }>('/plat/permission/app/menus', { permission_id: id });
    return (entries || []).map((i) => i.app_menu_id);
  } catch (e) {
    return [] as number[];
  }
}

/**
 * 绑定 / 解绑权限
 */
interface AskToHandleMenuAuth {
  permissionId: number;
  add?: number[];
  del?: number[];
}

export async function askToHandleMenuOfAuth({ permissionId, add, del }: AskToHandleMenuAuth) {
  try {
    await request.post<boolean>('/plat/app/menu/permission/bind', {
      add: add?.map((id) => ({
        app_menu_id: id,
        permission_id: permissionId,
      })),
      delete: del?.map((id) => ({
        app_menu_id: id,
        permission_id: permissionId,
      })),
    });
    return true;
  } catch (e) {
    message.error(e?.message || '更新权限失败，请稍后再试');
    return false;
  }
}

/**
 * 获取角色列表
 */
export async function queryRoleList() {
  let resData: MenuRoleInfo[] = [];
  try {
    const { entries } = await request.get<{ entries: MenuRoleInfo[] }>('/plat/roles');
    if (entries) {
      resData = [...entries];
    }
    return resData;
  } catch (e) {
    return resData;
  }
}

/**
 * 查看角色下所有权限
 */
export async function queryAuthOfRole(id: number) {
  let resData: number[] = [];
  try {
    const { entries } = await request.get<{
      entries: { id: number; role_id: number; permission_id: number }[];
    }>('/plat/role/app/menu/permissions', {
      role_id: id,
    });
    resData = (entries || []).map((i) => i.permission_id);
    return resData;
  } catch (e) {
    return resData;
  }
}

/**
 * 新增角色
 */
export async function askToAddRole(name: number, description?: string) {
  try {
    await request.post<boolean>('/plat/role', { name, description });
    return true;
  } catch (e) {
    message.error(e?.message || '新增角色失败，请稍后再试');
    return false;
  }
}

/**
 * 编辑角色
 */
export async function askToUpdateRole(id: number, name?: number, description?: string) {
  try {
    await request.put<boolean>('/plat/role', { id, name, description });
    return true;
  } catch (e) {
    message.error(e?.message || '编辑角色失败，请稍后再试');
    return false;
  }
}

/**
 * 删除角色
 */
export async function askToDeleteRole(id: number) {
  try {
    await request.delete<boolean>('/plat/role', { role_id: id });
    return true;
  } catch (e) {
    message.error(e?.message || '删除角色失败，请稍后再试');
    return false;
  }
}

/**
 * 查看角色下所有用户
 */

interface UserOfRoleRaw {
  entries: {
    id: number;
    role_id: number;
    user_id: number;
  }[];
}
interface UsersOfRoleData {
  success: boolean;
  data: UserListItem[];
  total: number;
}
export async function queryUsersOfRole(id: number) {
  const resData: UsersOfRoleData = {
    success: false,
    data: [],
    total: 0,
  };
  try {
    const [{ entries }, { data }] = await Promise.all([
      request.get<UserOfRoleRaw>('/plat/role/users', { role_id: id }),
      queryUserList(),
    ]);
    // eslint-disable-next-line no-restricted-syntax
    for (const { user_id: uid } of entries) {
      const user = data.find((u) => u.id === uid);
      if (user) {
        resData.data.push(user);
      }
    }
    resData.success = true;
    resData.total = resData.data.length;
    return resData;
  } catch (e) {
    return resData;
  }
}

/**
 * 从角色中绑定/解绑权限
 */

interface AskToHandleAuthOfRole {
  roleId: number;
  add?: number[];
  del?: number[];
}

export async function askToHandleAuthOfRole({ roleId, add, del }: AskToHandleAuthOfRole) {
  try {
    await request.post<boolean>('/plat/role/app/menu/permission/bind', {
      add: add?.map((id) => ({
        role_id: roleId,
        permission_id: id,
      })),
      delete: del?.map((id) => ({
        role_id: roleId,
        permission_id: id,
      })),
    });
    return true;
  } catch (e) {
    message.error(e?.message || '更新角色权限失败，请稍后再试');
    return false;
  }
}

/**
 * 为指定用户添加/删除角色
 */

interface AskToHandleUserOfRole {
  roleId: number;
  add?: number[];
  del?: number[];
}

export async function askToHandleUserOfRole({ roleId, add, del }: AskToHandleUserOfRole) {
  try {
    await request.post<boolean>('/plat/user/role/bind', {
      add: add?.map((id) => ({
        role_id: roleId,
        user_id: id,
      })),
      delete: del?.map((id) => ({
        role_id: roleId,
        user_id: id,
      })),
    });
    return true;
  } catch (e) {
    message.error(e?.message || '用户授权失败，请稍后再试')
    return false;
  }
}
