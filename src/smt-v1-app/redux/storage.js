import { configureStore } from '@reduxjs/toolkit';
import rfqMailReducer from './rfqMailSlice';

const storage = configureStore({
  reducer: {
    rfqMails: rfqMailReducer
  }
});

export default storage;
