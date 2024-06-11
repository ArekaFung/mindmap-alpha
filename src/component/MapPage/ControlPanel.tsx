import React, { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import '~/assets/css/ControlPanel.scss';
import '~/assets/css/Login.scss';

import LEFT_ARROW from '~/assets/images/left-arrow.svg'
import RIGHT_ARROW from '~/assets/images/right-arrow.svg'
import GOOGLE_ICON from '~/assets/images/google.svg'

import { useBoardStoreProps } from "~/store/boardStore";
import { useUserStore } from "~/store/userStore";
import { useEventActionStore } from '~/store/eventActionStore';
import ControlPanelListener from '~/listener/ControlPanelListener';



const ControlPanel = () => {
    const navigate = useNavigate()
    const setAction = useEventActionStore(state => state.setAction)

    const activeBoard = useBoardStoreProps(state => state.activeBoard)
    const availableBoard = useBoardStoreProps(state => state.availableBoard)
    const boardNodesToSaveData = useBoardStoreProps(state => state.toSaveData)

    const [isCollapseMenu, setCollapseMenu] = React.useState(true)
    const [isCollapseBoard, setCollapseBoard] = React.useState(true)
    const [tabs, setTabs] = React.useState<JSX.Element[]>([])
    const toggleCollapseMenu = () => setCollapseMenu(!isCollapseMenu)
    const toggleCollapseBoard = () => setCollapseBoard(!isCollapseBoard)

    const [boardTitle, setBoardTitle] = React.useState("")

    const userData = useUserStore(state => state.userData)


    function handleTabChange(event: React.SyntheticEvent<Element, Event>, newValue: any) {
        if (typeof newValue !== "number") {
            console.log("[ControlPanel] newValue type is not number")
            return
        }

        if (activeBoard === null && boardNodesToSaveData().uniqueNodeSaveData.nodeArr.length !== 0 && !window.confirm("Are you sure to switch (unsaved new board)?")) {
            console.log("[ControlPanel] not confirm to switch on unsaved new board")
            return
        }

        //TODO add check if edited since last save/read
        setAction(null, 'set active board', { boardID: newValue }, 'Maintain')
    }


    useEffect(() => {
        console.log("activeBoard", activeBoard)
        console.log("availableBoard", availableBoard)
        setTabs(availableBoard.map(board => {
            return <Tab key={board.id} value={board.id} label={board.title} />
        }))
    }, [activeBoard, availableBoard])


    return (
        <>
            <ControlPanelListener />
            <div className='controlPanel-container controlPanel-container-menu'>
                {
                    isCollapseMenu ?
                        <>
                            <div className='icon-wrapper' onClick={toggleCollapseMenu}>
                                <img className='arrow-left-icon' src={LEFT_ARROW} />
                                <span>Menu</span>
                            </div>
                        </> :
                        <>
                            <div className='icon-wrapper' onClick={toggleCollapseMenu}>
                                <img className='arrow-right-icon' src={RIGHT_ARROW} />
                            </div>
                            {
                                userData !== null ?
                                    <>
                                        <div className='btn' ><span>Welcome {userData.email}</span></div>
                                        <div className='btn' onClick={() => { setAction(null, 'save board', null, 'Maintain') }}><span>SAVE</span></div>
                                        <div className='btn' onClick={() => { setAction(null, 'read board', null, 'Maintain') }}><span>REFRESH</span></div>
                                        <div className='btn' onClick={() => { setAction(null, 'delete board', null, 'Maintain') }}><span>DELETE BOARD</span></div>
                                        <div className='btn' onClick={() => {
                                            setCollapseMenu(true)
                                            setCollapseBoard(true)
                                            setBoardTitle('')
                                            setAction(null, 'sign out with google', null, 'Maintain')
                                        }}><span>SIGN OUT</span></div>
                                    </> :
                                    <div className='btn' onClick={() => {
                                        setCollapseMenu(false)
                                        setCollapseBoard(false)
                                        setBoardTitle('')
                                        setAction(null, 'sign in with google', null, 'Maintain')
                                    }} style={{ display: "flex", alignItems: "center" }}>
                                        <img className='google-icon' src={GOOGLE_ICON} alt='GOOGLE_ICON' />
                                        <span>SIGN IN</span>
                                    </div>
                            }
                            <div className='btn' onClick={() => setAction(null, 'regen main map', null, 'Maintain')}><span>REGEN</span></div>
                            <div className='btn' onClick={() => navigate('/about-me')}><span>RETURN</span></div>
                        </>
                }
            </div >
            {userData !== null &&
                <div className='controlPanel-container controlPanel-container-board'>
                    {
                        isCollapseBoard ?
                            <>
                                <div className='icon-wrapper' onClick={toggleCollapseBoard}>
                                    <img className='arrow-left-icon' src={LEFT_ARROW} />
                                    <span>Board</span>
                                </div>
                            </> :
                            <>
                                <div className='icon-wrapper' onClick={toggleCollapseBoard}>
                                    <img className='arrow-right-icon' src={RIGHT_ARROW} />
                                </div>
                                <div className='btn' onClick={() => {
                                    setAction(null, 'add board', { boardTitle: boardTitle }, 'Maintain')
                                    setBoardTitle('')
                                }}><span>ADD BOARD</span></div>
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