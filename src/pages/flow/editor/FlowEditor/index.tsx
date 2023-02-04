/**
 * @author liuzhimeng
 * @date 2020-04-06
 * @description 流程图页面
 */

import React, { useCallback, useRef, useState } from 'react';

import type { MainDrawerFormValue } from '../components/EditDrawer/MainDrawer';
import MainDrawer from '../components/EditDrawer/MainDrawer';
import FlowContainer from '../components/FlowPanel/FlowContainer';
import type { ApproverFormValue } from '../components/Approver';
import type { FlowChartCreationType, FlowChartData } from '../data';
import { FlowChartNodeAssigneeEnum, getApproveTitleByAssignee } from '../service';
import { addFlowChartData, deleteFlowChartData, findFlowItemWithChild, modifyFlowChartData } from '../utils';

interface Props {
  data: FlowChartData;
  onChartChange: (data: FlowChartData) => void;
}

const FlowEditor: React.FC<Props> = ({ data, onChartChange }) => {
  const [flowData, handleFlowData] = useState<FlowChartData>(data);
  const [visible, handleVisible] = useState<boolean>(false);
  const [currentItem, handleCurrentItem] = useState<FlowChartData | undefined>();
  const refData = useRef<FlowChartData>(data);

  refData.current = flowData;

  const onClick = useCallback((current: FlowChartData) => {
    handleVisible(true);
    handleCurrentItem(current);
  }, []);

  const onOptionClick = useCallback(
    (option: 'add' | 'delete', item: FlowChartData, type?: FlowChartCreationType) => {
      let nextData;
      // 添加节点
      if (option === 'add' && type) {
        nextData = addFlowChartData(refData.current, item, type);
        const nextItem = findFlowItemWithChild(nextData, item.nodeId);
        if (nextItem?.childNode) {
          onClick(nextItem.childNode);
        }
      } else if (option === 'delete') {
        // 删除节点
        nextData = deleteFlowChartData(refData.current, item);
      }
      if (nextData) {
        handleFlowData(nextData);
        onChartChange(nextData);
      }
    },
    [onChartChange, onClick],
  );

  const onConfirm = useCallback(
    (values: MainDrawerFormValue) => {
      const { nodeId, type } = currentItem || {};
      let nextFlowData: FlowChartData = { ...refData.current };

      // 更新提交人节点数据
      if (type === 'start' && values.start) {
        const {
          starter: { value, content },
        } = values.start;
        nextFlowData = {
          ...nextFlowData,
          properties: {
            ...nextFlowData.properties,
            assignee: {
              key: FlowChartNodeAssigneeEnum.SPECIFIED_USER_ID,
              value,
            },
          },
          extra: {
            content,
          },
        };
      }

      // 更新审批人节点数据
      if (type === 'approver' && nodeId) {
        // 修改名称
        if (values.title) {
          const { name, hasBeenEdited } = values.title;
          const { assignee } = (values?.content as ApproverFormValue) || {};
          const currentName = getApproveTitleByAssignee(assignee, hasBeenEdited, name);
          nextFlowData = modifyFlowChartData(nextFlowData, nodeId, (current) => ({
            ...current,
            name: currentName,
          }));
        }
        // 修改配置
        if (values.content) {
          const {
            assignee: { key, value, content },
            taskEndMode,
            skipEnable,
          } = values.content as ApproverFormValue;
          nextFlowData = modifyFlowChartData(nextFlowData, nodeId, (current) => {
            return {
              ...current,
              properties: {
                ...current.properties,
                assignee: {
                  key,
                  value,
                },
                taskEndMode,
                skipEnable,
              },
              extra: {
                content,
              },
            };
          });
        }
      }

      // 更新抄送人节点数据
      if (type === 'notify' && nodeId) {
        // 修改名称
        if (values.title) {
          const { name } = values.title;
          nextFlowData = modifyFlowChartData(nextFlowData, nodeId, (current) => ({
            ...current,
            name,
          }));
        }
      }

      // 更新数据
      if (nextFlowData) {
        handleFlowData(nextFlowData);
        onChartChange(nextFlowData);
      }

      handleVisible(false);
    },
    [currentItem, onChartChange],
  );

  return (
    <>
      <FlowContainer data={flowData} onClick={onClick} onOptionClick={onOptionClick} />
      <MainDrawer
        visible={visible}
        data={currentItem}
        onConfirm={onConfirm}
        onClose={() => {
          handleVisible(false);
          handleCurrentItem(undefined);
        }}
      />
    </>
  );
};

export default FlowEditor;
