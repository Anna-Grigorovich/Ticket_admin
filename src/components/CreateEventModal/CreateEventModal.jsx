// import React, { useState } from 'react';
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

// const CreateEventModal = ({ open, onClose, onEventCreated }) => {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [date, setDate] = useState('');
//   const [time, setTime] = useState('');
//   const [endDate, setEndDate] = useState('');
//   const [endTime, setEndTime] = useState('');
//   const [price, setPrice] = useState('');
//   const [available, setAvailable] = useState(100);
//   const [place, setPlace] = useState('');
//   const [address, setAddress] = useState('');
//   const [show, setShow] = useState(true);
//   const [image, setImage] = useState(null);
//   const [previewImage, setPreviewImage] = useState(null);

//   const handleCreate = async () => {
//     if (
//       !date ||
//       !time ||
//       !endDate ||
//       !endTime ||
//       !title ||
//       !description ||
//       !price ||
//       !place ||
//       !address
//     ) {
//       console.error('One or more required fields are missing');
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token');
//       const dateStart = new Date(`${date}T${time}`).getTime();
//       const dateEnd = new Date(`${endDate}T${endTime}`).getTime();

//       const eventData = {
//         title,
//         description,
//         date: dateStart,
//         dateEnd,
//         place,
//         address,
//         prices: [
//           {
//             price: Number(price),
//             available: Number(available),
//             place,
//             description: 'Місця в фан-зоні',
//           },
//         ],
//         show,
//         ended: false,
//         sellEnded: false,
//       };

//       const eventResponse = await axios.post(
//         `${API_URL}/events-bo`,
//         eventData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         },
//       );

//       if (eventResponse.status === 201) {
//         const eventId = eventResponse.data._id;

//         if (image) {
//           const formData = new FormData();
//           formData.append('poster', image);

//           await axios.post(`${API_URL}/events-bo/upload/${eventId}`, formData, {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               'Content-Type': 'multipart/form-data',
//             },
//           });
//         }

//         onEventCreated();
//         onClear();
//         onClose();
//       }
//     } catch (error) {
//       console.error(
//         'Ошибка при создании ивента:',
//         error.response?.data || error,
//       );
//     }
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImage(file);
//       setPreviewImage(URL.createObjectURL(file));
//     }
//   };

//   const onClear = () => {
//     setTitle('');
//     setDescription('');
//     setDate('');
//     setTime('');
//     setEndDate('');
//     setEndTime('');
//     setPrice('');
//     setAvailable(100);
//     setPlace('');
//     setAddress('');
//     setShow(true);
//     setImage(null);
//     setPreviewImage(null);
//   };

//   return (
//     <Dialog open={open} onClose={onClose}>
//       <DialogTitle>Створити подію</DialogTitle>
//       <DialogContent>
//         <Grid container spacing={2}>
//           <Grid item xs={12}>
//             <TextField
//               label="Назва події"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               fullWidth
//             />
//           </Grid>
//           <Grid item xs={12}>
//             <TextField
//               label="Опис"
//               multiline
//               rows={4}
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               fullWidth
//             />
//           </Grid>
//           <Grid item xs={6}>
//             <TextField
//               label="Дата початку"
//               type="date"
//               value={date}
//               onChange={(e) => setDate(e.target.value)}
//               fullWidth
//               InputLabelProps={{
//                 shrink: true,
//               }}
//             />
//           </Grid>
//           <Grid item xs={6}>
//             <TextField
//               label="Час початку"
//               type="time"
//               value={time}
//               onChange={(e) => setTime(e.target.value)}
//               fullWidth
//               InputLabelProps={{
//                 shrink: true,
//               }}
//             />
//           </Grid>
//           <Grid item xs={6}>
//             <TextField
//               label="Дата завершення"
//               type="date"
//               value={endDate}
//               onChange={(e) => setEndDate(e.target.value)}
//               fullWidth
//               InputLabelProps={{
//                 shrink: true,
//               }}
//             />
//           </Grid>
//           <Grid item xs={6}>
//             <TextField
//               label="Час завершення"
//               type="time"
//               value={endTime}
//               onChange={(e) => setEndTime(e.target.value)}
//               fullWidth
//               InputLabelProps={{
//                 shrink: true,
//               }}
//             />
//           </Grid>
//           <Grid item xs={6}>
//             <TextField
//               label="Ціна"
//               type="number"
//               value={price}
//               onChange={(e) => setPrice(e.target.value)}
//               fullWidth
//             />
//           </Grid>
//           <Grid item xs={6}>
//             <TextField
//               label="Кількість квитків"
//               type="number"
//               value={available}
//               onChange={(e) => setAvailable(e.target.value)}
//               fullWidth
//             />
//           </Grid>
//           <Grid item xs={6}>
//             <TextField
//               label="Місце проведення"
//               value={place}
//               onChange={(e) => setPlace(e.target.value)}
//               fullWidth
//             />
//           </Grid>
//           <Grid item xs={6}>
//             <TextField
//               label="Адреса"
//               value={address}
//               onChange={(e) => setAddress(e.target.value)}
//               fullWidth
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
//               Додати афішу
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
//         <Button onClick={onClose}>Закрити</Button>
//         <Button onClick={handleCreate} variant="contained">
//           Створити
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default CreateEventModal;
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

  // Initial price option
  const [priceOptions, setPriceOptions] = useState([
    {
      price: '',
      available: 100,
      place: '',
      description: 'Місця в фан-зоні',
    },
  ]);

  const handleCreate = async () => {
    if (
      !date ||
      !time ||
      !endDate ||
      !endTime ||
      !title ||
      !description ||
      !place ||
      !address ||
      priceOptions.length === 0 ||
      priceOptions.some((option) => !option.price)
    ) {
      console.error('One or more required fields are missing');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const dateStart = new Date(`${date}T${time}`).getTime();
      const dateEnd = new Date(`${endDate}T${endTime}`).getTime();

      // Format price options for API
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
    setPriceOptions([
      {
        price: '',
        available: 100,
        place: '',
        description: 'Місця в фан-зоні',
      },
    ]);
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
              InputLabelProps={{
                shrink: true,
              }}
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
              InputLabelProps={{
                shrink: true,
              }}
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
              InputLabelProps={{
                shrink: true,
              }}
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
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Місце проведення"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              fullWidth
              margin="normal"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Адреса"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              fullWidth
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
