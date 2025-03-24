import { getRequest, postRequest, putRequest } from './ApiCore/GlobalApiCore';

export const getAllRFQMails = async (
  pageNo: number,
  pageSize: number,
  filterType: string,
  sinceFromDate: string
) => {
  return await postRequest('/rfq-mail/previews', {
    pageNo,
    pageSize,
    filterType,
    sinceFrom: sinceFromDate
  });
};

export const searchByRfqNumberId = async (
  rfqNumberId: string,
  pageNo: number,
  pageSize: number
) => {
  return await getRequest(
    `/rfq-mail/search/${rfqNumberId}/${pageNo}/${pageSize}`
  );
};

// RFQ Mail point status
export const point = async (
  rfqMailId: string,
  rfqMailPointStatus: 'SPAM' | 'NOT_RFQ' | 'NO_QUOTE' | 'UNREAD'
) => {
  return await putRequest('/rfq-mail/point', { rfqMailPointStatus, rfqMailId });
};

// RFQ Mail detail
export const getRfqMailDetailFromDB = async (rfqMailId: string) => {
  return await getRequest(`/rfq-mail/detail/${rfqMailId}`);
};

// RFQ Mail log
export const getRFQMailLogsFromDB = async (rfqMailId: string) => {
  return await getRequest(`/rfq-mail/detail/logs/${rfqMailId}`);
};

// RFQ Mail open control
export const isOpenRFQMail = async (rfqMailId: string) => {
  return await getRequest(`/rfq-mail/is-open-rfq-mail/${rfqMailId}`);
};

// RFQ Mail cancel
export const cancelRFQMail = async (rfqMailId: string) => {
  return await putRequest(`/rfq-mail/cancel-rfq-mail/${rfqMailId}`, {});
};

// RFQ Mail OPEN -> WFS transition
export const convertOpenToWFS = async (rfqMailId: string) => {
<<<<<<< HEAD
  return await putRequest(`/rfq-mail/status-to-wfs/${rfqMailId}`, {});
=======
  try {
    const accessToken = Cookies.get('access_token');
    const headers = {};
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    } else {
      window.location.assign('/');
    }

    const response = await api().put(
      `/rfq-mail/status-to-wfs/${rfqMailId}`,
      {},
      {
        headers
      }
    );
    // console.log('Response', response);

    if (response.status === 200) {
      if (response.data.statusCode === 498) {
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
              `/rfq-mail/status-to-wfs/${rfqMailId}`,
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
      return response.data;
    }
  } catch (err) {
    console.log('RFQMail Detail Permission Error');
  }
>>>>>>> fix/20march
};

// RFQ Maili revert
export const reverseRFQMail = async (rfqMailId: string) => {
  return await putRequest(`/rfq-mail/reverse-rfq-mail-status/${rfqMailId}`, {});
};

// RFQ Mail Subject search
export const searchRFQMailBySubject = async (
  subject: string,
  pageNo: number,
  pageSize: number
) => {
  return await getRequest(
    `/rfq-mail/search/mail-subject/${subject}/${pageNo}/${pageSize}`
  );
};

export const getByMailFilterItems = async (dateFrom: string) => {
  try {
    const accessToken = Cookies.get('access_token');
    const headers = {};
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    } else {
      window.location.assign('/');
    }

    const response = await api().get(
      `/rfq-mail/filter-parameters?dateFrom=${dateFrom}`,
      {
        headers
      }
    );
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
            `/rfq-mail/filter-parameters?dateFrom=${dateFrom}`,
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
    console.log('getByMailFilterItems Permission Error');
  }
};

export const searchByFilterParameters = async (
  pageNo: number,
  pageSize: number,
  params: string
) => {
  console.log('pageNo', pageNo);
  console.log('params', params);

  try {
    const accessToken = Cookies.get('access_token');
    const headers = {};
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    } else {
      window.location.assign('/');
    }

    const rfqMailResp = await api().get(
      `/rfq-mail/search-filter-parameters/${pageNo}/${pageSize}?${params}`,
      {
        headers
      }
    );
    console.log('rfqMailResp', rfqMailResp);
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
          let rfqMailResponseAfterRefresh = await api().get(
            `/rfq-mail/search-filter-parameters/${pageNo}/${pageSize}/${params}`,
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
    } else if (rfqMailResp.data.statusCode === 401) {
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      window.location.assign('/');
    }
  } catch (err) {
    console.log('searchByFilterParameters Permission Error');
  }
};
