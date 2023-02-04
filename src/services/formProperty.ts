import request from '@/utils/request';
import type { FormPropertyData } from '@/types/formProperty';

// 获取指定表单信息
export async function queryFormProperties(id: number) {
  let resData: FormPropertyData = {
    id: 0,
    name: '',
    startFormUrl: '',
    formCategoryId: 0,
    formProperties: [],
  };
  try {
    const data = await request.get<any>('/form/form', { form_id: id }, { putResponseLineToHump: true });
    resData = {
      ...data,
      formProperties: data.formProperties.map(({ seq, ...props }: any) => ({
        ...props,
        index: seq,
      })),
    };
    return resData;
  } catch (e) {
    return resData;
  }
}
