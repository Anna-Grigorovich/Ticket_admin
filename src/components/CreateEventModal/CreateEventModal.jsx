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

// const CreateEventModal = ({ open, onClose, onCreate }) => {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [date, setDate] = useState('');
//   const [time, setTime] = useState('');
//   const [price, setPrice] = useState('');
//   const [place, setPlace] = useState('');
//   const [image, setImage] = useState(null);

//   const handleCreate = () => {
//     const newEvent = {
//       id: Date.now(), // Generating a unique ID
//       title,
//       description,
//       date,
//       time,
//       price: parseFloat(price),
//       image: URL.createObjectURL(image), // Create an image preview URL
//       place,
//     };
//     onCreate(newEvent);
//     onClose();
//   };

//   return (
//     <Dialog open={open} onClose={onClose}>
//       <DialogTitle>Створити подію</DialogTitle>
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
//               rows={5} // Задаем количество строк
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               InputProps={{
//                 style: {
//                   fontSize: 16, // Уменьшаем размер текста до 16px
//                 },
//               }}
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
//           <Grid item xs={12}>
//             <Button variant="contained" component="label" fullWidth>
//               Додати афішу
//               <input
//                 type="file"
//                 hidden
//                 onChange={(e) => setImage(e.target.files[0])}
//               />
//             </Button>
//           </Grid>
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
} from '@mui/material';

const CreateEventModal = ({ open, onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [price, setPrice] = useState('');
  const [place, setPlace] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleCreate = () => {
    const newEvent = {
      id: Date.now(),
      title,
      description,
      date,
      time,
      price: parseFloat(price),
      image: URL.createObjectURL(image),
      place,
    };
    onCreate(newEvent);
    onClose();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              multiline
              rows={4}
              InputProps={{ style: { fontSize: '16px' } }} // Set font size
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
              Додати афішу
              <input type="file" hidden onChange={handleImageChange} />
            </Button>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Прев'ю афіші"
                style={{ marginTop: '10px', maxWidth: '100%', height: 'auto' }}
              />
            )}
          </Grid>
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
