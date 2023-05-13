import React, { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import { getRealtimeDatabaseRecord } from '../helper/firebaseFetch'

export default function MyProfile() {

    const locations = useLocation()
    const navigate = useNavigate()
    const [userInfo, setUserInfo] = useState(null)
    const [loading, setLoading] = useState(true)
    const params = useParams()

    const profileView = ['my booking', 'update profile', 'upload-receipt']

    // console.log('locations:' ,params);

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
        navigate(`/auth-my-profile/${params.uid}/${table.replace(' ', '-')}`)
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
                            <li onClick={handleSelectTable.bind(this, table)} className={`p-2 text-lg cursor-pointer capitalize rounded ${!locations.pathname.split('/')[2] ? table === 'booking' && 'bg-gray-300 text-gray-0' : locations.pathname.split('/')[2]?.replace('-', ' ') === table ? 'bg-gray-300 text-gray-0' : 'hover:bg-gray-200'}`} key={table}>
                                {table}
                            </li>
                        ))}
                    </ul>
                </aside>
            </section>

            <section className='w-full mt-8'>
                <div className='flex flex-col max-w-[1000px] mx-auto items-center w-full'>
                    <Outlet />
                </div>
            </section>
    </div>
    )
}
