import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { auth } from '../firebaseConfig'

export default function UpdatPassword() {

    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [erorrMessage, setErorrMessage] = useState({text: '', status: ''})
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const handleLogIn = (e) => {
        e.preventDefault()
        setErorrMessage({text: '', status: ''})

        if (newPassword !== confirmPassword) {
            return setErorrMessage({text: 'New Password Does Not Match Re-ener Password', status: 'danger'})
        }
  
        if (!newPassword || !oldPassword) {
            return setErorrMessage({text: 'Please Fill In All Fields', status: 'danger'})
        }
    
        setLoading(true)
    
        const credential = EmailAuthProvider.credential(
            auth.currentUser.email,
            oldPassword
        )
      
        reauthenticateWithCredential(
        auth.currentUser, 
        credential
        ).then(() => {
        updatePassword(auth.currentUser, newPassword).then(() => {
            setErorrMessage({text: 'Password Updated Successfully', status: 'seccuss'})
            setTimeout(() => navigate(-1), 1300)
        }).catch((error) => {
            setErorrMessage({text: 'Error, Please Try Again', status: 'danger'})
        }).finally(() => {
            setLoading(false)
            setOldPassword('')
            setNewPassword('')
            setConfirmPassword('')
        })
        }).catch((err) => {
        setErorrMessage({text: 'Current Password Incorrect', status: 'danger'})
        setLoading(false)
        })

    }
    
    return (
        <div className='flex-grow flex justify-center items-center'>
            <div className='w-full max-w-[650px] min-h-[430px] border mt-8 border-gray-200 rounded flex flex-col items-center p-3'>
                <h2 className='mb-2'> Update password </h2>
                <div className='min-h-[1rem] mt-2'>
                    {erorrMessage.text && <span className={`h-full  p-1 rounded-md text-gray-100 ${erorrMessage.status === 'danger' ? 'bg-red-500' : 'bg-green-500'}`}> {erorrMessage.text} </span>}
                </div>
                <div className='w-full h-full flex justify-center items-center'>
                    <form onSubmit={handleLogIn} className='w-full h-full'>
                        <div className='w-full max-w-[350px] mx-auto mt-4 flex flex-col gap-5'>
                            <div className='flex flex-col w-full'>
                                <label htmlFor=""> old password </label>
                                <input value={oldPassword} type='password' onChange={(e) => setOldPassword(e.target.value)} className='border p-1 rounded' />
                            </div>
                            <div className='flex flex-col w-full'>
                                <label htmlFor=""> new password </label>
                                <input value={newPassword} type='password' onChange={(e) => setNewPassword(e.target.value)} className='border p-1 rounded' />
                            </div>
                            <div className='flex flex-col w-full'>
                                <label htmlFor=""> confirm password </label>
                                <input value={confirmPassword} type='password' onChange={(e) => setConfirmPassword(e.target.value)} className='border p-1 rounded' />
                            </div>
                            <div className='flex mt-4 justify-end'>    
                                <input disabled={loading} type="submit" name="submit" className='p-2 px-3 rounded bg-primaryBlue text-gray-0 cursor-pointer' value={loading ? 'updating...' : 'Submit'} />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
