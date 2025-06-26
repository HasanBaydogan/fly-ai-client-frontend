import MainLayout from 'layouts/MainLayout';

import { RouteObject, createBrowserRouter } from 'react-router-dom';

import MainLayoutProvider from 'providers/MainLayoutProvider';
import { UnsavedChangesProvider } from 'providers/UnsavedChangesProvider';

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
import RFQListContainer from 'smt-v1-app/containers/RFQListContainer/RFQListContainer';
import PrivacyPolicy from 'smt-v1-app/components/features/authentication/PrivacyPolicy/PrivacyPolicy';
import SupplierDetailContainer from 'smt-v1-app/containers/SupplierDetailContainer/SupplierDetailContainer';
import SupplierListContainer from 'smt-v1-app/containers/SupplierListContainer/SupplierListContainer';

import QuoteListContainer from 'smt-v1-app/containers/QuoteListContainer/QuoteListContainer';

import SupplierEditContainer from 'smt-v1-app/containers/SupplierEditContainer/SupplierEditContainer';

import QuoteContainer from 'smt-v1-app/containers/QuoteContainer/QuoteContainer';

import AlreadyOpenedRfqBySomeoneError from 'smt-v1-app/components/error/AlreadyOpenedRfqBySomeoneError/AlreadyOpenedRfqBySomeoneError';

import ClientListContainer from 'smt-v1-app/containers/Client/ClientListContainer/ClientListContainer';
import NewClientContainer from 'smt-v1-app/containers/Client/NewClientContainer/NewClientContainer';
import ClientEditContainer from 'smt-v1-app/containers/Client/ClientEditContainer/ClientEditContainer';
import PartListContainer from 'smt-v1-app/containers/PartContainer/PartListContainer';
import PartContainer from 'smt-v1-app/containers/PartContainer/PartContainer';
import UserQuoteStatus from 'smt-v1-app/components/features/UserQuoteStatus/UserQuoteStatus';
import PiListContainer from 'smt-v1-app/containers/PiListContainer/PiListContainer';
import PiDetailContainer from 'smt-v1-app/containers/PiDetailContainer/PiDetailContainer';
import PoDetailContainer from 'smt-v1-app/containers/PoDetailContainer/PoDetailContainer';
import PoListContainer from 'smt-v1-app/containers/PoListContainer/PoListContainer';
import CompanyContainer from 'smt-v1-app/containers/CompanyContainer/CompanyContainer';
import Error451 from 'pages/error/Error451';
import ProtectedRoute from 'components/protectedRoute/ProtectedRoute';
import UserQuoteStatusContainer from 'smt-v1-app/containers/UserQuoteStatusContainer/UserQuoteStatusContainer';
import UserSettingsContainer from 'smt-v1-app/containers/UserSettingsContainer/UserSettingsContainer';
import RFQCreate from 'smt-v1-app/containers/RFQCreate/RFQCreate';

// import PartListContainer from 'smt-v1-app/containers/PartContainer/PartList/PartListContainer';

const routes: RouteObject[] = [
  {
    element: <App />,
    children: [
      {
        path: '/login',
        element: <LoginContainer />
      },
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
          <UnsavedChangesProvider>
            <MainLayoutProvider>
              <MainLayout />
            </MainLayoutProvider>
          </UnsavedChangesProvider>
        ),
        children: [
          {
            path: 'mail-tracking',
            element: <MailTrackingContainer />
          },
          {
            path: '',
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
                path: 'create',
                element: <RFQCreate />
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
                path: 'quotelist',
                element: <QuoteListContainer />
              }
            ]
          },
          {
            path: 'pi',
            children: [
              {
                path: 'list',
                element: <PiListContainer />
              },
              {
                path: 'detail',
                element: <PiDetailContainer />
              }
            ]
          },
          {
            path: 'po',
            children: [
              {
                path: 'list',
                element: <PoListContainer />
              },
              {
                path: 'detail',
                element: <PoDetailContainer />
              }
            ]
          },
          {
            path: 'supplier',
            children: [
              {
                path: 'new-supplier',
                element: <SupplierDetailContainer />
              },
              {
                path: 'list',
                element: <SupplierListContainer />
              },
              {
                path: 'edit',
                element: <SupplierEditContainer />
              }
            ]
          },
          {
            path: '/companies',
            element: <CompanyContainer />
          },
          {
            path: 'client',
            children: [
              {
                path: 'list',
                element: <ClientListContainer />
              },
              {
                path: 'new-client',
                element: <NewClientContainer />
              },
              {
                path: 'edit',
                element: <ClientEditContainer />
              }
            ]
          },
          {
            path: 'part',
            children: [
              {
                path: 'list',
                element: <PartListContainer />
              },
              {
                path: 'new-part',
                element: <PartContainer />
              }
            ]
          },
          {
            path: 'user-quote-stats',
            children: [
              {
                path: '',
                element: <UserQuoteStatus />
              }
            ]
          },
          {
            path: 'user-settings',
            children: [
              {
                path: '',
                element: <UserSettingsContainer />
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
        path: '451',
        element: <Error451 />
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
            path: '451',
            element: <Error451 />
          },
          {
            path: '500',
            element: <Error500 />
          },
          {
            path: 'already-opened-rfq-by-someone',
            element: <AlreadyOpenedRfqBySomeoneError />
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
