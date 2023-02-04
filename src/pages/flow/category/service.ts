import { message } from 'antd';
import request from '@/utils/request';
import type { FlowCategoryItem, FlowCategoryData, AddFlowCategoryParams, UpdateFlowCategoryParams } from './data';

export async function queryFlowCategory() {
  let resData: FlowCategoryData = {
    success: false,
    total: 0,
    data: [],
  };
  const data = await request.get<{ entries: FlowCategoryItem[]; total: number }>('/flow/categories');
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

export async function askToAddFlowCategory(params: AddFlowCategoryParams) {
  try {
    await request.post('/flow/category', params);
    return true;
  } catch (e) {
    message.error('添加分类失败，请稍后再试');
    return false;
  }
}

export async function askToUpdateFlowCategory(params: UpdateFlowCategoryParams) {
  try {
    await request.put('/flow/category', params);
    return true;
  } catch (e) {
    message.error('修改分类失败，请稍后再试');
    return false;
  }
}

export async function askToDeleteFlow(id: number) {
  try {
    await request.delete('/flow/category', { category_id: id });
    message.success('删除成功');
    return true;
  } catch (e) {
    message.error('删除分类失败，请稍后再试');
    return false;
  }
}
