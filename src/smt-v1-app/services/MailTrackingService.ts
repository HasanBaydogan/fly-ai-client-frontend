import axios from 'axios';
import { baseURL } from './ApiConstants';
import Cookies from 'js-cookie';
import { setCookie } from './CookieService';

const api = () => {
  return axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const getAllRFQMails = async (pageNo : number, pageSize:number,filterType:string,sinceFromDate:string) => {
    try {
      const accessToken = Cookies.get("access_token");
      const headers = {};
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      } else {
        window.location.assign("/");
      }
  
      const rfqMailResp = await api().get(`/rfq-mail/previews`,{
        headers,
      });
  
      if (rfqMailResp.data.statusCode === 200) {
        return rfqMailResp.data;
      } else if (rfqMailResp.data.statusCode === 498) {
        // Expired JWT
        try {
          const refreshTokenresponse = await api().post("/auth/refresh-token", {
            refreshToken: Cookies.get("refresh_token"),
            accessToken: accessToken,
          });
          if (refreshTokenresponse.data.statusCode === 200) {
            setCookie(
              "access_token",
              refreshTokenresponse.data.data.access_token
            );
            setCookie(
              "refresh_token",
              refreshTokenresponse.data.data.refresh_token
            );
            let rfqMailResponseAfterRefresh = await api().get(
                `/rfq-mail/previews`,
                {
                  headers: {
                    Authorization: `Bearer ${refreshTokenresponse.data.accessToken}`,
                  },
                }
              );
              
            return rfqMailResponseAfterRefresh.data;
          } else if (refreshTokenresponse.data.statusCode === 411) {
            // Invalid Refresh Token
            Cookies.remove("access_token");
            Cookies.remove("refresh_token");
            window.location.assign("/");
          } else if (refreshTokenresponse.data.statusCode === 404) {
            console.log("User not found");
          }
        } catch (err) {
          console.log(err);
        }
      } else if (rfqMailResp.data.statusCode === 401) {
        Cookies.remove("access_token");
        Cookies.remove("refresh_token");
        window.location.assign("/");
      }
    } catch (err) {
      console.log("RFQMail Permission Error");
    }
  };
  