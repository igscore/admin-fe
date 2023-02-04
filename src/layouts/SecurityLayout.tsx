import React, { useEffect, useState } from 'react';
import { stringify } from 'querystring';
import { connect, Redirect } from 'umi';
import { PageLoading } from '@ant-design/pro-layout';

import { ConnectState, ConnectProps } from '@/models/connect';
import { CurrentUser } from '@/models/user';
import cacheMng from '@/managers/cacheMng';

// @ts-ignore
window.REACT_APP_TIME = REACT_APP_TIME;

interface Props extends ConnectProps {
  loading?: boolean;
  currentUser?: Partial<CurrentUser>;
}

const SecurityLayout: React.FC<Props> = ({ dispatch, children, loading, currentUser }) => {
  const [isReady, handleIsReady] = useState<boolean>(false);

  useEffect(() => {
    if (dispatch) {
      dispatch({ type: 'user/queryCurrentCompany' });
      dispatch({ type: 'user/fetchCurrent' });
    }
    handleIsReady(true);
  }, []);

  const isLogin = !!currentUser?.id || !!cacheMng.getItem('token');
  // const isLogin = !!currentUser?.id || !!cacheMng.getCookie('token');

  if ((!isLogin && !loading) || !isReady) {
    return <PageLoading />;
  }

  if (!isLogin && window.location.pathname !== '/user/login') {
    const queryString = stringify({ redirect: window.location.href });
    return <Redirect to={`/user/login?${queryString}`} />;
  }

  return <>{children}</>;
};

export default connect(({ user, loading }: ConnectState) => ({
  currentUser: user.currentUser,
  loading: loading.models.user,
}))(SecurityLayout);
