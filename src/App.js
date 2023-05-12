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
import Rooms from './components/secureAdmin/RoomsTable';
import RoomTypeTable from './components/secureAdmin/RoomTypeTable';
import PromotionsTable from './components/secureAdmin/PromotionsTable';
import GalleryTable from './components/secureAdmin/GalleryTable';
import GallerySections from './components/secureAdmin/GallerySections';
import AdminTable from './components/secureAdmin/AdminTable';
import UsersTable from './components/secureAdmin/UsersTable';
import UpdatProfile from './components/UpdatProfile';
import Section from './components/Section';
import Hotels from './components/Hotels';
import SignUp from './components/SignUp';
import MyBooking from './components/MyBooking';
import MyProfile from './components/MyProfile';
import RoomItemTable from './components/secureAdmin/RoomItem';
import RoomDetails from './components/RoomDetails';
import GuestTable from './components/secureAdmin/GuestTable';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/hotels" element={<Hotels />}/>
      <Route path="/hotels/roomNumber" element={<RoomDetails />}/>
      <Route path="/promotions" element={<Promotions />}/>
      <Route path="/signup" element={<SignUp />}/>
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/gallery/:section" element={<Section />}/>
      <Route path="/location" element={<Location />}/>
      <Route path="/contact" element={<Contact />}/>
      <Route path="/check-out" element={<CheckOut />}/>
      <Route path="/payment-information" element={<PaymentInfo />} />
      <Route path="/login" element={<Login />}/>
      {/* <Route path="/auth-update-password" element={<UpdatPassword />}/> */}

      <Route path="/auth-my-profile/:uid" element={<MyProfile />}>
        <Route index element={ <MyBooking /> } />
        <Route path="my-booking" element={<MyBooking />}/>
        <Route path="update-profile" element={<UpdatProfile />}/>
      </Route>
      
      <Route path="/secure-admin" element={ <Admin /> }>
        <Route index element={ <Booking /> } />
        <Route path="booking" element={ <Booking /> } />
        <Route path="rooms" element={<Rooms />} />
        <Route path="room-type" element={<RoomTypeTable />} />
        <Route path="admin" element={<AdminTable />} />
        <Route path="users" element={<UsersTable />} />
        <Route path="promotions" element={<PromotionsTable />} />
        <Route path="gallery" element={<GalleryTable />} />
        <Route path="gallery-sections" element={<GallerySections />} />
        <Route path="room-item" element={<RoomItemTable />} />
        <Route path="guest" element={<GuestTable />} />
      </Route>

    </Routes>
  );
}

export default App;
