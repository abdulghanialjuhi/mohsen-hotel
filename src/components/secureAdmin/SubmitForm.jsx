import React, { useState } from 'react'
import { collection, addDoc } from "firebase/firestore"; 
import { db } from '../../firebaseConfig'

export default function SubmitForm({ tableName, setData, formInput, setFormInput }) {

    const [fonmLoading, setFonmLoading] = useState(false)

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
            const addResponse = await addDoc(collection(db, tableName), formInput);
            dataObject['record'] = formInput
            dataObject['id'] = addResponse.id
            setData(prevData => [...prevData, dataObject])
            const obj = {...formInput}

            Object.keys(obj).forEach(k => obj[k] = '');
            setFormInput(obj)
        } catch (error) {
            console.log('error: ', error);
        } finally {
            setFonmLoading(false)
        }
    }

    return (
        <div className='ml-auto h-full flex items-end'>
            <button disabled={fonmLoading} className='py-2 px-3 bg-primaryBlue text-gray-0 rounded' onClick={handleOnSubmit}>{fonmLoading ? 'adding...' : 'submit'}</button>
        </div>
    )
}
