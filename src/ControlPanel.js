import { useUserStore } from './Store/UserStore.js'
import { useNodesStore } from './Store/NodesStore.js'
import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import './styles/controlPanel.style.css';
import './styles/login.style.css';

const ControlPanel = () => {
    const navigate = useNavigate();

    const [isCollapseMenu, setCollapseMenu] = React.useState(true)
    const [isCollapseBoard, setCollapseBoard] = React.useState(true)
    const toggleCollapseMenu = () => setCollapseMenu(!isCollapseMenu)
    const toggleCollapseBoard = () => setCollapseBoard(!isCollapseBoard)


    const [boardTitle, setBoardTitle] = React.useState("")

    const initUniqueNodes = useNodesStore(state => state.initUniqueNodes)
    const uniqueNodes = useNodesStore(state => state.uniqueNodes)

    const activeBoard = useNodesStore(state => state.activeBoard)
    const setActiveBoard = useNodesStore(state => state.setActiveBoard)
    const availableBoard = useNodesStore(state => state.availableBoard)
    const setAvailableBoard = useNodesStore(state => state.setAvailableBoard)
    const resetNodeStore = useNodesStore(state => state.resetNodeStore)

    const readData = useUserStore(state => state.readData)
    const saveData = useUserStore(state => state.saveData)
    const readBoard = useUserStore(state => state.readBoard)
    const addBoard = useUserStore(state => state.addBoard)
    const deleteBoard = useUserStore(state => state.deleteBoard)

    const signInWithGoogle = useUserStore(state => state.signInWithGoogle)
    const signOutWithGoogle = useUserStore(state => state.signOutWithGoogle)
    const uid = useUserStore(state => state.uid)
    const email = useUserStore(state => state.email)

    var tabs = availableBoard.map(board => {
        return <Tab key={board.id} value={board.id} label={board.title} />
    })

    function handleTabChange(event, newValue) {
        setActiveBoard(newValue);
    };

    async function handleAddBoard() {
        await addBoard(boardTitle)
        readBoard().then(res => {
            if (res && res.length > 0) {
                console.log("set board", res)
                setAvailableBoard(res)
                setActiveBoard(res[res.length - 1].id)
            } else {
                console.log("empty boards")
                resetNodeStore()
            }
        })
        setBoardTitle("")
    }

    async function handleDeleteBoard() {
        if (window.confirm("Are you sure?") == true) {
            await deleteBoard(activeBoard)
            readBoard().then(res => {
                if (res && res.length > 0) {
                    console.log("delete board", res)
                    setAvailableBoard(res)
                    setActiveBoard(res[res.length - 1].id)
                } else {
                    console.log("empty boards")
                    resetNodeStore()
                }
            })
        }
    }


    useEffect(() => {
        console.log("activeBoard", activeBoard)
        readBoardDataFromFirebase()
    }, [activeBoard])

    function readBoardDataFromFirebase() {
        if (activeBoard !== null) {
            readData(activeBoard).then(res => {
                console.log("res", res)
                initUniqueNodes(res?.uniqueNodes)
            })
        } else {
            initUniqueNodes(null)
        }
    }


    return (
        <>
            <div className='controlPanel-container controlPanel-container-menu'>
                {
                    isCollapseMenu ?
                        <>
                            <div className='icon-wrapper' onClick={toggleCollapseMenu}>
                                <img className='arrow-left-icon' src={require('./assets/left-arrow.svg').default} />
                                <span>Menu</span>
                            </div>
                        </> :
                        <>
                            <div className='icon-wrapper' onClick={toggleCollapseMenu}>
                                <img className='arrow-right-icon' src={require('./assets/right-arrow.svg').default} />
                            </div>
                            {
                                uid ?
                                    <>
                                        <div className='btn' ><span>Welcome {email}</span></div>

                                        <div className='btn' onClick={() => saveData(activeBoard, uniqueNodes)}><span>SAVE</span></div>
                                        <div className='btn' onClick={() => readBoardDataFromFirebase()}><span>REFRESH</span></div>
                                        <div className='btn' onClick={handleDeleteBoard}><span>DELETE BOARD</span></div>
                                        <div className='btn' onClick={() => {
                                            signOutWithGoogle()
                                            setCollapseMenu(true)
                                        }}><span>SIGN OUT</span></div>
                                    </> :
                                    <div className='btn' onClick={signInWithGoogle} style={{ display: "flex", alignItems: "center" }}>
                                        <img className='google-icon' src={require('./assets/google.svg').default} alt='GOOGLE_ICON' />
                                        <span>SIGN IN</span>
                                    </div>
                            }
                            <div className='btn' onClick={() => navigate('/about-me')}><span>ABOUT ME</span></div>
                        </>
                }
            </div >
            {uid &&
                <div className='controlPanel-container controlPanel-container-board'>
                    {
                        isCollapseBoard ?
                            <>
                                <div className='icon-wrapper' onClick={toggleCollapseBoard}>
                                    <img className='arrow-left-icon' src={require('./assets/left-arrow.svg').default} />
                                    <span>Board</span>
                                </div>
                            </> :
                            <>
                                <div className='icon-wrapper' onClick={toggleCollapseBoard}>
                                    <img className='arrow-right-icon' src={require('./assets/right-arrow.svg').default} />
                                </div>
                                <div className='btn' onClick={handleAddBoard}><span>ADD BOARD</span></div>
                                <TextField
                                    id="outlined-controlled"
                                    label="New Board"
                                    value={boardTitle}
                                    onChange={(event) => {
                                        setBoardTitle(event.target.value);
                                    }}
                                    style={{ marginLeft: "15px", marginRight: "15px" }}
                                />

                                <Tabs
                                    value={activeBoard}
                                    onChange={handleTabChange}
                                    textColor="secondary"
                                    indicatorColor="secondary"
                                    aria-label="secondary tabs example"
                                >
                                    {tabs}
                                </Tabs>
                            </>
                    }
                </div>
            }
        </>
    )
}

export default ControlPanel