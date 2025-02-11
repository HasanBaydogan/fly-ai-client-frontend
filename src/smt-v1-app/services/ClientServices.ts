import axios from 'axios';
import { baseURL } from './ApiConstants';
import Cookies from 'js-cookie';
import { setCookie } from './CookieService';
import {
  Certypes,
  SupplierStatus
} from 'smt-v1-app/components/features/SupplierList/SupplierListTable/SearchBySupplierListMock';
import { FormattedContactData } from 'smt-v1-app/components/features/NewClient/NewClientContact/ContactListSection';
export interface TreeNode {
  segmentId: string;
  segmentName: string;
  isSelected?: boolean;
  subSegments: TreeNode[];
}

const api = () => {
  return axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

//  ---     GET     ---

export const getbyCurrencyController = async () => {
  try {
    const accessToken = Cookies.get('access_token');
    const headers = {};
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    } else {
      window.location.assign('/');
    }

    const CurrencyController = await api().get(`/currency/all`, {
      headers
    });
    console.log('SupplierId Get Response', CurrencyController);

    if (CurrencyController.data.statusCode === 200) {
      return CurrencyController.data;
    } else if (CurrencyController.data.statusCode === 498) {
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
          let rfqMailResponseAfterRefresh = await api().get(`/currency/all`, {
            headers: {
              Authorization: `Bearer ${refreshTokenresponse.data.accessToken}`
            }
          });

          return rfqMailResponseAfterRefresh.data;
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
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
          window.location.assign('/');
        }
      } catch (err) {
        console.log(err);
      }
    } else if (CurrencyController.data.statusCode === 401) {
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      window.location.assign('/');
    }
  } catch (err) {
    console.log('SegmentDetailList Permission Error');
  }
};

export const getByMarginTable = async () => {
  try {
    const accessToken = Cookies.get('access_token');
    const headers = {};
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    } else {
      window.location.assign('/');
    }

    const DefaultMarginTable = await api().get(`/client/default-margin-table`, {
      headers
    });
    console.log('Margin Table Get Response', DefaultMarginTable);

    if (DefaultMarginTable.data.statusCode === 200) {
      return DefaultMarginTable.data;
    } else if (DefaultMarginTable.data.statusCode === 498) {
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
          let rfqMailResponseAfterRefresh = await api().get(
            `/client/default-margin-table`,
            {
              headers: {
                Authorization: `Bearer ${refreshTokenresponse.data.accessToken}`
              }
            }
          );

          return rfqMailResponseAfterRefresh.data;
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
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
          window.location.assign('/');
        }
      } catch (err) {
        console.log(err);
      }
    } else if (DefaultMarginTable.data.statusCode === 401) {
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      window.location.assign('/');
    }
  } catch (err) {
    console.log('SegmentDetailList Permission Error');
  }
};

//     ---     POST        ---
export interface CreateClient {
  companyName: string;
  legalAddress: string;
  subCompanyName: string;
  currencyPreference: string;
  segmentIdList: string[];
  details: string;
  clientStatus: SupplierStatus;
  phone: string;
  website: string;
  mail: string;
  contactRequests: FormattedContactData[];
  attachmentRequests: {
    fileName: string;
    data: string;
  }[];
  userComments: {
    comment: string;
    severity: string;
  }[];
  dialogSpeed: number;
  dialogQuality: number;
  easeOfSupply: number;
  supplyCapability: number;
  euDemandParts: number;
}

export const postClientCreate = async (newClient: CreateClient) => {
  try {
    const access_token = Cookies.get('access_token');
    const headers: Record<string, string> = {};

    if (access_token) {
      headers['Authorization'] = `Bearer ${access_token}`;
    } else {
      window.location.assign('/');
      return;
    }

    const response = await api().post(`/client/create`, newClient, {
      headers
    });
    console.log('Client Payload', response);

    if (response.data.statusCode === 200) {
      return response.data;
    } else if (response.data.statusCode === 498) {
      try {
        const refresh_token = Cookies.get('refresh_token');

        const refreshTokenresponse = await api().post('/auth/refresh-token', {
          refresh_token
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
            `/client/create`,
            newClient,
            {
              headers: {
                Authorization: `Bearer ${refreshTokenresponse.data.data.access_token}`
              }
            }
          );
          return rfqMailResponseAfterRefresh.data;
        } else if (refreshTokenresponse.data.statusCode === 411) {
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
          window.location.assign('/');
        } else if (refreshTokenresponse.data.statusCode === 498) {
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
          window.location.assign('/');
        } else if (refreshTokenresponse.data.statusCode === 404) {
        }
      } catch (err) {
        console.error('Token yenileme sırasında hata oluştu:', err);
      }
    } else if (response.data.statusCode === 401) {
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      window.location.assign('/');
    } else {
      console.log(
        'İşlenmeyen yanıt durumu, statusCode:',
        response.data.statusCode
      );
    }
  } catch (err) {
    console.error('postSupplierCreate fonksiyonunda hata:', err);
  }
};
