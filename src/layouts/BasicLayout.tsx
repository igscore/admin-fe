import React, { useCallback, useEffect, useMemo, useState } from 'react';
import type { Dispatch } from 'umi';
import { connect, Link, history } from 'umi';
import { ConfigProvider } from 'antd';
import { Icon } from '@ant-design/compatible';
import zhCN from 'antd/es/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import type { BasicLayoutProps as ProLayoutProps, MenuDataItem, Settings } from '@ant-design/pro-layout';
import ProLayout from '@ant-design/pro-layout';
import RightContent from '@/components/GlobalHeader/RightContent';
import type { ConnectState } from '@/models/connect';
import { querySysLevelMenus } from '@/services/menuSysLevel';
import logo from '@/assets/logo.svg';

// 设置系统语言
moment.locale('zh-cn');

export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: Record<string, MenuDataItem>;
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
  dispatch: Dispatch;
}

// const noMatch = (
//   <Result
//     status={403}
//     title="403"
//     subTitle="对不起，您没有权限访问当前页面"
//     extra={
//       <Button type="primary">
//         <Link to="/user/login">去登录</Link>
//       </Button>
//     }
//   />
// );

// const footerRender: BasicLayoutProps['footerRender'] = () => {
//   return (
//     <DefaultFooter
//       copyright="2020 上海三头牛科技有限公司出品"
//       links={[
//         {
//           key: 'yiqi-oa',
//           title: '易企管理后台',
//           href: 'http://www.yiqioa.com',
//           blankTarget: true,
//         },
//       ]}
//     />
//   );
// };

const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const {
    dispatch,
    children,
    collapsed,
    settings,
    location = {
      pathname: '/',
    },
  } = props;
  const initOpenKeys = useMemo(() => {
    if (location.pathname && location.pathname.length > 1) {
      return [location.pathname.split('/').slice(0, -1).join('/')];
    }
    return [];
  }, [location]);
  const [loading, handleLoading] = useState<boolean>(true);
  const [menuData, handleMenuData] = useState<MenuDataItem[]>([]);
  const [openKeys, handleOpenKeys] = useState<string[]>(initOpenKeys);

  const menuDataRender = (menus: MenuDataItem[]): MenuDataItem[] => {
    return menus.map((menu) => {
      const { icon, ...item } = menu;

      let fixPath = item.path;
      if (!fixPath) {
        const child = item.children?.length ? item.children.find(({ path }) => !!path) : null;
        if (child) {
          fixPath = child.path?.split('/').slice(0, -1).join('/');
        }
      }

      return {
        ...item,
        path: fixPath,
        icon: icon && <Icon type={icon as string} />,
        children: item.children?.length ? menuDataRender(item.children) : [],
      };
    });
  };

  const onMenuCollapse = useCallback(
    (payload: boolean): void => {
      if (dispatch) {
        dispatch({
          type: 'global/changeLayoutCollapsed',
          payload,
        });
      }
    },
    [dispatch],
  );

  useEffect(() => {
    querySysLevelMenus().then(({ data }) => {
      if (data?.length) {
        handleMenuData(data[0]?.children[0]?.children || []);
      }
      handleLoading(false);
    });
  }, []);

  return (
    <ConfigProvider locale={zhCN}>
      <ProLayout
        {...settings}
        locale="zh-CN"
        logo={logo}
        menu={{ loading }}
        collapsed={collapsed}
        onCollapse={onMenuCollapse}
        rightContentRender={() => <RightContent />}
        onMenuHeaderClick={() => history.push('/home')}
        menuDataRender={() => menuDataRender(menuData)}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path) {
            return defaultDom;
          }
          return <Link to={menuItemProps.path}>{defaultDom}</Link>;
        }}
        breadcrumbRender={(routers = []) => [
          {
            path: '/home',
            breadcrumbName: '首页',
          },
          ...routers,
        ]}
        itemRender={(r, params, routes, paths) => {
          return routes.indexOf(r) === 0 ? (
            <Link to={paths.join('/home')}>{r.breadcrumbName}</Link>
          ) : (
            <span>{r.breadcrumbName}</span>
          );
        }}
        menuProps={{
          openKeys,
          onOpenChange: (keys) => {
            if (Array.isArray(keys)) {
              handleOpenKeys(keys as string[]);
            }
          },
        }}
      >
        {children}
      </ProLayout>
    </ConfigProvider>
  );
};

export default connect(({ global, settings }: ConnectState) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
