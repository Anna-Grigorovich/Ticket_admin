import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  user: { name: null, email: null },
  token: null,
  login: '',
  isLoggedIn: false,
  isFetchingCurrentUser: false,
  error: null, // Добавляем состояние для ошибок
};

// Асинхронный экшен для логина
export const logInUser = createAsyncThunk(
  'auth/logInUser',
  async ({ login, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:3300/auth/login', {
        login,
        password,
      });
      return { token: response.data.token, login }; // Возвращаем токен и логин
    } catch (error) {
      return rejectWithValue(error.response.data); // Возвращаем ошибку, если запрос не удался
    }
  },
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logOut(state) {
      state.login = '';
      state.token = null;
      state.isLoggedIn = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logInUser.pending, (state) => {
        state.isFetchingCurrentUser = true;
        state.error = null;
      })
      .addCase(logInUser.fulfilled, (state, action) => {
        // Сохраняем токен и логин пользователя после успешного логина
        state.token = action.payload.token; // Сохраняем токен
        state.login = action.payload.login; // Сохраняем логин, переданный в запросе
        state.isLoggedIn = true;
        state.isFetchingCurrentUser = false;
      })
      .addCase(logInUser.rejected, (state, action) => {
        state.error = action.payload || 'Ошибка авторизации';
        state.isFetchingCurrentUser = false;
      });
  },
});

export const { logOut } = authSlice.actions;
export default authSlice.reducer;
