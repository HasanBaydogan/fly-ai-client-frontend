import MainLayout from 'layouts/MainLayout';

import { RouteObject, createBrowserRouter } from 'react-router-dom';

import MainLayoutProvider from 'providers/MainLayoutProvider';

import Error404 from 'pages/error/Error404';
import Error403 from 'pages/error/Error403';
import Error500 from 'pages/error/Error500';

import App from 'App';

import TravelLanding from 'pages/apps/travel-agency/landing/Landing';

import HotelHomepage from 'pages/apps/travel-agency/hotel/customer/homepage/Homepage';
import HotelGallery from 'pages/apps/travel-agency/hotel/customer/HotelGallery';

import TravelAgencyLayout from 'layouts/TravelAgencyLayout';
import TravelLandingLayout from 'layouts/TravelLandingLayout';
import LoginContainer from 'smt-v1-app/containers/authentication/LoginContainer/LoginContainer';
import RegisterContainer from 'smt-v1-app/containers/authentication/RegisterContainer/RegisterContainer';
import ForgetPasswordContainer from 'smt-v1-app/containers/authentication/ForgetPasswordContainer/ForgetPasswordContainer';
import MailTrackingContainer from 'smt-v1-app/containers/MailTrackingContainer/MailTrackingContainer';
import RFQsContainer from 'smt-v1-app/containers/RFQsContainer/RFQsContainer';
import QuoteContainer from 'smt-v1-app/containers/QuoteContainer/QuoteContainer';

const routes: RouteObject[] = [
  {
    element: <App />,
    children: [
      {
        path: '/',
        element: (
          <MainLayoutProvider>
            <MainLayout />
          </MainLayoutProvider>
        ),
        children: [
          {
            path: '/mail',
            children: [
              {
                path: 'mail-tracking',
                element: <MailTrackingContainer />
              },
              {
                path: 'rfqs',
                element: <RFQsContainer />
              },
              {
                path: 'quote',
                element: <QuoteContainer />
              }
            ]
          }
        ]
      },

      {
        path: '/auth',
        children: [
          {
            path: 'sign-in',
            element: <LoginContainer />
          },
          {
            path: 'sign-up',
            element: <RegisterContainer />
          },
          {
            path: 'forget-password',
            element: <ForgetPasswordContainer />
          }
        ]
      },

      {
        element: <TravelLandingLayout />,
        path: 'apps/travel-agency',
        children: [
          {
            path: 'landing',
            element: <TravelLanding />
          }
        ]
      },
      {
        element: <TravelAgencyLayout />,
        path: 'apps/travel-agency',
        children: [
          {
            children: [
              {
                path: 'hotel/customer/homepage',
                element: <HotelHomepage />
              },
              {
                path: 'hotel/customer/gallery',
                element: <HotelGallery />
              }
            ]
          }
        ]
      },

      {
        path: '/pages/errors/',
        children: [
          {
            path: '404',
            element: <Error404 />
          },
          {
            path: '403',
            element: <Error403 />
          },
          {
            path: '500',
            element: <Error500 />
          }
        ]
      },
      {
        path: '*',
        element: <Error404 />
      }
    ]
  }
];

export const router = createBrowserRouter(routes);

export default routes;
