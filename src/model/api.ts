import igsRequest from './instance';
import axios from 'axios';

export const getAdList = async () => {
  // axios.post('https://api.igscore.com:8080/v1/common/match/live/count', {"noGameType":true,"lang":"en","timeZone":"+08:00","platform":"web","agentType":null,"appVersion":null,"sign":null})
  return igsRequest.get('user/ad/list')
}

export const goLogin = async ({username, password}: any) => {
  return igsRequest.post(`doLogin?username=${username}&password=${password}`)
}

export const createAd = async (params: any) => {
  return igsRequest.post(
    'user/ad/create',
    Object.assign(params, {
      "modifiedBy": "igAdmin",
      "createdBy": "igAdmin",
      status: 1
    })
  )
}

export const updateAd = async (params) => {
  return igsRequest.post(
    'user/ad/update',
    Object.assign(params, {
      "modifiedBy": "igAdmin",
      "createdBy": "igAdmin"
    })
  )
}

export const getAdDetail = async (id) => {
  // return {"code":"A00000","message":"Success.","result":{"id":470972,"name":"abcd","country":"CN","client":"123","platform":"web","position":"homepage","length":300,"width":100,"status":1,"imageUrl":"http://fasdfasf","description":"web home page","modifiedBy":"igscore","createdBy":"igscore","startTime":1672924629,"endTime":1794431829},"server_time":1676205155}
  return  igsRequest.get(`user/ad/${id}`)
}


export const goLogout = async () => {
  return igsRequest.post('logout')
}