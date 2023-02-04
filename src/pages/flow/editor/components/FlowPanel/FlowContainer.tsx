/**
 * @author liuzhimeng
 * @date 2020-04-06
 * @description 流程模板
 */

import React, { useCallback } from 'react';
import FlowItem from './FlowItem';
import type { FlowChartData, FlowChartCreationType } from '../../data';

import styles from './FlowContainer.less';

interface Props {
  data?: FlowChartData;
  onClick: (item: FlowChartData) => void;
  onOptionClick: (option: 'add' | 'delete', item: FlowChartData, type?: FlowChartCreationType) => void;
}

// 流程结束节点
const FlowNodeEnd: React.FC = () => (
  <div className={styles.endNode}>
    <div className={styles.endNodeCircle} />
    <div className={styles.endNodeText}>流程结束</div>
  </div>
);

const FlowContainer: React.FC<Props> = ({ data, onClick, onOptionClick }) => {
  const onStopDelete = useCallback(
    (item: FlowChartData, e: React.MouseEvent<HTMLElement, MouseEvent>) => {
      e.stopPropagation();
      onOptionClick('delete', item);
    },
    [onOptionClick],
  );

  const renderFlowItem = useCallback(
    (item: FlowChartData): React.ReactElement => {
      const { nodeId, childNode } = item;

      if (nodeId === 'flow-end') {
        return <FlowNodeEnd />;
      }

      return (
        <>
          <FlowItem
            key={nodeId}
            data={item}
            onClick={() => onClick(item)}
            onDelete={(e) => onStopDelete(item, e)}
            onTypeClick={(type) => onOptionClick('add', item, type)}
          />
          {!!childNode && renderFlowItem(childNode)}
        </>
      );
    },
    [onClick, onOptionClick, onStopDelete],
  );

  return <div className={styles.container}>{!!data && <div className={styles.list}>{renderFlowItem(data)}</div>}</div>;
};

export default FlowContainer;
