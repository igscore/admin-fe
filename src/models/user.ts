import type { Effect, Reducer } from 'umi';

import { queryCurrentUser, queryCurrentCompany } from '@/services/user';
import { goToLoginPage } from '@/utils/utils';

export type SystemPlatType = 'system' | 'tenant';
export type UserLevelType = 'SYSTEM_ADMIN' | 'TENANT_ADMIN' | 'TENANT_USER';

export interface CurrentUser {
  plat?: SystemPlatType;
  id?: number;
  name?: string;
  account?: string;
  avatarUrl?: string;
  jobNumber?: string; // 工号
  level?: UserLevelType; // 工号
  mainDepartmentId?: number;
  mainPositionId?: number;
  roles?: {
    id: number;
    name: string;
  }[];

  tenantId?: number;
  mainDepartment?: {
    id: number;
    name: string;
    parentId: number;
    sequence: number;
    state: number;
    type: number;
  };
  mainPosition?: {
    departmentId: number;
    description: string;
    duty: string;
    id: number;
    name: string;
    sequence: number;
    type: number;
  };
}

export interface CurrentCompany {
  id?: number;
  name?: string;
  logoUrl?: string;
}

export interface UserModelState {
  currentUser?: CurrentUser;
  currentCompany?: CurrentCompany;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetchCurrent: Effect;
    queryCurrentCompany: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    saveCurrentCompany: Reducer<UserModelState>;
    changeNotifyCount: Reducer<UserModelState>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
    currentCompany: {},
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrentUser);
      if (response) {
        yield put({
          type: 'saveCurrentUser',
          payload: response,
        });
      } else {
        goToLoginPage();
      }
    },

    *queryCurrentCompany({ payload }, { call, put }) {
      const response = yield call(queryCurrentCompany, payload);
      yield put({
        type: 'saveCurrentCompany',
        payload: response,
      });
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      const { id, ...rest } = (action.payload as CurrentUser) || {};
      const currentUser = id ? { id, ...rest } : {};
      return {
        ...state,
        currentUser,
      };
    },

    saveCurrentCompany(state, action) {
      const currentCompany = {
        id: action.payload.id || -1,
        name: action.payload.name || '',
        logo: action.payload.logo_url || '',
      };
      return {
        ...state,
        currentCompany,
      };
    },

    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};

export default UserModel;
