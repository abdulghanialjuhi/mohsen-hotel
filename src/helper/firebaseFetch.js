import { getDatabase, ref, child, get } from "firebase/database";
import { ref as ref1, getDownloadURL } from "firebase/storage";
import { db, storage } from '../firebaseConfig'
import { collection, getDocs } from "firebase/firestore"; 

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

export const getPic = async () => {
    try {
        return await getDownloadURL(ref1(storage, `roomPic.jpeg`))
    } catch (err) {
        console.log(err);
        throw err
    }
}


export const getDataCollection = async (table) => {
    const dataArr = []
    const querySnapshot = await getDocs(collection(db, table));

    querySnapshot.forEach((doc) => {
        dataArr.push(doc.data())
    });

    return dataArr
}