import React, { useCallback } from 'react';
import type { Dispatch } from 'umi';
import { connect } from 'umi';
import type { LoginParamsType } from '@/services/login';
import type { ConnectState } from '@/models/connect';
import type { StateType } from '@/models/login';
import MockSwitch from '@/components/GlobalHeader/MockSwitch';
import LoginFrom from './components/Login';
import styles from './style.less';

const { Company, UserName, Password, Submit } = LoginFrom;

interface Props {
  dispatch: Dispatch;
  userLogin: StateType;
  company?: ConnectState['user']['currentCompany'];
  submitting?: boolean;
}

const Login: React.FC<Props> = ({ company, submitting, dispatch }) => {
  const onLogin = useCallback(
    (payload: LoginParamsType) => {
      dispatch({
        type: 'login/login',
        payload,
      });
    },
    [dispatch],
  );

  return (
    <div className={styles.main}>
      {/* 通过 ./Login/map.tsx 编辑 */}
      <LoginFrom activeKey="account" onSubmit={onLogin}>
        {!!company?.id && <Company name="tenantId" defaultValue={String(company.id)} hidden />}
        <UserName name="account" />
        <Password name="password" />
        <Submit loading={submitting}>登录</Submit>
        <div style={{ float: 'right' }}>
          <MockSwitch />
        </div>
      </LoginFrom>
    </div>
  );
};

export default connect(({ login, user, loading }: ConnectState) => ({
  userLogin: login,
  company: user.currentCompany,
  submitting: loading.effects['login/login'],
}))(Login);
