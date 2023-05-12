import React, { useState } from 'react'
import Table from './secureAdmin/Table'
import { getCollectionDatWithId } from '../helper/firebaseFetch'
import { useParams } from 'react-router-dom'

export default function MyBooking() {

    const [data, setData] = useState([])
    const [keys] = useState(['id', 'room Number', 'guest Name', 'guest Id', 'checkIn Date', 'checkOut Date', 'total'])
    const tableName = 'booking'
    const params = useParams()

    const handleDelete = () => {}

    const hetRecordsWithId = async () => {
        const res = await getCollectionDatWithId('booking')
        const myBooking = res.filter((record) => record.record.guestId === params.uid)

        return myBooking
    }

    return (
        <div className='w-full h-full flex flex-col mb-10'>
            <section className='w-full mt-8'>
                <div className='flex flex-col max-w-[1000px] mx-auto items-center w-full'>
                    <div className='w-full h-full'>
                        <Table tableName={tableName} data={data} keys={keys} handleDelete={handleDelete} isDelete={false} setData={setData} defaultFunc={hetRecordsWithId} />
                    </div>
                </div>
            </section>
        </div>
    )
}
