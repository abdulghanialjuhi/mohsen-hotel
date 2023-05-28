import React, { useEffect, useState } from 'react'
import Table from './secureAdmin/Table'
import { getCollectionDatWithId, getCollectionData, updateDataCollectionId, getNestedCollectionData, getCollectionDocument } from '../helper/firebaseFetch'
import { useNavigate, useParams } from 'react-router-dom'
import { getInputType, setFormKeys } from './secureAdmin/helper'
import ModalForm from './secureAdmin/ModalForm'
import { convertRoomsToArr } from './Hotels'

export default function MyBooking() {

    const [data, setData] = useState([])
    const [keys] = useState(['id', 'time', 'checkIn Date', 'checkOut Date', 'total', 'status', 'receipt'])
    const [editForm, setEditForm] = useState(false)
    const [record, setRecord] = useState({})

    const tableName = 'booking'
    const params = useParams()


    const handleDelete = () => {}

    const hetRecordsWithId = async () => {
        const res = await getCollectionDatWithId('booking')
        const myBooking = res.filter((record) => record.record.guestId === params.uid)

        return myBooking
    }

    const handleEditRecord = (field) => {
        // console.log(field);
        setEditForm(true)
        setRecord(field)
    }

    return (
        <div className='w-full h-full flex flex-col mb-10'>
            <section className='w-full mt-8'>
                <div className='flex flex-col max-w-[1200px] mx-auto items-center w-full'>
                    <div className='w-full h-full'>
                        <Table editable={true} tableName={tableName} data={data} keys={keys} handleDelete={handleDelete} isDelete={false} handleEditRecord={handleEditRecord} setData={setData} defaultFunc={hetRecordsWithId} additionalComponent={<UploadReceipt />} />
                        {editForm && <EditDataForm setEditForm={setEditForm} keys={keys} tableName={tableName} setData={setData} disabledKeys={['id', 'total', 'status', 'receipt', 'time']} record={record} />}
                    </div>
                </div>
            </section>
        </div>
    )
}

const EditDataForm = ({ tableName, keys, setData, setEditForm, record, disabledKeys }) => {
    console.log('record: ', record);

    const [formInput, setFormInput] = useState({})
    const [fonmLoading, setFonmLoading] = useState(false)

    useEffect(() => {
        setFormKeys(keys, record.record).then((response) => setFormInput(response))
    }, [keys])

    const handleFormChange = (e, key) => {
        let value = e.target.value
        if (getInputType(key) === 'date') {
            value = value.replace('/', '-')
        } else if (getInputType(key) === 'file') {
            value = e.target?.files[0]
        }
        
        setFormInput(prev => ({
            ...prev,
            [key]: value
        }));
    }

    const handleOnSubmit = async () => {
        const isNullishs = Object.values(formInput).some(value => {
            if (value === null || value === '') {
                return true;
            }
        })

        if (formInput['status'] !== 'pending' && formInput['status'] !== 'paid') {
            alert('Sorry, you are not abele to update the booking')
            return
        }

        if (isNullishs) {
            alert('Please complete all fields')
            return
        }

        const rooms = record.record.roomNumber.split(', ')

        if (formInput['checkInDate'] >= formInput['checkOutDate']) {
            alert('Please enter valid checkin and checkout dates')
            return
        }

        setFonmLoading(true)

        try {
            const roomsAvalible = []
            const roomsBooked = []

            for (let room of rooms) {
                const roomRes = await getCollectionDocument('rooms', room)
                const roomType = await getNestedCollectionData('rooms', 'roomType', roomRes.roomType)

                for (let item of roomType) {
                    if (roomsBooked.includes(item.id)) continue
                    const res = await checkAvailability(item, formInput.checkInDate, formInput.checkOutDate, record.id)
                    if (res) {
                        roomsBooked.push(item.id)
                        roomsAvalible.push(item)
                        break
                    }
                }
            }

            let total = 0;
            roomsAvalible.forEach((room) => {
                total += room.record.price * getNights(formInput.checkInDate, formInput.checkOutDate)
            })

            // if (total !== parseInt(formInput['total']) && formInput['status'] === 'paid') {
            //     alert('Sorry, you are not abele to update the booking, due to price difference')
            //     return
            // }

            var result = roomsAvalible.map(u => u.record.roomNumber).join(', ')
            if (formInput['status'] === 'paid') {
                total -= formInput['total']
            }

            formInput['total'] = total
            formInput['roomNumber'] = result
            formInput['status'] = 'pending'
            
            const updatedObj = {}
            updatedObj['total'] = total
            updatedObj['roomNumber'] = result
            updatedObj['checkInDate'] = formInput.checkInDate
            updatedObj['checkOutDate'] = formInput.checkOutDate
            updatedObj['status'] = 'pending'

            await updateDataCollectionId(tableName, record.id, updatedObj)

            const recordClone = {...record}
            recordClone.record = formInput
            setData(prevData => prevData.map(item => item.id === record.id ? {...recordClone} : item ))

            setEditForm(false)
        } catch (error) {
            console.log('error: ', error);
            alert('sorry, something went wrong')
        } finally {
            setFonmLoading(false)
        }
    }

    if (!Object.keys(formInput).length > 0) return

    const todayDate = new Date().toISOString().split("T")[0]
    const isEditable = todayDate > formInput['checkInDate'] ? false : true
    console.log(formInput['checkInDate'], todayDate, isEditable);

    return (
        <div className='mt-5 py-2 w-full min-h-12 flex flex-col justify-start'>
            <ModalForm setShowModel={setEditForm}>
                <div className='w-full mt-3 h-full flex flex-col gap-3 items-center'>
                    <h3> Update {tableName} </h3>
                    <div className='w-full mt-3 h-full flex flex-col gap-3 items-center'>
                        <div className='flex mt-2 flex-wrap flex-grow justify-center gap-3'>

                            {keys.map((key) => (
                                <div key={key} className='flex flex-col'>
                                    <span> {key} </span>
                                    <input  min={todayDate} disabled={disabledKeys.includes(key.replace(' ', '')) || !isEditable} value={formInput[key.replace(' ', '')]} onChange={(e) => handleFormChange(e, key.replace(' ', ''))} type={getInputType(key)} name={key} className='border p-2' />
                                </div>
                            ))}
                        </div>
                        <span className='text-[12px] text-gray-400'>Please note, promotion code will not apply on updating booking</span>

                        <div className='mt-auto flex w-full justify-end gap-4'>
                            <button disabled={fonmLoading} className='py-2 px-3 bg-red-600 text-gray-0 rounded' onClick={() => setEditForm(false)}>Cancel</button>
                            <button disabled={fonmLoading} className='py-2 px-3 bg-primaryBlue text-gray-0 rounded' onClick={handleOnSubmit}>{fonmLoading ? 'update...' : 'update'}</button>
                        </div>
                    </div>
                </div>
            </ModalForm>
        </div>
    )
}

