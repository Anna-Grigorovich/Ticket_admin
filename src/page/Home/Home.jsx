import React, { useState } from 'react';
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
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', role: 'Manager' },
    { id: 2, name: 'Jane Smith', role: 'Cashier' },
    { id: 3, name: 'Tom Brown', role: 'Manager' },
  ]);
  useLogOutRedirect();
  const handleRegister = () => {
    if (username && password && role) {
      const newUser = {
        id: users.length + 1,
        name: username,
        password: password, // Store the password (for demonstration purposes only)
        role: role,
      };
      setUsers([...users, newUser]);
      setUsername('');
      setPassword('');
      setRole('');
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
            <MenuItem value="Manager">Менеджер</MenuItem>
            <MenuItem value="Cashier">Касир</MenuItem>
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
            <ListItemText primary={user.name} secondary={user.role} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Home;
