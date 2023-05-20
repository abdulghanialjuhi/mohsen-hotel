import React, { useEffect, useState } from 'react'
import Table from './Table';
import { getCollectionDatWithId, getPic, updateDataCollectionId } from '../../helper/firebaseFetch';
import ModalForm from './ModalForm';

export default function Booking() {

    const [data, setData] = useState([])
    const [keys] = useState(['id', 'room Number', 'time', 'guest Name', 'checkIn Date', 'checkOut Date', 'total', 'status', 'receipt'])
    const tableName = 'booking'
    const [shwoForm, setShowForm] = useState(false)
    const [record, setRecord] = useState({})

    const handleDelete = async (recordData) => {
        let cloneData = [...data]
        const deletedRecord = cloneData.filter(data => data.id !== recordData.id)
        setData(deletedRecord)
    }

    const getIDs = async() => {
        const res = await getCollectionDatWithId('booking')
        console.log(res);

        return res
    }

    const handleEditRecord = (field) => {
        setShowForm(true)
        setRecord(field)
    }

    return (
        <div className='w-full h-full'>
            <Table tableName={tableName} data={data} keys={keys} handleDelete={handleDelete} setData={setData} defaultFunc={getIDs} handleEditRecord={handleEditRecord} editable={true} />
           {shwoForm && <AddDataForm setShowForm={setShowForm} keys={keys} tableName={tableName} setData={setData}  record={record} />}
        </div>
    )
}

const AddDataForm = ({ tableName, setShowForm, record, setData }) => {

    const [selcectedSection, setSelcectedSection] = useState('pending')
    const [fonmLoading, setFonmLoading] = useState(false)
    const [receipt, setReceipt] = useState()

    useEffect(() => {
        if (record) {
            setSelcectedSection(record?.record?.status)
        }
        getPic(`/booking/${record.id}`)
        .then((res) => {
            setReceipt(res)
        }).catch((err) => {
            console.log('img error: ', err);
            setReceipt()
        })
    }, [])

    const handleOnSubmit = async () => {
        setFonmLoading(true)

        try {

            await updateDataCollectionId(tableName, record.id, {status: selcectedSection})

            // const filterData = data.find((item) => item.id === record.id)
            const recordClone = {...record}
            recordClone.record.status = selcectedSection
            setData(prevData => prevData.map(item => item.id === record.id ? {...recordClone} : item ))

            setShowForm(false)
        } catch (error) {
            console.log('error: ', error);
        } finally {
            setFonmLoading(false)
        }
    }
    const handleSelctSection = (e) => {
        setSelcectedSection(e.target.value)
    }

    return (
        <div className='mt-5 py-2 w-full min-h-12 flex flex-col justify-start'>
            <ModalForm setShowModel={setShowForm}>
                <div className='w-full mt-3 h-full flex flex-col gap-3 items-center'>
                    <h3> Update {tableName} </h3>
                    <div className='flex mt-2 flex-wrap flex-col flex-grow justify-center gap-3'>
                        <div className='w-[250px] h-[250px] border'>
                            {record.record.receipt && <img src={receipt} alt="receipt" className='w-full h-full' />}
                        </div>
                        <div className='flex flex-col'>
                            <span> Status </span>
                            <select className='p-2' onChange={handleSelctSection} value={selcectedSection} name="status">
                                <option className='border p-2' value='pending'>pending</option>
                                <option className='border p-2' value='paid'>paid</option>
                                <option className='border p-2' value='checked in'>checked in</option>
                                <option className='border p-2' value='checked out'>checked out</option>
                            </select>
                        </div>
                    </div>

                    <div className='mt-auto flex w-full justify-end gap-4'>
                        <button disabled={fonmLoading} className='py-2 px-3 bg-red-600 text-gray-0 rounded' onClick={() => setShowForm(false)}>Cancel</button>
                        <button disabled={fonmLoading} className='py-2 px-3 bg-primaryBlue text-gray-0 rounded' onClick={handleOnSubmit}>{fonmLoading ? 'adding...' : 'submit'}</button>
                    </div>
                </div>
            </ModalForm>
        </div>
    )
}
