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
import PaymentInfo from './components/PaymentInfo';
import Booking from './components/secureAdmin/Booking';
import Rooms from './components/secureAdmin/Rooms';
import PromotionsTable from './components/secureAdmin/PromotionsTable';
import GalleryTable from './components/secureAdmin/GalleryTable';
import GallerySections from './components/secureAdmin/GallerySections';
import AdminTable from './components/secureAdmin/AdminTable';
import UpdatPassword from './components/UpdatePassword';

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
      <Route path="/payment-information" element={<PaymentInfo />} />
      <Route path="/auth-login" element={<Login />}/>
      <Route path="/secure-update-password" element={<UpdatPassword />}/>
      
      <Route path="/secure-admin" element={ <Admin /> }>
        <Route index element={ <Booking /> } />
        <Route path="booking" element={ <Booking /> } />
        <Route path="rooms" element={<Rooms />} />
        <Route path="admin" element={<AdminTable />} />
        <Route path="promotions" element={<PromotionsTable />} />
        <Route path="gallery" element={<GalleryTable />} />
        <Route path="gallery-sections" element={<GallerySections />} />
      </Route>

    </Routes>
  );
}

export default App;
