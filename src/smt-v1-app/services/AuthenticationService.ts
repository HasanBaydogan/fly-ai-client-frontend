import axios from 'axios';
import { baseURL } from './ApiConstants';

const api = () => {
  return axios.create({
    baseURL: baseURL,
    timeout: 5000,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
export const register = async user => {
  try {
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
