import React, { useMemo } from 'react'
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

export default function Location() {

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: 'AIzaSyCfDGAehH-VwK_56cOvrNOSZTzPEsHU7JI',
      });
    const center = useMemo(() => ({ lat: 14.5314473, lng: 49.1302514 }), []);
    // 14.5314473,49.1302514,7.06z
    return (
        <div className='flex-grow flex mt-10 justify-center items-center mx-[-2rem] gap-3'>
     
            <div className='w-[600px] h-[500px] border'>
                {!isLoaded ? (
                    <h1>Loading...</h1>
                ) : (
                    <GoogleMap
                    mapContainerClassName="w-full h-full"
                    center={center}
                    zoom={10}
                >
                    <Marker position={{ lat: 14.5314473, lng: 49.1302514 }} />
                </GoogleMap>
                )}
            </div>
            <div className='w-[500px] h-[400px] flex justify-center items-center flex-col gap-5 shadow-lg'>
                <div className='flex'>
                    <span> Country: </span>
                    <h4> Yemen </h4>
                </div>
                <div className='flex'>
                    <span> Governorate: </span>
                    <h4>  Hadramout </h4>
                </div>
                <div className='flex'>
                    <span> City: </span>
                    <h4> Mukalla </h4>
                </div>
                <div className='flex'>
                    <span> Address: </span>
                    <h4> Al-Salam street next to mashhor misjed </h4>
                </div>
            </div>


    </div>
    )
}
