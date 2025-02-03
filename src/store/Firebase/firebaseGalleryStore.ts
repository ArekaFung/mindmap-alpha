import { create } from 'zustand'
import { getDatabase, ref, get as dbGet, set as dbSet, child, DatabaseReference } from 'firebase/database'

import { useFirebaseStore } from '~/store/Firebase/firebaseStore'
import { BoardInfoSaveData, BoardNodesSaveData } from '~/model/MapPage/saveDataProps'
import { useUserStore } from '../userStore';
import { checkNotUndefinedNotNull, softCheckNotUndefinedNotNull } from '~/util/firebaseUtil';
import { UniqueNode, UniqueNodeProps } from '~/model/MapPage/uniqueNode';

interface FirebaseGalleryProps {

}


export const useFirebaseBoardStore = create<FirebaseGalleryProps>((set, get) => ({

}))
