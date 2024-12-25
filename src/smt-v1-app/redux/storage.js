import { configureStore } from '@reduxjs/toolkit';
import rfqMailReducer from './rfqMailSlice.ts';
import userReducer from './userSlice.ts';

const storage = configureStore({
  reducer: {
    rfqMails: rfqMailReducer,
    user: userReducer
  }
});

export default storage;
