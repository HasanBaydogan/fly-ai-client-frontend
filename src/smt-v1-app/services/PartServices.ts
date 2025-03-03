import axios from 'axios';
import { baseURL } from './ApiConstants';
import Cookies from 'js-cookie';
import { setCookie } from './CookieService';

export interface TreeNode {
  segmentId: string;
  segmentName: string;
  isSelected?: boolean;
  subSegments: TreeNode[];
}

export type aircraft =
  | 'ANY'
  | 'AIRBUS'
  | 'ALBATROSL_39'
  | 'AGUSTA_WESTLAND'
  | 'BEECRAFT'
  | 'BOEING'
  | 'BOMBARDIER'
  | 'CESSNA'
  | 'DIAMOND'
  | 'LEONARDO'
  | 'L410'
  | 'SSJ100';

export type oem =
  | 'ANY'
  | 'AKZONOBEL'
  | 'BRIDGESTONE'
  | 'CHAMPION'
  | 'CHARLATTE'
  | 'COLUMBUSJACK'
  | 'DAVID_CLARK'
  | 'DIAMOND_AIRCRAFT'
  | 'DUNLOP'
  | 'DYNELL'
  | 'GOODRICH'
  | 'GOODYEAR'
  | 'GROVE'
  | 'HEATCON'
  | 'JBT_AEROTECH'
  | 'MALABAR'
  | 'MALLAGHAN'
  | 'MANITOWOC'
  | 'MICHELIN'
  | 'MILOCO'
  | 'MULAG'
  | 'POTAIN'
  | 'SAFRAN'
  | 'SAGEPARTS'
  | 'SOURIAU'
  | 'TESA_PRODUCTS'
  | 'THALES'
  | 'TRONAIR';

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

export const searchByPartList = async (
  udfId: string,
  p0: number,
  pageSize: number
) => {
  try {
    const accessToken = Cookies.get('access_token');
    const headers = {};
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    } else {
      window.location.assign('/');
    }

    const response = await api().get(`/part/???`, {
      headers
    });
    console.log('Response from getByClientDetailList:', response);

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
          let rfqMailResponseAfterRefresh = await api().get(`/part/???`, {
            headers: {
              Authorization: `Bearer ${refreshTokenresponse.data.accessToken}`
            }
          });

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
    console.log('[getByUDFPartList] Client Detail List Permission Error:', err);
  }
};

// *****************************
//         Item Fields
// *****************************

export const getByItemFields = async (partId: string) => {
  try {
    const accessToken = Cookies.get('access_token');
    const headers = {};
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    } else {
      window.location.assign('/');
    }

    const response = await api().get(`/part/id/${partId}`, {
      headers
    });
    console.log('Response from getByItemFields:', response);

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
            `/part/id/${partId}`,
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
    console.log('[getByItemFields] Permission Error:', err);
  }
};

export interface createPart {
  partNumber: string;
  partName: string;
  segmentIds: string[];
  aircraftModel: string;
  aircraft: string;
  comment: string;
  oem: string;
  hsCode: string;
}

export const postPartCreate = async (newPart: createPart) => {
  try {
    const access_token = Cookies.get('access_token');
    const headers: Record<string, string> = {};

    if (access_token) {
      headers['Authorization'] = `Bearer ${access_token}`;
    } else {
      window.location.assign('/');
      return;
    }

    const response = await api().post(`/part/create`, newPart, {
      headers
    });
    // console.log('Client Payload RESPONSE', response);

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
            `/part/create`,
            newPart,
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
    console.error('postPartCreate fonksiyonunda hata:', err);
  }
};

export interface updatePartPayload {
  partId: any;
  partName: string;
  aircraft: string;
  segmentIds: string[];
  aircraftModel: string;
  comment: string;
  oem: string;
  hsCode: string;
}

