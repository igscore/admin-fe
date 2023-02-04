import React from 'react';
import { Switch } from 'antd';
import cacheMng from '@/managers/cacheMng';
import styles from './index.less';

const onSwitchChange = (checked: boolean) => {
  cacheMng.setItem('mock', checked);
  setTimeout(() => {
    window.location.reload();
  }, 800);
};

// @ts-ignore
const MockSwitch: React.FC = () => {
  const defaultChecked = cacheMng.getItem('mock', false);
  return (
    REACT_APP_ENV === 'dev' && (
      <Switch
        className={styles.switch}
        unCheckedChildren="off"
        checkedChildren="mock"
        defaultChecked={defaultChecked}
        onChange={onSwitchChange}
      />
    )
  );
};

export default MockSwitch;
