import { MapContainer, TileLayer, useMap, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Link } from 'react-router-dom';
import ManualSlideshow from '../slideShows/ManualSlideshow';
import './Map.css';

export default function Map( { parks }) {

    return (
        <MapContainer className={'map-container'} center={[38, -97]} zoom={3} scrollWheelZoom={true} maxBounds={[[-90, -360], [90, 360]]} maxBoundsViscosity={1}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {parks.map((park, index) => {
                 
                let states = park.states.split(',').join(', ');
                const statesLength = park.states.split(',').length;
             
                if (statesLength > 2) {
                    states = states.split(',').slice(0, 3).join(', ') + ', & More';
                }
                
                return <Marker key={index} position={[park.latitude, park.longitude]} >
                            <Link to={`${park.fullName}/${park.parkCode}`}>
                                <Popup className='popup-container' >
                                    <div className='popup-img-container'>
                                        <ManualSlideshow images={park.images} />
                                    </div>
                                    <div className='popup-content'>
                                        <p className='popup-title'>{park.name}<br></br>{park.designation}</p>
                                        <p className='popup-states'>{states}</p>
                                    </div>
                                </Popup>
                            </Link>
                        </Marker>;
            })}
            
        </MapContainer>
    );
}
