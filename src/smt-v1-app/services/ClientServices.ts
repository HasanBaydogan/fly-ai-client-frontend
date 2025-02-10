import axios from 'axios';
import { baseURL } from './ApiConstants';
import Cookies from 'js-cookie';
import { setCookie } from './CookieService';
import {
  Certypes,
  SupplierStatus
} from 'smt-v1-app/components/features/SupplierList/SupplierListTable/SearchBySupplierListMock';
import { FormattedContactData } from 'smt-v1-app/components/features/SupplierDetail/SupplierDetailComponents/ContactListSection';
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

//     ---     POST        ---
export interface CreateClient {
  //   supplierCompanyName: string;
  segmentIds: string[];
  //   brand: string;
  //   countryId: string;
  //   pickUpAddress: string;
  //   supplierStatus: SupplierStatus;
  //   attachments: {
  //     fileName: string;
  //     data: string;
  //   }[];
  //   workingDetails: string;
  //   username: string;
  //   password: string;
  //   contacts: FormattedContactData[];
  //   certificateTypes: Certypes[];
  //   dialogSpeed: number;
  //   dialogQuality: number;
  //   easeOfSupply: number;
  //   supplyCapability: number;
  //   euDemandParts: number;
}

export const postClientCreate = async (newSupplier: CreateClient) => {
  try {
    const access_token = Cookies.get('access_token');
    const headers: Record<string, string> = {};

    if (access_token) {
      headers['Authorization'] = `Bearer ${access_token}`;
    } else {
      window.location.assign('/');
      return;
    }

    const response = await api().post(`/supplier/create`, newSupplier, {
      headers
    });

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
            `/supplier/create`,
            newSupplier,
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
