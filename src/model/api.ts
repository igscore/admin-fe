import igsRequest from './instance';

export const getAdList = async () => {
  return igsRequest.get('user/ad/list')
}

export const goLogin = async ({username, password}: any) => {
  return igsRequest.post(`doLogin?username=${username}&password=${password}`)
}

export const createAd = async (params: any) => {
  return igsRequest.post(
    'user/ad/create',
    {
      "name": "abc",
      "country": "CN",
      "client": "123",
      "platform": "web",
      "position": "homepage",
      "length": 300,
      "width": 100,
      "status": 0,
      "imageUrl": "http://fasdfasf",
      "description": "web home page",
      "modifiedBy": "igscore",
      "createdBy": "igscore",
      "startTime": 1672924629,
      "endTime": 1704431829
    }
  )
}
