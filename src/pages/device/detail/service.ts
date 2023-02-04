import { message } from 'antd';
import request from '@/utils/request';
import { isObj } from '@/utils/variable';

import type {
  AddOperationPointParams,
  DeviceDetailInfo,
  OperationPointDetail,
  OperationPointsData,
  QueryOperationPointsParams,
  UpdateOperationPointParams,
} from './data';

export async function queryDeviceDetail(id: string) {
  let resData = {
    data: null as DeviceDetailInfo | null,
    success: false,
  };
  try {
    const data = await request.get<any>('/device/dev', { dev_id: id }, { putResponseLineToHump: true });
    if (isObj(data)) {
      resData = {
        data: data as DeviceDetailInfo,
        success: true,
      };
    }
    return resData;
  } catch (e) {
    return resData;
  }
}

// 获取设备作业点列表
export async function queryOperationPoints(params: QueryOperationPointsParams = {}) {
  let resData: OperationPointsData = {
    success: false,
    total: 0,
    data: [],
  };
  try {
    const data = await request.get<any>('/device/location/page', params, {
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

// 获取设备作业点详情
export async function queryOperationPointDetail(id: number) {
  let resData = {
    data: null as OperationPointDetail | null,
    success: false,
  };
  try {
    const data = await request.get<any>('/device/location', { location_id: id }, { putResponseLineToHump: true });
    if (isObj(data)) {
      resData = {
        data: {
          ...data,
          flowDefBinds: data.flowDefBinds || [],
        } as OperationPointDetail,
        success: true,
      };
    }
    return resData;
  } catch (e) {
    return resData;
  }
}

// 添加作业点
export async function askToAddOperationPoint(data: AddOperationPointParams) {
  try {
    await request.post<{ id: string }>(
      '/device/location',
      { dev_id: data.devId, address: data.address },
      { putResponseLineToHump: true },
    );
    return true;
  } catch (e) {
    message.error(e?.message || '添加失败，请稍后再试');
    return false;
  }
}

// 更新作业点
export async function askToUpdateOperationPoint(params: UpdateOperationPointParams) {
  try {
    await request.put('/device/location', params);
    return true;
  } catch (e) {
    message.error('修改失败，请稍后再试');
    return false;
  }
}

export async function askToDeleteOperationPoint(locationId: number) {
  try {
    await request.delete('/device/location', { location_id: locationId });
    message.success('删除成功');
    return true;
  } catch (e) {
    message.error('删除失败，请稍后再试');
    return false;
  }
}

// 绑定设备作业点流程
export async function askToBindFlow(id: number, flowIds: number[]) {
  try {
    await request.post<{ id: string }>(
      '/device/location/flow/bind/list',
      {
        location_id: id,
        binds: flowIds.map((i) => ({ flow_def_id: i })),
      },
      { putResponseLineToHump: true },
    );
    return {
      success: true,
    };
  } catch (e) {
    message.error(e?.message || '绑定失败，请稍后再试');
    return {
      success: false,
    };
  }
}

export async function askToUnbindFlow(id: number, flowIds: number[]) {
  try {
    await request.delete<any>(
      '/device/location/flow/bind/list',
      {},
      {
        data: {
          location_id: id,
          binds: flowIds.map((i) => ({ flow_def_id: i })),
        },
        putResponseLineToHump: true,
      },
    );
    return {
      success: true,
    };
  } catch (e) {
    message.error(e?.message || '解绑失败，请稍后再试');
    return {
      success: false,
    };
  }
}
