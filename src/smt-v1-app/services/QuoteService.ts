import axios from 'axios';
import { baseURL } from './ApiConstants';
import Cookies from 'js-cookie';
import { setCookie } from './CookieService';
import { SaveRFQ } from 'smt-v1-app/components/features/RFQRightSide/RFQRightSideComponents/RFQRightSideHelper';

const api = () => {
  return axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};


export const getQuoteDetailsById = async (quoteId: string) => {
  try {
    const accessToken = Cookies.get('access_token');
    const headers = {};
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    } else {
      window.location.assign('/');
    }
    
    const rfqResponse = await api().get( `/quote/id/${quoteId}`, {
      headers
    });
    if (rfqResponse.data.statusCode === 200) {
      return rfqResponse.data;
    } else if (rfqResponse.data.statusCode === 498) {
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
          let rfqMailResponseAfterRefresh = await api().post(
            `/quote/id/${quoteId}`,
            {
              headers: {
                Authorization: `Bearer ${refreshTokenresponse.data.accessToken}`
              }
            }
          );

          return rfqMailResponseAfterRefresh.data;
        } else if (refreshTokenresponse.data.statusCode === 498) {
          // Expired Refresh Token
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
          window.location.assign('/');
        } else if (refreshTokenresponse.data.statusCode === 411) {
          // Invalid Refresh Token
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
          window.location.assign('/');
        } else if (refreshTokenresponse.data.statusCode === 404) {
          console.log('User not found');
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
          window.location.assign('/');
        }
      } catch (err) {
        console.log(err);
      }
    } else if (rfqResponse.data.statusCode === 404) {
      window.location.assign('/404');
    }
  } catch (err) {
    console.log('RFQ All Clients Permission Error');
  }
};

