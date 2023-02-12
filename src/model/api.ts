import igsRequest from './instance';

export const getAdList = async () => {
  return igsRequest.get('user/ad/list')
}

export const goLogin = async ({username, password}) => {
  return igsRequest.post(`doLogin?username=${username}&password=${password}`)
}