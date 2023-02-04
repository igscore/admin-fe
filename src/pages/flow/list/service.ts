import { message } from 'antd';
import request from '@/utils/request';
import type { FlowTemplateData, QueryFlowTemplateParams, UpdateFlowTemplateParams } from './data';

export enum FlowTemplateStateEnum {
  Disable = 1,
  Enable = 2,
}

export const FlowTemplateStateMaps = {
  [FlowTemplateStateEnum.Disable]: {
    tag: 'error',
    text: '已停用',
  },
  [FlowTemplateStateEnum.Enable]: {
    tag: 'success',
    text: '已启用',
  },
};

// 分页获取所有设备流程定义
export async function queryFlowListByAcl(params: QueryFlowTemplateParams = {}) {
  let resData: FlowTemplateData = {
    success: false,
    total: 0,
    data: [],
  };
  try {
    const data = await request.get<any>('/flow/definition/acl/page', params, {
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

// 分页获取所有流程定义
export async function queryFlowListByFilter(params: QueryFlowTemplateParams = {}) {
  let resData: FlowTemplateData = {
    success: false,
    total: 0,
    data: [],
  };
  try {
    const data = await request.get<any>('/flow/definitions/filter', params, {
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

export async function askToUpdateFlowList(params: UpdateFlowTemplateParams) {
  try {
    const { id, name, categoryId, description, icon, privileges, needAcl } = params;
    await request.put('/flow/definition', {
      id,
      name,
      description,
      icon,
      privileges,
      category_id: categoryId,
      need_acl: needAcl,
    });
    message.success('修改成功');
    return true;
  } catch (error) {
    message.error('修改失败请重试！');
    return false;
  }
}

// 删除流程定义
export async function askToDeleteFlow(id: number) {
  try {
    await request.delete('/flow/definition', { definition_id: id });
    message.success('删除成功');
    return true;
  } catch (error) {
    message.error('删除失败请重试！');
    return false;
  }
}

// 启用流程定义
export async function askToEnableFlow(id: number) {
  try {
    await request.put('/flow/definition/activate', { id });
    message.success('启用成功');
    return true;
  } catch (error) {
    message.error('启用失败请重试！');
    return false;
  }
}

// 禁用流程定义
export async function askToDisableFlow(id: number) {
  try {
    await request.put('/flow/definition/suspend', { id });
    message.success('停用成功');
    return true;
  } catch (error) {
    message.error('停用失败请重试！');
    return false;
  }
}
