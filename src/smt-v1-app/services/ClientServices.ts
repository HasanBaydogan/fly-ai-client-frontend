import axios from 'axios';
import { baseURL } from './ApiConstants';
import Cookies from 'js-cookie';
import { setCookie } from './CookieService';
import {
  Certypes,
  SupplierStatus
} from 'smt-v1-app/components/features/SupplierList/SupplierListTable/SearchBySupplierListMock';
import { FormattedContactData } from 'smt-v1-app/components/features/Client/NewClient/NewClientContact/ContactListSection';
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

export interface ClientData {
  id: string;
  clientId: string;
  companyName: string;
  segments: { segmentName: string }[];
  currencyPreference: string;
  website: string;
  legalAddress: string;
  email?: string;
  contacts: { email: string }[];
  clientStatus: SupplierStatus;
  quoteID: string | null;
  attachmentResponses: {
    attachmentId: string | null;
    fileName: string | null;
  }[];
  details: string | null;
  subCompanyName: string;
  phone: string;
  clientRatings: {
    dialogQuality: number;
    volumeOfOrder: number;
    continuityOfOrder: number;
    easeOfPayment: number;
    easeOfDelivery: number;
  };

  marginTable: {
    below200: number;
    btw200and500: number;
    btw500and1_000: number;
    btw1_000and5_000: number;
    btw5_000and10_000: number;
    btw10_000and50_000: number;
    btw50_000and100_000: number;
    btw100_000and150_000: number;
    btw150_000and200_000: number;
    btw200_000and400_000: number;
    btw400_000and800_000: number;
    btw800_000and1_000_000: number;
    btw1_000_000and2_000_000: number;
    btw2_000_000and4_000_000: number;
    above4_000_000: number;
    lastModifiedBy: string;
  };
  comment: string;
  createdBy: string;
  createdOn: string;
  lastModifiedBy: string;
  lastModifiedOn: string;
}

export const searchByClientList = async (
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
      ? `/client/all/${pageNo}/${pageSize}?${term}`
      : `/client/all/${pageNo}/${pageSize}`;

    const suppList = await api().get(url, { headers });
    // console.log('Response from searchByClientList:', suppList);

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
          const clientListAfterRefresh = await api().get(url, {
            headers: {
              Authorization: `Bearer ${refreshTokenresponse.data.accessToken}`
            }
          });

          return clientListAfterRefresh.data;
        } else if (refreshTokenresponse.data.statusCode === 411) {
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
          window.location.assign('/');
        } else if (refreshTokenresponse.data.statusCode === 498) {
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
          window.location.assign('/');
        } else if (refreshTokenresponse.data.statusCode === 404) {
          console.log('[searchByClientList] User not found. Redirecting.');
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
          window.location.assign('/');
        }
      } catch (err) {
        console.log('[searchByClientList] Refresh token error:', err);
      }
    } else if (suppList.data.statusCode === 401) {
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      window.location.assign('/');
    }
  } catch (err) {
    console.log('[searchByClientList] Supplier List Permission Error:', err);
  }
};

export interface ClientDataDetail {
  id: string;
  clientId: string;
  companyName: string;
  segments: { segmentName: string }[];
  currencyPreference: string;
  website: string;
  legalAddress: string;
  email?: string;
  contacts: { email: string }[];
  clientStatus: SupplierStatus;
  quoteID: string | null;
  attachmentResponses: {
    attachmentId: string | null;
    fileName: string | null;
  }[];
  details: string | null;
  subCompanyName: string;
  phone: string;

  clientRatings: {
    dialogQuality: number;
    volumeOfOrder: number;
    continuityOfOrder: number;
    easeOfPayment: number;
    easeOfDelivery: number;
  };
  marginTable: {
    below200: number;
    btw200and500: number;
    btw500and1_000: number;
    btw1_000and5_000: number;
    btw5_000and10_000: number;
    btw10_000and50_000: number;
    btw50_000and100_000: number;
    btw100_000and150_000: number;
    btw150_000and200_000: number;
    btw200_000and400_000: number;
    btw400_000and800_000: number;
    btw800_000and1_000_000: number;
    btw1_000_000and2_000_000: number;
    btw2_000_000and4_000_000: number;
    above4_000_000: number;
    lastModifiedBy: string;
  };
  createdBy: string;
  createdOn: string;
  lastModifiedBy: string;
  lastModifiedOn: string;
}

