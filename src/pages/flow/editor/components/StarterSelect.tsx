/**
 * @date 2020-04-06
 * @description 发起人属性配置
 */

import React, { useCallback, useEffect, useState } from 'react';
import { TreeSelect } from 'antd';
import type { TreeSelectProps } from 'antd/lib/tree-select';

import type { UserListItem, UserTreeItem } from '@/pages/setting/user/data';
import { queryUsersWithDepartment } from '@/pages/setting/user/service';
import type { DepartmentItem } from '@/pages/setting/department/data';

import type { FlowAssigneeValueItem } from '../data';

const { TreeNode, SHOW_PARENT } = TreeSelect;

interface StarterFormProperties {
  starter: number[];
}

export type UserAndDepartmentItem = UserListItem | DepartmentItem;

interface Props<T = any> extends TreeSelectProps<T> {
  afterLoad?: (tree: UserTreeItem[], allList: UserAndDepartmentItem[]) => void;
}

interface StarterSelectProps extends React.FC<Props> {
  getUserIds: (selected: number[]) => FlowAssigneeValueItem[];
}

export const getValuesById = (
  treeData: UserTreeItem[],
  selectedIds: StarterFormProperties['starter'],
  selectAll?: boolean,
): FlowAssigneeValueItem[] => {
  return treeData.reduce((arr, { id, type, children }) => {
    const isSelected = selectAll || selectedIds.includes(id);
    if (type === 'folder' && children?.length) {
      return arr.concat(getValuesById(children, selectedIds, isSelected));
    }
    if (isSelected) {
      return arr.concat([{ id }]);
    }
    return arr;
  }, [] as FlowAssigneeValueItem[]);
};

const StarterSelect: StarterSelectProps = ({ afterLoad, ...selectProps }) => {
  const [treeData, handleTreeData] = useState<UserTreeItem[]>([]);

  const renderNode = useCallback((node: UserTreeItem) => {
    if (node.type === 'folder') {
      return (
        <TreeNode key={node.id} value={node.id} title={node.name}>
          {(node.children || []).map(renderNode)}
        </TreeNode>
      );
    }
    return <TreeNode key={node.id} value={node.id} title={node.name} />;
  }, []);

  useEffect(() => {
    queryUsersWithDepartment().then(({ data: tree, departments, users }) => {
      handleTreeData(tree);
      StarterSelect.getUserIds = (selected) => getValuesById(tree, selected);
      if (afterLoad) {
        afterLoad(tree, [...departments, ...users]);
      }
    });
  }, [afterLoad]);

  return (
    <TreeSelect
      style={{ width: '100%' }}
      showCheckedStrategy={SHOW_PARENT}
      placeholder="请选择发起人"
      treeDefaultExpandAll
      treeCheckable
      {...selectProps}
    >
      {treeData.map(renderNode)}
    </TreeSelect>
  );
};

StarterSelect.getUserIds = () => [];

export default StarterSelect;
