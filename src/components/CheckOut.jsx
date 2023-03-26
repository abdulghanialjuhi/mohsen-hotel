import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../context/GlobalState'
import { collection, addDoc } from "firebase/firestore"; 
import { db } from '../firebaseConfig'
import { useNavigate, Link } from 'react-router-dom'


export default function CheckOut() {

  const { booking } = useContext(Context) 
  const [contactInfo, setContactInfo] = useState({fullName: null, email: null, phone: null})
  const [salutation, setsalutation] = useState('Mr')
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const navigate = useNavigate()

  // console.log('booking: ', booking);
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

  const isNullish = Object.values(contactInfo).some(value => {
    if (value === null || value === '') {
      return true;
    }
  
    return false;
  });

  const handleSubmit = async () => {
    if (isNullish) {
        alert('please fill in all fields')
        return
    }

    if ((!/^[0-9]+$/.test(contactInfo.phone))) {
        alert('invalid phone number')
        return
    }
    setSubmitLoading(true)

    try {
        const docRef = await addDoc(collection(db, "booking"), {
            checkInDate: booking.checkIn,
            checkOutDate: booking.checkOut,
            email: contactInfo.email,
            fullName: salutation + contactInfo.fullName,
            phone: contactInfo.phone,
            roomID: booking.room.roomID,
            total: booking.room.price * getNights()
        });

        console.log(docRef);
        navigate('/payment-information')
    } catch (err) {
        console.log('err: ', err);
    } finally {
        setSubmitLoading(false)
    }
  }

  useEffect(() => console.log(contactInfo), [contactInfo])

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
    <div className='flex-grow flex mt-4 p-3 '>
        <aside className='mr-6'>
            <div className='w-[290px] h-[430px] flex flex-col rounded border bg-white shadow-md py-4 px-2'>
                <div className='w-full p-1 text-primaryBlue'>
                    <h5>{booking.room.name} - {getNights()} NIGHT(S)</h5>
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

                <div className='mt-auto border-t w-full flex flex-col justify-center items-center'>
                    <span className='uppercase mt-4 text-gray-400 text-[16px] font-[600]'>total price</span>
                    <h6 className='text-[15px] text-primaryBlue mt-2'>${booking.room.price * getNights()}</h6>

                    <button disabled={submitLoading} onClick={handleSubmit} className='w-full rounded bg-primaryBlue hover:bg-blue-600 text-gray-0 p-[6px] mt-4'> {submitLoading ? "Loading" : "Submit"} </button>
                </div>

            </div>
        </aside>

        <div className='flex-grow flex flex-col'>
            <div className='w-full rounded overflow-hidden bg-gray-0 shadow-md min-h-[200px]'>
                <div className='w-full h-12 bg-primaryBlue flex items-center p-2 text-gray-0'>
                    <h4> Contact Details </h4>
                </div>
                <div className='w-full p-4 flex flex-wrap items-center justify-evenly'>

                    <div className='flex flex-col mx-2'>
                        <label> Salutation </label>
                        <select defaultValue={setsalutation} onChange={(e) => setsalutation(e.target.value)} name="salutation" className='border mt-1 rounded p-1'>
                            <option value="Mr">MR</option>
                            <option value="Ms">MS</option>
                        </select>
                    </div>

                    <ContactForm label='full name' name='name' fieldName='fullName' setContactInfo={setContactInfo} />
                    {/* <ContactForm label='last name' name='name' /> */}
                    {/* <ContactForm label='city' name='city' /> */}
                    <ContactForm label='email' name='email' fieldName='email' setContactInfo={setContactInfo} />
                    <ContactForm label='phone number' name='phone' pattern="[0-9]*" fieldName='phone'  setContactInfo={setContactInfo} />

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