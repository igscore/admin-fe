import React, { useCallback, useEffect, useRef, useState } from 'react';
import cls from 'classnames';
import { Button, Col, message, Modal, Radio, Row, Tree, Typography } from 'antd';
import { ColProps } from 'antd/lib/col';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

import { queryAppLevelMenus, SysMenuTypeEnum } from '@/services/menuAppLevel';
import { AppLevelMenuTreeItem } from '@/models/menuAppLevel';

import Flex from '@/components/Flex';
import HandleList, { HandleOptionType, ListItemInfo } from '@/components/HandleList';

import AuthModal from './AuthModal';
import { askToDeleteAuth, askToHandleMenuOfAuth, queryMenusOfAuth, queryAuthList } from '../service';

import { MenuAuthInfo } from '../data';
import styles from './index.less';

interface MenuTreeNodeInfo {
  menu: AppLevelMenuTreeItem;
  children?: MenuTreeNodeInfo[];
  beBound?: boolean;
}

const { Text } = Typography;

const { DirectoryTree, TreeNode } = Tree;
const ColLayout: ColProps = {
  style: {
    height: '100%',
    padding: '0px 20px 10px',
    borderRight: '1px solid #ccc',
    overflow: 'auto',
  },
};

const getTreeResourceIds = (menus: AppLevelMenuTreeItem[]) =>
  menus.reduce((ids, { id, children }) => {
    if (id) {
      ids.push(id);
    } else if (children) {
      // eslint-disable-next-line no-param-reassign
      ids = ids.concat(getTreeResourceIds(children));
    }
    return ids;
  }, [] as number[]);

const isAllBeBound = (menuIds: number[], boundIds: number[]) => {
  // eslint-disable-next-line no-restricted-syntax
  for (const id of menuIds) {
    if (!boundIds.includes(id)) {
      return false;
    }
  }
  return true;
};

