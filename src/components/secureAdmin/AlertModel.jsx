import React, { useState } from 'react'


export default function AlertModel({ setShowModel, onClick, deleteLoading }) {


    return (
        <div onClick={() => setShowModel(false)} className='fixed top-0 h-screen w-screen bg-black-rgba z-20 flex justify-center p-2'>
            <div onClick={(e) => e.stopPropagation()} className='max-w-[480px] w-[100%] h-[220px] bg-gray-100 rounded-xl overflow-scroll mt-[10rem]'>
                <div className='w-full h-full flex flex-col items-center p-4'>
                    <h3 className='mt-2 mb-4'> Would you like to permanently delete this record? </h3>

                    <span className='text-[14px] text-left'>Once deleted, this record will no longer be accessible.</span>
                    
                    <div className='w-full flex p-2 justify-end mt-auto mb-4 gap-4'>
                        <button onClick={() => setShowModel(false)} className='rounded-2xl border-gray-500 border py-1 px-3 hover:bg-gray-200 font-[500]'> Cancel </button>
                        <button disabled={deleteLoading} onClick={onClick} className='rounded-2xl py-1 px-3 bg-red-600 text-gray-0 hover:bg-red-700 font-[500]'> {deleteLoading ? 'Deleting...' : 'Permanently delete'}  </button>

                    </div>
                </div>
            </div>
        </div>
    )
}
