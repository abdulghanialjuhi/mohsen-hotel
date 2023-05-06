import React, { useContext, useEffect, useState } from 'react'
import { BsSearch, BsTrash } from 'react-icons/bs';
import AlertModel from './AlertModel';
import { doc, deleteDoc } from "firebase/firestore";
import { db } from '../../firebaseConfig'
import { getCollectionData } from '../../helper/firebaseFetch';
import { Context } from '../../context/GlobalState';

export default function Table({ tableName, data, keys, handleDelete, setData, isDelete=true, defaultFunc=getCollectionData }) {

    const [filterHistoryJobs, setFilterHistoryJobs] = useState([])
    const [loading, setLoading] = useState(true)

    let typingTimer;                
    let doneTypingInterval = 1000; 

    const getTableId = (name) => {
        if (name === 'booking') {
            return 'email'
        } else if (name === 'rooms') {
            return 'name'
        } else if (name === 'promotions') {
            return 'promotionCode'
        } else if (name === 'gallery') {
            return 'pictureID'
        } else if (name === 'admin') {
            return 'email'
        }
    } 
    const tableId = getTableId(tableName)

    useEffect(() => {
        defaultFunc(tableName).then((res) => {
            console.log(res);
            setData(res)
            setFilterHistoryJobs(res)
        }).catch((err) => {
            console.log('err: ', err);
        }).finally(() => {
            setLoading(false)
        })

    }, [])


    useEffect(() => {
        setFilterHistoryJobs(data)
    }, [data])

    const handleSearch = (e) => {
        const value = e.target.value
        clearTimeout(typingTimer);
        if (value) {
            typingTimer = setTimeout(handleSearching.bind(this, value.toLowerCase()), doneTypingInterval);
        } else {
          setFilterHistoryJobs(data)
        }
    }
    
    const handleSearching = (value) => {
        let matchData = []
    
        for (let items of data) {
            if (items.record[tableId].toLowerCase().includes(value)){
              matchData.push(items)
            } 
        }
        setFilterHistoryJobs(matchData);
    }

    return (
        <div>
            <div className='flex justify-between items-center w-full h-12 my-4'>
                <span className='capitalize'> {tableName} </span>
                <div className='flex justify-between items-center h-8 w-[250px] border border-gray-500 cursor-pointer px-1 rounded'>
                    <input onChange={handleSearch} placeholder='search' type="text" className='w-full p-1 outline-none text-sm bg-transparent' />
                    <BsSearch className='mx-1' />
                </div>
            </div>
            <div className='w-full min-h-[300px] border'>
                <div className='flex items-center justify-evenly w-full h-10 bg-gray-700'>
                    {keys.map((head) => (
                        !head.includes('password') &&
                        <span className='text-gray-100 px-2 overflow-hidden w-full text-center' key={head}> {head} </span>
                    ))}
                </div>
                <div className='p-1 max-h-[500px] overflow-scroll scrollbar-hide'>
                    {loading ? (
                        <h3 className='text-center mt-3'>
                            loading
                        </h3>
                    ) : filterHistoryJobs?.length > 0 ? (
                        filterHistoryJobs.map((num, i) => (
                            <Record key={i} field={num} keys={keys} handleDelete={handleDelete} tableName={tableName} isDelete={isDelete} />
                        )) 
                    ) : (
                        <h3 className='text-center mt-2'>
                            No data available
                        </h3>
                    )}
                </div>
            </div>
        </div>
    )
}

const Record = ({ field, keys, handleDelete, tableName }) => {

    const [showModel, setShowModel] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)

    const handleDeleteRecord = async () => {
        setDeleteLoading(true)
        console.log('record: ', field);

        try {
            if (tableName === 'admin') {
                await handleDelete(field)
            } else {
                await deleteDoc(doc(db, tableName, field.id));
                await handleDelete(field)
            }
        } catch (error) {
            console.log('error: ', error);
        } finally {
            setDeleteLoading(false)
            setShowModel(false)
        }
    }

    // console.log(true.);

    return (
        <div className='flex group justify-evenly relative bg-gray-200 w-full py-2 my-1 '>
            {keys.map((key) => (
                !key.includes('password') && (<span key={key} className='w-full h-[25px] text-center max-w-[200px] overflow-hidden'> {field.record[key.replace(' ', '')]?.toString()} </span>)
            ))}
            <div className='absolute right-0 z-10 p-1 bg-gray-400 hidden group-hover:block  cursor-pointer' onClick={() => setShowModel(true)}>
                <BsTrash color='#fff' />
            </div>
            {showModel && <AlertModel handleDelete={handleDelete} tableName={tableName} setShowModel={setShowModel} onClick={handleDeleteRecord} deleteLoading={deleteLoading} />}
        </div>
    )
}