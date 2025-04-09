// import React, { useState } from 'react';
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

// const CreateEventModal = ({ open, onClose, onEventCreated }) => {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [date, setDate] = useState('');
//   const [time, setTime] = useState('');
//   const [price, setPrice] = useState('');
//   const [available, setAvailable] = useState(100);
//   const [place, setPlace] = useState('');
//   const [address, setAddress] = useState('');
//   const [image, setImage] = useState(null);
//   const [previewImage, setPreviewImage] = useState(null);

//   const handleCreate = async () => {
//     if (
//       !date ||
//       !time ||
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
//       const dateEnd = dateStart + 2 * 60 * 60 * 1000;

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
//         show: true,
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
//     setPrice('');
//     setAvailable(100);
//     setPlace('');
//     setAddress('');
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
//               label="Дата"
//               type="date"
//               value={date}
//               onChange={(e) => setDate(e.target.value)}
//               fullWidth
//             />
//           </Grid>
//           <Grid item xs={6}>
//             <TextField
//               label="Час"
//               type="time"
//               value={time}
//               onChange={(e) => setTime(e.target.value)}
//               fullWidth
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
} from '@mui/material';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const CreateEventModal = ({ open, onClose, onEventCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [price, setPrice] = useState('');
  const [available, setAvailable] = useState(100);
  const [place, setPlace] = useState('');
  const [address, setAddress] = useState('');
  const [show, setShow] = useState(true);
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const handleCreate = async () => {
    if (
      !date ||
      !time ||
      !endDate ||
      !endTime ||
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
      const dateStart = new Date(`${date}T${time}`).getTime();
      const dateEnd = new Date(`${endDate}T${endTime}`).getTime();

      const eventData = {
        title,
        description,
        date: dateStart,
        dateEnd,
        place,
        address,
        prices: [
          {
            price: Number(price),
            available: Number(available),
            place,
            description: 'Місця в фан-зоні',
          },
        ],
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
        'Ошибка при создании ивента:',
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
    setPrice('');
    setAvailable(100);
    setPlace('');
    setAddress('');
    setShow(true);
    setImage(null);
    setPreviewImage(null);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Створити подію</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Назва події"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
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
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Дата початку"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              fullWidth
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
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Ціна"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Кількість квитків"
              type="number"
              value={available}
              onChange={(e) => setAvailable(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Місце проведення"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Адреса"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              fullWidth
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