const UploadReceipt = ({ field }) => {
    
    const params = useParams()
    const navigate = useNavigate()
    
    const handleEditRecord = () => {
        navigate(`/auth-my-profile/${params.uid}/upload-receipt?bookingId=${field.id}`)
    }

    return (
        <div className='absolute right-0 z-[9] mr-2 flex justify-center items-center'>
            <button onClick={handleEditRecord.bind(this, field)} className='bg-primaryBlue text-gray-0 p-1 rounded'>upload receipt</button>
        </div>
    )
}

const checkAvailability = async (item, checkIn, checkOut, id) => {

    try {

        const res = await getCollectionData('booking')

        const convertedList = convertRoomsToArr(res)
        const roomBooks = convertedList.filter((book) => book.record.roomNumber.includes(item.record.roomNumber) && book.id !== id)
        if (!roomBooks.length > 0) return true

        const fromDate = new Date(checkIn.replaceAll('-', '/')).setHours(0,0,0,0)
        const toDate = new Date(checkOut.replaceAll('-', '/')).setHours(0,0,0,0)

        let isAvalibe = true
        roomBooks.forEach((book) => {
            const bookFromDate = new Date(book.record.checkInDate.replaceAll('-', '/'))
            const bookToDate = new Date(book.record.checkOutDate.replaceAll('-', '/'))
        
            if((bookFromDate.getTime() <= toDate && bookFromDate.getTime() >= fromDate) || (bookToDate.getTime() <= toDate && bookToDate.getTime() >= fromDate) ) {
                isAvalibe = false
            }
        })

        return isAvalibe
    } catch (err) {
        console.log(err);
        return false
    }

}

const getNights = (checkIn, checkOut) => {
    const fromDate = new Date(checkIn.replaceAll('-', '/'))
    const toDate = new Date(checkOut.replaceAll('-', '/'))

    const difference = toDate.getTime() - fromDate.getTime();
    const TotalDays = Math.ceil(difference / (1000 * 3600 * 24));
    return TotalDays
}