import { getDatabase, ref, child, get, set, update } from "firebase/database";
import { ref as ref1, getDownloadURL, listAll, uploadBytes, deleteObject } from "firebase/storage";
import { db, storage } from '../firebaseConfig'
import { collection, getDocs, doc, query, where, addDoc, setDoc, getDoc, updateDoc } from "firebase/firestore"; 

export const getRealtimeDatabaseData = async (table) => {
    const dataArr = []
    const dbRef = ref(getDatabase());
    try {
        const snapshot = await get(child(dbRef, table))
        if (snapshot.exists()) {
            for (let i in snapshot.val()) {
                const obj = {}
                // console.log(snapshot.val()[i]);
                obj['id'] = i
                obj['record'] = snapshot.val()[i]
                dataArr.push(obj)
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

export const getRealtimeDatabaseRecord = async (table) => {
    const dbRef = ref(getDatabase());
    try {
        const snapshot = await get(child(dbRef, table))
        if (snapshot.exists()) {
            return snapshot.val()
            // console.log(snapshot.val());
        } else {
            console.log("No data available");
        }
    } catch (err) {
        return err
    }

}

export const setRealtimeDatabaseData = async (table, id, formData) => {
    const db = getDatabase();
    set(ref(db, `${table}/` + id), formData);

}

export const updateRealtimeDatabaseData = async (table, id, formData) => {
    const db = getDatabase();

    const updates = {}
    updates[`${table}/${id}`] = formData;

    return update(ref(db), updates)
}


export const getCollectionData = async (table) => {
    const dataArr = []

    const querySnapshot = await getDocs(collection(db, table));

    querySnapshot.forEach((doc) => {
        const data = {}
        data['record'] = doc.data()
        data['id'] = doc.id
        dataArr.push(data)
    });

    return dataArr
}

export const getCollectionDatWithId = async (table) => {
    const dataArr = []

    const querySnapshot = await getDocs(collection(db, table));

    querySnapshot.forEach((doc) => {
        const data = {}
        data['record'] = doc.data()
        data.record['id'] = doc.id
        data['id'] = doc.id
        dataArr.push(data)
    });

    return dataArr
}

export const getCollectionDocument = async (table, record) => {
    try {
        const docRef = doc(db, table, record);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data()
        } else {
            throw "No such document"
        }
    } catch (err) {
        return err
    }
}

export const getNestedCollectionData = async (table, condition, sub) => {

    const q = query(collection(db, table), where(condition, "==", sub));
    const dataArr = []
    
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        const data = {}
        data['record'] = doc.data()
        data['id'] = doc.id
        dataArr.push(data)
    });

    return dataArr
}


export const getPic = async (imgPath) => {
    try {
        return await getDownloadURL(ref1(storage, imgPath))
    } catch (err) {
        console.log(err);
        throw err
    }
}

export const getImages = async (folderPath) => {

    try {
        const listRef = ref1(storage, folderPath);
        const images = []
        const res = await listAll(listRef)
        
        if (!res.items.length > 0) {
            throw "No images found";
        }
        await Promise.all(res.items.map(async (itemRef) => {
            const obj = {}
            const url = await getDownloadURL(ref1(storage, `${folderPath}/${itemRef.name}`))
            obj['img'] = url
            obj['name'] = itemRef.name
            images.push(obj)
        }));

        return images
    } catch (err) {
        throw err
    }

}

export const deleteImages = async (folderPath) => {

    try {
        const listRef = ref1(storage, folderPath);
        const res = await listAll(listRef)
        
        if (!res.items.length > 0) {
            throw "No images found";
        }
        await Promise.all(res.items.map(async (itemRef) => {
            await deleteObject(ref1(storage, `${folderPath}/${itemRef.name}`))
        }));

        return 'success'
    } catch (err) {
        throw err
    }

}

export const uploadImage = async (imgPah, imageUri, index) => {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    return await uploadBytes(ref1(storage, `${imgPah}/${index}`), blob)
}

export const addDataCollection = async (tableName, form) => {
    return await addDoc(collection(db, tableName), form);
}

export const setDataCollectionId = async (tableName, id, form) => {
    return await setDoc(doc(db, tableName, id), form);
}

export const updateDataCollectionId = async (tableName, id, form) => {
    const washingtonRef = doc(db, tableName, id);
    return await updateDoc(washingtonRef, form);
}
