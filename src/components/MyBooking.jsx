import React, { useState } from 'react'
import Table from './secureAdmin/Table'
import { getCollectionDatWithId } from '../helper/firebaseFetch'
import { useNavigate, useParams } from 'react-router-dom'

export default function MyBooking() {

    const [data, setData] = useState([])
    const [keys] = useState(['id', 'time', 'checkIn Date', 'checkOut Date', 'total', 'status', 'receipt'])
    const tableName = 'booking'
    const params = useParams()
    const navigate = useNavigate()

    const handleDelete = () => {}

    const hetRecordsWithId = async () => {
        const res = await getCollectionDatWithId('booking')
        const myBooking = res.filter((record) => record.record.guestId === params.uid)

        return myBooking
    }

    const handleEditRecord = (field) => {
        navigate(`/auth-my-profile/${params.uid}/upload-receipt?bookingId=${field.id}`)
    }

    return (
        <div className='w-full h-full flex flex-col mb-10'>
            <section className='w-full mt-8'>
                <div className='flex flex-col max-w-[1200px] mx-auto items-center w-full'>
                    <div className='w-full h-full'>
                        <Table tableName={tableName} data={data} keys={keys} handleDelete={handleDelete} isDelete={false} handleEditRecord={handleEditRecord} setData={setData} defaultFunc={hetRecordsWithId} />
                    </div>
                </div>
            </section>
        </div>
    )
}
