import axios from 'axios';

let API_BASE_URL = 'http://10.17.65.27:8000/';

export const endpoints = {
  'login': '/o/token/',
  'register': '/users/',
  'current-user': '/users/current-user/'
};

export const authApis = (token) => {
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}

export default axios.create({
  baseURL: API_BASE_URL
})