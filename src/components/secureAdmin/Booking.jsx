import React, { useState } from 'react'
import Table from './Table';

export default function Booking() {

    const [data, setData] = useState([])
    const [keys] = useState(['full Name', 'room Number', 'checkIn Date', 'checkOut Date', 'email', 'phone',  'total'])
    const tableName = 'booking'

    const handleDelete = async (recordData) => {

        // try {
        //     await deleteDoc(doc(db, tableName, recordData.id));
        // } catch (error) {
        //     console.log('error: ', error);
        // } finally {
        //     setDeleteLoading(false)
        //     setShowModel(false)
        // }

        let cloneData = [...data]
        const deletedRecord = cloneData.filter(data => data.id !== recordData.id)
        setData(deletedRecord)
    }

    return (
        <div className='w-full h-full'>
            <Table tableName={tableName} data={data} keys={keys} handleDelete={handleDelete} setData={setData} />
        </div>
    )
}
