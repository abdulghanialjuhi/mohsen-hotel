import { getCollectionData } from "../../helper/firebaseFetch"


export const setFormKeys = (keys) => {
    return new Promise((resolve, reject) => {
        const obj = {}
        keys.forEach((key, i, arr) => {
            if (key !== 'section' && key !== 'bed Type') {
                obj[key.replace(' ', '')] = ''
            }
            if (i === arr.length -1) resolve(obj)
        })
    })
}

export const getInputType = (type) => {
    if (type.toLowerCase().includes('date')) {
        return 'date'
    } else if (type.toLowerCase().includes('image')) {
        return 'file'
    } else if (type.toLowerCase().includes('tv')) {
        return 'checkbox'
    }
    return 'text'
}

export const checkPrimaryKey = async (primaryValue, tableName, primaryKey) => {
    try {
        const res = await getCollectionData(tableName)
        return res.some((data) => data.record[primaryKey] === primaryValue)
    } catch (err) {
        console.log(err);
        return true
    }
}
