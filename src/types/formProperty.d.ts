// 表单项类型
export type FormPropertyType =
  | 'string'
  | 'number'
  | 'decimal'
  | 'date'
  | 'radio'
  | 'select'
  | 'checkbox'
  | 'textarea'
  | 'cash-zh';

export interface FormPropertyValueItem {
  id: number;
  formPropertyId: number;
  key: string;
  value: string;
}

export interface FormPropertyItem {
  type: FormPropertyType;
  id: number;
  index: number;
  key: string;
  name: string;
  tagId: string;
  defaultValue: string;
  datePattern: string;
  formId: number;
  isRequired: boolean;
  isCondCandidate: boolean;
  formValues: FormPropertyValueItem[];
}

export interface FormPropertyData {
  name: string;
  id: number;
  startFormUrl: string;
  formCategoryId: number;
  formCategory?: {
    sequence: number;
    name: string;
    id: number;
  };
  formProperties: FormPropertyItem[];
}
