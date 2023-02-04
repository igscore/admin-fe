import { getObjValueSafely, setObjValueSafely } from '@/utils/variable';

import { FlowChartNodeAssigneeEnum, FlowChartNodeEndModeEnum } from './service';
import { FlowChartCreationType, FlowChartData, FlowCreationEnumType } from './data';

const FlowCreationConfigEnum: FlowCreationEnumType = {
  approver: {
    type: 'approver',
    name: '审批人',
    properties: {
      assignee: {
        key: FlowChartNodeAssigneeEnum.SPECIFIED_USER_ID,
        value: [],
      },
      taskEndMode: FlowChartNodeEndModeEnum.REJECT,
      skipEnable: true,
    },
  },
  notifier: {
    type: 'notify',
    name: '抄送人',
    properties: {},
  },
};

const getKeyStr = (data: FlowChartData | undefined, nodeId: string, result: string): string => {
  if (!data) {
    return '';
  }

  const key = '.childNode';
  // eslint-disable-next-line no-param-reassign
  result += key;

  if (data.nodeId === nodeId) {
    return result.slice(key.length + 1);
  }

  return getKeyStr(data.childNode, nodeId, result);
};

const getDataKeyStr = (data: FlowChartData, nodeId: string): string => getKeyStr(data, nodeId, '');

const getDepth = (data: FlowChartData | undefined, nodeId: string, result: number): number => {
  if (!data) {
    return 0;
  }

  // eslint-disable-next-line no-param-reassign
  result += 1;

  if (data.nodeId === nodeId) {
    return result;
  }

  return getDepth(data.childNode, nodeId, result);
};

export const getFlowDepth = (data: FlowChartData, nodeId: string): number => getDepth(data, nodeId, 0);

// 获取当前节点及祖先节点数据（不包含子节点数据）
const fliterFlowDataWithoutChild = (data: FlowChartData, nodeId: string): FlowChartData => {
  const keyStr = getDataKeyStr(data, nodeId);
  if (keyStr) {
    const { childNode, ...rest } = getObjValueSafely<FlowChartData>(data, keyStr);
    const filterData = { ...data };

    setObjValueSafely(filterData, keyStr, { ...rest });

    return filterData;
  }
  const { childNode, ...rest } = data;
  return { ...rest };
};

// 获取当前节点数据（包含子节点数据）
export const findFlowItemWithChild = (data: FlowChartData, nodeId: string): FlowChartData | null => {
  const keyStr = getDataKeyStr(data, nodeId);
  if (keyStr) {
    return getObjValueSafely<FlowChartData>(data, keyStr);
  }
  return data;
};

/**
 * 增加指定节点
 * @param treeData 当前流程图数据
 * @param current 当前节点数据
 * @param type 创建节点类型
 */
export const addFlowChartData = (
  treeData: FlowChartData,
  current: FlowChartData,
  type: FlowChartCreationType,
): FlowChartData => {
  const { nodeId, childNode } = current;
  const nextData = { ...treeData };
  const currentItem = findFlowItemWithChild(nextData, nodeId);
  if (currentItem) {
    const newNodeId = `flow-${Math.floor(Math.random() * 10000)}`;
    const initialData = FlowCreationConfigEnum[type];
    currentItem.childNode = {
      prevId: nodeId,
      nodeId: newNodeId,
      type: initialData.type,
      name: initialData.name,
      properties: initialData.properties,
    };
    if (childNode) {
      childNode.prevId = newNodeId;
      currentItem.childNode.childNode = childNode;
    }
  }

  return nextData;
};

// 删除指定节点
export const deleteFlowChartData = (data: FlowChartData, item: FlowChartData): FlowChartData => {
  let nextData = { ...data };
  const { prevId, childNode } = item;
  if (prevId) {
    nextData = fliterFlowDataWithoutChild(nextData, prevId);
    const prevItem = findFlowItemWithChild(nextData, prevId);
    if (prevItem && childNode) {
      childNode.prevId = prevItem.nodeId;
      prevItem.childNode = childNode;
    }
  }
  return nextData;
};

// 更新指定节点
export const modifyFlowChartData = (
  treeData: FlowChartData,
  nodeId: string,
  modifier: (current: FlowChartData) => FlowChartData,
): FlowChartData => {
  const keyStr = getDataKeyStr(treeData, nodeId);
  if (keyStr) {
    const current = getObjValueSafely<FlowChartData>(treeData, keyStr);
    const modifiedNode = modifier(current);
    setObjValueSafely<FlowChartData>(treeData, keyStr, modifiedNode);
  }
  return treeData;
};
