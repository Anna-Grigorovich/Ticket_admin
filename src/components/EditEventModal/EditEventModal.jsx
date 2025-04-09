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
// import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL;

// const EditEventModal = ({ open, onClose, eventData, onSave }) => {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [date, setDate] = useState('');
//   const [time, setTime] = useState('');
//   const [price, setPrice] = useState('');
//   const [place, setPlace] = useState('');
//   const [address, setAddress] = useState('');
//   const [image, setImage] = useState(null);
//   const [previewImage, setPreviewImage] = useState(null);

//   // Загружаем данные события при открытии модалки
//   useEffect(() => {
//     if (eventData) {
//       console.log('Получены данные события:', eventData);

//       setTitle(eventData.title);
//       setDescription(eventData.description);
//       setDate(new Date(eventData.date).toISOString().split('T')[0]);
//       setTime(
//         new Date(eventData.date)
//           .toLocaleTimeString('en-US', { hour12: false })
//           .substring(0, 5),
//       );
//       setPrice(eventData.prices?.[0]?.price || '');
//       setPlace(eventData.place);
//       setAddress(eventData.address);

//       // Проверяем наличие афиши по ID события
//       const imageUrl = `${API_URL}/images/${eventData._id}.jpg`;
//       setPreviewImage(imageUrl);
//       console.log('URL афиши:', imageUrl);
//     }
//   }, [eventData]);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImage(file);
//       setPreviewImage(URL.createObjectURL(file));
//       console.log('Загружено новое изображение:', file.name);
//     }
//   };

//   const handleSave = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       console.log('Токен для авторизации:', token);

//       // Проверяем наличие ID события
//       const eventId = eventData._id || eventData.id;
//       if (!eventId) {
//         console.error('Ошибка: ID события не найден');
//         return;
//       }
//       console.log('ID события:', eventId);

//       const updatedEvent = {
//         ...eventData,
//         title,
//         description,
//         date: new Date(`${date}T${time}`).getTime(),
//         prices: [
//           {
//             price: Number(price),
//             available: eventData.prices?.[0]?.available || 100,
//             place: place,
//             description: 'Місця в фан-зоні',
//           },
//         ],
//         place,
//         address,
//         show: true,
//         ended: false,
//         sellEnded: false,
//       };

//       console.log('Отправляем обновленные данные:', updatedEvent);

//       // Отправка обновленных данных на сервер
//       const response = await axios.patch(
//         `${API_URL}/events-bo/${eventId}`,
//         updatedEvent,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         },
//       );
//       console.log('Успешное обновление события:', response.data);

//       // Если есть новое изображение, загружаем его отдельно
//       if (image) {
//         const formData = new FormData();
//         formData.append('poster', image);

//         try {
//           const imageResponse = await axios.post(
//             `${API_URL}/events-bo/upload/${eventId}`,
//             formData,
//             {
//               headers: {
//                 Authorization: `Bearer ${token}`,
//                 'Content-Type': 'multipart/form-data',
//               },
//             },
//           );
//           console.log('Изображение успешно загружено:', imageResponse.data);
//         } catch (error) {
//           console.error(
//             'Ошибка при загрузке изображения:',
//             error.response?.data || error,
//           );
//         }
//       }

//       onSave(updatedEvent);
//       onClose();
//     } catch (error) {
//       console.error(
//         'Ошибка при сохранении изменений:',
//         error.response?.data || error,
//       );
//     }
//   };

//   return (
//     <Dialog open={open} onClose={onClose}>
//       <DialogTitle>Редагувати подію</DialogTitle>
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
//           <Grid item xs={12}>
//             <Button variant="contained" component="label" fullWidth>
//               Змінити афішу
//               <input type="file" hidden onChange={handleImageChange} />
//             </Button>
//           </Grid>
//           {previewImage && (
//             <Grid item xs={12}>
//               <img
//                 src={previewImage}
//                 alt="Preview"
//                 style={{
//                   width: '150px',
//                   height: '150px',
//                   objectFit: 'contain',
//                 }}
//               />
//             </Grid>
//           )}
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
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const EditEventModal = ({ open, onClose, eventData, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [price, setPrice] = useState('');
  const [place, setPlace] = useState('');
  const [address, setAddress] = useState('');
  const [show, setShow] = useState(true);
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Загружаем данные события при открытии модалки
  useEffect(() => {
    if (eventData) {
      console.log('Получены данные события:', eventData);

      setTitle(eventData.title);
      setDescription(eventData.description);

      // Настраиваем дату и время начала
      setDate(new Date(eventData.date).toISOString().split('T')[0]);
      setTime(
        new Date(eventData.date)
          .toLocaleTimeString('en-US', { hour12: false })
          .substring(0, 5),
      );

      // Настраиваем дату и время конца
      if (eventData.dateEnd) {
        setEndDate(new Date(eventData.dateEnd).toISOString().split('T')[0]);
        setEndTime(
          new Date(eventData.dateEnd)
            .toLocaleTimeString('en-US', { hour12: false })
            .substring(0, 5),
        );
      } else {
        // Если нет dateEnd, устанавливаем дату конца на тот же день и +2 часа
        const endDateObj = new Date(eventData.date);
        endDateObj.setHours(endDateObj.getHours() + 2);
        setEndDate(endDateObj.toISOString().split('T')[0]);
        setEndTime(
          endDateObj
            .toLocaleTimeString('en-US', { hour12: false })
            .substring(0, 5),
        );
      }

      setPrice(eventData.prices?.[0]?.price || '');
      setPlace(eventData.place);
      setAddress(eventData.address);
      setShow(eventData.show !== undefined ? eventData.show : true);

      // Проверяем наличие афиши по ID события
      const imageUrl = `${API_URL}/images/${eventData._id}.jpg`;
      setPreviewImage(imageUrl);
      console.log('URL афиши:', imageUrl);
    }
  }, [eventData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
      console.log('Загружено новое изображение:', file.name);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Токен для авторизации:', token);

      // Проверяем наличие ID события
      const eventId = eventData._id || eventData.id;
      if (!eventId) {
        console.error('Ошибка: ID события не найден');
        return;
      }
      console.log('ID события:', eventId);

      const updatedEvent = {
        ...eventData,
        title,
        description,
        date: new Date(`${date}T${time}`).getTime(),
        dateEnd: new Date(`${endDate}T${endTime}`).getTime(),
        prices: [
          {
            price: Number(price),
            available: eventData.prices?.[0]?.available || 100,
            place: place,
            description: 'Місця в фан-зоні',
          },
        ],
        place,
        address,
        show,
        ended: false,
        sellEnded: false,
      };

      console.log('Отправляем обновленные данные:', updatedEvent);

      // Отправка обновленных данных на сервер
      const response = await axios.patch(
        `${API_URL}/events-bo/${eventId}`,
        updatedEvent,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log('Успешное обновление события:', response.data);

      // Если есть новое изображение, загружаем его отдельно
      if (image) {
        const formData = new FormData();
        formData.append('poster', image);

        try {
          const imageResponse = await axios.post(
            `${API_URL}/events-bo/upload/${eventId}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
              },
            },
          );
          console.log('Изображение успешно загружено:', imageResponse.data);
        } catch (error) {
          console.error(
            'Ошибка при загрузке изображения:',
            error.response?.data || error,
          );
        }
      }

      onSave(updatedEvent);
      onClose();
    } catch (error) {
      console.error(
        'Ошибка при сохранении изменений:',
        error.response?.data || error,
      );
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
              label="Дата початку"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Час початку"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Дата завершення"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Час завершення"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
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
