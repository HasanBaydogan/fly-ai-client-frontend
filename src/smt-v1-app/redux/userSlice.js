import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {
    email: ''
  }
};

const userSlice = createSlice({
  name: 'rfqMails',
  initialState,
  reducers: {
    putUser: (state, action) => {
      const { email } = action.payload;
      state.user.email = email;
    },

    deleteUser: (state, action) => {
      state.user.email = '';
    }
  }
});

export const { putUser, deleteUser } = userSlice.actions;
export default userSlice.reducer;
