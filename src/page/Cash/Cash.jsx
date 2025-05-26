import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  Paper,
  CircularProgress,
} from '@mui/material';
import { CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { useLogOutRedirect } from '../../hooks/useLogOutRedirect';

const API_URL = process.env.REACT_APP_API_URL;

const Cash = () => {
  const [barcode, setBarcode] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [ticketData, setTicketData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useLogOutRedirect();

  const getResultColor = (status) => {
    switch (status) {
      case 'valid':
        return 'green';
      case 'alreadyScanned':
        return 'orange';
      case 'wrongEvent':
        return 'blue';
      case 'notFound':
      case 'unauthorized':
      case 'error':
        return 'red';
      default:
        return 'grey';
    }
  };

  const getResultIcon = (status) => {
    const props = { size: 48, color: 'white' };
    switch (status) {
      case 'valid':
        return <CheckCircle {...props} />;
      case 'alreadyScanned':
        return <Clock {...props} />;
      case 'wrongEvent':
        return <AlertTriangle {...props} />;
      default:
        return <XCircle {...props} />;
    }
  };

  const getResultText = (status) => {
    switch (status) {
      case 'valid':
        return 'Прохід дозволено';
      case 'alreadyScanned':
        return 'Квиток вже відскановано';
      case 'wrongEvent':
        return 'Квиток не для цієї події';
      case 'notFound':
        return 'Квиток не знайдено';
      case 'unauthorized':
        return 'Помилка авторизації';
      case 'error':
        return 'Помилка сканування';
      default:
        return 'Результат сканування відобразиться тут';
    }
  };

  const handleScan = async () => {
    if (!barcode) {
      setError('Введіть штрих-код');
      return;
    }

    setError(null);
    setScanResult(null);
    setTicketData(null);
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/tickets/scan/${barcode}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}`);
      }

      const data = await response.json();
      setScanResult('valid');
      setTicketData(data);
      setBarcode('');
    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('404')) setScanResult('notFound');
      else if (msg.includes('409')) setScanResult('alreadyScanned');
      else if (msg.includes('400')) setScanResult('wrongEvent');
      else if (msg.includes('401')) {
        setScanResult('unauthorized');
        setError('Помилка авторизації. Увійдіть знову.');
      } else {
        setScanResult('error');
        setError('Невідома помилка при скануванні');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Введіть штрих-код"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleScan()}
          />
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Typography color="error">{error}</Typography>
          </Grid>
        )}

        <Grid item xs={12}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleScan}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Сканувати квиток'
            )}
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              backgroundColor: getResultColor(scanResult),
              color: 'white',
              minHeight: 200,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {getResultIcon(scanResult)}
            <Typography variant="h6" sx={{ mt: 2, textAlign: 'center' }}>
              {getResultText(scanResult)}
            </Typography>

            {scanResult === 'valid' && ticketData && (
              <Box mt={2} textAlign="center">
                <Typography>Подія: {ticketData.event?.title}</Typography>
                <Typography>Email: {ticketData.mail}</Typography>
                <Typography>
                  Місце: {ticketData?.event?.prices?.[0]?.description || '—'}
                </Typography>
                <Typography>Ціна: {ticketData.price} грн</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cash;
