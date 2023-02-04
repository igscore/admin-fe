import type { UserTypeEnum } from '@/pages/setting/user/service';
import type { DepartmentItem } from '@/pages/setting/department/data';

export interface UserDetailInfo {
  id: number;
  account: string;
  name: string;
  level: string;
  type: number;
  state: UserTypeEnum;
  comment: string;
  phone: number;
  roles: any[];
  jobNumber: number;
  nameSort: string;
  avatarId: number;
  avatarUrl: string;
  entryAt: number;
  resignAt: number;
  mainPositionId: number;
  mainDepartmentId: number;
  mainDepartment: DepartmentItem;
}
