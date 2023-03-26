import { createContext, useState } from 'react'

export const Context = createContext({})

export default function GlobalState() {

  const [loading, setLoading] = useState(false)
  const [booking, setBooking] = useState({
    checkIn: '',
    checkOut: '',
    adult: 1,
    children: 0
  })

  const actions = (action) => {
    const { type, payload } = action;

    switch (type) {
      case "SET_LOADING":
        return setLoading(payload)
      case "SET_BOOKING":
        return setBooking(payload)
      default:
        return loading;
    }
  };

  return { actions, loading, booking }
}
