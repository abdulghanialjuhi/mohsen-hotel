import React, { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate, useParams, useOutletContext } from 'react-router-dom'
import { getRealtimeDatabaseRecord } from '../helper/firebaseFetch'

export default function MyProfile() {

    const locations = useLocation()
    const navigate = useNavigate()
    const [userInfo, setUserInfo] = useState(null)
    const [loading, setLoading] = useState(true)
    const params = useParams()

    const profileView = ['profile', 'my booking', 'update profile', 'upload receipt']

    useEffect(() => {
        getRealtimeDatabaseRecord(`users/${params.uid}`)
        .then((user) => {
            console.log(user);
            setUserInfo(user)
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            setLoading(false)
        })
    }, [])

    const handleSelectTable = (table) => {
        if (table === 'profile') {
            navigate(`/auth-my-profile/${params.uid}/`)
        } else {
            navigate(`/auth-my-profile/${params.uid}/${table.replace(' ', '-')}`)
        }
    }

    if (loading) return 'loading'
    
    return (
        <div className='w-full h-full flex flex-col mb-10'>
            <section className='flex w-full mt-6'>
                <aside className='p-4 w-full max-w-[250px] rounded shadow bg-gray-0'>
                    <div className='w-full flex mt-3 mb-8 justify-center items-center'>
                        <h3 className='text-xl'> {userInfo.name}  </h3>
                    </div>
                    <ul>
                        {profileView.map((table) => (
                            <li onClick={handleSelectTable.bind(this, table)} className={`p-2 text-lg cursor-pointer capitalize rounded ${!locations.pathname.split('/')[3] ? table === 'profile' && 'bg-gray-300 text-gray-0' : locations.pathname.split('/')[3]?.replace('-', ' ') === table ? 'bg-gray-300 text-gray-0' : 'hover:bg-gray-200'}`} key={table}>
                                {table}
                            </li>
                        ))}
                    </ul>
                </aside>
            </section>

            <section className='w-full mt-8'>
                <div className='flex flex-col max-w-[1000px] mx-auto items-center w-full'>
                    <Outlet context={{userInfo}} />
                </div>
            </section>
    </div>
    )
}

export const ProfileInfo = () => {
    
    const {userInfo} = useOutletContext();

    return (
        <div className='flex flex-col max-w-[600px] h-[400px] p-4 bg-gray-0 shadow mx-auto items-center w-full'>
            <h2 className='mb-2'> Profile Information </h2>

            <div className='w-full h-full flex justify-center items-center'>
                    <div className='w-full max-w-[400px] mx-auto mt-4 flex flex-col gap-5'>
                        <div className='flex flex-col w-full'>
                            <label htmlFor=""> full name </label>
                            <input disabled={true} value={userInfo.name} className='border p-1 rounded' type="text" name='name' />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label htmlFor=""> email </label>
                            <input disabled value={userInfo.email} className='border p-1 rounded' type="text" name='email' />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label htmlFor=""> phone number </label>
                            <input disabled={true} value={userInfo.phone} className='border p-1 rounded' type="text" name='phone' />
                        </div>
                    </div>
            </div>
        </div>
    )
}