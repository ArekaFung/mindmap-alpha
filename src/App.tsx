import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import 'reactflow/dist/style.css';
import '~/assets/css/App.scss';

import MapPage from '~/component/MapPage/MapPage'
import AboutMePage from '~/component/AboutMePage/AboutMePage'
import DevListener from '~/listener/DevListener'

function App() {
    return (
        <>
            <div className='app-container'>
                <BrowserRouter>
                    <Routes>
                        <Route path="/mindmap-alpha/mind-map" element={<MapPage />} />
                        <Route path="/mindmap-alpha/about-me" element={<AboutMePage />} />
                        <Route
                            path="*"
                            element={<Navigate to="/mindmap-alpha" replace />}
                        />
                    </Routes>
                </BrowserRouter>
            </div >
        </>
    );
}

export default App;