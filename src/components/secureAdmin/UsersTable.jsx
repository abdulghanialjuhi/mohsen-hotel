import React, { useState, useEffect, useContext } from 'react'
import Table from './Table';
import axios from 'axios'
import { Context } from '../../context/GlobalState';

export default function UsersTable() {

    const [data, setData] = useState([])
    const [keys] = useState(['name', 'email', 'password'])
    const tableName = 'user'
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
            const res = await axios.get("http://localhost:8000/get-users")
            return res.data.users
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className='w-full h-full'>
            <Table tableName={tableName} data={data} keys={keys} handleDelete={handleDelete} setData={setData} isDelete={false} defaultFunc={getAllUsers} />
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
            const res = await axios.post("http://localhost:8000/add-user", {'name': formInput.name, 'email': formInput.email, 'password': formInput.password})
            console.log('res: ', res);

            dataObject['record'] = formInput
            dataObject['id'] = res.data.uid
            delete dataObject['password']

            setData(prevData => [...prevData, dataObject])
            const obj = {...formInput}

            Object.keys(obj).forEach(k => obj[k] = '');
            setFormInput(obj)
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
                <div className='w-full mt-3 min-h-[5rem] flex flex-wrap gap-3 items-center'>
                    {keys.map((key) => (
                        <div key={key} className='flex flex-col'>
                            <span> {key} </span>
                            <input value={formInput[key]} onChange={(e) => handleFormChange(e, key)} type={getInputType(key)} name={key} className='border p-2'   />
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
