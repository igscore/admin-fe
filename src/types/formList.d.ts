export interface SynergyFormItem {
  id: number;
  sequence: number;
  name: string;
  startFormUrl: string;
  formCategoryId: number;
  formCategory: {
    sequence: number;
    name: string;
    id: number;
  };
}

export interface SynergyFormItemRaw {
  id: number;
  sequence: number;
  name: string;
  start_form_url: string;
  form_category_id: number;
  form_category: {
    sequence: number;
    name: string;
    id: number;
  };
}

export interface SynergyFormData {
  success: boolean;
  total: number;
  data: SynergyFormItem[];
}

export interface FormCategoryItem {
  id: number;
  sequence: number;
  name: string;
}

export interface FormCategoryData {
  success: boolean;
  total: number;
  data: FormCategoryItem[];
}
