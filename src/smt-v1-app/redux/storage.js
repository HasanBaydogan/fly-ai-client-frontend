import { configureStore } from '@reduxjs/toolkit';
import rfqMailReducer from './rfqMailSlice';
import userReducer from './userSlice';

const storage = configureStore({
  reducer: {
    rfqMails: rfqMailReducer,
    user: userReducer
  }
});

export default storage;
