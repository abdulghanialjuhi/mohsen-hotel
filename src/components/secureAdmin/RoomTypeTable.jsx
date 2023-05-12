import React, { useState, useEffect } from 'react'
import { storage } from '../../firebaseConfig'
import Table from './Table';
import { ref, deleteObject, uploadBytesResumable } from "firebase/storage";
import { checkPrimaryKey, getInputType, setFormKeys } from './helper';
import { deleteImages, setDataCollectionId } from '../../helper/firebaseFetch';
import ModalForm from './ModalForm';

export default function RoomTypeTable() {

    const [data, setData] = useState([])

    const [keys] = useState(['id', 'bed Type', 'description', 'capacity', 'image'])
    const [recrodData, setRecrodData] = useState({})
    const [shwoForm, setShowForm] = useState(false)

    const tableName = 'roomType'
    const primaryKey = 'id'

    const handleDelete = (recordData) => {
        deleteImages(`${tableName}/${recordData.record[primaryKey]}`)
        .then((res) => {
            console.log(res);
            let cloneData = [...data]
            const deletedRecord = cloneData.filter(data => data.id !== recordData.id)
            setData(deletedRecord)
        }).catch((err) => {
            console.log(err);
        })
    }

    const handleEditRecord = (field) => {
        setRecrodData(field)
        setShowForm(true)
    }

    return (
        <div className='w-full h-full'>
            <Table tableName={tableName} data={data} keys={keys} handleDelete={handleDelete} setData={setData} handleEditRecord={handleEditRecord} />
            <AddDataForm recrodData={recrodData} setShowForm={setShowForm} shwoForm={shwoForm} keys={keys} tableName={tableName} setData={setData} primaryKey={primaryKey} />
        </div>
    )
}

const AddDataForm = ({ recrodData, tableName, keys, setData, primaryKey, shwoForm, setShowForm }) => {

    const [formInput, setFormInput] = useState({})
    const [selcectedSection, setSelcectedSection] = useState('')
    const [fonmLoading, setFonmLoading] = useState(false)

    useEffect(() => {
        setFormKeys(keys).then((response) => {
            console.log(response);
            setFormInput(response)
        })
    }, [keys])

    const handleFormChange = (e, key) => {
        let value = e.target.value
        if (getInputType(key) === 'date') {
            value = value.replace('/', '-')
        } else if (getInputType(key) === 'file') {
            value = e.target?.files
        } else if (getInputType(key) === 'checkbox') {
            value = e.target.checked
        }
        
        setFormInput(prev => ({
            ...prev,
            [key]: value
        }));
    }

    const handleOnSubmit = async () => {
        console.log(formInput);
        const isNullishs = Object.values(formInput).some(value => {
            if (value === null || value === '') {
                return true;
            }
        })

        if (isNullishs || !selcectedSection) {
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
            clone['image'] = formInput.id
            clone['bedType'] = selcectedSection
            
            await setDataCollectionId(tableName, formInput[primaryKey], clone)
            
            const dataObject = {}
            dataObject['record'] = clone
            dataObject['id'] = formInput[primaryKey]
            
            console.log(formInput.image);
            for (let img of formInput.image) {
                console.log('img: ', img);
                const storageRef = ref(storage, `/${tableName}/${formInput.id}/${img.name}`)
                await uploadBytesResumable(storageRef, img);
            }
            
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
    const handleSelctSection = (e) => {
        setSelcectedSection(e.target.value)
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

                            {keys.map((key) => (
                                !key.includes('bed Type') &&
                                <div key={key} className='flex flex-col'>
                                    <span> {key} </span>
                                    {key.includes('image') ? ( 
                                        <>
                                            <input onChange={(e) => handleFormChange(e, key.replace(' ', ''))} accept="image/png, image/jpeg" type={getInputType(key)} name={key} className='border p-2' multiple/>
                                            <span className='text-[10px]'>  To select multiple files, hold down the CTRL or SHIFT key while selecting</span>
                                        </>
                                        ) : (
                                            <input value={formInput[key.replace(' ', '')]} onChange={(e) => handleFormChange(e, key.replace(' ', ''))} type={getInputType(key)} name={key} className='border p-2' />
                                        )
                                    }
                                </div>
                            ))}
                            <div className='flex flex-col'>
                                <span> Bed type </span>
                                <select className='p-2' onChange={handleSelctSection} value={selcectedSection} name="sections">
                                    <option value="" disabled hidden>Choose bed type</option>
                                    <option className='border p-2' value='single'>single</option>
                                    <option className='border p-2' value='double'>double</option>
                                </select>
                            </div>
                        </div>

                        <div className='mt-auto flex w-full justify-end gap-4'>
                            <button disabled={fonmLoading} className='py-2 px-3 bg-red-600 text-gray-0 rounded' onClick={() => setShowForm(false)}>Cancel</button>
                            <button disabled={fonmLoading} className='py-2 px-3 bg-primaryBlue text-gray-0 rounded' onClick={handleOnSubmit}>{fonmLoading ? 'adding...' : 'submit'}</button>
                        </div>
                    </div>
                </ModalForm>
            )}
        </div>
    )
}
