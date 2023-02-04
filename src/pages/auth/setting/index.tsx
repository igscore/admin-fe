import React, { useMemo, useState } from 'react';
import { Tabs, Card } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import { getPageQuery } from '@/utils/utils';

import EditAuth from './EditAuth';
import EditRole from './EditRole';
import EditUser from './EditUser';

import styles from './index.less';

const { TabPane } = Tabs;

const SettingPages = [
  { key: 'auth', tab: '权限管理', component: <EditAuth /> },
  { key: 'role', tab: '角色管理', component: <EditRole /> },
  { key: 'user', tab: '角色授权', component: <EditUser /> },
];

const MenuSetting: React.FC = () => {
  const initialTab = useMemo(() => {
    const query = getPageQuery();
    return (query.tab as string) || 'auth';
  }, []);
  const [activeKey, handleActiveKey] = useState<string>(initialTab);

  return (
    <PageHeaderWrapper>
      <Card bordered={false} bodyStyle={{ padding: 0 }}>
        <Tabs
          className={styles.settingTabs}
          defaultActiveKey={initialTab}
          onChange={(key) => handleActiveKey(key)}
        >
          {SettingPages.map(({ key, tab, component }) => (
            <TabPane key={key} tab={tab}>
              {key === activeKey && component}
            </TabPane>
          ))}
        </Tabs>
      </Card>
    </PageHeaderWrapper>
  );
};

export default MenuSetting;
