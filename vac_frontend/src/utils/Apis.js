import axios from 'axios';
import Constants from 'expo-constants';

const { BASE_URL } = Constants.expoConfig.extra;
let API_BASE_URL = BASE_URL;

export const endpoints = {
  'login': '/o/token/',
  'register': '/users/',
  'current-user': '/users/current-user/',
  'get-users': '/users/get-users/',
  'appointment': '/appointments/',
  'vaccine-categories': '/categories/',
  'appointment-bycitizen': (citizen_id) => `/appointments/by-citizen/?citizen_id=${citizen_id}`,
  'campaign': '/campaigns/',
  'vaccine': '/vaccines/',
  'appointmentvaccine': '/appointmentvaccines/',
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