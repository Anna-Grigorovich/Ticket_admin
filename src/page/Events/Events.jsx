import React, { useState } from 'react';
import CreateEventModal from '../../components/CreateEventModal/CreateEventModal';
import { Button, Container } from '@mui/material';
import EventsTable from '../../components/EventsTable/EventsTable';
import { useLogOutRedirect } from '../../hooks/useLogOutRedirect';
import c from './Events.module.css';

const Events = () => {
  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Event 1',
      description: 'Description for Event 1',
      date: '2024-08-01',
      time: '18:00',
      price: 300,
      image: 'event1.jpg',
      place: 'Location 1',
    },
    // Add more initial events if needed
  ]);

  const [isModalOpen, setModalOpen] = useState(false);
  useLogOutRedirect();
  const handleCreateEvent = (newEvent) => {
    setEvents([...events, newEvent]);
  };

  return (
    <Container>
      <h1 className={c.title}>Події</h1>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setModalOpen(true)}
        sx={{ marginBottom: '8px' }}
      >
        Створити Івент
      </Button>
      <CreateEventModal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreateEvent}
      />
      <EventsTable />
    </Container>
  );
};

export default Events;
