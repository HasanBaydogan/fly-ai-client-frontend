import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  rfqMails: []
};

const rfqMailSlice = createSlice({
  name: 'rfqMails',
  initialState,
  reducers: {
    putRfqMails: (state, action) => {},

    deleteRfqMails: (state, action) => {}
  }
});

export const { putRfqMails, deleteRfqMails } = rfqMailSlice.actions;
export default rfqMailSlice.reducer;
