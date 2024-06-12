import { BrowserRouter, HashRouter, Navigate, Route, Routes } from 'react-router-dom';

import 'reactflow/dist/style.css';
import '~/assets/css/App.scss';

import MapPage from '~/component/MapPage/MapPage'
import AboutMePage from '~/component/AboutMePage/AboutMePage'
import DevListener from '~/listener/DevListener'

function App() {
    return (
        <>
            <div className='app-container'>
                <HashRouter>
                    <Routes>
                        <Route path="/" element={<MapPage />} />
                        <Route path="/mind-map" element={<MapPage />} />
                        <Route path="/about-me" element={<AboutMePage />} />
                        <Route
                            path="*"
                            element={<Navigate to="/" />}
                        />
                    </Routes>
                </HashRouter>
            </div >
        </>
    );
}

export default App;