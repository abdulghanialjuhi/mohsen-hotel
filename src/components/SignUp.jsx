import { signInWithEmailAndPassword } from 'firebase/auth'
import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Context } from '../context/GlobalState'
import { auth } from '../firebaseConfig'
import axios from 'axios'

const getErrorMessage = (error) => {
    switch (error.message) {
        case 'Firebase: Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later. (auth/too-many-requests).':
            return 'Access to this account has been temporarily disabled due to many failed login attempts'
        case 'Firebase: Error (auth/wrong-password).':
            return 'wrong-password'
        case 'Firebase: A network AuthError (such as timeout, interrupted connection or unreachable host) has occurred. (auth/network-request-failed).':
            return 'A network AuthError'
        case 'Firebase: Error (auth/user-not-found).':
            return 'user not found'
        default:
            return 'Error, Please Try Again';
    }
}

export default function SignUp() {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [erorrMessage, setErorrMessage] = useState('')
    const [seccussMessage, setSeccussMessage] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [loading, setLoading] = useState(false)

    const { actions } = useContext(Context)
    const navigate = useNavigate()

    const handleLogIn = async (e) => {
        e.preventDefault()

        if (password !== passwordConfirm) {
            setErorrMessage('Password does not match confirm Password')
            setTimeout(() => setErorrMessage(''), 1500)
            return false
        }

        if (!email || !password) {
            setErorrMessage('Please Fill In All Fields')
            setTimeout(() => setErorrMessage(''), 1500)
            return false
        }
    
        setLoading(true)

        try {
            await axios.post('http://localhost:8000/add-user', {email, password, name})
            setSeccussMessage('Account created seccussfully')
            setTimeout(() => navigate('/login'), 2000)
        } catch (error) {
            console.log(error);
            if (error.response?.data?.message) {
                setErorrMessage(error.response.data.message)
            } else {
                setErorrMessage(getErrorMessage(error))
            }
            setTimeout(() => {
                setErorrMessage('')
                }, 3000)
        } finally {
            setLoading(false)
            setPassword('')
            setPasswordConfirm('')
        }
    }
    
    return (
        <div className='flex-grow flex justify-center items-center'>
            <div className='w-full max-w-[650px] min-h-[430px] border mt-8 border-gray-200 rounded flex flex-col items-center p-3'>
                <h2 className='mb-2'> Sign Up </h2>
                <div className='min-h-[1rem] mt-2 flex justify-center max-w-[450px]'>
                    {erorrMessage && <span className='h-full bg-red-500 py-1 text-center px-2 rounded-md text-gray-100'> {erorrMessage} </span>}
                    {seccussMessage && <span className='h-full bg-green-500 py-1 text-center px-2 rounded-md text-gray-100'> {seccussMessage} </span>}
                </div>
                <div className='w-full h-full flex flex-col justify-center items-center'>
                    <form onSubmit={handleLogIn} className='w-full h-full'>
                        <div className='w-full max-w-[350px] mx-auto mt-4 flex flex-col gap-5'>
                            <div className='flex flex-col w-full'>
                                <label htmlFor=""> full name </label>
                                <input value={name} onChange={(e) => setName(e.target.value)} className='border p-1 rounded' type="text" />
                            </div>
                            <div className='flex flex-col w-full'>
                                <label htmlFor=""> email </label>
                                <input value={email} onChange={(e) => setEmail(e.target.value)} className='border p-1 rounded' type="text" />
                            </div>
                            <div className='flex flex-col w-full'>
                                <label htmlFor=""> password </label>
                                <input value={password} type='password' onChange={(e) => setPassword(e.target.value)} className='border p-1 rounded' />
                            </div>
                            <div className='flex flex-col w-full'>
                                <label htmlFor=""> confirm password </label>
                                <input value={passwordConfirm} type='password' onChange={(e) => setPasswordConfirm(e.target.value)} className='border p-1 rounded' />
                            </div>
                            <div className='flex mt-4 justify-end'>    
                                <input disabled={loading} type="submit" name="submit" className='p-2 px-3 rounded bg-primaryBlue text-gray-0 cursor-pointer' value={loading ? 'Singing up...' : 'Submit'} />
                            </div>
                        </div>
                    </form>
                    <div className='flex justify-center items-center mt-5 gap-2'>   
                        <p className=''>Already have an account? </p>
                        <Link className='text-primaryBlue' to='/login'> Login </Link> 
                    </div>
                </div>
            </div>
        </div>
    )
}
