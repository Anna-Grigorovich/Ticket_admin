import React, { useState, useEffect } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
} from '@mui/material';

const EditEventModal = ({ open, onClose, eventData, onSave }) => {
  const [title, setTitle] = useState(eventData.title || '');
  const [description, setDescription] = useState(eventData.description || '');
  const [date, setDate] = useState(eventData.date || '');
  const [time, setTime] = useState(eventData.time || '');
  const [price, setPrice] = useState(eventData.price || '');
  const [place, setPlace] = useState(eventData.place || '');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    setTitle(eventData.title || '');
    setDescription(eventData.description || '');
    setDate(eventData.date || '');
    setTime(eventData.time || '');
    setPrice(eventData.price || '');
    setPlace(eventData.place || '');
    setImage(eventData.image || null);
    setImagePreview(null); // Сбросить превью при открытии модалки
  }, [eventData]);

  const handleSave = () => {
    const updatedEvent = {
      ...eventData,
      title,
      description,
      date,
      time,
      price: parseFloat(price),
      image: image ? URL.createObjectURL(image) : eventData.image,
      place,
    };
    onSave(updatedEvent);
    onClose();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Змінити подію</DialogTitle>
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              minRows={4}
              inputProps={{ style: { fontSize: 16 } }}
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
          <Grid item xs={12}>
            <Button variant="contained" component="label" fullWidth>
              Змінити афішу
              <input type="file" hidden onChange={handleImageChange} />
            </Button>
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Прев'ю нової афіші"
                style={{ marginTop: '10px', maxWidth: '100%', height: 'auto' }}
              />
            ) : (
              <img
                src={eventData.image}
                alt="Поточна афіша"
                style={{ marginTop: '10px', maxWidth: '100%', height: 'auto' }}
              />
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Закрити</Button>
        <Button onClick={handleSave} variant="contained">
          Зберегти
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditEventModal;
