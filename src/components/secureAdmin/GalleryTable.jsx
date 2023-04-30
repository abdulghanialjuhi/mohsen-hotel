import React, { useState, useEffect } from 'react'
import { storage } from '../../firebaseConfig'
import Table from './Table';
import { ref, uploadBytesResumable, deleteObject } from "firebase/storage";
import { getCollectionData, setDataCollectionId } from '../../helper/firebaseFetch';
import { checkPrimaryKey, getInputType, setFormKeys } from './helper';

export default function Gallery() {

    const [data, setData] = useState([])
    const [sections, setSections] = useState([])
    const [keys] = useState(['image', 'label', 'section'])
    const tableName = 'gallery'
    const primaryKey = 'id'

    const handleDelete = (recordData) => {
        const desertRef = ref(storage, `${tableName}/${recordData.record.section}/${recordData.record[primaryKey]}`);
        deleteObject(desertRef).then(() => {
            let cloneData = [...data]
            const deletedRecord = cloneData.filter(data => data.id !== recordData.id)
            setData(deletedRecord)
        }).catch((error) => {
            console.log('error: ', error);
        });
    }

    useEffect(() => {
        getCollectionData('gallerySections').then((res) => {
            res.forEach((section) => {
                setSections(prev => [...prev, section.id])
            })
        }).catch((error) => {
            console.log(error);
        })
    }, [])

    return (
        <div className='w-full h-full'>
            <Table tableName={tableName} data={data} keys={keys} handleDelete={handleDelete} setData={setData} />
            <AddDataForm keys={keys} tableName={tableName} setData={setData} primaryKey={primaryKey} sections={sections} />
        </div>
    )
}

const AddDataForm = ({ tableName, keys, setData, sections, primaryKey }) => {

    const [shwoForm, setShowForm] = useState(false)
    const [formInput, setFormInput] = useState({})
    const [fonmLoading, setFonmLoading] = useState(false)
    const [selcectedSection, setSelcectedSection] = useState('')

    useEffect(() => {
        setFormKeys(keys).then((response) => setFormInput(response))
    }, [keys])

    const handleFormChange = (e, key) => {
        let value = e.target.value
        if (getInputType(key) === 'date') {
            value = value.replace('/', '-')
        } else if (getInputType(key) === 'file') {
            value = e.target?.files[0]
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

        if (isNullishs || !selcectedSection) {
            alert('Please complete all fields')
            return
        }

        setFonmLoading(true)

        try {
            const clone = {...formInput}
            clone['id'] = `${selcectedSection}-${formInput.label}`
            clone['image'] = formInput['image'].name
            clone['section'] = selcectedSection

            const isExisit = await checkPrimaryKey(clone[primaryKey], tableName, primaryKey)

            if (isExisit) {
                alert(`${primaryKey} must be unique`)
                return 
            }
            
            await setDataCollectionId(tableName, clone[primaryKey], clone)
            
            const dataObject = {}
            dataObject['record'] = clone
            dataObject['id'] = formInput[primaryKey]
            
            const storageRef = ref(storage, `/${tableName}/${selcectedSection}/${clone[primaryKey]}`)
            await uploadBytesResumable(storageRef, formInput['image']);
            
            setData(prevData => [...prevData, dataObject])

            const obj = {...formInput}
            Object.keys(obj).forEach(k => obj[k.replace(' ', '')] = '');
            setFormInput(obj)

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
                <div className='w-full mt-3 min-h-[5rem] flex flex-wrap gap-3 items-center'>
                    {keys.map((key) => (
                        key !== 'section' &&
                        <div key={key} className='flex flex-col'>
                            <span> {key} </span>
                            {key.includes('image') ? ( 
                                    <input onChange={(e) => handleFormChange(e, key.replace(' ', ''))} accept="image/png, image/jpeg" type={getInputType(key)} name={key} className='border p-2' />
                                ) : (
                                    <input value={formInput[key.replace(' ', '')]} onChange={(e) => handleFormChange(e, key.replace(' ', ''))} type={getInputType(key)} name={key} className='border p-2' />
                                )
                            }
                        </div>
                    ))}
                    <div className='flex flex-col'>
                         <span> Section </span>
                         <select onChange={handleSelctSection} value={selcectedSection} name="sections">
                            <option value="" disabled hidden>Choose section</option>
                             {sections.map((section, i) => (
                                <option key={i} className='border p-2' value={section}>{section}</option>
                             ))}
                         </select>
                     </div>
                    <div className='ml-auto h-full flex items-end'>
                        <button disabled={fonmLoading} className='py-2 px-3 bg-primaryBlue text-gray-0 rounded' onClick={handleOnSubmit}>{fonmLoading ? 'adding...' : 'submit'}</button>
                    </div>
                </div>
            )}
        </div>
    )
}
