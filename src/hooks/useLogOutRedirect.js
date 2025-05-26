import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logOut } from '../redux/authSlice';

// Утилита для проверки токена
export const isTokenExpired = (token) => {
  if (!token) return true;
  const payload = JSON.parse(atob(token.split('.')[1]));
  const expirationTime = payload.exp * 1000; // Время истечения токена
  return Date.now() >= expirationTime; // Если время истекло
};

export const useLogOutRedirect = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // Состояние, определяющее авторизован ли пользователь
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token'); // Получаем токен из localStorage
    // Проверяем, если токен отсутствует или истек
    if (!isLoggedIn || isTokenExpired(token)) {
      localStorage.removeItem('token'); // Удаляем токен из localStorage
      localStorage.removeItem('login'); // Также можно удалить другие данные (если они есть)
      localStorage.removeItem('role');
      dispatch(logOut()); // Сброс Redux
      navigate('/login', { replace: true }); // Перенаправляем на страницу логина
    }
  }, [isLoggedIn, navigate]); // Хук запускается при изменении авторизации или навигации
};
