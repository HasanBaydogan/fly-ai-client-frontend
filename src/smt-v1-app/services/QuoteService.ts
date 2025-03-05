import axios from 'axios';
import { baseURL } from './ApiConstants';
import Cookies from 'js-cookie';
import { setCookie } from './CookieService';
import { SaveRFQ } from 'smt-v1-app/components/features/RFQRightSide/RFQRightSideComponents/RFQRightSideHelper';
import { SendEmailProps } from 'smt-v1-app/components/features/QuoteWizard/formsQuote/WizardSendMailForm';

const api = () => {
  return axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export type QuoteStatus = {
  label: 'CONTACTED' | 'NOT_CONTACTED' | 'BLACK_LISTED';
  type: 'success' | 'warning' | 'danger';
};

export type FormStatus = {
  label: 'CONTACTED' | 'NOT_CONTACTED' | 'BLACK_LISTED';
  type: 'success' | 'warning' | 'danger';
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

    const rfqResponse = await api().get(`/quote/id/${quoteId}`, {
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
          let responseAfterRefresh = await api().get(`/quote/id/${quoteId}`, {
            headers: {
              Authorization: `Bearer ${refreshTokenresponse.data.accessToken}`
            }
          });

          return responseAfterRefresh.data;
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
    console.log('getQuoteDetailsById Permission Error');
  }
};

export const convertRFQToQuote = async (rfqMailId: string) => {
  try {
    const accessToken = Cookies.get('access_token');
    const headers = {};
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    } else {
      window.location.assign('/');
    }

    const rfqResponse = await api().post(
      `/quote/convert/${rfqMailId}`,
      {},
      {
        headers
      }
    );
    //console.log(rfqResponse);
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
          let responseAfterRefresh = await api().post(
            `/quote/convert/${rfqMailId}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${refreshTokenresponse.data.accessToken}`
              }
            }
          );

          return responseAfterRefresh.data;
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
    console.log('convertRFQToQuote Permission Error');
  }
};

export const quoteWizardIntro = async (
  quoteId: string,
  quotePartIds: string[],
  alternativeQuotePartIds: string[]
) => {
  try {
    const accessToken = Cookies.get('access_token');
    const headers = {};
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    } else {
      window.location.assign('/');
    }

    const rfqResponse = await api().post(
      `/quote/quote-wizard/${quoteId}`,
      { quotePartIds, alternativeQuotePartIds },
      {
        headers
      }
    );
    console.log(rfqResponse);
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
            `/quote/quote-wizard/${quoteId}`,
            { quotePartIds, alternativeQuotePartIds },
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
      window.location.assign('/');
    }
  } catch (err) {
    console.log('quoteWizardIntro Permission Error');
  }
};
export const getPreEmailSendingParameters = async (quoteId: string) => {
  try {
    const accessToken = Cookies.get('access_token');
    const headers = {};
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    } else {
      window.location.assign('/');
    }

    const response = await api().get(`/quote/pre-email-sending/${quoteId}`, {
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
          let dataResponseAfterRefresh = await api().get(
            `/quote/pre-email-sending/${quoteId}`,
            {
              headers: {
                Authorization: `Bearer ${refreshTokenresponse.data.accessToken}`
              }
            }
          );

          return dataResponseAfterRefresh.data;
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
    } else if (response.data.statusCode === 404) {
      window.location.assign('/');
    }
  } catch (err) {
    console.log('getPreEmailSendingParameters Permission Error');
  }
};

export const sendQuoteEmail = async (sendEmailProps: SendEmailProps) => {
  try {
    const accessToken = Cookies.get('access_token');
    const headers = {};
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    } else {
      window.location.assign('/');
    }

    const response = await api().post(`/quote/send-email`, sendEmailProps, {
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
          let dataResponseAfterRefresh = await api().post(
            `/quote/send-email`,
            sendEmailProps,
            {
              headers: {
                Authorization: `Bearer ${refreshTokenresponse.data.accessToken}`
              }
            }
          );

          return dataResponseAfterRefresh.data;
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
    } else if (response.data.statusCode === 404) {
      window.location.assign('/');
    }
  } catch (err) {
    console.log('Send Email Permission Error');
  }
};

export interface QuoteData {
  quoteId: string;
  quoteNumberId: string;
  revisionNo: string;
  clientsResponse: { clientId: string; clientName: string }[];
  clientRFQId: string;
  numOfProduct: number;
  quoteStatus: QuoteStatus;
  formStatus: FormStatus;
  finalCost: number;
  lastValidDate: string;
}

export const getByQuoteList = async (pageSize: number, pageNo: number) => {
  try {
    const accessToken = Cookies.get('access_token');
    const headers = {};
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    } else {
      window.location.assign('/');
    }

    const response = await api().get(`/quote/all/${pageNo}/${pageSize}`, {
      headers
    });
    // console.log('Response from getByQuoteList:', response);

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
            `/quote/all/${pageNo}/${pageNo}`,
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
    console.log('[getByQuoteList] Permission Error:', err);
  }
};
