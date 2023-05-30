import React, { useEffect, useState } from 'react'
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import ModalForm from './secureAdmin/ModalForm';
import { getCollectionData, getCollectionDocument } from '../helper/firebaseFetch';
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer'

const styles = StyleSheet.create({
	page: {
		// flexDirection: 'row',
        display: 'flex',
        padding: 10
	},
    header: {
        width: '100%',
        height: 40,
        borderBottom: 1,
        justifyContent: 'center'
    },
	title: {
		// flexGrow: 1,
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
        fontSize: 15
	},
    typesContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        marginTop: 30,
        border: 1,
        padding: 5,
    },
    tableHeader: {
        width: '65%',
        height: 30,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        // gap: 20,
        alignContent: 'center'
    },
    tableBody: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: 30,
        // justifyContent: 'space-between',
        alignContent: 'center',
        border: 1
    },
    tableText: {
        width: '15%',
        borderRight: 1,
        padding: 3,
    },
    labelValue: {
        flexGrow: 1,
        alignSelf: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
});

const MyDocument = ({ from, to, single, double, triple, total }) => {
    
    
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text>MK Hotel</Text>
                </View>
                <View style={styles.title}>
                    <Text>report on room type from {from} to {to}</Text>
                </View>
                <View style={styles.typesContainer}>
                    <View style={[styles.tableBody, {backgroundColor: '#C5C5C5'}]}>
                        <View style={styles.tableText}>
                            <Text > Type </Text>
                        </View>
                        <View style={styles.labelValue}>
                            <Text> Number of book </Text>
                        </View>
                    </View>
                    <View style={styles.tableBody}>
                        <View style={styles.tableText}>
                            <Text > single </Text>
                        </View>
                        <View style={styles.labelValue}>
                            <Text> {single} </Text>
                        </View>
                    </View>
                    <View style={styles.tableBody}>
                        <View style={styles.tableText}>
                            <Text > double </Text>
                        </View>
                        <View style={styles.labelValue}>
                            <Text> {double} </Text>
                        </View>
                    </View>
                    <View style={styles.tableBody}>
                        <View style={styles.tableText}>
                            <Text > triple </Text>
                        </View>
                        <View style={styles.labelValue}>
                            <Text> {triple} </Text>
                        </View>
                    </View>
                    <View style={[styles.tableBody, {marginTop: 20}]}>
                        <View style={styles.tableText}>
                            <Text > Total </Text>
                        </View>
                        <View style={styles.labelValue}>
                            <Text> {total} </Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
}

export default function Admin() {

    const tables = [{tableName: 'booking', id: 'email'}, {tableName: 'rooms', id: 'name'}, {tableName: 'room type', id: 'pictureID'}, {tableName: 'admin', id: 'adminID'}, {tableName: 'users', id: 'email'}, {tableName: 'promotions', id: 'promotionCode'}, {tableName: 'gallery', id: 'pictureID'}, {tableName: 'gallery sections', id: 'pictureID'}, {tableName: 'guest', id: 'xxxx'}]
    const [showReport, setShowReport] = useState(false)

    const locations = useLocation()
    const navigate = useNavigate()

    const handleSelectTable = (table) => {
        navigate(`${table.replace(' ', '-')}`)
    }

    return (
        <div className='w-full h-full flex flex-col mb-10 shadow bg-gray-0'>
            <section className='flex w-full mt-6 justify-between'>
                <aside className='p-4 w-full max-w-[200px] rounded shadow bg-gray-0'>
                    <ul>
                        {tables.map((table) => (
                            <li onClick={handleSelectTable.bind(this, table.tableName)} className={`p-2 text-lg cursor-pointer capitalize rounded ${!locations.pathname.split('/')[2] ? table.tableName === 'booking' && 'bg-primaryBlue text-gray-0' : locations.pathname.split('/')[2]?.replace('-', ' ') === table.tableName ? 'bg-primaryBlue text-gray-0' : 'hover:bg-gray-200'}`} key={table.tableName}>
                                {table.tableName}
                            </li>
                        ))}
                    </ul>
                </aside>
                <div className='w-[200px] h-[100px] border flex justify-center items-center'>
                    <button onClick={() => setShowReport(!showReport)} className='rounded py-2 px-3 bg-gray-800 text-gray-0 hover:bg-gray-900'>
                        Print Report
                    </button>
                    {showReport && <PrintReport setShowReport={setShowReport} />}
                </div>
            </section>

            <section className='w-full mt-8'>
                <div className='flex flex-col max-w-[1100px] mx-auto items-center w-full'>
                    <Outlet />
                </div>
            </section>
        </div>
    )
}


