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

//  ---     GET     ---

export const getbySegmentList = async () => {
  try {
    const accessToken = Cookies.get('access_token');
    const headers = {};
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    } else {
      window.location.assign('/');
    }

    const rfqMailResp = await api().get(`/segment/all`, {
      headers
    });
    // console.log('SupplierId Get Response', rfqMailResp);

    if (rfqMailResp.data.statusCode === 200) {
      return rfqMailResp.data;
    } else if (rfqMailResp.data.statusCode === 498) {
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
          let rfqMailResponseAfterRefresh = await api().get(`/segment/all`, {
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
    } else if (rfqMailResp.data.statusCode === 401) {
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      window.location.assign('/');
    }
  } catch (err) {
    console.log('SegmentDetailList Permission Error');
  }
};

export const getbyCountryList = async () => {
  try {
    const accessToken = Cookies.get('access_token');
    const headers = {};
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    } else {
      window.location.assign('/');
    }

    const rfqMailResp = await api().get(`/country/all`, {
      headers
    });

    if (rfqMailResp.data.statusCode === 200) {
      return rfqMailResp.data;
    } else if (rfqMailResp.data.statusCode === 498) {
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
          let rfqMailResponseAfterRefresh = await api().get(`/country/all`, {
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
    } else if (rfqMailResp.data.statusCode === 401) {
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      window.location.assign('/');
    }
  } catch (err) {
    console.log('CountryList Permission Error');
  }
};

//     ---     POST        ---
export interface CreateSupplier {
  supplierCompanyName: string;
  segmentIds: string[];
  brand: string;
  countryId: string;
  pickUpAddress: string;
  supplierStatus: SupplierStatus;
  attachments: {
    fileName: string;
    data: string;
  }[];
  workingDetails: string;
  username: string;
  password: string;
  contacts: FormattedContactData[];
  certificateTypes: Certypes[];
  dialogSpeed: number;
  dialogQuality: number;
  easeOfSupply: number;
  supplyCapability: number;
  euDemandParts: number;
}

export const postSupplierCreate = async (newSupplier: CreateSupplier) => {
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
    console.log(response);
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

export interface SupplierData {
  id: string;
  companyName: string;
  segments: { segmentName: string }[];
  brand: string;
  country: string;
  address: string;
  email?: string;
  contacts: { email: string }[];
  status: SupplierStatus;
  quoteID: string | null;
  attachments: {
    attachmentId: string | null;
    attachmentName: string | null;
  }[];
  workingDetails: string | null;
  userName: string;
  certificates: string[];
  dialogSpeed: string;
  dialogQuality: string;
  easeOfSupply: string;
  supplyCapability: string;
  euDemandOfParts: string;
  createdBy: string;
  createdOn: string;
  lastModifiedBy: string;
  lastModifiedOn: string;
}

export const searchBySupplierList = async (
  term: string,
  pageNo: number,
  pageSize: number = 6
) => {
  try {
    const accessToken = Cookies.get('access_token');
    const headers: Record<string, string> = {};
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    } else {
      window.location.assign('/');
      return;
    }

    // Term varsa query string olarak ekliyoruz
    const url = term
      ? `/supplier/all/filtered/${pageNo}/${pageSize}?${term}`
      : `/supplier/all/filtered/${pageNo}/${pageSize}`;

    const suppList = await api().get(url, { headers });

    if (suppList.data.statusCode === 200) {
      return suppList.data;
    } else if (suppList.data.statusCode === 498) {
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
          const suppListAfterRefresh = await api().get(url, {
            headers: {
              Authorization: `Bearer ${refreshTokenresponse.data.accessToken}`
            }
          });

          return suppListAfterRefresh.data;
        } else if (refreshTokenresponse.data.statusCode === 411) {
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
          window.location.assign('/');
        } else if (refreshTokenresponse.data.statusCode === 498) {
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
          window.location.assign('/');
        } else if (refreshTokenresponse.data.statusCode === 404) {
          console.log('[searchBySupplierList] User not found. Redirecting.');
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
          window.location.assign('/');
        }
      } catch (err) {
        console.log('[searchBySupplierList] Refresh token error:', err);
      }
    } else if (suppList.data.statusCode === 401) {
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      window.location.assign('/');
    }
  } catch (err) {
    console.log('[searchBySupplierList] Supplier List Permission Error:', err);
  }
};

export const getBySupplierId = async (supplierId: string) => {
  try {
    const accessToken = Cookies.get('access_token');
    const headers = {};
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    } else {
      window.location.assign('/');
    }

    const response = await api().get(`/supplier/id/${supplierId}`, {
      headers
    });
    // console.log('SupplierId Get Response', response);

    if (response.data.statusCode === 200) {
      return response.data;
    } else if (response.data.statusCode === 498) {
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
            `/supplier/id/${supplierId}`,
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
    } else if (response.data.statusCode === 401) {
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      window.location.assign('/');
    }
  } catch (err) {
    console.log('SupplierId Data Permission Error');
  }
};

export interface UpdateSupplierPayload {
  supplierId: string;
  supplierCompanyName: string;
  segmentIds: string[];
  brand: string;
  countryId: string;
  pickUpAddress: string;
  status: string;
  attachments: { id: string; fileName: string; data: string }[];
  workingDetails: string;
  username: string;
  password: string;
  contacts: FormattedContactData[];
  certificateTypes: Certypes[];
  dialogSpeed: number;
  dialogQuality: number;
  easeOfSupply: number;
  supplyCapability: number;
  euDemandParts: number;
}

export const putBySupplierUpdate = async (payload: UpdateSupplierPayload) => {
  try {
    const accessToken = Cookies.get('access_token');
    const headers = {};
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    } else {
      window.location.assign('/');
    }

    const response = await api().put(`/supplier/update`, payload, {
      headers
    });

    if (response.data.statusCode === 200) {
      return response.data;
    } else if (response.data.statusCode === 498) {
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
          let rfqMailResponseAfterRefresh = await api().put(
            `/supplier/update`,
            {},
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
    } else if (response.data.statusCode === 401) {
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      window.location.assign('/');
    }
  } catch (err) {
    console.log('Supplier Update Permission Error');
  }
};
