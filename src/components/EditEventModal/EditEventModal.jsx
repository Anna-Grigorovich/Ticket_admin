// import React, { useState, useEffect } from 'react';
// import {
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   TextField,
//   Grid,
//   Checkbox,
//   FormControlLabel,
// } from '@mui/material';
// import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL;

// const EditEventModal = ({ open, onClose, eventData, onSave }) => {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [date, setDate] = useState('');
//   const [time, setTime] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [endTime, setEndTime] = useState('');
//   const [price, setPrice] = useState('');
//   const [place, setPlace] = useState('');
//   const [address, setAddress] = useState('');
//   const [show, setShow] = useState(true);
//   const [image, setImage] = useState(null);
//   const [previewImage, setPreviewImage] = useState(null);

//   // Загружаем данные события при открытии модалки
//   useEffect(() => {
//     if (eventData) {
//       console.log('Получены данные события:', eventData);

//       setTitle(eventData.title);
//       setDescription(eventData.description);

//       // Настраиваем дату и время начала
//       setDate(new Date(eventData.date).toISOString().split('T')[0]);
//       setTime(
//         new Date(eventData.date)
//           .toLocaleTimeString('en-US', { hour12: false })
//           .substring(0, 5),
//       );

//       // Настраиваем дату и время конца
//       if (eventData.dateEnd) {
//         setEndDate(new Date(eventData.dateEnd).toISOString().split('T')[0]);
//         setEndTime(
//           new Date(eventData.dateEnd)
//             .toLocaleTimeString('en-US', { hour12: false })
//             .substring(0, 5),
//         );
//       } else {
//         // Если нет dateEnd, устанавливаем дату конца на тот же день и +2 часа
//         const endDateObj = new Date(eventData.date);
//         endDateObj.setHours(endDateObj.getHours() + 2);
//         setEndDate(endDateObj.toISOString().split('T')[0]);
//         setEndTime(
//           endDateObj
//             .toLocaleTimeString('en-US', { hour12: false })
//             .substring(0, 5),
//         );
//       }

//       setPrice(eventData.prices?.[0]?.price || '');
//       setPlace(eventData.place);
//       setAddress(eventData.address);
//       setShow(eventData.show !== undefined ? eventData.show : true);

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
//         dateEnd: new Date(`${endDate}T${endTime}`).getTime(),
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
//         show,
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
//               label="Дата початку"
//               type="date"
//               value={date}
//               onChange={(e) => setDate(e.target.value)}
//               InputLabelProps={{ shrink: true }}
//             />
//           </Grid>
//           <Grid item xs={6}>
//             <TextField
//               fullWidth
//               label="Час початку"
//               type="time"
//               value={time}
//               onChange={(e) => setTime(e.target.value)}
//               InputLabelProps={{ shrink: true }}
//             />
//           </Grid>
//           <Grid item xs={6}>
//             <TextField
//               fullWidth
//               label="Дата завершення"
//               type="date"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//               InputLabelProps={{ shrink: true }}
//             />
//           </Grid>
//           <Grid item xs={6}>
//             <TextField
//               fullWidth
//               label="Час завершення"
//               type="time"
//               value={endTime}
//               onChange={(e) => setEndTime(e.target.value)}
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
//             <FormControlLabel
//               control={
//                 <Checkbox
//                   checked={show}
//                   onChange={(e) => setShow(e.target.checked)}
//                 />
//               }
//               label="Показувати"
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
  IconButton,
  Typography,
  Divider,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const EditEventModal = ({ open, onClose, eventData, onSave }) => {
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
  const [priceOptions, setPriceOptions] = useState([
    {
      price: '',
      available: 100,
      place: '',
      description: 'Місця в фан-зоні',
    },
  ]);

  // Загружаем данные события при открытии модалки
  useEffect(() => {
    if (eventData) {
      console.log('Отримано дані події:', eventData);

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

      setPlace(eventData.place);
      setAddress(eventData.address);
      setShow(eventData.show !== undefined ? eventData.show : true);

      // Load price options if available
      if (eventData.prices && eventData.prices.length > 0) {
        setPriceOptions(
          eventData.prices.map((price) => ({
            price: price.price || '',
            available: price.available || 100,
            place: price.place || '',
            description: price.description || 'Місця в фан-зоні',
          })),
        );
      } else {
        // Reset to default if no prices are available
        setPriceOptions([
          {
            price: '',
            available: 100,
            place: '',
            description: 'Місця в фан-зоні',
          },
        ]);
      }

      // Проверяем наличие афиши по ID события
      const imageUrl = `${API_URL}/images/${eventData._id}.jpg`;
      setPreviewImage(imageUrl);
      console.log('URL афіші:', imageUrl);
    }
  }, [eventData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewImage(URL.createObjectURL(file));
      console.log('Завантажено нове зображення:', file.name);
    }
  };

  // Add new price option
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

  // Remove price option
  const removePriceOption = (index) => {
    if (priceOptions.length > 1) {
      const updatedOptions = [...priceOptions];
      updatedOptions.splice(index, 1);
      setPriceOptions(updatedOptions);
    }
  };

  // Update price option field
  const updatePriceOption = (index, field, value) => {
    const updatedOptions = [...priceOptions];
    updatedOptions[index][field] = value;
    setPriceOptions(updatedOptions);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Токен для авторизації:', token);

      // Проверяем наличие ID события
      const eventId = eventData._id || eventData.id;
      if (!eventId) {
        console.error('Помилка: ID події не знайдено');
        return;
      }
      console.log('ID події:', eventId);

      // Format price options for API
      const formattedPriceOptions = priceOptions.map((option) => ({
        price: Number(option.price),
        available: Number(option.available),
        place: option.place || place,
        description: option.description,
      }));

      const updatedEvent = {
        ...eventData,
        title,
        description,
        date: new Date(`${date}T${time}`).getTime(),
        dateEnd: new Date(`${endDate}T${endTime}`).getTime(),
        prices: formattedPriceOptions,
        place,
        address,
        show,
        ended: eventData.ended || false,
        sellEnded: eventData.sellEnded || false,
      };

      console.log('Відправляємо оновлені дані:', updatedEvent);

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
      console.log('Успішне оновлення події:', response.data);

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
          console.log('Зображення успішно завантажено:', imageResponse.data);
        } catch (error) {
          console.error(
            'Помилка при завантаженні зображення:',
            error.response?.data || error,
          );
        }
      }

      onSave(updatedEvent);
      onClose();
    } catch (error) {
      console.error(
        'Помилка при збереженні змін:',
        error.response?.data || error,
      );
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Редагувати подію</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Назва події"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Опис"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              margin="normal"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Дата початку"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              margin="normal"
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
              margin="normal"
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
              margin="normal"
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
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Місце проведення"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              margin="normal"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Адреса"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              margin="normal"
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
