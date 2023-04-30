import React from 'react'
import { useNavigate, Outlet, useLocation } from 'react-router-dom';

export default function Admin() {

    const tables = [{tableName: 'booking', id: 'email'}, {tableName: 'rooms', id: 'name'}, {tableName: 'facilities', id: 'pictureID'}, {tableName: 'admin', id: 'adminID'}, {tableName: 'promotions', id: 'promotionCode'}, {tableName: 'gallery', id: 'pictureID'}, {tableName: 'gallery sections', id: 'pictureID'}]

    const locations = useLocation()
    const navigate = useNavigate()

    const handleSelectTable = (table) => {
        navigate(`${table.replace(' ', '-')}`)
    }

    return (
        <div className='w-full h-full flex flex-col mb-10'>
            <section className='flex w-full mt-6'>
                <aside className='p-4 w-full max-w-[200px] rounded border'>
                    <ul>
                        {tables.map((table) => (
                            <li onClick={handleSelectTable.bind(this, table.tableName)} className={`p-2 text-lg cursor-pointer capitalize rounded ${locations.pathname.split('/')[2]?.replace('-', ' ') === table.tableName ? 'bg-gray-300 text-gray-0' : 'hover:bg-gray-200'}`} key={table.tableName}>
                                {table.tableName}
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
