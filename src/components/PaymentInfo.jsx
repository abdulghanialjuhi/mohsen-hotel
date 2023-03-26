import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../context/GlobalState'
import { Link } from 'react-router-dom'

export default function PaymentInfo() {

    const { booking } = useContext(Context) 
    const [loading, setLoading] = useState(true)

    const isNullishs = Object.values(booking).some(value => {
        if (value === null || value === '') {
        return true;
        }
    
        return false;
    });

    useEffect(() => {
        if (isNullishs) {
           alert('error')
        } else {
            setLoading(false)
        }
      
    }, [])

    const getNights = () => {
        const fromDate = new Date(booking.checkIn.replaceAll('-', '/'))
        const toDate = new Date(booking.checkOut.replaceAll('-', '/'))
    
        const difference = toDate.getTime() - fromDate.getTime();
        const TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
        return TotalDays
    } 


    if (loading) {
        return (
            <div className='flex flex-col'>
                <h1>Error</h1>
                <Link to='/'>
                    <h2 className='text-[blue]'> return to home page </h2> 
                </Link>
            </div>
        
        )
    }

    return (
        <div className='flex-grow flex mt-4 p-3 items-center justify-center'>
            <div className='w-full max-w-[500px] h-[300px] shadow-md flex flex-col items-center '>
                <h3 className='text-2xl'> Booked Successfully   </h3>

                <div className='w-full flex flex-grow flex-col items-center mt-8 gap-4'>
                    <h3> Please complete payment within 24 hours </h3>
                    <div className='flex flex-grow flex-col  mt-8 gap-4'>
                        <span>name: Mohsen</span>
                        <span>bank: maybank</span>
                        <span>account number: XXXXXXXXXX</span>
                        <span>total: {booking.room.price * getNights()}</span>

                    </div>
                </div>
            </div>
            
        </div>
    )
}
