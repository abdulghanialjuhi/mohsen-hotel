import React, { useEffect, useState } from 'react'
import { getImages } from '../helper/firebaseFetch'

export default function Gallery() {

    const [promotionsData, setPromotionsData] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        getImages('gallery').then((res) => {
            setPromotionsData(res);
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            setLoading(false)
        })

    }, [])

    return (
        <div className='flex-grow flex flex-col gap-5 mt-10 items-center mx-[-2rem]'>
            {loading ? 'loading' : (
                <> 
                    <h2> Take a look at our hotel </h2>
                    <div className='flex-grow flex flex-col gap-4 items-center justify-center'>
                        {promotionsData.length > 0 ? promotionsData.map((promotion, index) => (
                            <div key={index} className='relative w-full max-w-[500px] h-[500px] rounded overflow-hidden flex justify-center items-center border'>
                                <img src={promotion} alt="room" className='h-full w-full hover:scale-[1.1] transition-all' />
                            </div>
                        )) : 'no images yet'}
                    </div>
                </>
            )}
        </div>
    )
}
