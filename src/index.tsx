import AppProvider from 'providers/AppProvider';
import React from 'react';
import ReactDOM from 'react-dom/client';
import BreakpointsProvider from 'providers/BreakpointsProvider';
import SettingsPanelProvider from 'providers/SettingsPanelProvider';
import { RouterProvider } from 'react-router-dom';
import { router } from 'Routes';
import ChatWidgetProvider from 'providers/ChatWidgetProvider';
import { Provider } from 'react-redux';
import storage from 'smt-v1-app/redux/storage';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Provider store={storage}>
    <React.StrictMode>
      <AppProvider>
        <SettingsPanelProvider>
          <ChatWidgetProvider>
            <BreakpointsProvider>
              <RouterProvider router={router} />
            </BreakpointsProvider>
          </ChatWidgetProvider>
        </SettingsPanelProvider>
      </AppProvider>
    </React.StrictMode>
  </Provider>
);
