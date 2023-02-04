import { message } from 'antd';
import request from '@/utils/request';

import { DepartmentDirectorTypeEnum } from '@/pages/setting/department/service';
import { queryFormProperties } from '@/services/formProperty';
import type { FormPropertyItem } from '@/types/formProperty';
import type { ApproverFormValue } from '../editor/components/Approver';
import type { AddFlowChartDataParams, AskToHandleFlowParams, FlowChartData, QueryFlowChartData } from './data';

// 解析模式：
// SPECIFIED_USER_ID（指定用户ID）= 1;
// SPECIFIED_GROUP_ID（指定部门ID）= 2;
// SpecifiedPosition（指定岗位ID）= 3;
// OWNER_USER_ID（发起人自己处理）= 4;
// OWNER_GROUP_ID（指定发起人的部门处理）= 5;
// OWNER_SPECIFIED_USER_ID（发起人指定处理用户）= 6;
// SPECIFIED_GROUP_LEADER（指定部门ID匹配主管）= 7;
// OWNER_GROUP_LEADER（指定发起人部门匹配主管）= 8;
export enum FlowChartNodeAssigneeEnum {
  SPECIFIED_USER_ID = 1,
  SPECIFIED_GROUP_ID,
  SPECIFIED_POSITION_ID,
  OWNER_USER_ID,
  OWNER_GROUP_ID,
  OWNER_SPECIFIED_USER_ID,
  SPECIFIED_GROUP_LEADER,
  OWNER_GROUP_LEADER,
}

// 会签方式
// PassWithNoReject（只要处理人提交失败就协同关闭） = 1;
// PassWithPartialReject（处理人提交后结算协同是否结束） = 2;
// PassAnyWay = 3;（不管处理是否成功都继续流程）
export enum FlowChartNodeEndModeEnum {
  REJECT = 1,
  PARTIAL_REJECT,
  ANY_WAY,
}

export const FlowChartNodeEndModeMaps = {
  [FlowChartNodeEndModeEnum.REJECT]: {
    text: '会签',
    tip: '必须所有审批人同意',
  },
  [FlowChartNodeEndModeEnum.PARTIAL_REJECT]: {
    text: '或签',
    tip: '一名审批人同意即可',
  },
  [FlowChartNodeEndModeEnum.ANY_WAY]: {
    text: '必签',
    tip: '被拒绝时仍继续审批',
  },
};

export const FlowChartNodeAssigneeList = [
  { key: FlowChartNodeAssigneeEnum.SPECIFIED_USER_ID, text: '指定成员' },
  { key: FlowChartNodeAssigneeEnum.SPECIFIED_GROUP_LEADER, text: '指定主管' },
  { key: FlowChartNodeAssigneeEnum.SPECIFIED_POSITION_ID, text: '指定岗位' },
  { key: FlowChartNodeAssigneeEnum.SPECIFIED_GROUP_ID, text: '指定部门' },
  { key: FlowChartNodeAssigneeEnum.OWNER_SPECIFIED_USER_ID, text: '发起人自选' },
  { key: FlowChartNodeAssigneeEnum.OWNER_GROUP_LEADER, text: '发起人主管' },
  { key: FlowChartNodeAssigneeEnum.OWNER_GROUP_ID, text: '发起人部门' },
  { key: FlowChartNodeAssigneeEnum.OWNER_USER_ID, text: '发起人自己' },
];

export const getApproveTitleByAssignee = (
  assignee: ApproverFormValue['assignee'],
  hasBeenEdited: boolean,
  name: string,
) => {
  if (!assignee.key || hasBeenEdited) return name;

  switch (assignee.key) {
    case FlowChartNodeAssigneeEnum.SPECIFIED_USER_ID:
      return '审批人';
    case FlowChartNodeAssigneeEnum.SPECIFIED_GROUP_LEADER:
      return '审批主管';
    case FlowChartNodeAssigneeEnum.SPECIFIED_POSITION_ID:
      return '审批岗位';
    case FlowChartNodeAssigneeEnum.SPECIFIED_GROUP_ID:
      return '审批部门';
    case FlowChartNodeAssigneeEnum.OWNER_SPECIFIED_USER_ID:
      return '审批人';
    case FlowChartNodeAssigneeEnum.OWNER_GROUP_LEADER:
      if (assignee.value[0]?.type === DepartmentDirectorTypeEnum.LEADER_IN_CHARGE) {
        return '上级主管';
      }
      return '主管';
    case FlowChartNodeAssigneeEnum.OWNER_GROUP_ID:
      return '审批部门';
    case FlowChartNodeAssigneeEnum.OWNER_USER_ID:
      return '审批人';
    default:
      return '审批人';
  }
};

