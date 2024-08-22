import './App.css';
import { NavLink, Route, Router, Routes } from 'react-router-dom';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import Events from './page/Events/Events';
import Home from './page/Home/Home';
import EventDetail from './components/EventDetail/EventDetail';

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          {/* <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/event/:id" element={<EventDetail />} /> */}
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
