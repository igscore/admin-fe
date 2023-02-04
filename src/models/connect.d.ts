import { AnyAction, RouterTypes } from 'umi';
import { MenuDataItem } from '@ant-design/pro-layout';
import { FlowEditorState } from '@/pages/flow/editor/model';
import { DefaultSettings as SettingModelState } from '../../config/defaultSettings';
import { GlobalModelState } from './global';
import { UserModelState } from './user';
import { StateType } from './login';

export { GlobalModelState, SettingModelState, UserModelState, FlowEditorState };

export interface Loading {
  effects: {
    [key: string]: boolean | undefined;
  };
  global: boolean;
  models: {
    global?: boolean;
    menu?: boolean;
    setting?: boolean;
    user?: boolean;
    login?: boolean;
    floweditor?: boolean;
  };
}

export interface ConnectState {
  loading: Loading;
  global: GlobalModelState;
  settings: SettingModelState;
  user: UserModelState;
  login: StateType;
  floweditor: FlowEditorState;
}

export interface Route extends MenuDataItem {
  routes?: Route[];
}

/**
 * @type T: Params matched in dynamic routing
 */
export interface ConnectProps<T = {}> extends Partial<RouterTypes<Route, T>> {
  dispatch?: Dispatch<AnyAction>;
}
