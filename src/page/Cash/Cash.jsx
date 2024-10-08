import React, { useState } from 'react';
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
import { useLogOutRedirect } from '../../hooks/useLogOutRedirect';

const Cash = ({ events }) => {
  const [selectedEvent, setSelectedEvent] = useState('');
  const [barcode, setBarcode] = useState('');
  const [scanResult, setScanResult] = useState(null);
  useLogOutRedirect();
  const handleEventChange = (event) => {
    setSelectedEvent(event.target.value);
  };

  const handleBarcodeChange = (event) => {
    setBarcode(event.target.value);
  };

  const checkTicket = () => {
    console.log(
      `Проверка билета для события: ${selectedEvent}, штрих-код: ${barcode}`,
    );

    if (barcode === '12345') {
      setScanResult('valid');
    } else {
      setScanResult('inHall');
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
                events.map((event) => (
                  <MenuItem key={event.id} value={event.id}>
                    {`${event.title} - ${event.date}`}
                  </MenuItem>
                ))
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
                  : scanResult === 'inHall'
                  ? 'red'
                  : 'grey',
              textAlign: 'center',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="h6" sx={{ color: 'white' }}>
              {scanResult === 'valid'
                ? 'Прохід дозволено'
                : scanResult === 'inHall'
                ? 'Квиток в залі'
                : 'Результат сканування відобразиться тут'}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cash;
