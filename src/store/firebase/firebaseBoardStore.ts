import { create } from 'zustand'
import { getDatabase, ref, get as dbGet, set as dbSet, child, DatabaseReference } from 'firebase/database'

import { getDbRef } from '~/store/Firebase/firebaseStore'
import { BoardInfoSaveData, BoardNodesSaveData } from '~/model/MapPage/saveDataProps'
import { getUID, checkUID } from '../userStore';
import { checkNotUndefinedNotNull, softCheckNotUndefinedNotNull } from '~/util/firebaseUtil';
import { UniqueNode, UniqueNodeProps } from '~/model/MapPage/uniqueNode';

interface FirebaseBoardProps {
    readInfoList: () => Promise<BoardInfoSaveData[] | null>
    readNodes: (boardID: number) => Promise<BoardNodesSaveData | null>
    saveNodes: (boardID: number, boardNodes: BoardNodesSaveData) => Promise<boolean>
    addBoard: (title: string, boardNodes?: BoardNodesSaveData) => Promise<number | null>
    deleteBoard: (boardID: number) => Promise<boolean | null>
}


export const useFirebaseBoardStore = create<FirebaseBoardProps>((set, get) => ({
    readInfoList: async () => {
        if (!checkUID()) {
            console.log('[Board] Trying to readInfoList with null UID')
            return null
        }

        return await dbGet(child(getDbRef(), `UserData/${getUID()}/BoardInfo`)).then((snapshot) => {
            const availableBoard: BoardInfoSaveData[] = []
            if (snapshot.exists()) {
                console.log(snapshot.val())
                for (const [key, value] of Object.entries(snapshot.val())) {
                    const data: any = value

                    if (checkNotUndefinedNotNull('[Board] Problematic data from Firebase for readInfoList', [data?.id, data?.title])) {
                        availableBoard.push({
                            id: data.id,
                            title: data.title
                        })
                    }
                }
            } else {
                console.log('[Board] No readInfoList data available on Firebase');
            }

            return availableBoard
        }).catch((error) => {
            console.error('[Board] Error at readInfoList: ', error)
            return null
        });
    },
    readNodes: async (boardID: number) => {
        if (!checkUID()) {
            console.log('[Board] Trying to readNodes with null UID')
            return null
        }

        return await dbGet(child(getDbRef(), `UserData/${getUID()}/BoardNodes/${boardID}`)).then((snapshot) => {
            const boardNodesSaveData: BoardNodesSaveData = {
                mainMapSaveData: {
                    nodeArr: [],
                    edgeArr: []
                },
                uniqueNodeSaveData: {
                    nodeArr: []
                }
            }

            if (snapshot.exists()) {
                const res = snapshot.val()

                softCheckNotUndefinedNotNull(`[Board] Softcheck data from Firebase for readNode with Board: ${boardID} found null | undefined`, [res?.mainMapSaveData?.nodeArr, res?.mainMapSaveData?.edgeArr, res?.uniqueNodeSaveData?.nodeArr])
                boardNodesSaveData.mainMapSaveData.nodeArr = res?.mainMapSaveData?.nodeArr === undefined ? [] : res.mainMapSaveData.nodeArr
                boardNodesSaveData.mainMapSaveData.edgeArr = res?.mainMapSaveData?.edgeArr === undefined ? [] : res.mainMapSaveData.edgeArr
                boardNodesSaveData.uniqueNodeSaveData.nodeArr = res?.uniqueNodeSaveData?.nodeArr === undefined ? [] : res.uniqueNodeSaveData.nodeArr
            } else {
                console.log(`[Board] No readNodes data available on Firebase for readNode with Board: ${boardID}`);
            }

            return boardNodesSaveData
        }).catch((error) => {
            console.error(`[Board] Error at readNodes with Board: ${boardID} `, error)
            return null
        });
    },
    saveNodes: async (boardID: number, boardNodes: BoardNodesSaveData) => {
        if (!checkUID()) {
            console.log('[Board] Trying to saveNodes with null UID')
            return false
        }

        return await dbSet(child(getDbRef(), `UserData/${getUID()}/BoardNodes/${boardID}`), boardNodes).then(() => {
            return true
        }).catch((error) => {
            console.error(`[Board] Error at saveNodes with Board: ${boardID} `, error)
            return false
        });
    },
    addBoard: async (title: string, boardNodes?: BoardNodesSaveData) => {
        return await get().readInfoList().then(async (res: BoardInfoSaveData[] | null) => {
            if (res === null) {
                return null
            }

            var maxID = res.reduce((x, y) => {
                return x.id > y.id ? x : y
            }, { id: -1 }).id

            res.push({
                id: maxID + 1,
                title
            })

            const addBoardSuccess = await dbSet(child(getDbRef(), `UserData/${getUID()}/BoardInfo`), [...res]).then(() => {
                return true
            }).catch((error) => {
                console.error(`[Board] Error at addBoard with title: ${title} `, error)
                return false
            });

            if (!addBoardSuccess) {
                return null
            }

            const rootProps: UniqueNodeProps = {
                id: 0,
                content: title,
                childrenID: []
            }

            // set default value if adding empty board
            if (boardNodes === undefined) {
                boardNodes = {
                    mainMapSaveData: {
                        nodeArr: [{
                            id: '0',
                            position: {
                                x: 0,
                                y: 0
                            },
                            type: 'colorNode',
                            data: {
                                uniqueNode: new UniqueNode(rootProps),
                                childrenID: [],
                                treePos: {
                                    x: -1,
                                    y: 0
                                },
                            }
                        }],
                        edgeArr: []
                    },
                    uniqueNodeSaveData: {
                        nodeArr: [rootProps]
                    }
                }
            }

            const saveNodeSuccess = await get().saveNodes(maxID + 1, boardNodes)

            if (!saveNodeSuccess) {
                return null
            }

            return maxID + 1
        })
    },
    deleteBoard: async (boardID: number) => {
        if (!checkUID()) {
            console.log('[Board] Trying to deleteBoard with null UID')
            return false
        }

        return await get().readInfoList().then(async (res) => {
            if (!res) {
                console.error('[Board] No res at deleteBoard readInfoList: ', res)
                return false
            }

            if (res.find(board => board.id === boardID) === undefined) {
                console.error(`[Board] ID: ${boardID} not exist at firebase: `, res)
                return false
            }

            res = res.filter(board => board.id !== boardID)

            return await dbSet(child(getDbRef(), `UserData/${getUID()}/BoardInfo`), [...res]).then(async () => {
                return await dbSet(child(getDbRef(), `UserData/${getUID()}/BoardNodes/${boardID}`), null).then(() => {
                    return true
                }).catch((error) => {
                    console.error('[Board] Error at deleteBoard set BoardNodes: ', error)
                    return null
                });
            }).catch((error) => {
                console.error('[Board] Error at deleteBoard set BoardInfo: ', error)
                return null
            });
        })
    },
}))




