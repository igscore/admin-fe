import { message } from 'antd';
import request from '@/utils/request';
import type { DeviceGroupItem, DeviceGroupData, AddDeviceGroupParams, UpdateDeviceGroupParams } from './data';

export async function queryDeviceGroup() {
  let resData: DeviceGroupData = {
    success: false,
    total: 0,
    data: [],
  };
  const data = await request.get<{ entries: DeviceGroupItem[]; total: number }>('/device/group/list');
  if (Array.isArray(data.entries)) {
    const { entries, total } = data;
    resData = {
      total,
      success: true,
      data: entries,
    };
  }
  return resData;
}

export async function askToAddDeviceGroup(params: AddDeviceGroupParams) {
  try {
    await request.post('/device/group', params);
    return true;
  } catch (e) {
    message.error('添加分类失败，请稍后再试');
    return false;
  }
}

export async function askToUpdateDeviceGroup(params: UpdateDeviceGroupParams) {
  try {
    await request.put('/device/group', params);
    return true;
  } catch (e) {
    message.error('修改分类失败，请稍后再试');
    return false;
  }
}

export async function askToDeleteDeviceGroup(groupId: number) {
  try {
    await request.delete('/device/group', { group_id: groupId });
    message.success('删除成功');
    return true;
  } catch (e) {
    message.error('删除分类失败，请稍后再试');
    return false;
  }
}
