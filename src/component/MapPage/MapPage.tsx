import MainMap from '~/component/MapPage/MainMap';
import SelectorMap from '~/component/MapPage/SelectorMap';
import NodeListener from '~/listener/NodeListener';
import MapAppListener from '~/listener/MapAppListener';

import '~/assets/css/MapPage.scss';
import ControlPanel from './ControlPanel';

const MapPage = () => {
    return (
        <div className='mappage-container'>
            <MapAppListener />
            <NodeListener />
            <SelectorMap />
            <MainMap />
            <ControlPanel />
        </div>
    );
}

export default MapPage;