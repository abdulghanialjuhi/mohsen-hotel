import { getDatabase, ref, child, get } from "firebase/database";
import { ref as ref1, getDownloadURL, listAll, uploadBytes } from "firebase/storage";
import { db, storage } from '../firebaseConfig'
import { collection, getDocs, doc } from "firebase/firestore"; 

export const getDate = async (table) => {
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

export const getCollectionData = async (table, isCollection) => {
    const dataArr = []
    let querySnapshot 
    if (isCollection) {
        querySnapshot = await getDocs(collection(db, table));
    } else {
        querySnapshot = await getDocs(collection(db, table));
    }

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
            const url = await getDownloadURL(ref1(storage, `${folderPath}/${itemRef.name}`))
            images.push(url)
        }));

        return images
    } catch (err) {
        throw err
    }

}

export const uploadImage = async (imgPah, imageUri, index) => {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    return await uploadBytes(ref1(storage, `${imgPah}/${index}`), blob)
}

export const getDataCollection = async (table) => {
    const dataArr = []
    const querySnapshot = await getDocs(collection(db, table));

    querySnapshot.forEach((doc) => {
        dataArr.push(doc.data())
    });

    return dataArr
}