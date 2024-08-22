import React from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import { format } from 'date-fns';
import uk from 'date-fns/locale/uk';
const events = [
    { id: 1, title: 'Event 1', description: 'Description for Event 1', date: '2024-08-01', time: '18:00', price: 300, image: 'event.jpg' },
    { id: 2, title: 'Event 2', description: 'Description for Event 2', date: '2024-08-02', time: '19:00', price: 350, image: 'event.jpg' },
    { id: 3, title: 'Event 3', description: 'Description for Event 3', date: '2024-08-03', time: '20:00', price: 400, image: 'event.jpg' },
    { id: 4, title: 'Event 4', description: 'Description for Event 4', date: '2024-08-22', time: '21:00', price: 450, image: 'event.jpg' },
  ];
const EventDetail = () => {
    const { id } = useParams();
    const event = events.find(event => event.id === parseInt(id));
  
    if (!event) {
      return <Typography variant="h6">Event not found</Typography>;
    }
  
    const eventDate = new Date(event.date);
    const formattedDate = format(eventDate, 'd MMMM yyyy, EEEE', { locale: uk });
    const formattedTime = event.time;
  
    return (
      <Box>
        <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, maxWidth: 800, margin: 'auto', boxShadow: 'none' }}>
          <CardMedia
            component="img"
            sx={{ width: { xs: '100%', md: 400 }, height: { xs: 200, md: '100%' }, objectFit: 'cover' }}
            image={require(`../../img/${event.image}`)}
            alt={event.title}
          />
          <CardContent sx={{ flex: '1' }}>
            <Typography gutterBottom variant="h4" component="div">
              {event.title}
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {formattedDate}, {formattedTime}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Місце: {event.location}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Ціна: {event.price} грн
            </Typography>
            <Button
              variant="contained"
              sx={{
                mt: 2,
                backgroundColor: 'black',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'gray',
                },
              }}
            >
              купити квиток
            </Button>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1">
                {event.description}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  };

export default EventDetail;