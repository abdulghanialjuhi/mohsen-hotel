import React, { useState, useEffect } from 'react'
import { storage } from '../../firebaseConfig'
import Table from './Table';
import { ref, uploadBytesResumable, deleteObject } from "firebase/storage";
import { checkPrimaryKey, getInputType, setFormKeys } from './helper';
import { setDataCollectionId } from '../../helper/firebaseFetch';
import ModalForm from './ModalForm';


export default function Promotions() {

    const [data, setData] = useState([])
    const [keys] = useState(['promotion Code', 'percent', 'expire Date', 'image'])
    const tableName = 'promotions'
    const primaryKey = 'promotionCode'

    const handleDelete = async (recordData) => {
        const desertRef = ref(storage, `${tableName}/${recordData.record[primaryKey]}`);
        try {
            await deleteObject(desertRef)
        } catch(error) {
            console.log('error: ', error);
        } finally {
            let cloneData = [...data]
            const deletedRecord = cloneData.filter(data => data.id !== recordData.id)
            setData(deletedRecord)
        }
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
        const formWithoutImage = {...formInput}
        delete formWithoutImage['image']
        const isNullishs = Object.values(formWithoutImage).some(value => {
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
            clone['image'] = formInput['image'] ? formInput['image'].name : 'no image'
            
            await setDataCollectionId(tableName, formInput[primaryKey], clone)
            
            const dataObject = {}
            dataObject['record'] = clone
            dataObject['id'] = formInput[primaryKey]
            
            const storageRef = ref(storage, `/${tableName}/${formInput[primaryKey]}`)
            formInput['image'] && await uploadBytesResumable(storageRef, formInput['image']);
            
            setData(prevData => [...prevData, dataObject])

            const obj = {...formInput}
            Object.keys(obj).forEach(k => obj[k.replace(' ', '')] = '');
            setFormInput(obj)
            setShowForm(false)

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
                        <div className='flex mt-2 flex-col w-full flex-grow justify-center gap-3'>
                            <div className='w-[90%] mx-auto mt-3 min-h-[5rem] flex flex-wrap gap-3 items-center'>
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