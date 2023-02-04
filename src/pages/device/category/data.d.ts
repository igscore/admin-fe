export interface DeviceGroupItem {
  id: number;
  name: string;
}

export interface DeviceGroupData {
  success: boolean;
  total: number;
  data: DeviceGroupItem[];
}

export interface AddDeviceGroupParams {
  name: string;
}

export interface UpdateDeviceGroupParams {
  id: number;
  name: string;
}
