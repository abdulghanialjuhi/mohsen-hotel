import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getNestedCollectionData, getPic } from '../helper/firebaseFetch';

export default function Section() {

    const [sectionData, setSectionData] = useState([])
    const [loading, setLoading] = useState(true)

    const params = useParams()

    useEffect(() => {
        getNestedCollectionData('gallery', "section", params.section)
        .then((res) => {
            setSectionData(res)
        }).catch((err) => {
            console.log(err);
        }).finally(() => {
            setLoading(false)
        })
    }, [])

    return (
        <div className='flex-grow flex flex-col gap-5 mt-10 items-center  mx-[-2rem]'>
            {loading ? 'loading' : (
                <> 
                    <h2 className='mb-7'> Take a look at our hotel </h2>
                    <div className='flex-grow flex w-full max-w-[950px] flex-wrap gap-5 items-center justify-evenly'>
                        {sectionData.length > 0 ? sectionData.map((data, index) => (
                            <SectionImage key={index} {...data.record} params={params} />
                        )) : 'no images yet'}
                    </div>
                </>
            )}
        </div>
    )
}

const SectionImage = ({ label, params, id }) => {
    const [sectionImg, setSectionImg] = useState('')

    useEffect(() => {
        getPic(`/gallery/${params.section}/${id}`)
        .then((res) => {
            setSectionImg(res)
        }).catch((err) => {
            console.log('img error: ', err);
        })
    })

    return (
        <div className='relative w-full max-w-[400px] h-[420px] rounded overflow-hidden flex flex-col justify-center items-center border shadow-sm'>
            <div className='w-full h-[90%]'>
                <img src={sectionImg} alt={label} className='w-full h-full object-cover' />
            </div>
            <div className='flex-grow w-full flex justify-center items-center'>
                <span> {label} </span>
            </div>
        </div>

    )
}