import './App.css';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import Events from './page/Events/Events';
import Dashboard from './page/Dashboard/Dashboard'; // Добавляем Dashboard
// import EventDetail from './components/EventDetail/EventDetail';
import NavigationDrawer from './components/NavigationDrawer/NavigationDrawer';
import { useState, useEffect } from 'react';
import LoginPage from './page/Login/Login';
import { useSelector } from 'react-redux';
import Cash from './page/Cash/Cash';
import Users from './page/Home/Users';

function App() {
  const [open, setOpen] = useState(false);
  const { isLoggedIn, role } = useSelector((state) => state.auth);
  const navigate = useNavigate(); // Программное перенаправление

  const toggleDrawer = () => {
    setOpen(!open);
  };

  // Программное перенаправление продавца на кассу при логине
  useEffect(() => {
    if (role === 'seller' && isLoggedIn) {
      navigate('/cash');
    }
  }, [role, isLoggedIn, navigate]);

  return (
    <div className="app">
      {isLoggedIn && role !== 'seller' && (
        <NavigationDrawer open={open} toggleDrawer={toggleDrawer} />
      )}
      <Header toggleDrawer={toggleDrawer} />
      <main>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Главная страница - Dashboard для админа и менеджера */}
          <Route
            path="/"
            element={
              isLoggedIn ? (
                role === 'seller' ? (
                  <Navigate to="/cash" />
                ) : (
                  <Dashboard />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Страница Home для создания пользователей (только для админа) */}
          <Route
            path="/users"
            element={role === 'admin' ? <Users /> : <Navigate to="/" />}
          />

          {/* Общие маршруты для админа и менеджера */}
          <Route path="/events" element={<Events />} />
          {/* <Route path="/event/:id" element={<EventDetail />} /> */}

          {/* Только для роли seller */}
          <Route path="/cash" element={<Cash />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
