import React, { useState, useEffect } from 'react'
import { storage } from '../../firebaseConfig'
import Table from './Table';
import { ref, deleteObject, uploadBytesResumable } from "firebase/storage";
import { checkPrimaryKey, getInputType, setFormKeys } from './helper';
import { setDataCollectionId } from '../../helper/firebaseFetch';

export default function FacilitiesTable() {

    const [data, setData] = useState([])

    const [keys] = useState(['id', 'TV', 'bed Double', 'bed Single', 'description', 'image'])
    const tableName = 'facilities'
    const primaryKey = 'id'

    const handleDelete = (recordData) => {
        const desertRef = ref(storage, `${tableName}/${recordData.record[primaryKey]}`);
        deleteObject(desertRef).then(() => {
            let cloneData = [...data]
            const deletedRecord = cloneData.filter(data => data.id !== recordData.id)
            setData(deletedRecord)
        }).catch((error) => {
            console.log('error: ', error);
        });
    }

    return (
        <div className='w-full h-full'>
            <Table tableName={tableName} data={data} keys={keys} handleDelete={handleDelete} setData={setData} />
            <AddDataForm keys={keys} tableName={tableName} setData={setData} primaryKey={primaryKey} />
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
            clone['image'] = formInput['image'].name
            
            await setDataCollectionId(tableName, formInput[primaryKey], clone)
            
            const dataObject = {}
            dataObject['record'] = clone
            dataObject['id'] = formInput[primaryKey]
            
            const storageRef = ref(storage, `/${tableName}/${formInput.id}`)
            await uploadBytesResumable(storageRef, formInput['image']);
            
            setData(prevData => [...prevData, dataObject])

            const obj = {...formInput}
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
                            {key.includes('image') ? ( 
                                    <input onChange={(e) => handleFormChange(e, key.replace(' ', ''))} accept="image/png, image/jpeg" type={getInputType(key)} name={key} className='border p-2' />
                                ) : (
                                    <input value={formInput[key.replace(' ', '')]} onChange={(e) => handleFormChange(e, key.replace(' ', ''))} type={getInputType(key)} name={key} className='border p-2' />
                                )
                            }
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
