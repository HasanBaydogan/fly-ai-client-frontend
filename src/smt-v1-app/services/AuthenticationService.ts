import axios from 'axios';
import { baseURL } from './ApiConstants';
import Cookies from 'js-cookie';
import { removeCookies, setCookie } from './CookieService';

const api = () => {
  return axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
export const register = async user => {
  try {
    console.log(user)
    const response = await api().post('/auth/register', user);
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const validateEmailOTP = async (email: string, otp: string) => {
  try {
    const response = await api().post('/auth/verify/email', { otp, email });
    return response.data;
  } catch (err) {
    console.log(err);
  }
};
export const login = async (email: string, password: string) => {
  try {
    const response = await api().post('/auth/login', { email, password });
    return response.data;
  } catch (err) {
    console.log(err);
  }
};
export const forgetPassword = async (email: string) => {
  try {
    const response = await api().post('/auth/forget-password', { email });
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const verifyPassRefreshOTP = async (
  email: string,
  otp: string,
  clientValidationOTP: string
) => {
  try {
    const response = await api().post('/auth/verify/password-refresh-otp', {
      email,
      otp,
      clientValidationOTP
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const refreshPassword = async (
  email: string,
  secret: string,
  newPassword: string
) => {
  try {
    const response = await api().post('/auth/refresh-password', {
      email,
      secret,
      newPassword
    });
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

export const validateAccessToken = async () => {
  try {
    const access_token = Cookies.get('access_token');
    const response = await api().post('/auth/validate-access-token', {
      access_token
    });
    if (response.data.statusCode === 200) {
      // 200 Success
      window.location.assign('/pi/list');
    } else if (response.data.statusCode === 401) {
      // 401 Invalid Token
      removeCookies();
    } else if (response.data.statusCode === 498) {
      const refresh_token = Cookies.get('refresh_token');
      const refreshTokenresponse = await api().post('/auth/refresh-token', {
        refresh_token
      });
      if (refreshTokenresponse.data.statusCode === 200) {
        setCookie('access_token', refreshTokenresponse.data.data.access_token);
        setCookie(
          'refresh_token',
          refreshTokenresponse.data.data.refresh_token
        );
        window.location.assign('/pi/list');
      } else {
        removeCookies();
      }
    } else if (response.data.statusCode === 404) {
      removeCookies();
    } else {
      removeCookies();
    }
  } catch (err) {
    console.log(err);
    removeCookies();
  }
};
