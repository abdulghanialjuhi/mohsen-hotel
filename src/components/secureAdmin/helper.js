import { getCollectionData } from "../../helper/firebaseFetch"


export const setFormKeys = (keys, values={}) => {
    return new Promise((resolve, reject) => {
        const obj = {}
        keys.forEach((key, i, arr) => {
            if (key !== 'section' && key !== 'bed Type') {
                if (Object.keys(values).length > 0 && !key.includes('image')) {
                    if (values[key.replace(' ', '')]) {
                        obj[key.replace(' ', '')] = values[key.replace(' ', '')]
                    } else {
                        obj[key.replace(' ', '')] = ''
                    }
                } else {
                    obj[key.replace(' ', '')] = ''
                }
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
