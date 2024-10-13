import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { useLogOutRedirect } from '../../hooks/useLogOutRedirect';

const Home = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [users, setUsers] = useState([]);

  useLogOutRedirect(); // Если нужно перенаправить неавторизованного пользователя

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3300/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Response data:', response.data); // Проверь, что здесь массив
      setUsers(response.data.users);
    } catch (error) {
      console.error('Ошибка при получении пользователей:', error);
    }
  };

  // Вызов fetchUsers при монтировании компонента
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRegister = async () => {
    if (username && password && role) {
      try {
        // Достаём токен администратора из localStorage или redux
        const token = localStorage.getItem('token');
        console.log(token);
        // Формируем объект с данными нового пользователя
        const newUser = {
          login: username,
          password: password,
          role: role,
        };

        // Отправляем запрос на сервер
        const response = await axios.post(
          'http://localhost:3300/users', // Это адрес твоего эндпоинта
          newUser,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Передаём токен администратора
            },
          },
        );

        // Если регистрация успешна, добавляем нового пользователя в список
        setUsers([...users, { id: users.length + 1, name: username, role }]);
        setUsername('');
        setPassword('');
        setRole('');
      } catch (error) {
        console.error('Ошибка регистрации:', error);
        alert('Не удалось зарегистрировать пользователя. Проверьте данные.');
      }
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Реєстрація користувача
      </Typography>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}
      >
        <TextField
          label="Ім'я користувача"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
        />
        <TextField
          label="Пароль"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
        />
        <FormControl fullWidth>
          <InputLabel id="role-label">Роль</InputLabel>
          <Select
            labelId="role-label"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            fullWidth
          >
            <MenuItem value="manager">Менеджер</MenuItem>
            <MenuItem value="seller">Касир</MenuItem>
            <MenuItem value="admin">Адмін</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={handleRegister}>
          Зареєструвати
        </Button>
      </Box>

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Зареєстровані користувачі
      </Typography>
      <List>
        {users.map((user) => (
          <ListItem key={user.id}>
            <ListItemText primary={user.login} secondary={user.role} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Home;
