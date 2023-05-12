import React from 'react'

export default function ModalForm({ setShowModel, children }) {

    return (
        <div onClick={() => setShowModel(false)} className='fixed top-0 left-0 h-screen w-screen bg-black-rgba z-20 flex justify-center items-center p-2'>
            <div onClick={(e) => e.stopPropagation()} className='max-w-[750px] w-[100%] h-[70%] max-h-[500px] bg-gray-100 rounded-lg overflow-scroll'>
                <div className='w-full h-full flex flex-col items-center justify-center p-4'>
                    {children}
                </div>
            </div>
        </div> 
    )
}
