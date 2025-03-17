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

export const openAttachment = async (attachmentId: string) => {
  try {
    const access_token = Cookies.get('access_token');
    const headers = {};
    if (access_token) {
      headers['Authorization'] = `Bearer ${access_token}`;
    } else {
      window.location.assign('/');
    }

    const attachmentResp = await api().get(`/attachment/id/${attachmentId}`, {
      headers
    });

    // console.log('attachmentResp', attachmentResp);
    if (attachmentResp.data.statusCode === 200) {
      return attachmentResp.data;
    } else if (attachmentResp.data.statusCode === 498) {
      // Expired JWT
      try {
        const refreshTokenresponse = await api().post('/auth/refresh-token', {
          refresh_token: Cookies.get('refresh_token')
        });

        if (refreshTokenresponse.data.statusCode === 200) {
          setCookie(
            'access_token',
            refreshTokenresponse.data.data.access_token
          );
          setCookie(
            'refresh_token',
            refreshTokenresponse.data.data.refresh_token
          );
          let attachmentlResponseAfterRefresh = await api().get(
            `/attachment/id/${attachmentId}`,
            {
              headers: {
                Authorization: `Bearer ${refreshTokenresponse.data.data.access_token}`
              }
            }
          );
          return attachmentlResponseAfterRefresh.data;
        } else if (refreshTokenresponse.data.statusCode === 411) {
          // Invalid Refresh Token
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
          window.location.assign('/');
        } else if (refreshTokenresponse.data.statusCode === 498) {
          // Expired Refresh Token
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
          window.location.assign('/');
        } else if (refreshTokenresponse.data.statusCode === 404) {
          console.log('User not found');
        }
      } catch (err) {
        console.log(err);
      }
    } else if (attachmentResp.data.statusCode === 401) {
      // Unauthorize
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      window.location.assign('/');
    }
  } catch (err) {
    console.log('RFQMail Permission Error');
  }
};
