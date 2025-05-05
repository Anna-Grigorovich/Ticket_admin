import React from 'react';
import './Dashboard.module.css';
import { Box, Typography, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useLogOutRedirect } from '../../hooks/useLogOutRedirect';

const Dashboard = () => {
  useLogOutRedirect();

  return (
    <div className="dashboard-container">
      <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Paper elevation={3} className="welcome-paper">
          <div className="welcome-content">
            <HomeIcon className="home-icon" />
            <Typography variant="h3" component="h1" className="welcome-title">
              Головна сторінка
            </Typography>
            <Typography variant="body1" className="welcome-text">
              Вітаємо в адміністративній панелі системи управління квитками
            </Typography>
          </div>
        </Paper>
      </Box>
    </div>
  );
};

export default Dashboard;
