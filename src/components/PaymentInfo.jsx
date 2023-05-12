import React from 'react'
import { useSearchParams } from 'react-router-dom'

export default function PaymentInfo() {

    const [searchParams] = useSearchParams();
    const total = searchParams.get('total')

    return (
        <div className='flex-grow flex mt-4 p-3 items-center justify-center'>
            <div className='w-full max-w-[500px] h-[300px] shadow-md flex flex-col items-center '>
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
            </div>
            
        </div>
    )
}
