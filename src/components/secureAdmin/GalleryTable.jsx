import React, { useState, useEffect } from 'react'
import { collection, addDoc } from "firebase/firestore"; 
import { db } from '../../firebaseConfig'
import Table from './Table';
import SubmitForm from './SubmitForm';

export default function Gallery() {

    const [data, setData] = useState([])
    // const [keys] = useState(['pictureID', 'pictureName'])
    const [keys] = useState(['tag', 'pictureName'])
    const tableName = 'gallery'

    const handleDelete = (recordData) => {
        let cloneData = [...data]
        const deletedRecord = cloneData.filter(data => data.id !== recordData.id)
        setData(deletedRecord)
    }

    return (
        <div className='w-full h-full'>
            <Table tableName={tableName} data={data} keys={keys} handleDelete={handleDelete} setData={setData} />
            <AddDataForm keys={keys} tableName={tableName} setData={setData} />
        </div>
    )
}

const AddDataForm = ({ tableName, keys, setData }) => {

    const [shwoForm, setShowForm] = useState(false)
    const [formInput, setFormInput] = useState({})

    useEffect(() => {
        const obj = {}
        keys.forEach((key, i, arr) => {
            obj[key] = ''
            if (i === arr.length -1) setFormInput(obj)
        })
        
    }, [keys])

    const getInputType = (type) => {
        if (type.toLowerCase().includes('date')) {
            return 'date'
        } else if (type.toLowerCase().includes('img')) {
            return 'file'
        }
        return 'text'
    }

    const handleFormChange = (e, key) => {
        let value = e.target.value
        if (getInputType(key) === 'date') {
            value = value.replace('/', '-')
        }
        if (getInputType(key) === 'file') {
            value = e.target.files[0]
        }
        
        console.log('value: ', key);

        setFormInput(prev => ({
            ...prev,
            [key]: value
          }));
    }

    return (
        <div className='mt-5 py-2 w-full min-h-12 flex flex-col justify-start'>
            <div className='w-full flex justify-end items-center'>
                <button onClick={() => setShowForm(!shwoForm)} className='bg-gray-700 hover:bg-gray-800 p-3 rounded text-gray-0'> Add new {tableName} </button>
            </div>
            {shwoForm && (
                <div className='w-full mt-3 min-h-[5rem] flex flex-wrap gap-3 items-center'>
                    {keys.map((key) => (
                        <div key={key} className='flex flex-col'>
                            <span> {key} </span>
                            <input value={formInput[key]} onChange={(e) => handleFormChange(e, key)} type={getInputType(key)} name={key} className='border p-2'   />
                        </div>
                    ))}
                    <SubmitForm tableName={tableName} setData={setData} formInput={formInput} setFormInput={setFormInput} />
                </div>
            )}
        </div>
    )
}
