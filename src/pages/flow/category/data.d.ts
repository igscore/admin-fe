export interface FlowCategoryItem {
  id: number;
  sequence: number;
  name: string;
}

export interface FlowCategoryData {
  success: boolean;
  total: number;
  data: FlowCategoryItem[];
}

export interface AddFlowCategoryParams {
  sequence: number; // 排序 默认 0：不排序
  name: string;
}

export interface UpdateFlowCategoryParams {
  id: number;
  sequence: number; // 排序 默认 0：不排序
  name: string;
}
