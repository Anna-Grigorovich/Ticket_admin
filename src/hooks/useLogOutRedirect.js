// import { useEffect } from 'react';
// import { useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom';

// // utils/tokenUtils.js
// export const isTokenExpired = (token) => {
//   if (!token) return true;
//   const payload = JSON.parse(atob(token.split('.')[1]));
//   const expirationTime = payload.exp * 1000; // Время истечения токена
//   return Date.now() >= expirationTime; // Если время истекло
// };

// // export const useLogOutRedirect = () => {
// //   const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
// //   console.log('isLoggedIn:', isLoggedIn); // Добавьте это для отладки

// //   const navigate = useNavigate();
// //   useEffect(() => {
// //     if (!isLoggedIn) {
// //       navigate('/login', { replace: true });
// //     }
// //   }, [isLoggedIn, navigate]);
// // };
// export const useLogOutRedirect = () => {
//   const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!isLoggedIn || isTokenExpired(token)) {
//       localStorage.removeItem('token'); // Удаляем токен из localStorage
//       navigate('/login', { replace: true }); // Перенаправляем на страницу логина
//     }
//   }, [isLoggedIn, navigate]);
// };
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

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

  useEffect(() => {
    const token = localStorage.getItem('token'); // Получаем токен из localStorage
    // Проверяем, если токен отсутствует или истек
    if (!isLoggedIn || isTokenExpired(token)) {
      localStorage.removeItem('token'); // Удаляем токен из localStorage
      localStorage.removeItem('login'); // Также можно удалить другие данные (если они есть)
      localStorage.removeItem('role');
      navigate('/login', { replace: true }); // Перенаправляем на страницу логина
    }
  }, [isLoggedIn, navigate]); // Хук запускается при изменении авторизации или навигации
};
