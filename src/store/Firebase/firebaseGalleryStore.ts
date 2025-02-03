import { create } from 'zustand'
import { getDatabase, ref, get as dbGet, set as dbSet, child, DatabaseReference } from 'firebase/database'

import { useFirebaseStore } from '~/store/Firebase/firebaseStore'
import { PhotoMetaData } from '~/model/GalleryPage/photoProps'
import { checkNotUndefinedNotNull, softCheckNotUndefinedNotNull } from '~/util/firebaseUtil';

interface FirebaseGalleryProps {
    readPhotoList: () => Promise<PhotoMetaData[] | null>

}


export const useFirebaseBoardStore = create<FirebaseGalleryProps>((set, get) => ({
    readPhotoList: async () => {
        return null
    }
}))


// https://firebase.google.com/docs/database/web/lists-of-data
// const db = firebase.database();
// const ref = db.ref('your_data_path');

// ref.orderByChild('timestamp').once('value')
//     .then((snapshot) => {
//         const data: { [key: string]: any } = {};
//         snapshot.forEach((childSnapshot) => {
//             const key = childSnapshot.key;
//             const value = childSnapshot.val();
//             data[key!] = value; // Store the data in an object with keys
//         });
//         console.log('Ordered Data:', data);
//     })
//     .catch((error) => {
//         console.error('Error retrieving data:', error);
//     });