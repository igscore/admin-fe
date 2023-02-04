import type { FlowTemplateStateEnum } from './service';

export interface FlowListItem {
  id: number;
  version: number;
  name: string;
  description: string;
  icon: string;
  state: FlowTemplateStateEnum;
  categoryId: number;
  formId: number;
  startFormUrl: string;
  category: {
    id: number;
    sequence: number;
    name: string;
  };
}

export interface FlowTemplateData {
  data: FlowListItem[];
  total?: number;
  success: boolean;
}

export interface QueryFlowTemplateParams {
  limit?: number;
  offset?: number;
  name?: string;
  state?: FlowTemplateStateEnum;
  categoryId?: number;
}

export interface UpdateFlowTemplateParams {
  id: number;
  name: string;
  categoryId: number;
  description: string;
  icon: string;
  needAcl?: boolean;
  privileges: {
    // 权限
    add: { userId: number }[] | null;
    delete: { userId: number }[] | null;
  };
}
