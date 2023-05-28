import React, { useState, useEffect, useContext } from 'react'
import Table from './Table';
import axios from 'axios'
import { Context } from '../../context/GlobalState';
import ModalForm from './ModalForm';

export default function AdminTable() {

    const [data, setData] = useState([])
    const [keys] = useState(['name', 'email', 'password'])
    const tableName = 'admin'
    const { user } = useContext(Context)

    const handleDelete = async (recordData)  => {
        try {
            const res = await axios.post("http://localhost:8000/delete-user", {'uid': recordData.id})
            if (recordData.id === user) {
                window.location.reload()
            }
            let cloneData = [...data]
            const deletedRecord = cloneData.filter(data => data.id !== recordData.id)
            setData(deletedRecord)
        } catch (err) {
            console.log(err);
            alert('Error: something went wrong')
        }
    }

    const getAllUsers = async () => {
        try {
            const res = await axios.get("http://localhost:8000/get-admins")
            return res.data.users
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className='w-full h-full'>
            <Table tableName={tableName} data={data} keys={keys} handleDelete={handleDelete} setData={setData} defaultFunc={getAllUsers} />
            <AddDataForm keys={keys} tableName={tableName} setData={setData} primaryKey='email' />
        </div>
    )
}

export const AddDataForm = ({ tableName, keys, setData, primaryKey }) => {

    const [shwoForm, setShowForm] = useState(false)
    const [formInput, setFormInput] = useState({})
    const [fonmLoading, setFonmLoading] = useState(false)

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
        } else if (type.toLowerCase().includes('password')) {
            return 'password'
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
            const dataObject = {}
            const res = await axios.post("http://localhost:8000/add-admin", {'name': formInput.name, 'email': formInput.email, 'password': formInput.password})
            console.log('res: ', res);

            dataObject['record'] = formInput
            dataObject['id'] = res.data.uid
            delete dataObject['password']

            setData(prevData => [...prevData, dataObject])
            const obj = {...formInput}

            Object.keys(obj).forEach(k => obj[k] = '');
            setFormInput(obj)
            setShowForm(false)

        } catch (error) {
            console.log('error: ', error);
            if (error.response.data.message) {
                alert(`Error: ${error.response.data.message}`)
            } else {
                alert(`Error: something went wrong`)
            }
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
                            {keys.map((key) => (
                                <div key={key} className='flex flex-col'>
                                    <span> {key} </span>
                                    <input value={formInput[key]} onChange={(e) => handleFormChange(e, key)} type={getInputType(key)} name={key} className='border p-2'   />
                                </div>
                            ))}
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
