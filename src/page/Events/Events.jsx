// import React, { useState } from 'react';
// import CreateEventModal from '../../components/CreateEventModal/CreateEventModal';
// import { Button, Container } from '@mui/material';
// import EventsTable from '../../components/EventsTable/EventsTable';
// import { useLogOutRedirect } from '../../hooks/useLogOutRedirect';
// import c from './Events.module.css';

// const Events = () => {
//   const [events, setEvents] = useState([
//     {
//       id: 1,
//       title: 'Event 1',
//       description: 'Description for Event 1',
//       date: '2024-08-01',
//       time: '18:00',
//       price: 300,
//       image: 'event1.jpg',
//       place: 'Location 1',
//     },
//     // Add more initial events if needed
//   ]);

//   const [isModalOpen, setModalOpen] = useState(false);
//   useLogOutRedirect();
//   const handleCreateEvent = (newEvent) => {
//     setEvents([...events, newEvent]);
//   };

//   return (
//     <Container>
//       <h1 className={c.title}>Події</h1>
//       <Button
//         variant="contained"
//         color="primary"
//         onClick={() => setModalOpen(true)}
//         sx={{ marginBottom: '8px' }}
//       >
//         Створити Івент
//       </Button>
//       <CreateEventModal
//         open={isModalOpen}
//         onClose={() => setModalOpen(false)}
//         onCreate={handleCreateEvent}
//       />
//       <EventsTable />
//     </Container>
//   );
// };

// export default Events;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CreateEventModal from '../../components/CreateEventModal/CreateEventModal';
import { Button, Container } from '@mui/material';
import EventsTable from '../../components/EventsTable/EventsTable';
import { useLogOutRedirect } from '../../hooks/useLogOutRedirect';
import c from './Events.module.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);

  useLogOutRedirect();

  // Функция для получения ивентов с бэкенда
  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:3300/events');
      console.log(response.data.events);
      setEvents(response.data.events); // Предполагается, что сервер возвращает массив ивентов
    } catch (error) {
      console.error('Ошибка при получении ивентов:', error);
    }
  };

  // Получение ивентов при загрузке компонента
  useEffect(() => {
    fetchEvents();
  }, []);

  // Функция для создания нового ивента
  const handleCreateEvent = async (newEvent) => {
    try {
      const token = localStorage.getItem('token'); // Получаем токен из localStorage
      const response = await axios.post(
        'http://localhost:3300/events',
        newEvent,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Передаём токен для авторизации
          },
        },
      );

      // Обновляем список ивентов после успешного создания
      setEvents([...events, response.data]);
      setModalOpen(false); // Закрываем модальное окно после создания
    } catch (error) {
      console.error('Ошибка при создании ивента:', error);
    }
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
      <EventsTable events={events} />{' '}
      {/* Передаём ивенты в компонент таблицы */}
    </Container>
  );
};

export default Events;
