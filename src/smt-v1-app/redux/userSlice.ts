import { createSlice } from '@reduxjs/toolkit';

const initialState: UserState = {
  user: {
    email: ''
  }
};

const userSlice = createSlice({
  name: 'user',
  initialState, // Use the typed initialState here
  reducers: {
    putUser: (state, action) => {
      const { email } = action.payload;
      state.user.email = email; // Update the email
    },
    deleteUser: state => {
      state.user.email = ''; // Reset the email
    }
  }
});

export const { putUser, deleteUser } = userSlice.actions;
export default userSlice.reducer;