export const putPartUpdate = async (payload: updatePartPayload) => {
  try {
    const accessToken = Cookies.get('access_token');
    const headers = {};
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    } else {
      window.location.assign('/');
    }
    // console.log('Client editPayload1', payload);

    const response = await api().put(`/part/update`, payload, {
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
            `/part/update`,
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
    console.log('putUpdateNotes Permission Error');
  }
};

// *****************************
//           UDF API's
// *****************************

export interface UDFData {
  udfId: string;
  fieldName: string;
  fieldType: string[];
  fieldStringValues: [string];
  addrfieldIntValuesess: [0];
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export const getByUDFPartList = async (
  partId: string,
  p0: number,
  pageSize: number
) => {
  try {
    const accessToken = Cookies.get('access_token');
    const headers = {};
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    } else {
      window.location.assign('/');
    }

    const response = await api().get(`/part/udf/part-id/${partId}`, {
      headers
    });
    console.log('Response from getByClientDetailList:', response);

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
            `/part/udf/part-id/${partId}`,
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
    console.log('[getByUDFPartList] Client Detail List Permission Error:', err);
  }
};

// *****************************
//           Notes API's
// *****************************

export const searchByNoteList = async (
  pageSize: number,
  pageNo: number,
  partId: string
) => {
  // console.log('Response from searchByClientList:', term);
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
    const url = `/part/note/part-id/${partId}/${pageNo}/${pageSize}`;
    // console.log('url', url);
    const noteList = await api().get(url, { headers });
    // console.log('Response from searchByNoteList:', noteList);

    if (noteList.data.statusCode === 200) {
      return noteList.data;
    } else if (noteList.data.statusCode === 498) {
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
    } else if (noteList.data.statusCode === 401) {
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      window.location.assign('/');
    }
  } catch (err) {
    console.log('[searchByClientList] Supplier List Permission Error:', err);
  }
};

export interface updatePayload {
  noteId: string;
  noteContent: string;
  noteType: string;
}

export const putUpdateNotes = async (payload: updatePayload) => {
  try {
    const accessToken = Cookies.get('access_token');
    const headers = {};
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    } else {
      window.location.assign('/');
    }
    // console.log('Client editPayload1', payload);

    const response = await api().put(`/part/note/update`, payload, {
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
            `/part/note/update`,
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
    console.log('putUpdateNotes Permission Error');
  }
};

export interface newNotePayload {
  partId: string;
  noteContent: string;
  partNoteType: string; // Artık dizi değil, tek string olacak
}

export const postNewNotes = async (newPart: newNotePayload) => {
  try {
    const access_token = Cookies.get('access_token');
    const headers: Record<string, string> = {};
    if (access_token) {
      headers['Authorization'] = `Bearer ${access_token}`;
    } else {
      window.location.assign('/');
      return { success: false, message: 'No access token' };
    }
    // console.log('payload', newPart);

    const response = await api().post(`/part/note/create`, newPart, {
      headers
    });
    // console.log('New Note Payload RESPONSE', response);

    if (response.data.statusCode === 200 || response.data.statusCode === 201) {
      return { success: true, data: response.data };
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
            `/part/note/create`,
            newPart,
            {
              headers: {
                Authorization: `Bearer ${refreshTokenresponse.data.data.access_token}`
              }
            }
          );
          if (
            rfqMailResponseAfterRefresh.data.statusCode === 200 ||
            rfqMailResponseAfterRefresh.data.statusCode === 201
          ) {
            return { success: true, data: rfqMailResponseAfterRefresh.data };
          } else {
            return { success: false, message: 'Error after token refresh' };
          }
        } else if (
          refreshTokenresponse.data.statusCode === 411 ||
          refreshTokenresponse.data.statusCode === 498
        ) {
          Cookies.remove('access_token');
          Cookies.remove('refresh_token');
          window.location.assign('/');
          return { success: false, message: 'Token error' };
        }
      } catch (err) {
        console.error('Token yenileme sırasında hata oluştu:', err);
        return { success: false, message: 'Refresh token error' };
      }
    } else if (response.data.statusCode === 401) {
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      window.location.assign('/');
      return { success: false, message: 'Unauthorized' };
    } else {
      console.log(
        'İşlenmeyen yanıt durumu, statusCode:',
        response.data.statusCode
      );
      return { success: false, message: 'Unhandled response status' };
    }
  } catch (err) {
    console.error('postNewNotes fonksiyonunda hata:', err);
    return { success: false, message: 'Exception occurred' };
  }
};
