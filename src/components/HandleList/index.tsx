import React, { useCallback, useMemo, useState } from 'react';
import cls from 'classnames';
import FuzzySearch from 'fuse.js';
import { DeleteOutlined, EditOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons';
import { Input, Button, List, Dropdown, Menu, message, Modal, Typography } from 'antd';
import Flex from '@/components/Flex';

import styles from './index.less';

const { Text } = Typography;
const { Search } = Input;

export interface ListItemInfo {
  listId: number;
  listName: string;
  raw: any;
}

interface IProps {
  list: ListItemInfo[];
  label: string;
  showHeader?: boolean;
  showDelete?: boolean;
  onHandle?(type: HandleOptionType, selectedId?: number): void;
  onSelect(item: ListItemInfo): void;
}

export type HandleOptionType = 'add' | 'update' | 'delete';

const HandleList: React.FC<IProps> = props => {
  const { list, showHeader = true, showDelete = true, onHandle = () => {} } = props;
  const [selectedId, handleSelectedId] = useState<number>();
  const [searchList, handleSearchList] = useState<IProps['list']>();

  const fuseIns = useMemo(() => {
    return new FuzzySearch<ListItemInfo>(list, {
      keys: ['listName'],
    });
  }, [list]);

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const newList = fuseIns.search(e.target.value);
      handleSearchList(newList.map(({ item }) => item));
    } else {
      handleSearchList(undefined);
    }
  };

  const onSelect = useCallback((item: ListItemInfo) => {
    handleSelectedId(item.listId);
    props.onSelect(item);
  }, []);

  const onAdd = useCallback(() => {
    handleSelectedId(undefined);
    onHandle('add');
  }, []);

  const onEdit = useCallback((item: ListItemInfo, e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    onHandle('update', item.listId);
  }, []);

  const onMenuClick = ({ key }: any) => {
    if (selectedId) {
      const type = key as HandleOptionType;
      if (type === 'delete') {
        const selectedItem = props.list.find(i => i.listId === selectedId);
        Modal.confirm({
          content: `确定删除“${selectedItem && selectedItem.listName}”${props.label}？`,
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            onHandle(type, selectedId);
            handleSelectedId(undefined);
          },
        });
      } else {
        onHandle(type, selectedId);
      }
    } else {
      message.warn(`请先选择${props.label}`);
    }
  };

  const MenuComponent = (
    <Menu onClick={onMenuClick}>
      <Menu.Item key="update">
        <EditOutlined style={{ marginRight: 5 }} />
        修改{props.label}
      </Menu.Item>
      {showDelete && (
        <Menu.Item key="delete">
          <DeleteOutlined style={{ marginRight: 5 }} />
          删除{props.label}
        </Menu.Item>
      )}
    </Menu>
  );

  return (
    <List
      className={cls(styles.handleList, !showHeader && styles.withoutOption)}
      size="small"
      dataSource={!searchList ? list : searchList}
      header={
        <>
          {showHeader && (
            <Flex justify="space-between" style={{ marginBottom: 15 }}>
              <Button onClick={onAdd}>
                <PlusOutlined />
                新增{props.label}
              </Button>
              <Dropdown overlay={MenuComponent}>
                <Button type="link" style={{ padding: 0 }}>
                  <SettingOutlined />
                </Button>
              </Dropdown>
            </Flex>
          )}
          <Search placeholder={`搜索指定${props.label}`} onChange={onSearch} />
        </>
      }
      renderItem={item => {
        const isSelected = item.listId === selectedId;
        return (
          <List.Item
            className={styles.item}
            style={isSelected ? { background: '#bae7ff' } : {}}
            onClick={() => onSelect(item)}
          >
            <Flex className={styles.itemRow} justify="space-between" aligns="center">
              <Text className={styles.itemName}>{item.listName}</Text>
              {showHeader && (
                <Button
                  className={styles.editBtn}
                  style={{ display: isSelected ? 'inline-block' : 'none' }}
                  type="link"
                  size="small"
                  onClick={e => onEdit(item, e)}
                >
                  <EditOutlined />
                </Button>
              )}
            </Flex>
          </List.Item>
        );
      }}
    />
  );
};

export default HandleList;
