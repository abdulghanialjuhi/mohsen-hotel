import React, { useState } from 'react'
import { signOut } from 'firebase/auth'
import { CgProfile } from 'react-icons/cg'
import { auth } from '../firebaseConfig'

export default function Profile() {

    const [isMenu, setIsMenu] = useState(false)

    const handleLogOut = () => {
        signOut(auth).then(() => {
            console.log('logged out');
            window.location = '/auth-login'
        }).catch((err) => {
            console.log(err);
        })
    }

    return (
        <div className='p-2 flex items-center '>
            <div onClick={() => setIsMenu(!isMenu)} className='p-1 cursor-pointer relative'>
                <CgProfile size={35} />
                {isMenu && (
                    <div onClick={(e) => e.stopPropagation()} className='min-h-[150px] shadow bg-gray-0 w-[200px] absolute top-[100%] right-0 cursor-default flex flex-col p-4 rounded'>
                        {/* <div className='w-full flex h-[70px] justify-center items-center'>

                        </div> */}
                        <div onClick={() => window.location = 'secure-update-password'} className='mt-3 flex w-full items-center justify-center hover:bg-gray-200 cursor-pointer rounded p-1'>
                            <button className='font-[600] p-1'>Updat password</button>
                        </div>

                        <div onClick={handleLogOut} className='mt-auto flex w-full p-1 justify-center hover:bg-gray-200 cursor-pointer rounded'>
                            <button className='font-[600] p-1 text-red-500'>Logout</button>
                        </div>
                    </div>
                )}
            </div>


        </div>
    )
}
