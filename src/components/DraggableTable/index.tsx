import React, { useMemo, useCallback } from 'react';
import arrayMove from 'array-move';
import {
  SortableContainer as SortableContainerHOC,
  SortableElement,
  SortableHandle,
  WrappedComponent,
} from 'react-sortable-hoc';
import { MenuOutlined } from '@ant-design/icons';
import ProTable, { ProTableProps } from '@ant-design/pro-table';

import styles from './styles.less';

interface Props extends ProTableProps<any, any> {
  dataSource: any[];
  renderDragBody?: WrappedComponent<any>;

  dragEnd(list: any[]): void;
}

const DragHandle = SortableHandle(() => <MenuOutlined style={{ marginLeft: 22, cursor: 'pointer', color: '#ccc' }} />);
const SortableContainer = SortableContainerHOC((props: any) => <tbody {...props} />);

export const DraggableTableColumns = (sort = 'sort', index = 'index') => [
  {
    title: '拖拽',
    dataIndex: sort,
    className: styles.dragVisible,
    render: () => <DragHandle />,
  },
  {
    title: '序号',
    dataIndex: index,
    valueType: 'index',
  },
];

const DraggableTable: React.FC<Props> = ({ dataSource, renderDragBody, dragEnd, ...restProps }) => {
  const SortableItem = useMemo(() => SortableElement(renderDragBody || ((props: any) => <tr {...props} />)), [
    renderDragBody,
  ]);

  const DraggableContainer = useCallback(
    (props: any) => (
      <SortableContainer
        useDragHandle
        helperClass={styles.rowDragging}
        onSortEnd={async ({ oldIndex, newIndex }: any) => {
          if (oldIndex !== newIndex) {
            const newList = arrayMove([...dataSource], oldIndex, newIndex).filter(Boolean);
            dragEnd(newList);
          }
        }}
        {...props}
      />
    ),
    [dataSource, dragEnd],
  );

  const DraggableBodyRow = useCallback(
    ({ className, style, ...rest }: any) => {
      const index = dataSource.findIndex((x) => x.key === rest['data-row-key']);
      if (index > -1) {
        return <SortableItem index={index} {...rest} />;
      }
      return null;
    },
    [dataSource],
  );

  return (
    <ProTable
      {...restProps}
      dataSource={dataSource}
      components={{
        body: {
          wrapper: DraggableContainer,
          row: DraggableBodyRow,
        },
      }}
    />
  );
};

export default DraggableTable;
