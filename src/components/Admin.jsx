import React, { useEffect, useState } from 'react'
import { BsSearch } from 'react-icons/bs';
import { collection, getDocs, addDoc, setDoc, doc } from "firebase/firestore"; 
import { db,auth } from '../firebaseConfig'
import { getDatabase, ref, set, child, get } from "firebase/database";

export default function Admin() {

    const [data, setData] = useState([])
    const [keys, setKeys] = useState([])
    const [tableName, setTableName] = useState('booking')
    const tables = [{tableName: 'booking', id: 'bookingID'}, {tableName: 'rooms', id: 'roomID'},{tableName: 'admin', id: 'adminID'}, {tableName: 'promotions', id: 'promotionID'}, {tableName: 'users', id: 'userName'}, {tableName: 'gallery', id: 'pictureID'}]

    // const getDate = async (table) => {
    //     const dataArr = []
    //     const querySnapshot = await getDocs(collection(db, table));

    //     querySnapshot.forEach((doc) => {
    //         dataArr.push(doc.data())
    //     });
  
    //     return dataArr
    // }

    const getDate = async (table) => {
        const dataArr = []
        const dbRef = ref(getDatabase());
        try {
            const snapshot = await get(child(dbRef, table))
            if (snapshot.exists()) {
                for (let i in snapshot.val()) {
                    // console.log(snapshot.val()[i]);
                    dataArr.push(snapshot.val()[i])
                }
                // console.log(snapshot.val());
            } else {
                console.log("No data available");
            }

            return dataArr
        } catch (err) {
            return err
        }

  
    }

    useEffect(() => {
        getDate(tableName).then((res) => {
            setData(res)
            Object.keys(res[0]).forEach((key) => {
                if (keys.includes(key)) return
                setKeys(prevKeys => [...prevKeys, key])
            })
        }).catch((err) => {
            console.log('err: ', err);
        })

    }, [])

    // useEffect(() => {
    //     console.log('dae: ', data);
    //     if (data.length > 0) {
    //         Object.keys(data[0]).forEach((key) => {
    //             if (keys.includes(key)) return
    //             setKeys(prevKeys => [...prevKeys, key])
    //         })
    //     }
    // }, [data])

    const handleSelectTable = (table) => {
        if (tableName === table) return
        setKeys([])
        setTableName(table)
        getDate(table).then((res) => {
            setData(res)
            Object.keys(res[0]).forEach((key) => {
                // if (keys.includes(key)) return
                setKeys(prevKeys => [...prevKeys, key])
            })
        })
    }

    return (
        <div className='w-full h-full flex flex-col'>
            <section className='flex w-full mt-6'>
                <aside className='p-4 w-full max-w-[200px] rounded border'>
                    <ul>
                        {tables.map((table) => (
                            <li onClick={handleSelectTable.bind(this, table.tableName)} className={`p-2 text-lg cursor-pointer capitalize rounded ${tableName === table.tableName ? 'bg-gray-300 text-gray-0' : 'hover:bg-gray-200'}`} key={table.tableName}>
                                {table.tableName}
                            </li>
                        ))}
                    </ul>
                </aside>
            </section>

            <section className='w-full mt-8'>
                <div className='flex flex-col max-w-[1000px] mx-auto items-center w-full'>
                    <div className='flex justify-between items-center w-full h-12 my-4'>
                        <span className='capitalize'> {tableName} </span>
                        <div className='flex justify-between items-center h-8 w-[250px] border border-gray-500 cursor-pointer px-1 rounded'>
                            <input placeholder='search' type="text" className='w-full p-1 outline-none text-sm bg-transparent' />
                            <BsSearch className='mx-1' />
                        </div>
                    </div>
                    <div className='w-full min-h-[300px] border'>
                        <div className='flex items-center justify-evenly w-full h-10 bg-gray-700'>
                            {keys.map((head) => (
                                <span className='text-gray-100 px-2 overflow-hidden w-full text-center' key={head}> {head} </span>
                            ))}
                        </div>

                        <div className='p-1 max-h-[500px] overflow-scroll'>
                            {data.length > 0 ? (
                                data.map((num, i) => (
                                    <div key={i} className='flex justify-evenly  bg-gray-200 w-full py-2 my-1'>
                                        {keys.map((key) => (
                                            <span key={key} className='w-full text-center'> {num[key]} </span>
                                        ))}
                                    </div>
                                )) 
                            ) : (
                                <h3 className='text-center mt-2'>
                                    No data available
                                </h3>
                            )}
                        </div>

                    </div>
                    {keys.length > 1 && <AddDataForm tables={tables} keys={keys} tableName={tableName} setData={setData} />}
                </div>
            </section>
        </div>
    )
}

const AddDataForm = ({ tables, tableName, keys, setData }) => {

    const [shwoForm, setShowForm] = useState(false)
    const [formInput, setFormInput] = useState({})

    useEffect(() => {
        const obj = {}
        keys.forEach((key, i, arr) => {
            obj[key] = ''
            if (i === arr.length -1) setFormInput(obj)
        })
        
    }, [keys])

    // useEffect(() => {
    //     console.log(formInput)
    // }, [formInput])

    const getInputType = (type) => {
        if (type.toLowerCase().includes('date')) {
            return 'date'
        } 
        return 'text'
    }

    const handleFormChange = (e, key) => {
        let value = e.target.value
        if (getInputType(key) === 'date') {
            value = value.replace('/', '-')
        }

        setFormInput(prev => ({
            ...prev,
            [key]: value
          }));
        // console.log(e.target.value);
        // console.log(key);
    }

    const handleOnSubmit = async () => {
        // const querySnapshot =  addDoc(collection(db, formInput));
        const tableId = tables.find(table => table.tableName === tableName)
        console.log(tableId);
        try {
            const db = getDatabase();
            await set(ref(db, `${tableName}/` + formInput[tableId.id]), formInput)
            // const docRef = await setDoc(doc(db, tableName, formInput[tableId.id]), formInput);
            // // await setDoc(doc(db, tableName, tableId.id), formInput);
            // keys.forEach((key) => {
            //     setFormInput(prev => ({
            //         ...prev,
            //         [key]: ''
            //     }));
            // })
            setData(prevData => [...prevData, formInput])
            // console.log("Document written with ID: ", docRef);
        } catch (error) {
            console.log('error: ', error);
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
                        <button className='py-2 px-3 bg-primaryBlue text-gray-0 rounded' onClick={handleOnSubmit}>submit</button>
                    </div>
                </div>
            )}
        </div>
    )
}

// const InputForm = (type) => {

//     const inputRef = useRef()

//     const getInputType = () => {
//         if (type.toLowerCase().includes('date')) {
//             return 'date'
//         } 
//         return 'text'
//     }

//     return (
//         <input type='text' onFocus={(e) => console.log('e', e.type=getInputType())} placeholder={type} name={type} className='border p-2'   />
//     )

// }