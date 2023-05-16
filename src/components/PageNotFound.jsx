import React from 'react'
import { Link } from 'react-router-dom'

export default function PageNotFound() {

    return (
        <div className='flex-grow flex mt-10 justify-center items-center mx-[-2rem]'>
            <div className='w-full max-w-[500px] h-[400px] flex items-center flex-col gap-5 shadow bg-gray-0 p-2'>
                <div className='h-[50%] w-full flex flex-col justify-between items-center mt-8'>
                    <h2>Page not found</h2>
                    <div>
                        <div className='flex gap-1'>
                            <Link to='/'>
                                <h3 className='text-lg'> Go to home page </h3>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
