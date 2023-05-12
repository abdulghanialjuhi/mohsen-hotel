import React, { useState } from 'react'
import HotelsModal from './HotelsModal'
import SearchHotelCard from './SearchHotelCard'

export default function Home() {

  const [showModel, setShowModel] = useState(false)

  return (
    <div className='flex-grow relative flex mx-[-2rem] min-h-[650px]'>
        <div className='absolute top-0 w-full h-full'>
            <img src='panner.jpg' alt="panner" className='w-full h-full' />
        </div>
        <div className='flex-grow z-10 px-8'>
            <div className='w-full flex justify-end items-center my-4'>
                <SearchHotelCard />
            </div>
        </div>
        {showModel && <HotelsModal setShowModel={setShowModel} />}
    </div>
  )
}
