import { message } from 'antd';

import request from '@/utils/request';
import type {
  PositionItem,
  AddPositionParams,
  UpdatePositionParams,
  FilterPositionParams,
  FilterPositionData,
} from './data';

export enum PositionTypeEnum {
  HIGH = 1, // 高层
  MIDDLE, // 中层
  LOW, // 基层
}

export const PositionTypeMaps = {
  [PositionTypeEnum.HIGH]: {
    tag: 'gold',
    text: '高层',
  },
  [PositionTypeEnum.MIDDLE]: {
    tag: 'green',
    text: '中层',
  },
  [PositionTypeEnum.LOW]: {
    tag: 'blue',
    text: '基层',
  },
};

export async function queryPosition(
  departmentId?: number,
): Promise<{ list: PositionItem[]; success: boolean; total: number }> {
  let response = {
    list: [] as PositionItem[],
    success: false,
    total: 0,
  };
  try {
    const { entries } = await request.get('/plat/positions', {}, { putResponseLineToHump: true });
    if (Array.isArray(entries)) {
      const list = departmentId ? entries.filter(({ departmentId: id }) => departmentId === id) : entries;
      response = {
        list,
        total: list.length,
        success: true,
      };
    }
    return response;
  } catch (e) {
    return response;
  }
}

export async function queryPositionByFilter(params: FilterPositionParams = {}) {
  let resData: FilterPositionData = {
    data: [],
    success: false,
    total: 0,
  };
  try {
    const { entries, total } = await request.get(
      '/plat/positions/filter',
      {
        limit: 20,
        offset: 0,
        ...params,
      },
      {
        putRequestHumpToLine: true,
        putResponseLineToHump: true,
      },
    );
    if (Array.isArray(entries)) {
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

export async function askToAddPosition({ departmentId, ...rest }: AddPositionParams) {
  return request.post('/plat/position', {
    ...rest,
    department_id: departmentId,
  });
}

export async function askToUpdatePosition({ departmentId, ...rest }: UpdatePositionParams) {
  return request.put('/plat/position', {
    ...rest,
    department_id: departmentId,
  });
}

export async function askToDeletePosition(positionId: number) {
  try {
    await request.delete('/plat/position', { position_id: positionId });
    message.success('删除成功', 2);
    return true;
  } catch (e) {
    message.error('删除失败，请稍后再试');
    return false;
  }
}
