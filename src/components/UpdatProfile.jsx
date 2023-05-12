import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { auth } from '../firebaseConfig'
import { getRealtimeDatabaseRecord, updateRealtimeDatabaseData } from '../helper/firebaseFetch'

export default function UpdatProfile() {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [erorrMessage, setErorrMessage] = useState({text: '', status: ''})
    const [loading, setLoading] = useState(false)
    const params = useParams()


    useEffect(() => {
        getRealtimeDatabaseRecord(`users/${params.uid}`)
        .then((user) => {
            console.log(user);
            setName(user.name)
            setEmail(user.email)
            setPhone(user.phone)
            // setUserInfo(user)
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            // setLoading(false)
        })
    }, [])

    const handleLogIn = async (e) => {
        e.preventDefault()
        setErorrMessage({text: '', status: ''})

        if (!name || !phone || !email) {
            return setErorrMessage({text: 'Please Fill In All Fields', status: 'danger'})
        }

        if (oldPassword && !newPassword) {
            return setErorrMessage({text: 'Please Fill In All Fields', status: 'danger'})
        }

        if (oldPassword && (newPassword !== confirmPassword)) {
            return setErorrMessage({text: 'New Password Does Not Match Re-ener Password', status: 'danger'})
        }
    
        setLoading(true)
    
        const credential = EmailAuthProvider.credential(
            auth.currentUser.email,
            oldPassword
        )

        if (oldPassword) {
            reauthenticateWithCredential(
                auth.currentUser, 
                credential
            ).then(async() => {
                await updatePassword(auth.currentUser, newPassword)
            }).catch((err) => {
                setErorrMessage({text: 'Current Password Incorrect', status: 'danger'})
                setLoading(false)
            })
        }

        try {
            await updateRealtimeDatabaseData('users', params.uid, {name, email, phone})
            setErorrMessage({text: 'Information Updated Successfully', status: 'seccuss'})
        } catch (err) {
            setErorrMessage({text: 'Error, Please Try Again', status: 'danger'})
        } finally {
            setLoading(false)
            setOldPassword('')
            setNewPassword('')
            setConfirmPassword('')
        }

    }
    
    return (
        <div className='w-full max-w-[650px] min-h-[430px] rounded mt-8 bg-white shadow flex flex-col items-center p-3 py-5'>
            <h2 className='mb-2'> Update profile </h2>
            <div className='min-h-[1rem] mt-2'>
                {erorrMessage.text && <span className={`h-full  p-1 rounded-md text-gray-100 ${erorrMessage.status === 'danger' ? 'bg-red-500' : 'bg-green-500'}`}> {erorrMessage.text} </span>}
            </div>
            <div className='w-full h-full flex justify-center items-center'>
                <form onSubmit={handleLogIn} className='w-full h-full'>
                    <div className='w-full max-w-[400px] mx-auto mt-4 flex flex-col gap-5'>
                        <div className='flex flex-col w-full'>
                            <label htmlFor=""> full name </label>
                            <input value={name} onChange={(e) => setName(e.target.value)} className='border p-1 rounded' type="text" name='name' />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label htmlFor=""> email </label>
                            <input disabled value={email} className='border p-1 rounded' type="text" name='email' />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label htmlFor=""> phone number </label>
                            <input value={phone} onChange={(e) => setPhone(e.target.value)} className='border p-1 rounded' type="text" name='phone' />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label htmlFor=""> old password </label>
                            <input placeholder='Leave plank to keep the same' value={oldPassword} type='password' onChange={(e) => setOldPassword(e.target.value)} className='border p-1 rounded' name='password' />
                        </div>
                        <div className='flex w-full'>
                            <div className='flex flex-col w-full px-1'>
                                <label htmlFor=""> new password </label>
                                <input value={newPassword} type='password' onChange={(e) => setNewPassword(e.target.value)} className='border p-1 rounded' name='password' />
                            </div>
                            <div className='flex flex-col w-full px-1'>
                                <label htmlFor=""> confirm password </label>
                                <input value={confirmPassword} type='password' onChange={(e) => setConfirmPassword(e.target.value)} className='border p-1 rounded' name='password' />
                            </div>
                        </div>
                        <div className='flex mt-4 justify-end'>    
                            <input disabled={loading} type="submit" name="submit" className='p-2 px-3 rounded bg-primaryBlue text-gray-0 cursor-pointer w-full' value={loading ? 'updating...' : 'Submit'} />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
