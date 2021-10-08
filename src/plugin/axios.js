import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import * as RootNavigation from '../navigation/RootNavigation';
import { BASE_URL } from 'react-native-dotenv';

import {
  KEY_STORAGE_TOKEN,
  KEY_STORAGE_ENTITY,
  KEY_STORAGE_LOCATION,
} from '../store/constant';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(
  async (config) => {
    let JWT_TOKEN = await AsyncStorage.getItem(KEY_STORAGE_TOKEN);
    if (JWT_TOKEN != null) {
      config.headers.Authorization = `Bearer ${JWT_TOKEN}`;
    }
    return config;
  },
  (error) => {
    console.warn('error');
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.status != 200) {
      if (response.statusText) {
        console.warn({
          message: response.statusText,
          description:
            'Something wrong, please contact your administrator. \n- ' +
            response.statusText +
            ' with code: ' +
            response.status,
          type: 'danger',
        });
      } else {
        console.warn({
          message: 'Error',
          description:
            'Something wrong, please contact your administrator. \n- ' +
            response.status,
          type: 'danger',
        });
      }
    }
    if (
      !response.data.success &&
      response.data.message == 'Access token is invalid'
    ) {
      AsyncStorage.multiRemove([
        KEY_STORAGE_TOKEN,
        KEY_STORAGE_ENTITY,
        KEY_STORAGE_LOCATION,
      ]).then(() => {
        RootNavigation.replace('Login');
      });
      response.data.message = 'Your session has expired';
    }
    return response;
  },
  (error) => {
    console.warn('axios error', error.message);
    if (typeof error.response != 'undefined' && error.response.status == 401) {
      console.warn({
        message: error.response.status.toString(),
        description: error.response.data.messages.join('. '),
        type: 'danger',
      });
      AsyncStorage.multiRemove([
        KEY_STORAGE_TOKEN,
        KEY_STORAGE_ENTITY,
        KEY_STORAGE_LOCATION,
      ]).then(() => {
        RootNavigation.replace('Login');
      });
    } else {
      if (typeof error.response.data.messages == 'object') {
        console.warn({
          message: 'Fatal Error',
          description: error.response.data.messages.join('\n'),
          type: 'danger',
        });
      } else {
        console.warn({
          message: 'Fatal Error',
          description:
            'Something wrong, please contact your administrator. \n- ' + error,
          type: 'danger',
        });
      }
    }

    throw new Error(
      typeof error.response != 'undefined'
        ? error.response
        : {
          data: {
            status: 500,
            message: error.message,
          },
        },
    );
  },
);

const $axios = axiosInstance;

export default $axios;
