export interface DeviceListItem {
  id: string;
  uuid: string;
  mac: string;
  password: string;
  name: string;
  groupId: number;
  description: string;
  type: number;
  distanceLimit: number;
  createBy: number;
  createAt: string;
  updateAt: string;
}

export interface DeviceData {
  data: DeviceListItem[];
  total: number;
  success: boolean;
}

export interface QueryDeviceParams {
  limit?: number;
  offset?: number;
  devName?: string;
  devTypes?: number;
}

export interface AddDeviceParams {
  mac: string;
  password: string;
  name: string;
  type: number;
  description: string;
}

export type UpdateDeviceParams = Partial<AddDeviceParams>;
