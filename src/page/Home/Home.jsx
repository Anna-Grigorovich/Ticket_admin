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
  Alert,
  Snackbar,
  Divider,
  Avatar,
  Chip,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
  AdminPanelSettings as AdminIcon,
  Support as ManagerIcon,
  PointOfSale as SellerIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useLogOutRedirect } from '../../hooks/useLogOutRedirect';

const Home = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const API_URL = process.env.REACT_APP_API_URL;

  useLogOutRedirect();

  // Get role icon based on user role
  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <AdminIcon />;
      case 'manager':
        return <ManagerIcon />;
      case 'seller':
        return <SellerIcon />;
      default:
        return null;
    }
  };

  // Get role color based on user role
  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'manager':
        return 'primary';
      case 'seller':
        return 'success';
      default:
        return 'default';
    }
  };

  // Get role display name in Ukrainian
  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'admin':
        return 'Адмін';
      case 'manager':
        return 'Менеджер';
      case 'seller':
        return 'Касир';
      default:
        return role;
    }
  };

  // Function to fetch all users
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Помилка при отриманні користувачів:', error);
      showSnackbar('Не вдалося завантажити користувачів', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to register a new user
  const handleRegister = async () => {
    if (!username || !password || !role) {
      showSnackbar('Будь ласка, заповніть всі поля', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const newUser = { login: username, password: password, role: role };

      await axios.post(`${API_URL}/users`, newUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Clear form and update user list
      setUsername('');
      setPassword('');
      setRole('');
      await fetchUsers();
      showSnackbar('Користувача успішно зареєстровано', 'success');
    } catch (error) {
      console.error('Помилка реєстрації:', error);
      showSnackbar('Не вдалося зареєструвати користувача', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Open delete confirmation dialog
  const handleOpenDialog = (userId, userName) => {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
    setOpenDialog(true);
  };

  // Close delete confirmation dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUserId(null);
    setSelectedUserName('');
  };

  // Function to delete a user
  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `https://devback.toptickets.com.ua/users/${selectedUserId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Удаляем пользователя из списка без повторного запроса
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== selectedUserId),
      );
      showSnackbar('Користувача успішно видалено', 'success');
    } catch (error) {
      console.error(
        'Помилка при видаленні користувача:',
        error.response?.data || error.message,
      );
      showSnackbar('Не вдалося видалити користувача', 'error');
    } finally {
      handleCloseDialog();
      setIsLoading(false);
    }
  };

  // Show snackbar notification
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Grid container spacing={4}>
        {/* Registration Form */}
        <Grid item xs={12} md={4}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PersonAddIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h5" component="h2">
                  Реєстрація користувача
                </Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                  label="Ім'я користувача"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  fullWidth
                  variant="outlined"
                />
                <TextField
                  label="Пароль"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                  variant="outlined"
                />
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="role-label">Роль</InputLabel>
                  <Select
                    labelId="role-label"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    label="Роль"
                  >
                    <MenuItem value="manager">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ManagerIcon sx={{ mr: 1, color: 'primary.main' }} />
                        Менеджер
                      </Box>
                    </MenuItem>
                    <MenuItem value="seller">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <SellerIcon sx={{ mr: 1, color: 'success.main' }} />
                        Касир
                      </Box>
                    </MenuItem>
                    <MenuItem value="admin">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AdminIcon sx={{ mr: 1, color: 'error.main' }} />
                        Адмін
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleRegister}
                  disabled={isLoading}
                  startIcon={<PersonAddIcon />}
                  size="large"
                  sx={{ mt: 1 }}
                >
                  Зареєструвати
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Users List */}
        <Grid item xs={12} md={8}>
          <Card elevation={3}>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                }}
              >
                <Typography variant="h5" component="h2">
                  Зареєстровані користувачі
                </Typography>
                <Button
                  startIcon={<RefreshIcon />}
                  onClick={fetchUsers}
                  disabled={isLoading}
                  variant="outlined"
                  size="small"
                >
                  Оновити
                </Button>
              </Box>
              <Divider sx={{ mb: 3 }} />

              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Користувач</TableCell>
                      <TableCell>Роль</TableCell>
                      <TableCell align="right">Дії</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.length > 0 ? (
                      users.map((user) => (
                        <TableRow
                          key={user._id}
                          sx={{
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.04)',
                            },
                          }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Avatar
                                sx={{
                                  bgcolor: getRoleColor(user.role),
                                  width: 36,
                                  height: 36,
                                  mr: 2,
                                }}
                              >
                                {user.login.charAt(0).toUpperCase()}
                              </Avatar>
                              <Typography>{user.login}</Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={getRoleIcon(user.role)}
                              label={getRoleDisplayName(user.role)}
                              color={getRoleColor(user.role)}
                              variant="outlined"
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              onClick={() =>
                                handleOpenDialog(user._id, user.login)
                              }
                              color="error"
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          <Typography color="textSecondary" sx={{ py: 2 }}>
                            {isLoading
                              ? 'Завантаження...'
                              : 'Користувачів не знайдено'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Delete confirmation dialog */}
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
            Ви впевнені, що хочете видалити користувача{' '}
            <strong>{selectedUserName}</strong>? Цю дію неможливо скасувати.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            color="primary"
            disabled={isLoading}
          >
            Скасувати
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={isLoading}
            startIcon={<DeleteIcon />}
          >
            Видалити
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Home;