// 格式化发起人ID列表（接口需要）
const getFlowTemplatePrivileges = (data: FlowChartData): { user_id: number }[] => {
  if (data.type === 'start') {
    return (data.properties.assignee?.value || []).map(({ id }) => ({
      user_id: Number(id),
    }));
  }
  return [];
};

const findFlowNodesAndEdges = (
  data: FlowChartData,
  formProperties: FormPropertyItem[],
  nodes: any[],
  edges: any[],
  edgeStartId?: string,
) => {
  // 格式化节点数据
  const node = {
    type: 'user_task', // 任务节点对应的类型，只能填user_task
    id: data.nodeId,
    name: data.name,
    properties: {},
  };
  if (data.type === 'end') {
    node.type = 'end_event';
  } else {
    node.properties = {
      // 表单字段权限，默认全部可读写
      action_rules: formProperties.map(({ key }) => ({
        key,
        is_readable: true,
        is_writable: true,
      })),
    };
    if (data.type === 'start') {
      node.type = 'start_event';
    } else {
      const { assignee, taskEndMode, skipEnable } = data.properties;
      node.properties = {
        ...node.properties,
        pass_ratio: 0,
        assignee,
        task_end_mode: taskEndMode,
        skip_enable: skipEnable,
      };
    }
  }
  nodes.push(node);

  // 格式化边线数据
  if (edgeStartId) {
    edges.push({
      type: 'sequence_flow',
      id: `${edgeStartId}_to_${data.nodeId}`,
      source_ref: edgeStartId,
      target_ref: data.nodeId,
    });
  }

  if (data.childNode) {
    findFlowNodesAndEdges(data.childNode, formProperties, nodes, edges, data.nodeId);
  }
};

// 格式化流程图数据（接口需求）
const getFlowNodesAndEdges = (
  data: FlowChartData,
  formProperties: FormPropertyItem[],
): { nodes: any[]; edges: any[] } => {
  const nodes: any[] = [];
  const edges: any[] = [];
  findFlowNodesAndEdges(data, formProperties, nodes, edges);
  return { nodes, edges };
};

export async function queryFlowTemplate(id: number) {
  let resData: QueryFlowChartData = {};
  try {
    const data = await request.get<any>('/flow/definition', { def_id: id });
    if (data) {
      const graphContent = JSON.parse(data.graph_content);
      const chart: FlowChartData = JSON.parse(graphContent?.chart || null);
      const starter = Array.isArray(data.identity_links)
        ? (data.identity_links || []).map(({ user_id: i }: any) => Number(i))
        : [];
      resData = {
        chart,
        config: {
          starter,
          id: data.id,
          name: data.name,
          formIdGroup: [data.form_id],
          categoryId: data.category_id,
          description: data.description,
        },
      };
    }
    return resData;
  } catch (e) {
    return resData;
  }
}

export async function addFlowTemplate({ config, chart, needAcl }: AddFlowChartDataParams) {
  try {
    const { formProperties } = await queryFormProperties(config.formId);

    const id = `flow-template-${Math.floor(Math.random() * 10000)}`;
    const { nodes, edges } = getFlowNodesAndEdges(chart, formProperties);
    const params = {
      need_acl: needAcl,
      start_form_url: '/synergy/create',
      privileges: {
        add: getFlowTemplatePrivileges(chart), // 发起人ID列表
      },
      category_id: config.categoryId,
      form_id: config.formId,
      name: config.name,
      description: config.description,
      icon: '',
      graph_content: {
        chart: JSON.stringify(chart),
      },
      resource_content: {
        id, // 流程图的ID，前端生成
        name: config.name, // 和上面的name一致即可
        type: 'process', // 固定类型，表示流程
        form_properties: formProperties,
        nodes,
        edges,
      },
    };
    await request.post('/flow/definition', params);
    return {
      success: true,
    };
  } catch (e) {
    message.error(e?.message || '创建失败，请稍后再试');
    return {
      success: false,
    };
  }
}

const formatModifier = (next: number[], current: number[]) => {
  const add = next.filter((i) => !current.includes(i));
  const del = current.filter((i) => !next.includes(i));
  return {
    add,
    del,
  };
};

export async function askToHandleFlow({ id, next, current, needAcl }: AskToHandleFlowParams) {
  const { add, del } = formatModifier(next, current);
  try {
    await request.put(
      '/flow/definition',
      {
        id,
        privileges: {
          add: add?.map((userId) => ({ userId })),
          delete: del?.map((userId) => ({ userId })),
        },
        needAcl,
      },
      { putRequestHumpToLine: true },
    );
    return {
      success: true,
    };
  } catch (e) {
    message.error(e?.message || '修改失败，请稍后再试');
    return {
      success: false,
    };
  }
}
