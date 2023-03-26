import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../context/GlobalState';
import { getDate, getPic } from '../helper/firebaseFetch'
import { useNavigate} from 'react-router-dom'

export default function HotelsModal({ setShowModel }) {

    const [data, setData] = useState([])
 
    useEffect(() => {
        getDate('rooms').then((res) => {
            setData(res)
        }).catch((err) => {
            console.log('err: ', err);
        })

    }, [])


    return (
        <div onClick={() => setShowModel(false)} className='fixed top-0 h-screen w-screen bg-black-rgba z-20 flex justify-center items-center p-2'>

            <div onClick={(e) => e.stopPropagation()} className='max-w-[720px] w-[100%] h-[70%] bg-gray-100 rounded-lg overflow-scroll'>
                <div className='w-full h-full flex flex-col items-center p-4'>
                    
                    {data.length > 0 ? data.map((room) => (
                            <HotelRoom room={room} key={room.roomID} />
                        )) : (
                            <div>
                                no rooms available at the moment
                            </div>
                        )}

                </div>
            </div>
            
        </div>
    )
}


const HotelRoom = (props) => {

    const { name, pictureID, type, price, roomID } = props.room
    const [roomPic, setRoomPic] = useState('')
    const [available, setAvailable] = useState(true)
    const navigate = useNavigate()
    const { actions, booking } = useContext(Context)

    useEffect(() => {
        checkAvailability()

        getPic().then((res) => {
            setRoomPic(res);
        }).catch((err) => {
            console.log(err);
        })
    })
    
    const checkAvailability = async () => {

        try {
            const res = await getDate('booking')
            // console.log(res);
            // console.log(booking);

            const roomBooks = res.filter((book) => book.roomID === roomID)
            console.log(roomBooks);
            if (!roomBooks.length > 0) return setAvailable(true)

            const fromDate = new Date(booking.checkIn.replaceAll('-', '/'))
            const toDate = new Date(booking.checkOut.replaceAll('-', '/'))
            
            // console.log(fromDate);
            // console.log(toDate);
            roomBooks.forEach((book) => {
                const bookToDate = new Date(book.checkOutDate.replaceAll('-', '/'))
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
        <div className='w-full p-2 border my-2 flex justify-between items-center' > 
        <div className='w-[160px] h-[120px] mx-2'>
            <img src={roomPic} alt="picture here" />
        </div>
        <div className=''>
            <h4> {name}  </h4>
            <h4> ${price}/night  </h4>
            
        </div>

        <div>
            <button onClick={handleOnClick} disabled={!available} className={`p-2 rounded text-gray-0 ${available ? 'bg-primaryBlue' : 'bg-[red]'}`}> check out </button>
        </div>
    </div>
    )
}