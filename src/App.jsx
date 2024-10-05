import './App.css';
import { NavLink, Route, Router, Routes } from 'react-router-dom';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import Events from './page/Events/Events';
import Home from './page/Home/Home';
import EventDetail from './components/EventDetail/EventDetail';
import NavigationDrawer from './components/NavigationDrawer/NavigationDrawer';
import { useState } from 'react';
import Cash from './components/Cash/Cash';
import LoginPage from './page/Login/Login';

function App() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };
  const events = [
    {
      id: 1,
      title: 'Event 1',
      description: 'Description for Event 1',
      date: '2024-08-01',
      time: '18:00',
      price: 300,
      image: 'event.jpg',
    },
    {
      id: 2,
      title: 'Event 2',
      description: 'Description for Event 2',
      date: '2024-08-02',
      time: '19:00',
      price: 350,
      image: 'event.jpg',
    },
    {
      id: 3,
      title: 'Event 3',
      description: 'Description for Event 3',
      date: '2024-08-03',
      time: '20:00',
      price: 400,
      image: 'event.jpg',
    },
    {
      id: 4,
      title: 'Event 4',
      description: 'Description for Event 4',
      date: '2024-08-22',
      time: '21:00',
      price: 450,
      image: 'event.jpg',
    },
    {
      id: 5,
      title: 'Event 4',
      description: 'Description for Event 4',
      date: '2024-08-22',
      time: '21:00',
      price: 450,
      image: 'event.jpg',
    },
    {
      id: 6,
      title: 'Event 4',
      description: 'Description for Event 4',
      date: '2024-08-22',
      time: '21:00',
      price: 450,
      image: 'event.jpg',
    },
    {
      id: 7,
      title: 'Event 4',
      description: 'Description for Event 4',
      date: '2024-08-22',
      time: '21:00',
      price: 450,
      image: 'event.jpg',
    },
    {
      id: 8,
      title: 'Event 4',
      description: 'Description for Event 4',
      date: '2024-08-22',
      time: '21:00',
      price: 450,
      image: 'event.jpg',
    },
    {
      id: 9,
      title: 'Event 4',
      description: 'Description for Event 4',
      date: '2024-08-22',
      time: '21:00',
      price: 450,
      image: 'event.jpg',
    },
    {
      id: 10,
      title: 'Event 4',
      description: 'Description for Event 4',
      date: '2024-08-22',
      time: '21:00',
      price: 450,
      image: 'event.jpg',
    },
  ];
  return (
    <div className="app">
      <NavigationDrawer open={open} toggleDrawer={toggleDrawer} />
      <Header toggleDrawer={toggleDrawer} />
      <main>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/cash" element={<Cash events={events} />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
