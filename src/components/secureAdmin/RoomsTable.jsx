import React, { useState, useEffect } from 'react'
import Table from './Table';
import { checkPrimaryKey, getInputType, setFormKeys } from './helper';
import { setDataCollectionId, updateDataCollectionId } from '../../helper/firebaseFetch';
import ModalForm from './ModalForm';

export default function Rooms() {

    const [data, setData] = useState([])
    const [keys] = useState(['name', 'room Number', 'roomType'])
    const [editForm, setEditForm] = useState(false)
    const [record, setRecord] = useState({})
    const tableName = 'rooms'

    const handleDelete = (recordData) => {
        let cloneData = [...data]
        const deletedRecord = cloneData.filter(data => data.id !== recordData.id)
        setData(deletedRecord)
    }

    const handleEditRecord = (field) => {
        // console.log(field);
        setEditForm(true)
        setRecord(field)
    }

    return (
        <div className='w-full h-full'>
            <Table tableName={tableName} data={data} keys={keys} handleDelete={handleDelete} setData={setData} editable={true} handleEditRecord={handleEditRecord} />
            <AddDataForm keys={keys} tableName={tableName} setData={setData} primaryKey='roomNumber' />
            {/* <EditDataForm keys={keys} tableName={tableName} setData={setData} primaryKey='roomNumber' /> */}
            {editForm && <EditDataForm setEditForm={setEditForm} keys={keys} tableName={tableName} setData={setData} primaryKey='roomNumber' record={record} />}
        </div>
    )
}

const AddDataForm = ({ tableName, keys, setData, primaryKey }) => {

    const [shwoForm, setShowForm] = useState(false)
    const [formInput, setFormInput] = useState({})
    const [fonmLoading, setFonmLoading] = useState(false)

    useEffect(() => {
        setFormKeys(keys).then((response) => setFormInput(response))
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

        if (isNullishs) {
            alert('Please complete all fields')
            return
        }

        setFonmLoading(true)

        try {
            const isExisit = await checkPrimaryKey(formInput[primaryKey], tableName, primaryKey)

            if (isExisit) {
                alert(`${primaryKey} must be unique`)
                return 
            }

            const clone = {...formInput}
            
            await setDataCollectionId(tableName, formInput[primaryKey], clone)
            
            const dataObject = {}
            dataObject['record'] = clone
            dataObject['id'] = formInput[primaryKey]
            
            
            setData(prevData => [...prevData, dataObject])

            const obj = {...formInput}
            console.log('obj: ', obj);
            Object.keys(obj).forEach(k => obj[k.replace(' ', '')] = '');
            setFormInput(obj)

        } catch (error) {
            console.log('error: ', error);
        } finally {
            setFonmLoading(false)
        }
    }

    return (
        <div className='mt-5 py-2 w-full min-h-12 flex flex-col justify-start'>
            <div className='w-full flex justify-end items-center'>
                <button onClick={() => setShowForm(!shwoForm)} className='bg-gray-700 hover:bg-gray-800 p-3 rounded text-gray-0'> Add new {tableName} </button>
            </div>
            {shwoForm && (
                <ModalForm setShowModel={setShowForm}>
                    <div className='w-full mt-3 h-full flex flex-col gap-3 items-center'>
                        <h3> Add New {tableName} </h3>
                        <div className='flex mt-2 flex-wrap flex-grow justify-center gap-3'>
                            <div className='w-[90%] mx-auto mt-3 min-h-[5rem] flex flex-wrap gap-3 items-center'>
                                {keys.map((key) => (
                                    key !== 'section' &&
                                    <div key={key} className='flex flex-col'>
                                        <span> {key} </span>
                                        <input value={formInput[key.replace(' ', '')]} onChange={(e) => handleFormChange(e, key.replace(' ', ''))} type={getInputType(key)} name={key} className='border p-2' />
                                    </div>
                                ))}
                            </div>

                            <div className='mt-auto flex w-full justify-end gap-4'>
                                <button disabled={fonmLoading} className='py-2 px-3 bg-red-600 text-gray-0 rounded' onClick={() => setShowForm(false)}>Cancel</button>
                                <button disabled={fonmLoading} className='py-2 px-3 bg-primaryBlue text-gray-0 rounded' onClick={handleOnSubmit}>{fonmLoading ? 'adding...' : 'submit'}</button>
                            </div>
                        </div>
                    </div>
                </ModalForm>

            )}
        </div>
    )
}

const EditDataForm = ({ tableName, keys, setData, primaryKey, setEditForm, record }) => {

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

        if (isNullishs) {
            alert('Please complete all fields')
            return
        }

        setFonmLoading(true)

        try {
            await updateDataCollectionId(tableName, record.id, formInput)

            const recordClone = {...record}
            recordClone.record = formInput
            setData(prevData => prevData.map(item => item.id === record.id ? {...recordClone} : item ))

            setEditForm(false)
        } catch (error) {
            console.log('error: ', error);
        } finally {
            setFonmLoading(false)
        }
    }

    if (!Object.keys(formInput).length > 0) return

    return (
        <div className='mt-5 py-2 w-full min-h-12 flex flex-col justify-start'>
            <ModalForm setShowModel={setEditForm}>
                <div className='w-full mt-3 h-full flex flex-col gap-3 items-center'>
                    <h3> Update {tableName} </h3>
                    <div className='w-full mt-3 h-full flex flex-col gap-3 items-center'>
                        <div className='flex mt-2 flex-wrap flex-grow justify-center gap-3'>

                            {keys.map((key) => (
                                !key.includes('bed Type') &&
                                <div key={key} className='flex flex-col'>
                                    <span> {key} </span>
                                    <input disabled={key.replace(' ', '') === primaryKey} value={formInput[key.replace(' ', '')]} onChange={(e) => handleFormChange(e, key.replace(' ', ''))} type={getInputType(key)} name={key} className='border p-2' />
                                </div>
                            ))}
                        </div>

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