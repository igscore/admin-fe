import request from '@/utils/request';
import type { SynergyFormItemRaw, SynergyFormData, FormCategoryData } from '@/types/formList';

export async function querySynergyForm() {
  let resData: SynergyFormData = {
    success: false,
    total: 0,
    data: [],
  };
  const data = await request.get<{ entries: SynergyFormItemRaw[]; total: number }>('/form/forms');
  if (Array.isArray(data.entries)) {
    const { entries, total } = data;
    resData = {
      total,
      success: true,
      data: entries.map(({ start_form_url, form_category, form_category_id, ...left }) => ({
        ...left,
        startFormUrl: start_form_url,
        formCategoryId: form_category_id,
        formCategory: form_category,
      })),
    };
  }
  return resData;
}

export async function queryFormCategory() {
  let resData: FormCategoryData = {
    success: false,
    total: 0,
    data: [],
  };
  const data = await request.get<{ entries: any[]; total: number }>(
    '/form/categories',
    {},
    {
      putResponseLineToHump: true,
    },
  );
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
