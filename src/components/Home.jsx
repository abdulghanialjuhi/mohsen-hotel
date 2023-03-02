import React, { useContext, useState } from 'react'
import { BiMinus, BiPlus } from 'react-icons/bi'
import { useNavigate} from 'react-router-dom'
import { Context } from '../context/GlobalState'

export default function Home() {

  const [roomType, setRoomType] = useState([])
  const { actions, booking } = useContext(Context)

  const navigate = useNavigate()

  const handleOnSubmit = () => {
    navigate('check-out')
  }

  const handleCheckIn = (e) => {
    const value = e.target.value.replace('/', '-')

  }

  const handleCheckOut = (e) => {
    const value = e.target.value.replace('/', '-')

  }

  return (
    <div className='flex-grow relative flex mx-[-2rem]'>
      <div className='absolute top-0 w-full h-full'>
        <img src='panner.jpg' alt="panner" className='w-full h-full' />
      </div>

      <div className='flex-grow z-10 px-8'>
        <div className='w-full flex justify-end items-center my-4'>
          <aside className='flex flex-col w-full max-w-[370px] bg-black'>
            <div className='w-full h-12 bg-[#8f3237] p-2 flex justify-center items-center'>
              <h2 className='text-[#fbd789] font-medium'> Book Now </h2>
            </div>

            <div className='w-full p-4 flex justify-center items-center flex-col bg-[#fbd789]'>
              <div className='w-full flex justify-between items-center'>
                <div className='flex flex-col'>
                  <label htmlFor=""> Check in </label>
                  <input className='p-1 rounded-sm' type="date" />
                </div>

                <div className='flex flex-col'>
                  <label htmlFor=""> Check out </label>
                  <input className='p-1 rounded-sm' type="date" />
                </div>

              </div>

              <div className='w-full flex flex-col mt-5 gap-4'>
                <div className='w-full flex justify-between items-center'>
                  <div className='flex'>
                    <h4 className='font-medium'> Adult(s) </h4>
                  </div>
                  <div className='flex items-center py-2 px-3 border rounded border-black'>
                    <BiMinus className='cursor-pointer text-gray-600 hover:text-black' size={20} />
                    <span className='px-4 font-medium'>1</span>
                    <BiPlus className='cursor-pointer text-gray-600 hover:text-black' size={20} />
                  </div>

                </div>

                <div className='w-full flex justify-between items-center'>
                  <div className='flex'>
                    <h4 className='font-medium'> Children </h4>
                  </div>
                  <div className='flex items-center py-2 px-3 border rounded border-black'>
                    <BiMinus className='cursor-pointer text-gray-600 hover:text-black' size={20} />
                    <span className='px-4 font-medium'>1</span>
                    <BiPlus className='cursor-pointer text-gray-600 hover:text-black' size={20} />
                  </div>

                </div>

              </div>

              <div className='flex w-full mt-8'>
                <input className='w-full p-2 rounded outline-none' type="text" name="promotion" placeholder='Discount Code' />
                <button className='px-4 bg-primaryBlue rounded ml-[-10px] text-gray-0 hover:bg-[#1162be]'>Apply</button>
              </div>

              <div className='flex w-full items-center justify-between mt-8'>
                <h4 className='font-medium'> Room type </h4>
                <select>
                  <option value="">1</option>
                  <option value="">3</option>
                  <option value="">3</option>
                </select>
              </div>

              <div className='flex w-full mt-8'>
                <button onClick={handleOnSubmit} className='py-2 px-3 bg-[#8f3237] rounded text-gray-0 hover:bg-[#77282c]'>Submit</button>

              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
