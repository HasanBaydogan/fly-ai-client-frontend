import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';

// Define the structure of the state
interface RFQMailState {
  rfqMails: RFQMail[];
}

// Define the initial state with the correct type
const initialState: RFQMailState = {
  rfqMails: [] // Starts with an empty array
};

const rfqMailSlice = createSlice({
  name: 'rfqMails',
  initialState,
  reducers: {
    // Action to add new RFQ mails
    putRfqMails: (state, action: PayloadAction<RFQMail[]>) => {
      state.rfqMails = action.payload;
      
    },

    // Action to delete RFQ mails by their IDs
    deleteRfqMails: (state, action: PayloadAction<string[]>) => {
      state.rfqMails = []
    }
  }
});

// Select RFQ mails with type safety
export const useRFQMailsSelector = () =>
  useSelector((state: { rfqMails: RFQMailState }) => state.rfqMails.rfqMails);
export const { putRfqMails, deleteRfqMails } = rfqMailSlice.actions;
export default rfqMailSlice.reducer;
