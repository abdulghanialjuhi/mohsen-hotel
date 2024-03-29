import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../context/GlobalState';
import { getRealtimeDatabaseData, getPic, getCollectionData, getCollectionDocument } from '../helper/firebaseFetch'
import { useNavigate} from 'react-router-dom'

export default function HotelsModal({ setShowModel }) {

    const [data, setData] = useState([])
 
    useEffect(() => {
        getRealtimeDatabaseData('rooms').then((res) => {
            setData(res)
        }).catch((err) => {
            console.log('err: ', err);
        })

    }, [])


    return (
        <div onClick={() => setShowModel(false)} className='fixed top-0 h-screen w-screen bg-black-rgba z-20 flex justify-center items-center p-2'>

            <div onClick={(e) => e.stopPropagation()} className='max-w-[750px] w-[100%] h-[70%] bg-gray-100 rounded-lg overflow-scroll'>
                <div className='w-full h-full flex flex-col items-center p-4'>
                    {data.length > 0 ? data.map((room) => (
                        <HotelRoom room={room} key={room.roomID} />
                    )) : (
                        <div>no rooms available at the moment</div>
                    )}
                </div>
            </div>
            
        </div>
    )
}


export const HotelRoom = (props) => {

    const { name, roomNumber, type, price, roomID, id, facilities, capacity } = props.room.record
    // console.log('facilities: ', facilities);
    // console.log('roomNumber: ', roomNumber);
    // console.log('capacity: ', capacity);

    const [roomPic, setRoomPic] = useState('')
    const [available, setAvailable] = useState(true)
    const [facilitiesData, setFacilitiesData] = useState({})
    const { actions, booking } = useContext(Context)
    const navigate = useNavigate()

    useEffect(() => {
        checkAvailability()

        getCollectionDocument(`facilities`, facilities)
        .then((res) => {
            // console.log(res);
            setFacilitiesData(res)
        }).catch((err) => {
            console.log(err)
            setFacilitiesData({TV: 'undefind', bedDouble: 'undefind', bedSingle: 'undefind', description: 'undefind'})
        })

        getPic(`facilities/${facilities}`)
        .then((res) => {
            setRoomPic(res);
        }).catch((err) => {
            console.log(err);
        })
    })
    
    const checkAvailability = async () => {

        try {
            if (booking.adult > capacity) return setAvailable(false)

            const res = await getRealtimeDatabaseData('booking')

            const roomBooks = res.filter((book) => book.roomID === roomID)
            // console.log(roomBooks);
            if (!roomBooks.length > 0) return setAvailable(true)

            const fromDate = new Date(booking.checkIn.replaceAll('-', '/'))
            // const toDate = new Date(booking.checkOut.replaceAll('-', '/'))
            
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
        <div className='w-full h-[200px] p-4 border border-gray-400 my-2 rounded-sm flex justify-between items-center'> 
            <div className='w-[250px] mx-2 flex items-center justify-center'>
                <img src={roomPic} alt="picture here" className='w-full h-full' />
            </div>
            <div className='flex flex-col flex-grow h-full justify-center items-center'>
                <div className='flex flex-grow flex-col w-full px-4 py-2'> 
                    <ul>
                        <li> {facilitiesData.TV} TV </li>
                        <li> {facilitiesData.bedSingle} single bed </li>
                        <li> {facilitiesData.bedDouble} double bed </li>
                        <li> {facilitiesData.description} </li>
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