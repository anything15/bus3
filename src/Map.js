import React from 'react';
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { Grid } from '@mui/material';

const mapContainerStyle = {
  height: "400px",
  width: "100%"
};

const Map = ({ mapCenter, mapZoom, pickupLocationLatLng, destinationLatLng, directionsResult }) => (
  <Grid item xs={12} style={{paddingTop: '30px'}}>
    <GoogleMap
      id="map"
      mapContainerStyle={mapContainerStyle}
      zoom={mapZoom}
      center={mapCenter}
      options={{disableDefaultUI: true, zoomControl: true}}
    >
      {pickupLocationLatLng && <Marker position={pickupLocationLatLng} />}
      {destinationLatLng && <Marker position={destinationLatLng} />}

      {directionsResult && (
        <DirectionsRenderer
          options={{
            directions: directionsResult,
          }}
        />
      )}
    </GoogleMap>
  </Grid>
);

export default Map;