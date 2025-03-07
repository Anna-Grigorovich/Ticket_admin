import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
} from '@mui/material';
import axios from 'axios';

const CreateEventModal = ({ open, onClose, onEventCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [price, setPrice] = useState('');
  const [place, setPlace] = useState('');
  const [address, setAddress] = useState('');
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null); // Для предварительного просмотра

  const handleCreate = async () => {
    if (
      !date ||
      !time ||
      !title ||
      !description ||
      !price ||
      !place ||
      !address
    ) {
      console.error('One or more required fields are missing');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const eventData = {
        title,
        description,
        date: new Date(`${date}T${time}`).getTime(),
        price: Number(price),
        place,
        address,
      };

      console.log('Отправляемые данные:', eventData);

      const eventResponse = await axios.post(
        'https://back.toptickets.com.ua/events',
        eventData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const eventId = eventResponse.data._id;

      if (image) {
        const formData = new FormData();
        formData.append('poster', image);

        await axios.post(
          `https://back.toptickets.com.ua/events/upload/${eventId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          },
        );
      }
      onEventCreated();
      onClear();
      onClose();
    } catch (error) {
      console.error(
        'Ошибка при создании ивента:',
        error.response?.data || error,
      );
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file)); // Создаем URL для предварительного просмотра
    }
  };
  const onClear = () => {
    setDescription('');
    setDate('');
    setTime('');
    setPrice('');
    setPlace('');
    setAddress('');
    setImage('');
    setPreviewImage('');
    setTitle('');
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Створити подію</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Назва події"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Опис"
              multiline
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Дата"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Час"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Ціна"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Місце проведення"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Адреса"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
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
        <Button onClick={handleCreate} variant="contained">
          Створити
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateEventModal;
