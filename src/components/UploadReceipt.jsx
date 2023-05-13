import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { updateDataCollectionId } from '../helper/firebaseFetch'
import { uploadBytesResumable, ref } from 'firebase/storage'
import { storage } from '../firebaseConfig'

export default function UploadReceipt() {
    
    const [booking, setBooking] = useState('')
    const [receipt, setReceipt] = useState('')
    const [loading, setLoading] = useState(false)
    const [erorrMessage, setErorrMessage] = useState('')
    const [seccussMessage, setSeccussMessage] = useState('')
    
    const [searchParams] = useSearchParams();
    const bookingId = searchParams.get('bookingId')

    useEffect(() => {
        if (bookingId) {
            setBooking(bookingId)
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!booking || !receipt) {
            setErorrMessage('Please Fill In All Fields')
            setTimeout(() => setErorrMessage(''), 1500)
            return false
        }

        setLoading(true)
        const storageRef = ref(storage, `/booking/${booking}`)
        await uploadBytesResumable(storageRef, receipt)
        updateDataCollectionId('booking', booking,  {receipt: receipt.name})
        .then((res) => {
            setSeccussMessage('uploaded successfully')
        }).catch((error) => {
            console.log(error);
            setErorrMessage('Error, Something went wrong')
            setTimeout(() => {
                setErorrMessage('')
            }, 3000)
        }).finally(() => {
            setLoading(false)
        })
    }
    
    return (
        <div className='w-full max-w-[650px] min-h-[430px] rounded mt-8 bg-white shadow flex flex-col items-center p-3 py-5'>
            <h2 className='mb-2'> Upload receipt </h2>
            <div className='min-h-[1rem] mt-2 flex justify-center max-w-[450px]'>
                {erorrMessage && <span className='h-full bg-red-500 py-1 text-center px-2 rounded-md text-gray-100'> {erorrMessage} </span>}
                {seccussMessage && <span className='h-full bg-green-500 py-1 text-center px-2 rounded-md text-gray-100'> {seccussMessage} </span>}
            </div>
            <div className='w-full h-full flex flex-col justify-center items-center'>
                <form onSubmit={handleSubmit} className='w-full h-full'>
                    <div className='w-full max-w-[350px] mx-auto mt-4 flex flex-col gap-5'>
                        <div className='flex flex-col w-full'>
                            <label htmlFor=""> booking </label>
                            <input value={booking} onChange={(e) => setBooking(e.target.value)} className='border p-1 rounded' type="text" />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label htmlFor=""> receipt </label>
                            <input onChange={(e) => setReceipt(e.target.files[0])} accept="image/png, image/jpeg" type='file' name='receipt' className='border p-2' />
                        </div>
                        <div className='flex mt-4 justify-end'>    
                            <input disabled={loading} type="submit" name="submit" className='p-2 px-3 rounded bg-primaryBlue text-gray-0 cursor-pointer w-full' value={loading ? 'uploading...' : 'Submit'} />
                        </div>
                    </div>
                </form>

            </div>
        </div>
    )
}