export const getByClientId = async (clientIdId: string) => {
  try {
    const accessToken = Cookies.get('access_token');
    const headers = {};
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    } else {
      window.location.assign('/');
    }

    const response = await api().get(`/client/id/more-detail/${clientIdId}`, {
      headers
    });
    // console.log('clientId Get Response', response);

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
            `/client/id/more-detail/${clientIdId}`,
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
    console.log('clientId Data Permission Error');
  }
};

export const getByClientDetailList = async (clientId: string) => {
  try {
    const accessToken = Cookies.get('access_token');
    const headers = {};
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    } else {
      window.location.assign('/');
    }

    const response = await api().get(`/client/id/detail/${clientId}`, {
      headers
    });
    // console.log('Response from getByClientDetailList:', response);

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
            `/client/id/detail/${clientId}`,
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
    console.log(
      '[getByClientDetailList] Client Detail List Permission Error:',
      err
    );
  }
};

export const getAttachedFile = async (attachmentId: string) => {
  try {
    const accessToken = Cookies.get('access_token');
    const headers = {};
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    } else {
      window.location.assign('/');
    }

    const response = await api().get(`/attachment/id/${attachmentId}`, {
      headers
    });
    // console.log('Response from getAttachedFile:', response);

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
            `/attachment/id/${attachmentId}`,
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
    console.log('Attachment File Permission Error');
  }
};

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
    // console.log('SupplierId Get Response', CurrencyController);

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
    // console.log('Margin Table Get Response', DefaultMarginTable);

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
  clientRatings: {
    dialogQuality: number;
    volumeOfOrder: number;
    continuityOfOrder: number;
    easeOfPayment: number;
    easeOfDelivery: number;
  };
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
    // console.log('Client Payload', response);

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

export interface UpdateClientPayload {
  clientId: string;
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
  clientPriceMarginTableRequest: { [k: string]: number };
  clientRatings: {
    dialogQuality: number;
    volumeOfOrder: number;
    continuityOfOrder: number;
    easeOfPayment: number;
    easeOfDelivery: number;
  };
}

export const putByClientUpdate = async (payload: UpdateClientPayload) => {
  try {
    const accessToken = Cookies.get('access_token');
    const headers = {};
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    } else {
      window.location.assign('/');
    }
    // console.log('Client editPayload1', payload);

    const response = await api().put(`/client/update`, payload, {
      headers
    });
    // console.log('Client editPayload2', response);

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
            `/client/update`,
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

// export const putByClientUpdate = async (editPayload: UpdateClientPayload) => {
//   try {
//     const accessToken = Cookies.get('access_token');
//     const headers = {};
//     if (accessToken) {
//       headers['Authorization'] = `Bearer ${accessToken}`;
//     } else {
//       window.location.assign('/');
//     }

//     const response = await api().put(`/client/update`, editPayload, {
//       headers
//     });
//     console.log('Client editPayload2', response);

//     if (response.data.statusCode === 200) {
//       return response.data;
//     } else if (response.data.statusCode === 498) {
//       Expired JWT
//       try {
//         const refreshTokenresponse = await api().post('/auth/refresh-token', {
//           refresh_token: Cookies.get('refresh_token')
//         });
//         if (refreshTokenresponse.data.statusCode === 200) {
//           setCookie(
//             'access_token',
//             refreshTokenresponse.data.data.access_token
//           );
//           setCookie(
//             'refresh_token',
//             refreshTokenresponse.data.data.refresh_token
//           );
//           let rfqMailResponseAfterRefresh = await api().put(
//             `/client/update`,
//             {},
//             {
//               headers: {
//                 Authorization: `Bearer ${refreshTokenresponse.data.accessToken}`
//               }
//             }
//           );

//           return rfqMailResponseAfterRefresh.data;
//         } else if (refreshTokenresponse.data.statusCode === 498) {
//           Expired Refresh Token
//           Cookies.remove('access_token');
//           Cookies.remove('refresh_token');
//           window.location.assign('/');
//         } else if (refreshTokenresponse.data.statusCode === 411) {
//           Invalid Refresh Token
//           Cookies.remove('access_token');
//           Cookies.remove('refresh_token');
//           window.location.assign('/');
//         } else if (refreshTokenresponse.data.statusCode === 404) {
//           console.log('User not found');
//           Cookies.remove('access_token');
//           Cookies.remove('refresh_token');
//           window.location.assign('/');
//         }
//       } catch (err) {
//         console.log(err);
//       }
//     } else if (response.data.statusCode === 401) {
//       Cookies.remove('access_token');
//       Cookies.remove('refresh_token');
//       window.location.assign('/');
//     }
//   } catch (err) {
//     console.log('Supplier Update Permission Error');
//   }
// };
