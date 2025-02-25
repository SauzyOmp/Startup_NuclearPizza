import React from 'react';
import './pizza.css';

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

import {
  APIProvider,
  Map,
  useMap,
  AdvancedMarker,
  Pin
} from '@vis.gl/react-google-maps';

export function Pizza() {
  return (
    <main>
      <h1>Pizza</h1>
      
      {/* Google Map Section */}
      <div style={{ height: '400px', width: '100%' }}>
        <APIProvider 
          apiKey={googleMapsApiKey} 
          onLoad={() => console.log('Maps API has loaded.')}
        >
          <Map
            defaultZoom={13}
            defaultCenter={{ lat: -33.860664, lng: 151.208138 }}
            mapId="da37f3254c6a6d1c"
          />
        </APIProvider>
      </div>
      
      {/* Bomb List Content */}
      <dl className="bomb-list">
        <div className="bomb">
          <dt>Little Boy</dt>
          <dd>
            <img src="little-boy.jpg" alt="Little Boy bomb image" />
            <p>A uranium-based bomb dropped on Hiroshima in 1945.</p>
          </dd>
        </div>
        <div className="bomb">
          <dt>Fat Man</dt>
          <dd>
            <img src="fat-man.jpg" alt="Fat Man bomb image" />
            <p>A plutonium-based bomb dropped on Nagasaki in 1945.</p>
          </dd>
        </div>
        <div className="bomb">
          <dt>Tsar Bomba</dt>
          <dd>
            <img src="tsar-bomba.jpg" alt="Tsar Bomba bomb image" />
            <p>The largest nuclear bomb ever detonated, tested by the Soviet Union in 1961.</p>
          </dd>
        </div>
        <div className="bomb">
          <dt>Castle Bravo</dt>
          <dd>
            <img src="castle-bravo.png" alt="Castle Bravo bomb image" />
            <p>A powerful hydrogen bomb test by the U.S. in 1954, causing unexpected fallout.</p>
          </dd>
        </div>
        <div className="bomb">
          <dt>Ivy Mike</dt>
          <dd>
            <img src="ivy-mike.jpg" alt="Ivy Mike bomb image" />
            <p>The first full-scale hydrogen bomb test by the U.S. in 1952.</p>
          </dd>
        </div>
      </dl>
      
      
      <div>
        Most pizzas Cooked by you before: <br />
        Congrats, that's X more than your friend: REALFRIEND99
      </div>
    </main>
  );
}