const PrintReport = ({ setShowReport }) => {

    
    const [loading, setLoading] = useState(false)
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')
    const [typesQuty, setTypesQuty] = useState({})

    useEffect(() => console.log(typesQuty), [typesQuty])
    const getDateBooking = async (from, to, booking) => {
        const singleType = []
        const doubleType = []
        const tripleType = []
        let total = 0

        for (let book of booking) {

            const checkin = new Date(book.record.checkInDate.replaceAll('-', '/'))
            
            if (checkin.getTime() <= to && checkin.getTime() >= from) {
                const roomRes = await getCollectionDocument('rooms', book.record.roomNumber)

                if (roomRes.roomType === 'type_single') {
                    singleType.push(book)
                } else if (roomRes.roomType === 'type_double') {
                    doubleType.push(book)
                } else if (roomRes.roomType === 'type_triple') {
                    tripleType.push(book)
                }

                total += book.record.total
            }
        }

        console.log('booking: ', booking);
        return [singleType, doubleType, tripleType, total]

    }

    const handleOnSubmit = async () => {

        if (!fromDate || !toDate) {
            alert('Please fill in all fields')
            return
        }

        const from = new Date(fromDate).setHours(0,0,0,0)
        const to = new Date(toDate).setHours(0,0,0,0)

        console.log('fromDate: ', from);
        console.log('toDate: ', to);

        if (from >= to) {
            alert('Please choose valid dates')
            return
        }

        try {

            setLoading(true)

            const booking = await getCollectionData('booking')
            const[ singleType, doubleType, tripleType, total ]= await getDateBooking(from, to, booking)
            setTypesQuty({'singleType': singleType.length, 'doubleType': doubleType.length, 'tripleType': tripleType.length, 'total': total})

        } catch (err) {
            console.log(err);
            alert('sorry, Something went wrong')
        } finally {
            setLoading(false)
        }

    }

    return (
        <ModalForm setShowModel={setShowReport}>
            <div className='w-full mt-3 h-full flex flex-col gap-3 items-center'>
                <h3> Print a report </h3>
                <div className='flex mt-2 flex-col w-full flex-grow justify-center gap-3'>
                    <div className='w-[90%] mx-auto mt-3 min-h-[5rem] flex justify-center gap-5 items-center'>
                        <div className='flex flex-col'>
                            <span> from date </span>
                            <input onChange={(e) => setFromDate(e.target.value)} value={fromDate} type="date" className='border p-2' />
                        </div>
                        <div className='flex flex-col'>
                            <span> to date </span>
                            <input min={fromDate+1} onChange={(e) => setToDate(e.target.value)} value={toDate} type="date" className='border p-2' />
                        </div>
                    </div>
                    {fromDate && toDate && Object.keys(typesQuty).length > 0 && <PDFDownloadLink document={< MyDocument from={fromDate} to={toDate} single={typesQuty.singleType} double={typesQuty.doubleType} triple={typesQuty.tripleType} total={typesQuty.total} />} fileName="hotel-report.pdf">
                    {({ blob, url, loading, error }) => (
                        <div className='w-full flex p-1 justify-center mt-5'>
                            <button className='rounded p-2 text-gray-0 bg-primaryBlue'> 
                                {loading ? 'Loading document...' : 'Download now'}  
                            </button>
                        </div>
                    )}
                    </PDFDownloadLink>}
                    <div className='mt-auto flex w-full justify-end gap-4'>
                        <button className='py-2 px-3 bg-red-600 text-gray-0 rounded' onClick={() => setShowReport(false)}>Cancel</button>
                        <button disabled={loading} className='py-2 px-3 bg-primaryBlue text-gray-0 rounded' onClick={handleOnSubmit}>{loading ? 'printing...' : 'print'}</button>
                    </div>
                </div>
            </div>
        </ModalForm>
    )
}