import React, { useContext, useEffect, useState, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Context } from '../context/GlobalState'
import { getCollectionData, getCollectionDocument, getImages } from '../helper/firebaseFetch'
import { useNavigate } from 'react-router-dom'
import { FaTv, FaBed } from 'react-icons/fa'
import { BiBed } from 'react-icons/bi'
import { MdIron, MdShower, MdOutlineAir } from 'react-icons/md'
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai'
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'


export default function Hotels() {

    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [slectedRoomNumber, setSlectedRoomNumber] = useState([])
    const { actions } = useContext(Context)
    
    const [searchParams] = useSearchParams();
    const checkIn = searchParams.get('checkin')
    const checkOut = searchParams.get('checkout')
    const adult = parseInt(searchParams.get('adults'))
    const children = parseInt(searchParams.get('children'))
    const rooms = parseInt(searchParams.get('rooms'))
    const navigate = useNavigate()
    const booking = { checkIn,checkOut, adult, children, rooms }

    useEffect(() => {
        actions({type: 'SET_BOOKING', payload: booking})
        getCollectionData('rooms').then((res) => {
            setData(res)
        }).catch((err) => {
            console.log('err: ', err);
        }).finally(() => {
            setLoading(false)
        })

    }, [])
    
    const handleOnClick = () => {
        actions({type: 'SET_BOOKING', payload: {...booking, room: slectedRoomNumber}})
        navigate('/check-out')
    }

    return (
        <div className='h-full w-screen flex justify-center items-center p-4 my-8 mt-10 max-w-[1000px] mx-auto shadow rounded bg-gray-0'>
            <div className='max-w-[760px] w-full h-[70%] rounded-lg overflow-scroll'>
                <div className='w-full flex flex-col justify-center items-center'>
                    <h3 className='text-xl'> Available Rooms </h3>
                    {booking.rooms > 1 && (
                        <>
                            <span className='text-gray-400'> select {booking.rooms} rooms </span>
                            <button onClick={handleOnClick} disabled={slectedRoomNumber.length < booking.rooms} className={`p-2 rounded text-gray-0 ${slectedRoomNumber.length < booking.rooms ? 'bg-gray-300' : 'bg-primaryBlue'}`}> check out </button>
                        </>
                    )}
                </div>
                <div className='w-full h-full flex flex-col items-center p-4 gap-8'>
                    {loading ? 'loading' : (
                        data.length > 0 ? data.map((room) => (
                            <HotelRoom slectedRoomNumber={slectedRoomNumber} setSlectedRoomNumber={setSlectedRoomNumber} room={room} key={room.id} />
                        )) : (
                            <div>no rooms available at the moment</div>
                        ))}
                </div>
            </div>
        </div>
    )
}