const EditAuth: React.FC = () => {
  const authList = useRef<MenuAuthInfo[]>([]);
  const [menuTree, handleMenuTree] = useState<AppLevelMenuTreeItem[]>();
  const [listData, handleListData] = useState<ListItemInfo[]>([]);
  const [curMenuIds, handleMenuIds] = useState<number[]>([]);
  const [selectedAuth, handleSelectedAuth] = useState<MenuAuthInfo>();
  const [selectedMenuKey, handleSelectedMenuKey] = useState<string>();
  const [modalVisible, handleModalVisible] = useState<boolean>(false);
  const [checked, handleChecked] = useState<boolean>(false);

  const fetchList = useCallback(() => {
    queryAppLevelMenus().then(({ data }) => {
      handleMenuTree(data);
    });
    queryAuthList().then((auths) => {
      const list: ListItemInfo[] = auths.map((item) => ({
        listId: item.id,
        listName: item.name,
        raw: item,
      }));
      authList.current = auths;
      handleListData(list);
    });
  }, []);

  const filterBoundMenus = useCallback(
    (
      raws: AppLevelMenuTreeItem[],
      currentMenuIds: number[],
    ): {
      menus: MenuTreeNodeInfo[];
      showParent: boolean;
    } => {
      const { length } = raws;
      const menus: MenuTreeNodeInfo[] = [];
      let showParent = true;

      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < length; i++) {
        const menu = raws[i];

        if (!menu) {
          break;
        }

        const { type, id, children: childList } = menu;
        let nextResIds = currentMenuIds;
        let children: MenuTreeNodeInfo[] | undefined;
        let beBound: boolean | undefined;
        let showSelf = true;

        if (type === SysMenuTypeEnum.Folder) {
          const childMenus = filterBoundMenus(childList || [], nextResIds);
          children = childMenus.menus;
          if (checked) {
            showSelf = !!childMenus.menus.length && childMenus.showParent;
          }
        } else {
          nextResIds = currentMenuIds.filter((curId) => curId !== id);
          // 是否已被绑定到当前权限上
          beBound = nextResIds.length !== currentMenuIds.length;
          if (checked) {
            showSelf = beBound;
          }
        }

        if (showSelf) {
          menus.push({ menu, children, beBound });
        }

        showParent = showParent || showSelf;
      }

      return {
        menus,
        showParent,
      };
    },
    [checked],
  );

  const onHandle = async (type: HandleOptionType, selectedId?: number) => {
    if (type === 'add') {
      handleModalVisible(true);
      handleSelectedAuth(undefined);
    } else if (type === 'delete' && selectedId) {
      const result = await askToDeleteAuth(selectedId);
      if (result) {
        message.success('权限删除成功');
        await fetchList();
      }
    } else if (type === 'update') {
      const current = authList.current.find((i) => i.id === selectedId);
      if (current) {
        handleModalVisible(true);
        handleSelectedAuth(current);
      }
    }
  };

  const onAuthSelect = async (current: MenuAuthInfo) => {
    handleSelectedAuth(current);
    const curIds = await queryMenusOfAuth(current.id);
    handleMenuIds(curIds);
  };

  // 点击菜单，绑定/解绑权限
  const onMenuEdit = useCallback(
    (e: React.MouseEvent<HTMLElement, MouseEvent>, menu: AppLevelMenuTreeItem, beBound?: boolean) => {
      if (selectedAuth) {
        const { id: listId, name: listName } = selectedAuth;
        // 节点数据
        if (menu) {
          const { name, type, id, children } = menu;
          let resIds: number[] = [];
          let title = '';

          // 单独某个节点
          if (type === SysMenuTypeEnum.Node && id) {
            resIds = [id];
            if (beBound) {
              title = `确定将“${name}”菜单从“${listName}”权限中解绑”？`;
            } else {
              title = `确定将“${name}”菜单绑定到“${listName}”权限？`;
            }
          }

          // 某个文件夹
          if (type === SysMenuTypeEnum.Folder && children?.length) {
            resIds = getTreeResourceIds(children);
            // eslint-disable-next-line no-param-reassign
            beBound = isAllBeBound(resIds, curMenuIds);
            if (beBound) {
              title = `确定将“${name}”内所有子菜单从“${listName}”中解绑？`;
            } else {
              title = `确定将“${name}”内所有子菜单绑定到“${listName}”？`;
            }
          }

          if (resIds.length) {
            Modal.confirm({
              title,
              okText: '确定',
              cancelText: '取消',
              onOk: async () => {
                const success = await askToHandleMenuOfAuth({
                  permissionId: listId,
                  [beBound ? 'del' : 'add']: resIds,
                });
                if (success && selectedAuth) {
                  await onAuthSelect(selectedAuth);
                }
              },
            });
          } else {
            message.warn('当前没有可编辑的菜单');
          }
        }
      } else {
        message.warn('请先选择要绑定的权限');
      }
    },
    [selectedAuth, curMenuIds],
  );

  const onAddAuthOk = useCallback(() => {
    handleModalVisible(false);
    fetchList();
  }, []);

  const onMenuSelect = useCallback((selectedKeys: string[]) => {
    handleSelectedMenuKey(selectedKeys.length ? selectedKeys[0] : undefined);
  }, []);

  const menuNodeRender = useCallback(
    ({ menu, beBound, children }: MenuTreeNodeInfo) => {
      const { id, name, type, hideInMenu } = menu;

      if (hideInMenu) return null;

      const key = String(id);
      const isLeaf = type === SysMenuTypeEnum.Node;
      const toBound = !isLeaf || !!beBound;
      return (
        <TreeNode
          key={key}
          className={cls(styles.treeNode, !toBound && styles.treeNodeDisabled)}
          isLeaf={isLeaf}
          title={
            <>
              <Text>{name}</Text>
              <Button
                className={styles.treeNodeEdit}
                style={selectedMenuKey === key ? { display: 'inline-block' } : {}}
                type="link"
                size="small"
                onClick={(e) => onMenuEdit(e, menu, beBound)}
              >
                {toBound ? <EyeInvisibleOutlined style={{ color: '#ccc' }} /> : <EyeOutlined />}
              </Button>
            </>
          }
        >
          {!isLeaf && children ? children.map(menuNodeRender) : undefined}
        </TreeNode>
      );
    },
    [selectedAuth, selectedMenuKey, curMenuIds],
  );

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <Row className={styles.editAuth}>
      <Col span={6} {...ColLayout}>
        <HandleList label="权限" list={listData} onHandle={onHandle} onSelect={({ raw }) => onAuthSelect(raw)} />
      </Col>
      <Col span={6} {...ColLayout}>
        <Radio.Group
          style={{ marginBottom: 15, marginTop: 12 }}
          buttonStyle="solid"
          defaultValue={false}
          value={checked}
          onChange={(e) => handleChecked(!!e.target.value)}
        >
          <Radio.Button value={false}>显示全部</Radio.Button>
          <Radio.Button value disabled={!selectedAuth}>
            显示绑定
          </Radio.Button>
        </Radio.Group>
        {!!menuTree && (
          <DirectoryTree onSelect={onMenuSelect as any} expandAction={false} defaultExpandAll>
            {menuTree.map((rootMenu) => {
              const { children, hideInMenu } = rootMenu;

              if (hideInMenu) return null;

              let treeList: MenuTreeNodeInfo[] = [];
              if (children?.length) {
                const treeData = filterBoundMenus(children, curMenuIds);
                treeList = treeData.menus;
              }
              return menuNodeRender({
                menu: rootMenu,
                children: treeList,
              });
            })}
          </DirectoryTree>
        )}
      </Col>
      <Col span={12}>
        <Flex style={{ width: '100%', height: '100%' }} justify="center" aligns="center">
          <Typography.Text>请在左侧配置权限，点击菜单可绑定/解绑对应权限</Typography.Text>
        </Flex>
      </Col>
      <AuthModal
        visible={modalVisible}
        data={selectedAuth}
        onOk={onAddAuthOk}
        onClose={() => handleModalVisible(false)}
      />
    </Row>
  );
};

export default EditAuth;
