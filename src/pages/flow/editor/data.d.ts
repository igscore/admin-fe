import type { FlowChartNodeAssigneeEnum, FlowChartNodeEndModeEnum } from './service';

// 前端：流程节点类型：发起人 审批人，抄送，结束
export type FlowChartType = 'start' | 'approver' | 'notify' | 'end';

// 前端：流程节点ID类型
export type FlowChartNodeIdType = 'flow-start' | 'flow-end' | string;

// 前端：发起人名字类型
export type FlowChartNameType = '发起人' | string;

// 前端：创建流程节点类型： 审批人 / 抄送人
export type FlowChartCreationType = 'approver' | 'notifier';

// 流程节点属性值类型
export interface FlowAssigneeValueItem {
  id?: number;
  type?: number;
}

// 前端：流程图节点属性数据类型
export interface FlowChartProperty {
  assignee?: {
    key: FlowChartNodeAssigneeEnum;
    value: FlowAssigneeValueItem[];
  };
  taskEndMode?: FlowChartNodeEndModeEnum;
  passRatio?: number; // 针对PassWithPartialReject的成功比率
  skipEnable?: boolean; // 如果没有匹配到处理人是否继续
  actionRules?: {
    key: string;
    isReadable: boolean;
    isWritable: boolean;
  }[];
}

// 前端：流程图及其节点数据类型
export interface FlowChartData {
  type: FlowChartType;
  name: FlowChartNameType;
  nodeId: FlowChartNodeIdType;
  prevId: FlowChartNodeIdType | null;
  properties: FlowChartProperty;
  childNode?: FlowChartData;
  extra?: Record<string, any>;
}

// 前端：流程基础设置表单类型
export interface FlowFormConfigProperties {
  id: number;
  name: string;
  formIdGroup: number[];
  starter: number[];
  categoryId: number;
  description: string;
}

// API：获取流程图数据(queryFlowTemplate)返回值类型
export interface QueryFlowChartData {
  config?: FlowFormConfigProperties;
  chart?: FlowChartData;
}

// 前端：单个节点（FlowItem）组件配置数据枚举类型
export type FlowConfigEnumType = {
  [type in Exclude<FlowChartType, 'end'>]: {
    head: {
      icon: any;
      bgColor: string;
    };
    content: {
      defaultText: string;
      format: (
        content: string[],
        assigneeKey?: FlowChartNodeAssigneeEnum,
        taskEndMode?: FlowChartNodeEndModeEnum,
      ) => string;
    };
  };
};

// 前端：单个节点创建时的默认配置数据枚举类型
export type FlowCreationEnumType = {
  [type in FlowChartCreationType]: {
    type: FlowChartType;
    name: string;
    properties: Partial<FlowChartProperty>;
  };
};

// API：提交流程接口基本配置信息
export interface APIFlowChartConfig {
  name: string;
  categoryId: number; // 流程分组ID
  formId: number;
  description: string;
}

// API：提交流程接口参数
export interface AddFlowChartDataParams {
  config: APIFlowChartConfig;
  chart: FlowChartData;
  needAcl?: boolean;
}

export interface AskToHandleFlowParams {
  id: number;
  next: number[];
  current: number[];
  needAcl?: boolean;
}