export const HotelRoom = (props) => {

    const { name, roomNumber, price, roomType } = props.room.record

    const [roomPic, setRoomPic] = useState([])
    const [available, setAvailable] = useState(true)
    const [facilitiesData, setFacilitiesData] = useState({})
    const { actions, booking, user, isAdmin } = useContext(Context)
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

        getImages(`roomType/${roomType}`)
        .then((res) => {
            setRoomPic(res);
        }).catch((err) => {
            console.log(err);
        })
    }, [])
    
    const checkAvailability = async () => {

        try {
            if (booking.adult > facilitiesData.capacity) return setAvailable(false)

            const res = await getCollectionData('booking')

            const convertedList = convertRoomsToArr(res)

            const roomBooks = convertedList.filter((book) => book.record.roomNumber.includes(roomNumber))
            if (!roomBooks.length > 0) return setAvailable(true)

            const fromDate = new Date(booking.checkIn.replaceAll('-', '/'))
            
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
        if (!user || isAdmin) {
            alert('you have to login first to checkout')
            return false
        }
        actions({type: 'SET_BOOKING', payload: {...booking, room: [props.room]}})
        navigate('/check-out')
    }

    const handleAddRoomToList = (e) => {
        if (e.target.checked) {
            if (props.slectedRoomNumber.length < booking.rooms && available) {
                props.setSlectedRoomNumber(prev => [...prev, props.room])
            } else {
                e.preventDefault()
            }
        } else {
            const arr = [...props.slectedRoomNumber]
            const deltedRoomArr = arr.filter((room) => room.record.roomNumber !== roomNumber)
            console.log('deltedRoomArr: ', deltedRoomArr);
            props.setSlectedRoomNumber(deltedRoomArr)
        }
    }

    return (
        <div className='w-full flex gap-3'>
            {booking.rooms > 1 && <input onClick={handleAddRoomToList} type="checkbox" className='w-[20px]' />}
            <div className='w-full h-[350px] p-4 border-[0.8px] border-gray-300 my-2 rounded-sm flex justify-between items-center'> 
                <div className='min-w-[250px] max-w-[270px] h-full mx-2 flex justify-center overflow-hidden'>
                    {/* <img src={roomPic} alt="picture here" className='w-full h-full  max-h-[180px]' /> */}
                    {roomPic.length > 0 && <Panner data={roomPic} />}
                </div>
                <div className='flex flex-col flex-grow h-full justify-center items-center'>
                    <div className='flex flex-grow flex-col w-full px-4'> 
                    <h3 className='my-2 cursor-pointer hover:text-black'> {name} </h3>
                        <ul>
                            {facilitiesData.bedType?.toLowerCase() === 'double' ? (
                                <li className='flex items-center gap-2'> <BiBed /> double bed </li>
                            ) : (
                                <li className='flex items-center gap-2'> <FaBed /><FaBed /> single bed </li>
                            )}
                            <li > capacity: {facilitiesData.capacity} </li>
                            <li className='text-gray-500'> description: {facilitiesData.description} </li>
                            <div className='flex justify-evenly mt-4'>
                                <li className='flex items-center gap-1'> <FaTv /> TV  </li>
                                <li className='flex items-center gap-1'> <MdIron size={22} /> Iron  </li>
                                <li className='flex items-center gap-1'> <MdShower size={22}/> Shower  </li>
                                <li className='flex items-center gap-1'> <MdOutlineAir size={22}/> Air conditioning  </li>
                            </div>
                        </ul>
                        <h4 className='mt-auto'> ${price}/night  </h4>
                    </div>

                    <div className='flex justify-end items-center w-full gap-3'>
                        <button onClick={handleOnClick} disabled={!available || booking.rooms > 1} className={`p-2 rounded text-gray-0 ${available ? 'bg-primaryBlue' : 'bg-gray-300'}`}> check out </button>
                    </div>
                </div>
            </div>
        </div>
    )
}


function Panner({ data }) {

    const slideRef = useRef()

    const properties = {
        duration: 5000,
        autoplay: true,
        transitionDuration: 500,
        arrows: false,
        infinite: true,
        easing: "ease",
        // indicators: (i) => <div className="indicator">{i + 1}</div>
      };

    const back = () => {
        slideRef.current.goBack();
    }

    const next = () => {
        slideRef.current.goNext();
    }


    return (
        <div className='w-full h-full flex overflow-hidden relative max-h-[200px]'>
            <div className='w-full h-full overflow-hidden'>
                <div className="slide-container">
                    <Slide ref={slideRef} {...properties}>
                        {data.map((each, index) => (
                            <div key={index} className='relative'>
                                <div className="each-slide">
                                    <img className="lazy w-full h-full" src={each?.img} alt="sample" />
                                </div>
                            </div>
                        ))}
                    </Slide>
                    <div className='absolute top-[50%]'>
                        <AiOutlineLeft className='cursor-pointer text-gray-0' onClick={back} size={24}  />
                    </div>
                    <div className='absolute top-[50%] right-0'>
                        <AiOutlineRight className='cursor-pointer text-gray-0' onClick={next} size={24}  />
                    </div>
                </div>
            </div>
        </div>
    )
}

const convertRoomsToArr = (list) => {
    list.map((book) => {
        book.record.roomNumber = book.record.roomNumber.split(', ')
    })

    return list
}