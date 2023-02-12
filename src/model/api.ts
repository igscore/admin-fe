import igsRequest from './instance';
import axios from 'axios';

export const getAdList = async () => {
  // axios.post('https://api.igscore.com:8080/v1/common/match/live/count', {"noGameType":true,"lang":"en","timeZone":"+08:00","platform":"web","agentType":null,"appVersion":null,"sign":null})
  // return igsRequest.get('user/ad/list')
  return {"code":"A00000","message":"Success.","result":[{"id":470972,"name":"abcd","country":"CN","client":"123","platform":"web","position":"homepage","length":300,"width":100,"status":1,"imageUrl":"http://fasdfasf","description":"web home page","modifiedBy":"igscore","createdBy":"igscore","startTime":1672924629,"endTime":1794431829},{"id":470973,"name":"test","country":"CN","client":"123","platform":"ios","position":"homepage","length":300,"width":100,"status":1,"imageUrl":"http://fasdfasf","description":"web home page","modifiedBy":"igscore","createdBy":"igscore","startTime":1672924629,"endTime":1794431829},{"id":471074,"name":"test","country":"CN","client":"123","platform":"ios","position":"homepage","length":300,"width":100,"status":0,"imageUrl":"http://fasdfasf","description":"web home page","modifiedBy":"igscore","createdBy":"igscore","startTime":1672924629,"endTime":1704431829}],"server_time":1676203808}
}

export const goLogin = async ({username, password}: any) => {
  return igsRequest.post(`doLogin?username=admin&password=igscoreAdmin`)
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

export const getAdDetail = async (id) => {
  return {"code":"A00000","message":"Success.","result":{"id":470972,"name":"abcd","country":"CN","client":"123","platform":"web","position":"homepage","length":300,"width":100,"status":1,"imageUrl":"http://fasdfasf","description":"web home page","modifiedBy":"igscore","createdBy":"igscore","startTime":1672924629,"endTime":1794431829},"server_time":1676205155}
  return  igsRequest.get(`user/ad/${id}`)
}
