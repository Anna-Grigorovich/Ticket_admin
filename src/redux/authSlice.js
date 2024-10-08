import { createSlice } from '@reduxjs/toolkit';
// import authOperations from './authOperation';
const initialState = {
  user: { name: null, email: null },
  token: null,
  login: '',
  isLoggedIn: false,
  isFetchingCurrentUser: false,
};
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logIn(state, action) {
      state.login = action.payload;
      state.isLoggedIn = true;
    },
    logOut(state) {
      state.login = ' ';
      state.isLoggedIn = false;
    },
  },
});

export const { logIn, logOut } = authSlice.actions;
// export const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   extraReducers: {
//     [authOperations.register.fulfilled](state, action) {
//       state.user = action.payload.user;
//       console.log(action.payload.user);
//       state.token = action.payload.token;
//       state.isLoggedIn = true;
//     },
//     [authOperations.logIn.fulfilled](state, action) {
//       state.user = action.payload.user;
//       state.token = action.payload.token;
//       state.isLoggedIn = true;
//     },
//     [authOperations.logOut.fulfilled](state) {
//       state.user = { name: null, email: null };
//       state.token = null;
//       state.isLoggedIn = false;
//     },
//     [authOperations.fetchCurrentUser.pending](state) {
//       state.isFetchingCurrentUser = true;
//     },
//     [authOperations.fetchCurrentUser.fulfilled](state, action) {
//       state.user = action.payload;
//       state.isLoggedIn = true;
//       state.isFetchingCurrentUser = false;
//     },
//     [authOperations.fetchCurrentUser.rejected](state) {
//       state.isFetchingCurrentUser = false;
//     },
//   },
// });
