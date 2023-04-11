import React, { useState, useEffect, useContext } from 'react'
import { collection, addDoc } from "firebase/firestore"; 
import { db, auth } from '../../firebaseConfig'
import Table from './Table';
import { deleteUser, createUserWithEmailAndPassword } from "firebase/auth";

export default function AdminTable() {

    const [data, setData] = useState([])
    const [keys] = useState(['name', 'email', 'password'])
    const tableName = 'admin'
    // const { user } = useContext()

    const handleDelete = (recordData) => {
        deleteUser(auth.currentUser).then(() => {
            console.log('access');
            window.location = '/auth-login'
            // User deleted.
        }).catch((error) => {
            // An error ocurred
            console.log('error: ', error);
        });

        let cloneData = [...data]
        const deletedRecord = cloneData.filter(data => data.id !== recordData.id)
        setData(deletedRecord)
    }

    return (
        <div className='w-full h-full'>
            <Table tableName={tableName} data={data} keys={keys} handleDelete={handleDelete} setData={setData} isDelete={true} />
            <AddDataForm keys={keys} tableName={tableName} setData={setData} />
        </div>
    )
}

const AddDataForm = ({ tableName, keys, setData }) => {

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
        
        console.log('value: ', key);

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
            const userCredential = await createUserWithEmailAndPassword(auth, formInput.email, formInput.password)
            const user = userCredential.user;
            console.log('user: ', user);
            const addResponse = await addDoc(collection(db, tableName), {email: formInput.email, name: formInput.name, userUID: userCredential.user.uid});


            dataObject['record'] = formInput
            dataObject['id'] = addResponse.id
            delete dataObject['password']

            setData(prevData => [...prevData, dataObject])
            const obj = {...formInput}

            Object.keys(obj).forEach(k => obj[k] = '');
            setFormInput(obj)
        } catch (error) {
            // const errorCode = error.code;
            // const errorMessage = error.message;
            console.log('error: ', error);
            alert('error adding new admin')
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
                        {/* <SubmitForm tableName={tableName} setData={setData} formInput={formInput} setFormInput={setFormInput} /> */}

                </div>
            )}
        </div>
    )
}
