import './App.css';
import { Routes, Route } from 'react-router-dom'
import Home from './components/Home';
import Promotions from './components/Promotions';
import Events from './components/Events';
import Gallery from './components/Gallery';
import Location from './components/Location';
import Contact from './components/Contact';
import Admin from './components/Admin';
import Login from './components/Login';
import CheckOut from './components/CheckOut';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/promotions" element={<Promotions />}/>
      <Route path="/events" element={<Events />}/>
      <Route path="/gallery" element={<Gallery />}/>
      <Route path="/location" element={<Location />}/>
      <Route path="/contact" element={<Contact />}/>
      <Route path="/check-out" element={<CheckOut />}/>
      <Route path="/auth-login" element={<Login />}/>
      
      <Route path="/secure-admin" element={<Admin />}/>
    </Routes>
  );
}

export default App;
