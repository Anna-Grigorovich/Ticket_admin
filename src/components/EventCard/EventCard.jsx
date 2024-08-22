import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Grid,
  Button,
} from '@mui/material';
import { format } from 'date-fns';
import { uk } from 'date-fns/locale';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  const eventDate = new Date(event.date);
  const eventTime = event.time;

  // Format date and time
  const formattedDate = format(eventDate, 'd MMMM yyyy, EEEE', {
    locale: uk,
  });
  const formattedTime = `${eventTime}`;

  return (
    <Card sx={{ display: 'flex', flexDirection: 'column', maxWidth: 800, margin: 2 }}>
      <Grid container spacing={2} direction={{ xs: 'column', md: 'row' }}>
        <Grid item xs={12} md={4}>
          <CardMedia
            component="img"
            sx={{ width: '100%', height: { xs: 200, md: '100%' }, objectFit: 'cover' }}
            image={require(`../../img/${event.image}`)}
            alt={event.title}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {event.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {event.description}
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {formattedDate}, {formattedTime}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                від {event.price} грн
              </Typography>
              <Link to={`/event/${event.id}`} style={{ textDecoration: 'none' }}>
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
              </Link>
            </Box>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  );
};
export default EventCard;
