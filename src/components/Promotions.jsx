import React, { useEffect, useState } from 'react'
import { getDate } from '../helper/firebaseFetch'

export default function Promotions() {

    const [promotionsData, setPromotionsData] = useState([])

    useEffect(() => {

        getDate('promotions')
        .then((res) => {
            setPromotionsData(res)
            console.log(res);
        }).catch((err) => {
            console.log(err);
        })

    }, [])

    return (
        <div className='flex-grow flex justify-center items-center mx-[-2rem]'>
            {promotionsData.map((promotion) => (
                <div key={promotion.promotionID} className='relative w-full max-w-[500px] h-[500px] rounded overflow-hidden flex justify-center items-center'>
                    <img src="/roomPic.jpeg" alt="room" className='h-full w-full' />
                    <div className='absolute left-0 h-12 w-[150px] bottom-10 bg-white flex justify-center items-center'>
                        <h6> {promotion.promotionID} </h6>
                    </div>
                </div>
            ))}
        </div>
    )
}
