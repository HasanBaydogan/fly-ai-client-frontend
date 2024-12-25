import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
      state.rfqMails = state.rfqMails.filter(
        mail => !action.payload.includes(mail.id)
      );
    }
  }
});

export const { putRfqMails, deleteRfqMails } = rfqMailSlice.actions;
export default rfqMailSlice.reducer;
