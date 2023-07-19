







/*import React from 'react';
import { DirectionsRenderer } from '@react-google-maps/api';

const DirectionsMap = ({ directions }) => (
  <DirectionsRenderer
    options={{
      directions: directions
    }}
  />
);

export default DirectionsMap;







/*import React from 'react';
import { GoogleMap, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

const DirectionsMap = ({ origin, destination }) => (
  <GoogleMap
    id="direction-example"
    mapContainerStyle={{ height: "400px", width: "full" }}
    zoom={10}
    center={{
      lat: 50.035092,
      lng: -94.716583
    }}
  >
    <DirectionsService
      options={{
        destination: destination,
        origin: origin,
        travelMode: 'DRIVING'
      }}
      callback={res => {
        if (res !== null) {
          setDirections(res);
        }
      }}
    />
    <DirectionsRenderer
      options={{
        directions: directions
      }}
    />
  </GoogleMap>
);

export default DirectionsMap; */





/*import React, { useState } from 'react';
import { GoogleMap, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

function DirectionsMap({ origin, destination }) {
  const [directions, setDirections] = useState(null);

  return (
    <GoogleMap
      id="direction-example"
      mapContainerStyle={{ height: "400px", width: "full" }}
      zoom={10}
      center={{
        lat: 50.035092,
        lng: -94.716583
      }}
    >
      <DirectionsService
        options={{
          destination: destination,
          origin: origin,
          travelMode: 'DRIVING'
        }}
        callback={res => {
          if (res !== null) {
            setDirections(res);
          }
        }}
      />
      <DirectionsRenderer
        options={{
          directions: directions
        }}
      />
    </GoogleMap>
  );
}

export default DirectionsMap;*/
