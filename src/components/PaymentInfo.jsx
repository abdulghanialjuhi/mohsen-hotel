import React, { useContext } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Context } from '../context/GlobalState';

export default function PaymentInfo() {

    const [searchParams] = useSearchParams();

    const total = searchParams.get('total')
    const bookingId = searchParams.get('booking')
    const { user } = useContext(Context)

    const handleOnSubmit = () => {
        window.location = `auth-my-profile/${user}/upload-receipt?bookingId=${bookingId}`
    }
    return (
        <div className='flex-grow flex mt-4 p-3 items-center justify-center'>
            <div className='w-full max-w-[500px] min-h-[300px] shadow-md flex flex-col items-center p-2'>
                <h3 className='text-2xl'> Booked Successfully   </h3>

                <div className='w-full flex flex-grow flex-col items-center mt-8 gap-4'>
                    <h3> Please complete payment within 24 hours </h3>
                    <div className='flex flex-grow flex-col  mt-8 gap-4'>
                        <span>name: Mohsen</span>
                        <span>bank: maybank</span>
                        <span>account number: 112148308546</span>
                        <span>total: {total} </span>
                    </div>
                </div>
                <div className='mt-3 flex flex-col justify-center items-center gap-3'>
                    {/* <label>Upload receipt here</label>
                    <input accept="image/png, image/jpeg" className='' type="file" onChange={(e) => SetReceipt(e.target.files[0])} /> */}
                    <button className='py-2 px-3 bg-primaryBlue text-gray-0 rounded w-full' onClick={handleOnSubmit}> Upload receipt</button>
                </div>
            </div>
            
        </div>
    )
}
