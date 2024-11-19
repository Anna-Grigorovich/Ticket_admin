import React, { useState, useEffect } from 'react';
import {
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button,
  Grid,
  Box,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useLogOutRedirect } from '../../hooks/useLogOutRedirect';
import { format } from 'date-fns';
import uk from 'date-fns/locale/uk';

const Cash = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [barcode, setBarcode] = useState('');
  const [scanResult, setScanResult] = useState(null);

  useLogOutRedirect();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:3300/events'); // Получение событий с бэкенда
        setEvents(response.data.events); // Обновление состояния с полученными событиями
      } catch (error) {
        console.error('Ошибка при получении ивентов:', error);
      }
    };

    fetchEvents(); // Вызов функции для получения событий
  }, []);

  const handleEventChange = (event) => {
    setSelectedEvent(event.target.value);
  };

  const handleBarcodeChange = (event) => {
    setBarcode(event.target.value);
  };

  const checkTicket = async () => {
    console.log(
      `Проверка билета для события: ${selectedEvent}, штрих-код: ${barcode}`,
    );

    try {
      const token = localStorage.getItem('token'); // Предположим, что вы храните токен в localStorage

      const response = await axios.get(
        `http://localhost:3300/tickets/${selectedEvent}/${barcode}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Добавляем заголовок с токеном
          },
        },
      );
      setScanResult('valid'); // Если билет найден, устанавливаем статус
    } catch (error) {
      console.error('Ошибка при проверке билета:', error);

      if (error.response) {
        const status = error.response.status;
        if (status === 404) {
          setScanResult('notFound'); // Билет не найден
        } else if (status === 400) {
          setScanResult('wrongEvent'); // Билет не соответствует событию
        } else if (status === 409) {
          setScanResult('alreadyScanned'); // Билет уже отсканирован
        } else if (status === 401) {
          setScanResult('unauthorized'); // Ошибка аутентификации
        }
      } else {
        setScanResult('error'); // Общая ошибка
      }
    }
  };
  return (
    <Container maxWidth="sm">
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Оберіть подію</InputLabel>
            <Select
              value={selectedEvent}
              onChange={handleEventChange}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200, // Максимальная высота выпадающего списка
                    overflowY: 'auto', // Прокрутка, если элементы не помещаются
                  },
                },
              }}
            >
              {events.length > 0 ? (
                events.map((event) => {
                  const eventDate = new Date(event.date);

                  // Форматируем дату и время
                  const formattedDateTime = format(
                    eventDate,
                    'd MMMM yyyy, EEE. HH:mm',
                    {
                      locale: uk,
                    },
                  );

                  return (
                    <MenuItem key={event._id} value={event._id}>
                      {`${event.title} - ${formattedDateTime}`}
                    </MenuItem>
                  );
                })
              ) : (
                <MenuItem disabled>Нет доступных событий</MenuItem>
              )}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Введіть штрих-код"
            value={barcode}
            onChange={handleBarcodeChange}
          />
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" fullWidth onClick={checkTicket}>
            Сканувати квиток
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Box
            sx={{
              p: 2,
              borderRadius: 1,
              backgroundColor:
                scanResult === 'valid'
                  ? 'green'
                  : scanResult === 'wrongEvent'
                  ? 'blue'
                  : scanResult === 'alreadyScanned'
                  ? 'orange'
                  : scanResult === 'notFound'
                  ? 'red'
                  : 'grey',
              textAlign: 'center',
              height: '300px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h6" sx={{ color: 'white' }}>
              {scanResult === 'valid'
                ? 'Прохід дозволено'
                : scanResult === 'wrongEvent'
                ? 'Квиток не для цієї події'
                : scanResult === 'alreadyScanned'
                ? 'Квиток вже відскановано'
                : scanResult === 'notFound'
                ? 'Квиток не знайдено'
                : 'Результат сканування відобразиться тут'}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cash;
