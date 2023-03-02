import { createContext, useState } from 'react'

export const Context = createContext({})

export default function GlobalState() {

  const [loading, setLoading] = useState(false)
  const [booking, setBooking] = useState({
    checkIn: '',
    checkOut: '',
    discountPercent: ''

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
