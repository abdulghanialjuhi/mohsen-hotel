import { onAuthStateChanged } from 'firebase/auth'
import { createContext, useEffect, useState } from 'react'
import { auth } from '../firebaseConfig'

export const Context = createContext({})

export default function GlobalState() {

  const [loading, setLoading] = useState(true)
  const [isAuth, setIsAuth] = useState(false)
  const [user, setUser] = useState(null)
  const [booking, setBooking] = useState({
    checkIn: '',
    checkOut: '',
    adult: 1,
    children: 0,
    rooms: 1
  })

  const actions = (action) => {
    const { type, payload } = action;

    switch (type) {
      case "SET_LOADING":
        return setLoading(payload)
      case "SET_BOOKING":
        return setBooking(payload)
      case "SET_IS_AUTH":
        return setIsAuth(payload)
      case "SET_USER":
        return setUser(payload)
      default:
        return loading;
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      // console.log('user: ', user);
      if (user) {
        setUser(user.uid)
        setIsAuth(true)
      } 
      setLoading(false)
    })

  }, [])

  return { actions, loading, booking, isAuth, user }
}
