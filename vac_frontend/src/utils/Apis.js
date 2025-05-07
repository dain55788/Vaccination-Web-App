import axios from 'axios';

let API_BASE_URL = 'http://192.168.1.36:8000/';

export const endpoints = {
  'login': '/o/token/',
  'register': '/users/',
  'current-user': '/users/current-user/',
  'appointment':'/appointments/',
  'vaccinetypes':'/vaccinetypes/',
  'campaign': '/campaigns/',
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