import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  user: { name: null, email: null },
  token: localStorage.getItem('token') || null, // Восстанавливаем токен из localStorage
  login: localStorage.getItem('login') || '', // Восстанавливаем логин из localStorage
  isLoggedIn: !!localStorage.getItem('token'), // Если токен есть, пользователь залогинен
  role: localStorage.getItem('role') || '', // Восстанавливаем роль из localStorage
  isFetchingCurrentUser: false,
  error: null, // Состояние для ошибок
};

// Асинхронный экшен для логина
export const logInUser = createAsyncThunk(
  'auth/logInUser',
  async ({ login, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        'https://back.toptickets.com.ua/auth/login',
        {
          login,
          password,
        },
      );
      console.log(response);
      return { token: response.data.access, login, role: response.data.role }; // Предполагаем, что сервер возвращает { token: 'your-token' }
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
      localStorage.removeItem('token'); // Удаляем токен из localStorage при выходе
      localStorage.removeItem('login'); // Удаляем логин из localStorage
      localStorage.removeItem('role'); // Удаляем роль из localStorage
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
        state.token = action.payload.token; // Сохраняем токен в Redux
        state.login = action.payload.login; // Сохраняем логин
        state.role = action.payload.role; // Сохраняем роль пользователя
        state.isLoggedIn = true;
        state.isFetchingCurrentUser = false;

        // Сохраняем токен и логин в localStorage
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('login', action.payload.login);
        localStorage.setItem('role', action.payload.role); // Сохраняем роль в localStorage
      })
      .addCase(logInUser.rejected, (state, action) => {
        state.error = action.payload || 'Ошибка авторизации';
        state.isFetchingCurrentUser = false;
      });
  },
});

export const { logOut } = authSlice.actions;
export default authSlice.reducer;
