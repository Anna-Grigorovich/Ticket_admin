import './App.css';
import { NavLink, Route, Router, Routes } from 'react-router-dom';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import Events from './page/Events/Events';
import Home from './page/Home/Home';
import EventDetail from './components/EventDetail/EventDetail';
import NavigationDrawer from './components/NavigationDrawer/NavigationDrawer';
import { useState } from 'react';

// function App() {
//   return (
//     <div className="app">
//       <NavigationDrawer/>
//       <Header />
//       <main>
//         <Routes>
//           {/* <Route path="/" element={<Home />} />
//           <Route path="/events" element={<Events />} />
//           <Route path="/event/:id" element={<EventDetail />} /> */}
//         </Routes>
//       </main>
//       <Footer />
//     </div>
//   );
// }
function App() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <div className="app">
      <NavigationDrawer open={open} toggleDrawer={toggleDrawer} />
      <Header toggleDrawer={toggleDrawer} />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/event/:id" element={<EventDetail />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
