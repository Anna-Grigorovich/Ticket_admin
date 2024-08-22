
// import React from 'react';
// import { Box, Grid } from '@mui/material';
// import EventCard from '../EventCard/EventCard';

// const events = [
//   {
//     id: 1,
//     title: 'Event 1',
//     description: 'Description for Event 1',
//     // shortDescription: 'lzlzlz',
//     // place: 'Tl',
//     // musicStyle: ['lala', 'lala'],
//     date: '2024-08-01',
//     time: '18:00',
//     price: 300,
//     image: 'event.jpg',
//   },
//   {
//     id: 2,
//     title: 'Event 2',
//     description: 'Description for Event 2',
//     date: '2024-08-02',
//     time: '19:00',
//     price: 350,
//     image: 'event.jpg',
//   },
//   {
//     id: 3,
//     title: 'Event 3',
//     description: 'Description for Event 3',
//     date: '2024-08-03',
//     time: '20:00',
//     price: 400,
//     image: 'event.jpg',
//   },
//   {
//     id: 4,
//     title: 'Event 4',
//     description: 'Description for Event 4',
//     date: '2024-08-04',
//     time: '21:00',
//     price: 450,
//     image: 'event.jpg',
//   },
// ];
// const EventList = () => {
//   return (
//     <Box sx={{ p: 2 }}>
//       <Grid container spacing={2} justifyContent="center">
//         {events.map((event) => (
//           <Grid item key={event.id} xs={12} sm={6} md={6} lg={6}>
//             <EventCard event={event} />
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//   );
// };

// export default EventList;



import React, { useState } from 'react';
import { Box, Grid, Button, TextField, useMediaQuery, useTheme } from '@mui/material';
import EventCard from '../EventCard/EventCard';
import { addDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

const events = [
  { id: 1, title: 'Event 1', description: 'Description for Event 1', date: '2024-08-01', time: '18:00', price: 300, image: 'event.jpg' },
  { id: 2, title: 'Event 2', description: 'Description for Event 2', date: '2024-08-02', time: '19:00', price: 350, image: 'event.jpg' },
  { id: 3, title: 'Event 3', description: 'Description for Event 3', date: '2024-08-03', time: '20:00', price: 400, image: 'event.jpg' },
  { id: 4, title: 'Event 4', description: 'Description for Event 4', date: '2024-08-22', time: '21:00', price: 450, image: 'event.jpg' },
];
const EventList = () => {
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [searchText, setSearchText] = useState('');

  const handleFilter = (filterType) => {
    const today = new Date();
    let filtered = events;

    if (filterType === 'week') {
      const start = startOfWeek(today);
      const end = endOfWeek(today);
      filtered = events.filter(event => new Date(event.date) >= start && new Date(event.date) <= end);
    } else if (filterType === 'month') {
      const start = startOfMonth(today);
      const end = endOfMonth(today);
      filtered = events.filter(event => new Date(event.date) >= start && new Date(event.date) <= end);
    } else if (filterType === 'tomorrow') {
      const tomorrow = addDays(today, 1);
      filtered = events.filter(event => new Date(event.date).toDateString() === tomorrow.toDateString());
    } else if (filterType === 'all') {
      filtered = events;
    }

    setFilteredEvents(filtered);
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchText(query);
    const filtered = events.filter(e => e.title.toLowerCase().includes(query));
    setFilteredEvents(filtered);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      sx={{
        p: 2,
        overflowX: 'hidden',
        maxWidth: '100%',
        boxSizing: 'border-box',
      }}
    >
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexWrap: isMobile ? 'wrap' : 'nowrap',
            gap: 2,
            mb: isMobile ? 2 : 0,
            overflowX: 'auto',
            '& > *': {
              flexBasis: isMobile ? 'calc(50% - 8px)' : 'auto',
            },
          }}
        >
          <Button
            variant="text"
            onClick={() => handleFilter('all')}
            sx={{ color: 'black', textTransform: 'none', '&:hover': { backgroundColor: 'transparent' } }}
          >
            Всі
          </Button>
          <Button
            variant="text"
            onClick={() => handleFilter('week')}
            sx={{ color: 'black', textTransform: 'none', '&:hover': { backgroundColor: 'transparent' } }}
          >
            На цьому тижні
          </Button>
          <Button
            variant="text"
            onClick={() => handleFilter('month')}
            sx={{ color: 'black', textTransform: 'none', '&:hover': { backgroundColor: 'transparent' } }}
          >
            В цьому місяці
          </Button>
          <Button
            variant="text"
            onClick={() => handleFilter('tomorrow')}
            sx={{ color: 'black', textTransform: 'none', '&:hover': { backgroundColor: 'transparent' } }}
          >
            Завтра
          </Button>
        </Box>
        <TextField
          label="Пошук за назвою"
          variant="outlined"
          size="small"
          value={searchText}
          onChange={handleSearch}
          sx={{
            width: isMobile ? '100%' : 300,
            mt: isMobile ? 2 : 0,
          }}
        />
      </Box>
      <Grid container spacing={2} justifyContent="center">
        {filteredEvents.map((event) => (
          <Grid item key={event.id} xs={12} sm={6} md={6} lg={6}>
            <EventCard event={event} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
// const EventList = () => {
//   const [filteredEvents, setFilteredEvents] = useState(events);

//   const handleFilter = (filterType) => {
//     const today = new Date();

//     let filtered = events;
//     if (filterType === 'week') {
//       const start = startOfWeek(today);
//       const end = endOfWeek(today);
//       filtered = events.filter(event => new Date(event.date) >= start && new Date(event.date) <= end);
//     } else if (filterType === 'month') {
//       const start = startOfMonth(today);
//       const end = endOfMonth(today);
//       filtered = events.filter(event => new Date(event.date) >= start && new Date(event.date) <= end);
//     } else if (filterType === 'tomorrow') {
//       const tomorrow = addDays(today, 1);
//       filtered = events.filter(event => new Date(event.date).toDateString() === tomorrow.toDateString());
//     } else if (filterType === 'all') {
//       filtered = events;
//     }

//     setFilteredEvents(filtered);
//   };

//   return (
//     <Box sx={{ p: 2 }}>
//       <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
//         <Button 
//           variant="text" 
//           onClick={() => handleFilter('all')} 
//           sx={{ backgroundColor: 'black', color: 'white', '&:hover': { backgroundColor: 'darkgray' } }}
//         >
//           Всі
//         </Button>
//         <Button 
//           variant="text" 
//           onClick={() => handleFilter('week')} 
//           sx={{ backgroundColor: 'black', color: 'white', '&:hover': { backgroundColor: 'darkgray' } }}
//         >
//           На цьому тижні
//         </Button>
//         <Button 
//           variant="text" 
//           onClick={() => handleFilter('month')} 
//           sx={{ backgroundColor: 'black', color: 'white', '&:hover': { backgroundColor: 'darkgray' } }}
//         >
//           В цьому місяці
//         </Button>
//         <Button 
//           variant="text" 
//           onClick={() => handleFilter('tomorrow')} 
//           sx={{ backgroundColor: 'black', color: 'white', '&:hover': { backgroundColor: 'darkgray' } }}
//         >
//           Завтра
//         </Button>
//       </Box>
//       <Grid container spacing={2} justifyContent="center">
//         {filteredEvents.map((event) => (
//           <Grid item key={event.id} xs={12} sm={6} md={6} lg={6}>
//             <EventCard event={event} />
//           </Grid>
//         ))}
//       </Grid>
//     </Box>
//   );
// };

export default EventList;
