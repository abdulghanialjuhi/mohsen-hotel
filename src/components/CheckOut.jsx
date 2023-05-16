import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../context/GlobalState'
import { collection, addDoc } from "firebase/firestore"; 
import { db } from '../firebaseConfig'
import { useNavigate } from 'react-router-dom'
import { getRealtimeDatabaseRecord } from '../helper/firebaseFetch';
import { getCollectionDocument } from '../helper/firebaseFetch';


export default function CheckOut() {

    const { booking, user } = useContext(Context) 
    const [salutation, setsalutation] = useState('Mr')
    const [loading, setLoading] = useState(true)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [guestInfo, setGuestInfo] = useState({ name: '', email: '', phone: '' })
    const [loginInfo, setLoginInfo] = useState({name: '', email: '', phone: ''})
    const [discountPercent, setDiscountPercent] = useState(0)
    const [promotionInput, setPromotionInput] = useState('')
    const [promotionLoading, setPromotionLoading] = useState(false)
    const [isValidCode, setIsValidCode] = useState(false)

    const [isGuest, setIsGuest] = useState(false)
    const [totalPrice, setTotalPrice] = useState(0)
    const navigate = useNavigate()

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
            getRealtimeDatabaseRecord(`users/${user}`)
            .then((userInfo) => {
                setGuestInfo(userInfo)
                setLoginInfo(userInfo)
            }).catch((err) => {
                console.log(err);
            }).finally(() => {
                setLoading(false)
            })
        }
    }, [])

    useEffect(() => calculatePrice(), [discountPercent])

    const calculatePrice = () => {
        let total = 0;
        try {
            booking.room.forEach((roomPrc) => {
                total += roomPrc.record.price * getNights()
            })
            const calculatePromotion = total * ( (100-discountPercent) / 100 )
            setTotalPrice(calculatePromotion.toFixed(2)) 
        } catch (err) {
            navigate('/')
        }

    }

    const getNights = () => {
        const fromDate = new Date(booking.checkIn.replaceAll('-', '/'))
        const toDate = new Date(booking.checkOut.replaceAll('-', '/'))

        const difference = toDate.getTime() - fromDate.getTime();
        const TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
        return TotalDays
    }

    const handleSubmit = async () => {

        const guestNullish = Object.values(guestInfo).some(value => {
            if (value === null || value === '') {
            return true;
            }
        
            return false;
        });

        if (guestNullish && !isGuest) {
            alert('please fill in all fields')
            return
        }

        setSubmitLoading(true)
            
        try {
            let time = new Date()
            time = time.toJSON().split('T')[1].split(':').slice(0, 2).join(':')

            var result = booking.room.map(u => u.record.roomNumber).join(', ')
            const bookdata = {
                checkInDate: booking.checkIn,
                checkOutDate: booking.checkOut,
                guestId: user,
                guestName: `${salutation} ${guestInfo.name}`,
                roomNumber: result,
                total: totalPrice,
                status: 'pending',
                time: time
            }

            console.log(bookdata);

            const docRef = await addDoc(collection(db, "booking"), bookdata);
            const guestDB = {...guestInfo}
            guestDB['bookingId'] = docRef.id
            guestDB['adult'] = booking.adult
            guestDB['children'] = booking.children
            guestDB.name = `${salutation} ${guestDB.name}`
            await addDoc(collection(db, "guest"), guestDB);

            navigate(`/payment-information?total=${totalPrice}&booking=${docRef.id}`)
        } catch (err) {
            console.log('err: ', err);
        } finally {
            setSubmitLoading(false)
        }
    }

    if (loading) {
        return (
            <div className='flex flex-col'>
                loading...
            </div>
        
        )
    }


    const handleGuestChange = (e) => {
        setIsGuest(!isGuest)
        if (e.target.checked) {
            setGuestInfo({ name: '', email: '', phone: ''})
        } else {
            setGuestInfo(loginInfo)
        }
    }

    const handleCheckPromotions = () => {
        setPromotionLoading(true)
        getCollectionDocument('promotions', promotionInput)
        .then((res) => {
            // console.log(parseInt(res.percent));
            if (!isNaN(parseInt(res.percent))) {
                const todayDate = new Date()
                const expDate = new Date(res.expireDate.replaceAll('-', '/'))
                if (todayDate.getTime() > expDate.getTime()) {
                    setDiscountPercent(0)
                    setIsValidCode(true)
                } else {
                    setDiscountPercent(parseInt(res.percent))
                    setIsValidCode(false)
                }
            } else {
                setDiscountPercent(0)
                setIsValidCode(true)
            }
        }).catch((err) => {
            console.log(err);
            setDiscountPercent(0)
            setIsValidCode(true)
        }).finally(() => {
            setPromotionLoading(false)
        })
    }

    return (
        <div className='flex-grow flex mt-4 p-3 '>
            <aside className='mr-6'>
                <div className='w-[290px] h-[430px] flex flex-col rounded border bg-white shadow-md py-4 px-2'>
                    <div className='w-full p-1 text-primaryBlue'>
                        <h5>{booking.room[0].record.name} - {getNights()} NIGHT(S)</h5>
                    </div>

                    <div className='mt-2 px-2 w-full flex justify-between items-center'>
                        <div className='flex flex-col justify-center'>
                            <span className='uppercase text-gray-400 text-[12px]'>check in</span>
                            <h6 className='text-[15px] mt-2'>{booking.checkIn}</h6>
                        </div>
                        <div className='flex flex-col justify-center'>
                            <span className='uppercase text-gray-400 text-[12px]'>check out</span>
                            <h6 className='text-[15px] mt-2'>{booking.checkOut}</h6>
                        </div>
                    </div>

                    <div className='mt-4 px-2 w-full flex justify-between items-center'>
                        <div className='flex flex-col items-center justify-center'>
                            <span className='uppercase text-gray-400 text-[12px]'>adults</span>
                            <h6 className='text-[15px] mt-2'>{booking.adult}</h6>
                        </div>
                        <div className='flex flex-col items-center justify-center'>
                            <span className='uppercase text-gray-400 text-[12px]'>children</span>
                            <h6 className='text-[15px] mt-2'>{booking.children}</h6>
                        </div>
                    </div>
                    <div>
                        <div className='flex w-full mt-8'>
                            <input value={promotionInput} onChange={(e) => setPromotionInput(e.target.value)} className='w-full p-1 rounded outline-none border' type="text" name="promotion" placeholder='Discount Code' />
                            <button disabled={promotionLoading} onClick={handleCheckPromotions} className='px-3 bg-primaryBlue rounded ml-[-10px] text-gray-0 hover:bg-[#1162be]'>{promotionLoading ? 'checking...' : 'Apply'}</button>
                        </div>
                        {isValidCode && <span className='text-[11px] text-red-500'> invalid code! </span>}
                    </div>

                    <div className='mt-auto border-t w-full flex flex-col justify-center items-center'>
                        <span className='uppercase mt-4 text-gray-400 text-[16px] font-[600]'>total price</span>
                        <h6 className='text-[15px] text-primaryBlue mt-2'>${totalPrice}</h6>

                        <button disabled={submitLoading} onClick={handleSubmit} className='w-full rounded bg-primaryBlue hover:bg-blue-600 text-gray-0 p-[6px] mt-4'> {submitLoading ? "Loading" : "Submit"} </button>
                    </div>

                </div>
            </aside>

            <div className='flex-grow flex flex-col'>
                <div className='w-full rounded overflow-hidden bg-gray-0 shadow-md min-h-[200px]'>
                    <div className='w-full h-12 bg-primaryBlue flex items-center p-2 text-gray-0'>
                        <h4> Guest Details </h4>
                    </div>
                    <div className='flex w-full py-2 gap-1 mt-3 p-2'>
                        <input type="checkbox" value={isGuest} onChange={handleGuestChange} />
                        <label>I'm Booking for someone else</label>
                    </div>
                    <div className='w-full p-4 flex flex-wrap items-center justify-evenly'>

                        <div className='flex flex-col mx-2'>
                            <label> Salutation </label>
                            <select defaultValue={salutation} onChange={(e) => setsalutation(e.target.value)} name="salutation" className='border mt-1 rounded p-1'>
                                <option value="Mr">MR</option>
                                <option value="Ms">MS</option>
                            </select>
                        </div>

                        <ContactForm label='full name' name='name' fieldName='name' setContactInfo={setGuestInfo} value={guestInfo.name} />
                        <ContactForm label='email' name='email' fieldName='email' setContactInfo={setGuestInfo} value={guestInfo.email} />
                        <ContactForm label='phone number' name='phone' pattern="[0-9]*" fieldName='phone'  setContactInfo={setGuestInfo} value={guestInfo.phone} />

                    </div>
                </div>
            </div>
        </div>
    )
}

const ContactForm = ({ label, setContactInfo, fieldName, ...rest }) => {

    const handleOnChange = (e) => {
        setContactInfo((prevState) => ({
            ...prevState,
            [fieldName]: e.target.value,
          }));
        // setContactInfo({...data, [fieldName]: e.target.value})
    }

    return (
        <div className='flex flex-col'>
            <label> {label} </label>
            <input onChange={handleOnChange} {...rest} type="text" className='border rounded mt-1 p-1' />
        </div>
    )
}