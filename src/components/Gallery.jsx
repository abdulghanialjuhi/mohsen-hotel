import React, { useEffect, useState } from 'react'
import { getImages } from '../helper/firebaseFetch'
import { useNavigate } from 'react-router-dom'

export default function Gallery() {

    const [promotionsData, setPromotionsData] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {

        getImages('gallerySections').then((res) => {
            console.log(res);
            setPromotionsData(res);
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            setLoading(false)
        })

    }, [])

    const handleSectionClick = (section) => {
        navigate(`${section}`)
    }

    return (
        <div className='flex-grow flex flex-col gap-5 mt-10 items-center mx-[-2rem]'>
            {loading ? 'loading' : (
                <> 
                    <h2 className='mb-7'> Take a look at our hotel </h2>
                    <div className='flex-grow flex w-full max-w-[950px] flex-wrap gap-5 items-center justify-center'>
                        {promotionsData.length > 0 ? promotionsData.map((promotion, index) => (
                            <div key={index} className='relative w-full max-w-[400px] h-[400px] rounded overflow-hidden flex justify-center items-center border cursor-pointer' onClick={handleSectionClick.bind(this, promotion.name)}>
                                <div className='flex h-full w-full after:bg-black-rgba after:absolute after:z-10 after:left-0 after:right-0 after:top-0 after:bottom-0 hover:scale-105 transition-all'>
                                    <img src={promotion.img} alt="room" className='object-cover' />
                                </div>
                                <span className='absolute text-gray-100 z-20 font-bold text-lg'> {promotion.name} </span>
                            </div>
                        )) : 'no images yet'}
                    </div>
                </>
            )}
        </div>
    )
}
