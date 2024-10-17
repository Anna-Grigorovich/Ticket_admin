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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { useLogOutRedirect } from '../../hooks/useLogOutRedirect';

const Home = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useLogOutRedirect(); // Если нужно перенаправить неавторизованного пользователя

  // Функция для получения списка всех пользователей
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3300/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data.users); // Предполагается, что данные пользователей возвращаются в поле "users"
      console.log(response.data.users);
    } catch (error) {
      console.error('Ошибка при получении пользователей:', error);
    }
  };

  // Вызов fetchUsers при монтировании компонента
  useEffect(() => {
    fetchUsers();
  }, []);

  // Функция для регистрации нового пользователя
  const handleRegister = async () => {
    if (username && password && role) {
      try {
        const token = localStorage.getItem('token');
        const newUser = { login: username, password: password, role: role };

        const response = await axios.post(
          'http://localhost:3300/users',
          newUser,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        // Обновляем список пользователей после успешного добавления
        fetchUsers();
        setUsername('');
        setPassword('');
        setRole('');
      } catch (error) {
        console.error('Ошибка регистрации:', error);
        alert('Не удалось зарегистрировать пользователя.');
      }
    }
  };

  // Открытие диалогового окна с подтверждением удаления
  const handleOpenDialog = (userId) => {
    setSelectedUserId(userId);
    setOpenDialog(true);
  };

  // Закрытие диалогового окна
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUserId(null);
  };

  // Функция для удаления пользователя
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3300/users/${selectedUserId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Обновляем список пользователей после успешного удаления
      fetchUsers();
      handleCloseDialog();
    } catch (error) {
      console.error('Ошибка при удалении пользователя:', error);
      alert('Не удалось удалить пользователя.');
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

      {/* Таблица с пользователями */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Логін</TableCell>
              <TableCell>Роль</TableCell>
              <TableCell align="right">Дії</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.login}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell align="right">
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleOpenDialog(user._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Диалоговое окно для подтверждения удаления */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Підтвердження видалення
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Ви впевнені, що хочете видалити цього користувача?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Скасувати
          </Button>
          <Button onClick={handleDelete} color="secondary" autoFocus>
            Видалити
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Home;
