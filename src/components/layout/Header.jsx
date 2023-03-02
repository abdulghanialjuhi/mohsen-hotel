import React from 'react'
import { Link } from 'react-router-dom'
import { useLocation, useNavigate } from 'react-router-dom'

export default function Header() {

    const locations = useLocation()
    const navigate = useNavigate()

    const navList = [['home', '/'], ['promotions', '/promotions'], ['meetings & events', '/events'], ['gallery', '/gallery'], ['location', '/location'], ['contact us', '/contact']]
    const excludeHeader = ['secure', 'auth']

    return (
        <div>
            <div className='flex align-center h-20 border-b-[1px]'>
                <div className='flex px-8 items-center cursor-pointer' onClick={() => navigate('/')}>
                    <h1 className='text'> MK </h1>
                    <h3 className='text-xl ml-2'> Hotel </h3>
                </div>

            </div>
            {!excludeHeader.some(el => locations.pathname.includes(el)) && (
                <nav className='flex items-center h-12 border-b-[1px]'>
                    <ul className='flex w-full h-full justify-evenly'>
                        {navList.map(([title, url]) => (
                            <Link key={url} to={url}>
                                <li className={`relative flex h-full items-center uppercase text-sm cursor-pointer hover:before:absolute 
                                hover:before:border-t-[3px] hover:before:border-t-black hover:before:top-0 hover:before:rounded-sm hover:before:w-full hover:before:content-[""] ${locations.pathname === url ? 'text-black font-medium' : ''}`}>
                                    {title} 
                                </li>
                            </Link>
                        ))}
                    </ul>
                </nav>
            )}
        </div>

    )
}
