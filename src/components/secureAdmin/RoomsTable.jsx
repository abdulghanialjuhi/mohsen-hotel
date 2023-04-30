import React, { useState, useEffect } from 'react'
import Table from './Table';
import { checkPrimaryKey, getInputType, setFormKeys } from './helper';
import { setDataCollectionId } from '../../helper/firebaseFetch';

export default function Rooms() {

    const [data, setData] = useState([])
    const [keys] = useState(['room Number', 'price', 'capacity', 'facilities'])
    const tableName = 'rooms'

    const handleDelete = (recordData) => {
        let cloneData = [...data]
        const deletedRecord = cloneData.filter(data => data.id !== recordData.id)
        setData(deletedRecord)
    }

    return (
        <div className='w-full h-full'>
            <Table tableName={tableName} data={data} keys={keys} handleDelete={handleDelete} setData={setData} />
            <AddDataForm keys={keys} tableName={tableName} setData={setData} primaryKey='roomNumber' />
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
                <div className='w-full mt-3 min-h-[5rem] flex flex-wrap gap-3 items-center'>
                    {keys.map((key) => (
                        key !== 'section' &&
                        <div key={key} className='flex flex-col'>
                            <span> {key} </span>
                            <input value={formInput[key.replace(' ', '')]} onChange={(e) => handleFormChange(e, key.replace(' ', ''))} type={getInputType(key)} name={key} className='border p-2' />
                        </div>
                    ))}
                    <div className='ml-auto h-full flex items-end'>
                        <button disabled={fonmLoading} className='py-2 px-3 bg-primaryBlue text-gray-0 rounded' onClick={handleOnSubmit}>{fonmLoading ? 'adding...' : 'submit'}</button>
                    </div>
                </div>
            )}
        </div>
    )
}
