// import React, { useState, useEffect } from 'react';
// import {
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   TextField,
//   Grid,
// } from '@mui/material';

// const EditEventModal = ({ open, onClose, eventData, onSave }) => {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [date, setDate] = useState('');
//   const [time, setTime] = useState('');
//   const [price, setPrice] = useState('');
//   const [place, setPlace] = useState('');
//   const [address, setAddress] = useState('');

//   // Когда модальное окно открывается, мы загружаем данные события для редактирования
//   useEffect(() => {
//     if (eventData) {
//       setTitle(eventData.title);
//       setDescription(eventData.description);
//       setDate(new Date(eventData.date).toISOString().split('T')[0]); // Конвертация timestamp в формат даты
//       setTime(
//         new Date(eventData.date)
//           .toLocaleTimeString('en-US', { hour12: false })
//           .substring(0, 5),
//       );
//       setPrice(eventData.price);
//       setPlace(eventData.place);
//       setAddress(eventData.address);
//     }
//   }, [eventData]);

//   const handleSave = () => {
//     const updatedEvent = {
//       ...eventData, // Сохраняем _id и другие неизмененные поля
//       title,
//       description,
//       date: new Date(`${date}T${time}`).getTime(), // Преобразуем дату и время в timestamp
//       price: Number(price),
//       place,
//       address,
//     };
//     onSave(updatedEvent); // Передаем обновленные данные события
//   };

//   return (
//     <Dialog open={open} onClose={onClose}>
//       <DialogTitle>Редактировать подію</DialogTitle>
//       <DialogContent>
//         <Grid container spacing={2}>
//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               label="Назва події"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               fullWidth
//               label="Опис"
//               multiline
//               rows={5}
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             />
//           </Grid>
//           <Grid item xs={6}>
//             <TextField
//               fullWidth
//               label="Дата"
//               type="date"
//               value={date}
//               onChange={(e) => setDate(e.target.value)}
//               InputLabelProps={{ shrink: true }}
//             />
//           </Grid>
//           <Grid item xs={6}>
//             <TextField
//               fullWidth
//               label="Час"
//               type="time"
//               value={time}
//               onChange={(e) => setTime(e.target.value)}
//               InputLabelProps={{ shrink: true }}
//             />
//           </Grid>
//           <Grid item xs={6}>
//             <TextField
//               fullWidth
//               label="Ціна"
//               type="number"
//               value={price}
//               onChange={(e) => setPrice(e.target.value)}
//             />
//           </Grid>
//           <Grid item xs={6}>
//             <TextField
//               fullWidth
//               label="Місце проведення"
//               value={place}
//               onChange={(e) => setPlace(e.target.value)}
//             />
//           </Grid>
//           <Grid item xs={6}>
//             <TextField
//               fullWidth
//               label="Адреса"
//               value={address}
//               onChange={(e) => setAddress(e.target.value)}
//             />
//           </Grid>
//         </Grid>
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>Скасувати</Button>
//         <Button onClick={handleSave} variant="contained">
//           Зберегти
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default EditEventModal;
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
import axios from 'axios';

const EditEventModal = ({ open, onClose, eventData, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [price, setPrice] = useState('');
  const [place, setPlace] = useState('');
  const [address, setAddress] = useState('');
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Загружаем данные события при открытии модалки
  useEffect(() => {
    if (eventData) {
      setTitle(eventData.title);
      setDescription(eventData.description);
      setDate(new Date(eventData.date).toISOString().split('T')[0]); // Преобразуем timestamp в дату
      setTime(
        new Date(eventData.date)
          .toLocaleTimeString('en-US', { hour12: false })
          .substring(0, 5),
      );
      setPrice(eventData.price);
      setPlace(eventData.place);
      setAddress(eventData.address);

      // Загрузим текущий постер для предварительного просмотра
      setPreviewImage(`http://localhost:3300/images/${eventData._id}.jpg`);
    }
  }, [eventData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    const updatedEvent = {
      ...eventData, // Сохраняем _id и другие неизмененные поля
      title,
      description,
      date: new Date(`${date}T${time}`).getTime(),
      price: Number(price),
      place,
      address,
    };

    // Передаем обновленные данные
    await onSave(updatedEvent);

    // Если было загружено новое изображение, отправляем его на сервер
    if (image) {
      const formData = new FormData();
      formData.append('poster', image);

      try {
        const token = localStorage.getItem('token');
        await axios.post(
          `http://localhost:3300/events/upload/${eventData._id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          },
        );
      } catch (error) {
        console.error('Ошибка загрузки изображения:', error);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Редагувати подію</DialogTitle>
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
              Змінити афішу
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
        <Button onClick={onClose}>Скасувати</Button>
        <Button onClick={handleSave} variant="contained">
          Зберегти
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditEventModal;
