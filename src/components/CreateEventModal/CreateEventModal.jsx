import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  Checkbox,
  FormControlLabel,
  IconButton,
  Typography,
  Divider,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { CircularProgress } from '@mui/material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const CreateEventModal = ({ open, onClose, onEventCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [place, setPlace] = useState('');
  const [address, setAddress] = useState('');
  const [show, setShow] = useState(true);
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [priceOptions, setPriceOptions] = useState([
    {
      price: '',
      available: 100,
      place: '',
      description: 'Місця в фан-зоні',
    },
  ]);

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Назва обов’язкова';
    if (!description.trim()) newErrors.description = 'Опис обов’язковий';
    if (!date) newErrors.date = 'Дата початку обов’язкова';
    if (!time) newErrors.time = 'Час початку обов’язковий';
    if (!endDate) newErrors.endDate = 'Дата завершення обов’язкова';
    if (!endTime) newErrors.endTime = 'Час завершення обов’язковий';
    if (!place.trim()) newErrors.place = 'Місце проведення обов’язкове';
    if (!address.trim()) newErrors.address = 'Адреса обов’язкова';

    priceOptions.forEach((option, index) => {
      if (!option.price) {
        newErrors[`price-${index}`] = 'Ціна обов’язкова';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validate()) return;
    setLoading(true); // 🟦 Показать спиннер

    try {
      const token = localStorage.getItem('token');
      const dateStart = new Date(`${date}T${time}`).getTime();
      const dateEnd = new Date(`${endDate}T${endTime}`).getTime();

      const formattedPriceOptions = priceOptions.map((option) => ({
        price: Number(option.price),
        available: Number(option.available),
        place: option.place || place,
        description: option.description,
      }));

      const eventData = {
        title,
        description,
        date: dateStart,
        dateEnd,
        place,
        address,
        prices: formattedPriceOptions,
        show,
        ended: false,
        sellEnded: false,
      };

      const eventResponse = await axios.post(
        `${API_URL}/events-bo`,
        eventData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (eventResponse.status === 201) {
        const eventId = eventResponse.data._id;

        if (image) {
          const formData = new FormData();
          formData.append('poster', image);

          await axios.post(`${API_URL}/events-bo/upload/${eventId}`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          });
        }

        onEventCreated();
        onClear();
        onClose();
      }
    } catch (error) {
      console.error(
        'Помилка при створенні події:',
        error.response?.data || error,
      );
    } finally {
      setLoading(false); // 🟦 Скрыть спиннер
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const onClear = () => {
    setTitle('');
    setDescription('');
    setDate('');
    setTime('');
    setEndDate('');
    setEndTime('');
    setPlace('');
    setAddress('');
    setShow(true);
    setImage(null);
    setPreviewImage(null);
    setErrors({});
    setPriceOptions([
      {
        price: '',
        available: 100,
        place: '',
        description: 'Місця в фан-зоні',
      },
    ]);
  };

  const addPriceOption = () => {
    setPriceOptions([
      ...priceOptions,
      {
        price: '',
        available: 100,
        place: '',
        description: '',
      },
    ]);
  };

  const removePriceOption = (index) => {
    if (priceOptions.length > 1) {
      const updatedOptions = [...priceOptions];
      updatedOptions.splice(index, 1);
      setPriceOptions(updatedOptions);
    }
  };

  const updatePriceOption = (index, field, value) => {
    const updatedOptions = [...priceOptions];
    updatedOptions[index][field] = value;
    setPriceOptions(updatedOptions);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Створити подію</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Назва події"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
              margin="normal"
              required
              error={!!errors.title}
              helperText={errors.title}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Опис"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              margin="normal"
              required
              error={!!errors.description}
              helperText={errors.description}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Дата початку"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              fullWidth
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
              error={!!errors.date}
              helperText={errors.date}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Час початку"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              fullWidth
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
              error={!!errors.time}
              helperText={errors.time}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Дата завершення"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              fullWidth
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
              error={!!errors.endDate}
              helperText={errors.endDate}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Час завершення"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              fullWidth
              margin="normal"
              required
              InputLabelProps={{ shrink: true }}
              error={!!errors.endTime}
              helperText={errors.endTime}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Місце проведення"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              fullWidth
              margin="normal"
              required
              error={!!errors.place}
              helperText={errors.place}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Адреса"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              fullWidth
              margin="normal"
              required
              error={!!errors.address}
              helperText={errors.address}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Варіанти квитків
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {priceOptions.map((option, index) => (
              <Paper
                key={index}
                elevation={1}
                sx={{ p: 2, mb: 2, position: 'relative' }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      Варіант квитка #{index + 1}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <TextField
                      label="Ціна"
                      type="number"
                      value={option.price}
                      onChange={(e) =>
                        updatePriceOption(index, 'price', e.target.value)
                      }
                      fullWidth
                      required
                      error={!!errors[`price-${index}`]}
                      helperText={errors[`price-${index}`]}
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <TextField
                      label="Кількість квитків"
                      type="number"
                      value={option.available}
                      onChange={(e) =>
                        updatePriceOption(index, 'available', e.target.value)
                      }
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <TextField
                      label="Місце (опційно)"
                      value={option.place}
                      onChange={(e) =>
                        updatePriceOption(index, 'place', e.target.value)
                      }
                      fullWidth
                      placeholder="Секція/Зона"
                    />
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <TextField
                      label="Опис"
                      value={option.description}
                      onChange={(e) =>
                        updatePriceOption(index, 'description', e.target.value)
                      }
                      fullWidth
                    />
                  </Grid>
                  {priceOptions.length > 1 && (
                    <IconButton
                      aria-label="delete"
                      onClick={() => removePriceOption(index)}
                      sx={{ position: 'absolute', top: 8, right: 8 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Grid>
              </Paper>
            ))}

            <Button
              startIcon={<AddIcon />}
              onClick={addPriceOption}
              variant="outlined"
              fullWidth
              sx={{ mt: 1 }}
            >
              Додати ще один тип квитків
            </Button>
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={show}
                  onChange={(e) => setShow(e.target.checked)}
                />
              }
              label="Показувати"
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" component="label" fullWidth>
              Додати афішу
              <input type="file" hidden onChange={handleImageChange} />
            </Button>
          </Grid>
          {previewImage && (
            <Grid item xs={12}>
              <img
                src={previewImage}
                alt="Preview"
                style={{
                  width: '150px',
                  height: '150px',
                  objectFit: 'contain',
                }}
              />
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Закрити</Button>
        {/* <Button onClick={handleCreate} variant="contained">
          Створити
        </Button> */}
        <Button onClick={handleCreate} variant="contained" disabled={loading}>
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Створити'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateEventModal;
