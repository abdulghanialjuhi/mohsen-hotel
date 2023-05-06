import React, { useContext, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Context } from '../context/GlobalState'
import { getPic, getCollectionData, getCollectionDocument } from '../helper/firebaseFetch'
import { useNavigate } from 'react-router-dom'
import { FaTv, FaBed } from 'react-icons/fa'
import { BiBed } from 'react-icons/bi'

export default function Hotels() {

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const { actions } = useContext(Context)
    
    const [searchParams] = useSearchParams();
    const checkIn = searchParams.get('checkin')
    const checkOut = searchParams.get('checkout')
    const adult = parseInt(searchParams.get('adults'))
    const children = parseInt(searchParams.get('children'))
    const rooms = parseInt(searchParams.get('rooms'))
    
    const booking = { checkIn,checkOut, adult, children, rooms }

    useEffect(() => {
        actions({type: 'SET_BOOKING', payload: booking})
        getCollectionData('rooms').then((res) => {
            console.log(res);
            setData(res)
        }).catch((err) => {
            console.log('err: ', err);
        }).finally(() => {
            setLoading(false)
        })

    }, [])

    return (
        <div className='h-full w-screen flex justify-center items-center p-2 mt-10 max-w-[1000px] mx-auto shadow-lg'>
            <div className='max-w-[760px] w-full h-[70%] bg-gray-100 rounded-lg overflow-scroll'>
                <div className='w-full flex justify-center items-center'>
                    <h3 className='text-xl'> Available Hotels </h3>
                </div>
                <div className='w-full h-full flex flex-col items-center p-4 gap-8'>
                    {loading ? 'loading' : (
                        data.length > 0 ? data.map((room) => (
                            <HotelRoom room={room} key={room.id} />
                        )) : (
                            <div>no rooms available at the moment</div>
                        ))}
                </div>
            </div>
        </div>
    )
}

export const HotelRoom = (props) => {

    const { name, roomNumber, type, price, roomID, id, roomType, capacity } = props.room.record

    const [roomPic, setRoomPic] = useState('')
    const [available, setAvailable] = useState(true)
    const [facilitiesData, setFacilitiesData] = useState({})
    const { actions, booking } = useContext(Context)
    const navigate = useNavigate()

    useEffect(() => {
        checkAvailability()

        getCollectionDocument(`roomType`, roomType)
        .then((res) => {
            // console.log(res);
            setFacilitiesData(res)
        }).catch((err) => {
            console.log(err)
            setFacilitiesData({TV: 'undefind', bedDouble: 'undefind', bedSingle: 'undefind', description: 'undefind'})
        })

        getPic(`roomType/${roomType}`)
        .then((res) => {
            setRoomPic(res);
        }).catch((err) => {
            console.log(err);
        })
    }, [])
    
    const checkAvailability = async () => {

        try {
            if (booking.adult > capacity) return setAvailable(false)

            const res = await getCollectionData('booking')

            const roomBooks = res.filter((book) => book.roomID === roomID)
            console.log(roomBooks);
            if (!roomBooks.length > 0) return setAvailable(true)

            const fromDate = new Date(booking.checkIn.replaceAll('-', '/'))
            // const toDate = new Date(booking.checkOut.replaceAll('-', '/'))
            
            roomBooks.forEach((book) => {
                const bookToDate = new Date(book.record.checkOutDate.replaceAll('-', '/'))
                if(bookToDate.getTime() >= fromDate.getTime()) return setAvailable(false)
            })

        } catch (err) {
            console.log(err);
            return false
        }

    }

    const handleOnClick = () => {
        actions({type: 'SET_BOOKING', payload: {...booking, room: props.room}})
        navigate('/check-out')
    }

    if ((booking.adult > 2 || booking.children > 4) && type === '1') return 
    if ((booking.adult > 4 || booking.children > 4) && type === '2') return 

    return (
        <div className='w-full h-[200px] p-4 border-[0.8px] border-gray-300 my-2 rounded-sm flex justify-between items-center'> 
            <div className='w-[250px] mx-2 flex items-center justify-center'>
                <img src={roomPic} alt="picture here" className='w-full h-full' />
            </div>
            <div className='flex flex-col flex-grow h-full justify-center items-center'>
                <div className='flex flex-grow flex-col w-full px-4'> 
                    <ul>
                        {facilitiesData.TV && <li className='flex items-center gap-2'> <FaTv /> TV </li>}
                        <li className='flex items-center gap-2'> <FaBed /> {facilitiesData.bedSingle} single bed </li>
                        <li className='flex items-center gap-2'> <BiBed /> {facilitiesData.bedDouble} double bed </li>
                        <li> description: {facilitiesData.description} </li>
                    </ul>
                    <h4 className='mt-auto'> ${price}/night  </h4>
                </div>

                <div className='flex justify-end items-center w-full'>
                    <button onClick={handleOnClick} disabled={!available} className={`p-2 rounded text-gray-0 ${available ? 'bg-primaryBlue' : 'bg-[red]'}`}> check out </button>
                </div>
            </div>
    </div>
    )
}