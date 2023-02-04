import { Effect, Reducer } from 'umi';
import { UserTreeItem } from '@/pages/setting/user/data';
import { queryUsersWithDepartment } from '@/pages/setting/user/service';

export interface FlowEditorConfig {
  name: string;
  formId: number;
  categoryId: number;
  description: string;
}

// 发起人属性信息
export interface FlowChartStarterProps {
  raw: {
    starter?: number[];
  };
  format: {
    starter?: {
      value: string[];
      props: string;
    };
  };
}

export interface FlowEditorState {
  userTreeData?: UserTreeItem[];
  config?: Partial<FlowEditorConfig>;
  starterProps?: Partial<FlowChartStarterProps>;
}

export interface FlowEditorModelType {
  namespace: 'floweditor';
  state: FlowEditorState;
  effects: {
    fetchUserTreeData: Effect;
  };
  reducers: {
    saveCreation: Reducer<FlowEditorState>;
    saveUsers: Reducer<FlowEditorState>;
  };
}

const FlowEditorModel: FlowEditorModelType = {
  namespace: 'floweditor',

  state: {
    userTreeData: [],
    config: {},
    starterProps: {},
  },

  effects: {
    *fetchUserTreeData(_, { call, put }) {
      const { data } = yield call(queryUsersWithDepartment);
      if (data) {
        yield put({
          type: 'saveUsers',
          payload: data,
        });
      }
    },
  },

  reducers: {
    saveCreation(state) {
      return {
        ...state,
      };
    },
    saveUsers(state, action) {
      return {
        ...state,
        userTreeData: action.payload || [],
      };
    },
  },
};

export default FlowEditorModel;
