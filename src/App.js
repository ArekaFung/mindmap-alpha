import './App.css';

import React from 'react';
import InitFirebase from './Firebase.js'
import ControlPanel from './ControlPanel.js'
import List from './List.js'
import About from './About.js'
import SwitchList from './Whitelist.js'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<About />} />
                <Route path="/map" element={<MapPage />} />
                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />
            </Routes>
        </BrowserRouter>
    );
}

const MapPage = () => {
    return (
        <>
            <InitFirebase />
            <ControlPanel />
            <List />
            {/* <SwitchList /> */}
        </>
    )
}

export default App;
