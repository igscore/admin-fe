import { message } from 'antd';
import request from '@/utils/request';
import type { AddDeviceParams, DeviceData, QueryDeviceParams, UpdateDeviceParams } from './data';

// 获取所有设备列表
export async function queryDeviceList(params: QueryDeviceParams = {}) {
  let resData: DeviceData = {
    success: false,
    total: 0,
    data: [],
  };
  try {
    const data = await request.get<any>('/device/dev/page', params, {
      putRequestHumpToLine: true,
      putResponseLineToHump: true,
    });
    if (Array.isArray(data.entries)) {
      const { entries, total } = data;
      resData = {
        success: true,
        data: entries,
        total,
      };
    }
    return resData;
  } catch (e) {
    return resData;
  }
}

export async function askToAddDevice(params: AddDeviceParams) {
  const resData = {
    success: false,
  };
  try {
    await request.post('/device/dev', params, { putRequestHumpToLine: true });
    resData.success = true;
    return resData;
  } catch (e) {
    message.error(e?.message || `录入设备失败，请稍后再试`);
    return resData;
  }
}

export async function askToUpdateDevice(data: UpdateDeviceParams) {
  const resData = {
    success: false,
  };
  try {
    await request.put('/device/dev', data, { putRequestHumpToLine: true });
    resData.success = true;
    return resData;
  } catch (e) {
    message.error(e?.message || `修改设备信息失败，请稍后再试`);
    return resData;
  }
}

export async function askToDeleteDevice(id: string) {
  try {
    await request.delete('/device/dev', { dev_id: id });
    message.success('删除成功');
    return true;
  } catch (error) {
    message.error('删除失败请重试！');
    return false;
  }
}
