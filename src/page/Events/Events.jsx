import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CreateEventModal from '../../components/CreateEventModal/CreateEventModal';
import { Button, Container } from '@mui/material';
import EventsTable from '../../components/EventsTable/EventsTable';
import { useLogOutRedirect } from '../../hooks/useLogOutRedirect';
import c from './Events.module.css';
const API_URL = process.env.REACT_APP_API_URL;

const Events = () => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);

  useLogOutRedirect();

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/events-bo`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          limit: 1000,
        },
      });
      setEvents(response.data.events);
    } catch (error) {
      console.error('Ошибка при получении ивентов:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEventCreated = () => {
    fetchEvents(); // Повторная загрузка событий после создания
    setModalOpen(false); // Закрыть модал после создания
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
        onEventCreated={handleEventCreated}
      />
      <EventsTable events={events} onEventUpdated={fetchEvents} />
    </Container>
  );
};

export default Events;
