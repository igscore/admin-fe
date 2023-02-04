export interface FlowDefBindItem {
  locationId: number;
  flowDefId: number;
}

export interface DeviceDetailInfo {
  id: string;
  name: string;
  type: number;
  description: string;
  createBy: number;
  createAt: number;
  updateBy: number;
  updateAt: number;
  flowDefBinds: FlowDefBindItem[];
}

export interface OperationPointItem {
  id: number;
  address: string;
  devId: string;
}

export interface OperationPointsData {
  data: OperationPointItem[];
  total: number;
  success: boolean;
}

export interface QueryOperationPointsParams {
  devId?: string;
  address?: string;
  limit?: number;
  offset?: number;
}

export interface AddOperationPointParams {
  devId: string;
  address: string;
}

export interface UpdateOperationPointParams {
  id: number;
  address: string;
  devId: string;
}

export interface OperationPointDetail {
  id: number;
  address: string;
  devId: string;
  flowDefBinds?: FlowDefBindItem[];
}
