import React, { useState, useEffect } from 'react';
import './Dashboard.module.css';
import { Box, Typography, Paper, Grid, CircularProgress } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import { useLogOutRedirect } from '../../hooks/useLogOutRedirect';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useLogOutRedirect();

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error(`Помилка HTTP: ${response.status}`);
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error('Помилка завантаження даних дашборду:', err);
        setError(err.message);
        // Mock data fallback
        const mockData = {
          userName: 'Іван Петров',
          userRole: 'Організатор',
          serviceFee: 5,
          eventsStats: {
            total: 12,
            hidden: 3,
            inSell: 7,
            currentEvents: ['Концерт', 'Виставка'],
            totalTicketsSold: 253,
            totalRevenue: 126500,
          },
          ticketsStats: {
            totalAvailable: 500,
            totalScanned: 180,
          },
        };
        setData(mockData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Paper
        elevation={3}
        sx={{ p: 3, textAlign: 'center', color: 'error.main' }}
      >
        <Typography variant="h6">
          Помилка завантаження даних: {error}
        </Typography>
      </Paper>
    );
  }

  const eventPieData = [
    { name: 'Приховані', value: data.eventsStats.hidden, color: '#ffcca9' },
    { name: 'У продажу', value: data.eventsStats.inSell, color: '#6bc4a6' },
    {
      name: 'Поточні',
      value: data.eventsStats.currentEvents.length,
      color: '#0099cc',
    },
  ];

  const ticketPieData = [
    {
      name: 'Відскановані',
      value: data.ticketsStats.totalScanned,
      color: '#0099cc',
    },
    {
      name: 'Доступні',
      value: data.ticketsStats.totalAvailable - data.ticketsStats.totalScanned,
      color: '#6bc4a6',
    },
  ];

  return (
    <div className="dashboard-container">
      <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Paper elevation={3} sx={{ mb: 3, p: 3 }}>
          <Box sx={{ textAlign: 'center' }}>
            <HomeIcon sx={{ fontSize: 40, mb: 1, color: 'primary.main' }} />
            <Typography variant="h3" component="h1">
              Головна сторінка
            </Typography>
            <Typography variant="body1">
              Вітаємо в адміністративній панелі системи управління квитками
            </Typography>
          </Box>
        </Paper>

        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Інформація користувача
          </Typography>
          <Typography variant="body1">
            {data.userName} ({data.userRole})
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Сервісний збір: {data.serviceFee}%
          </Typography>
        </Paper>

        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Загальна статистика
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText',
                }}
              >
                <Typography variant="body2">Усього заходів</Typography>
                <Typography variant="h4">{data.eventsStats.total}</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  bgcolor: 'success.light',
                  color: 'success.contrastText',
                }}
              >
                <Typography variant="body2">Продано квитків</Typography>
                <Typography variant="h4">
                  {data.eventsStats.totalTicketsSold}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={1}
                sx={{ p: 2, bgcolor: 'info.light', color: 'info.contrastText' }}
              >
                <Typography variant="body2">Доступно квитків</Typography>
                <Typography variant="h4">
                  {data.ticketsStats.totalAvailable}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  bgcolor: 'secondary.light',
                  color: 'secondary.contrastText',
                }}
              >
                <Typography variant="body2">Загальний дохід</Typography>
                <Typography variant="h4">
                  {data.eventsStats.totalRevenue.toLocaleString()} ₴
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Paper>

        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Кругові діаграми
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" align="center" sx={{ mb: 1 }}>
                Статистика заходів
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={eventPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {eventPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" align="center" sx={{ mb: 1 }}>
                Статистика квитків
              </Typography>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={ticketPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {ticketPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Grid>
          </Grid>
        </Paper>

        {data.eventsStats.currentEvents.length > 0 && (
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Поточні заходи
            </Typography>
            <Grid container spacing={2}>
              {data.eventsStats.currentEvents.map((event, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Paper
                    elevation={1}
                    sx={{ p: 2, bgcolor: 'background.default' }}
                  >
                    <Typography variant="subtitle1">{event}</Typography>
                    <Typography variant="body2" color="success.main">
                      Активний
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}
      </Box>
    </div>
  );
};

export default Dashboard;
