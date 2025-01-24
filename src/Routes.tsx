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
import RFQContainer from 'smt-v1-app/containers/RFQContainer/RFQContainer';
import QuoteContainer from 'smt-v1-app/containers/QuoteContainer/QuoteContainer';
import RFQListContainer from 'smt-v1-app/containers/RFQListContainer/RFQListContainer';
import PrivacyPolicy from 'smt-v1-app/components/features/authentication/PrivacyPolicy/PrivacyPolicy';
import QuoteListContainer from 'smt-v1-app/containers/QuoteListContainer/QuoteListContainer';
import SupplierDetailContainer from 'smt-v1-app/containers/SupplierDetailContainer/SupplierDetailContainer';
import SupplierListContainer from 'smt-v1-app/containers/SupplierListContainer/SupplierListContainer';

const routes: RouteObject[] = [
  {
    element: <App />,
    children: [
      {
        path: '/',
        element: <LoginContainer />
      },
      {
        path: 'privacy-policy',
        element: <PrivacyPolicy />
      },
      {
        path: '/',
        element: (
          <MainLayoutProvider>
            <MainLayout />
          </MainLayoutProvider>
        ),
        children: [
          {
            path: 'mail-tracking',
            element: <MailTrackingContainer />
          },
          {
            path: 'rfqs',
            children: [
              {
                path: 'list',
                element: <RFQListContainer />
              },
              {
                path: 'rfq',
                element: <RFQContainer />
              },
              {
                path: '',
                element: <Error404 />
              }
            ]
          },
          {
            path: 'quotes',
            children: [
              {
                path: 'quote',
                element: <QuoteContainer />
              },
              {
                path: 'list',
                element: <QuoteListContainer />
              }
            ]
          },
          {
            path: 'supplier',
            children: [
              {
                path: 'detail',
                element: <SupplierDetailContainer />
              },
              {
                path: 'list',
                element: <SupplierListContainer />
              }
            ]
          }
        ]
      },

      {
        path: '/register',
        element: <RegisterContainer />
      },
      {
        path: '/forget-password',
        element: <ForgetPasswordContainer />
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
