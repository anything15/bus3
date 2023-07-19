import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Autocomplete } from '@react-google-maps/api';
import { TextField } from '@mui/material';
import * as turf from '@turf/turf';
import { formBusActions } from './redux/formBusSlice';
import store from "./redux/store";


function DestinationField() {
  const formBusState = useSelector((state) => state.formBus);
  const dispatch = useDispatch();
  const destinationAutocompleteRef = useRef();

  useEffect(() => {
    return () => {
      console.log('DestinationField unmounted');
    };
  }, []);

  useEffect(() => {
    console.log('FormBus state changed:', formBusState);
  }, [formBusState]);

  const handleDestinationChange = () => {
    const formBusState = store.getState().formBus;
    console.log(`handleDestinationChange called`); // log when function is called
    console.log('State before destination change:', formBusState);
    const ref = destinationAutocompleteRef.current;
    if (ref) {
      const place = ref.getPlace();
      if (place) {
        console.log('Got place:', place); // log received place
        const latLng = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
  
        // Define your geofenced area
        const geofencedArea = turf.polygon([[
          [-0.4365770, 51.6678624],
          [0.11925577597057213, 51.67363149254149],
          [0.11817223469228111, 51.29013250036243],
          [-0.4316739069302571, 51.3150680818589],
          [-0.4365770, 51.6678624] // Close the polygon
        ]]);
  
        // Create a point for the new location
        const locationPoint = turf.point([latLng.lng, latLng.lat]);
  
        // Check if the location falls within the geofenced area
        if (turf.booleanPointInPolygon(locationPoint, geofencedArea)) {
          console.log('Location is within geofenced area'); // log when geofence check passes
          console.log(place);
  
          const newState = {
            ...formBusState,
            destination: place.formatted_address,
            destinationLatLng: latLng,
            mapCenter: latLng,
            mapZoom: 10
          };
  
          console.log("Dispatching action with new state:", newState); // New log statement
          console.log('State after destination change:', formBusState);
          dispatch(formBusActions.setFormState(newState));
        } else {
          console.log('Location is outside geofenced area'); // log when geofence check fails
          alert('This location is outside of our service area.');
        }
      }
    }
  };

  return (
    <Autocomplete
      onLoad={(autocomplete) => {
        autocomplete.setFields(['address_components', 'geometry', 'icon', 'name', 'formatted_address']);
        autocomplete.setOptions({componentRestrictions: { country: "gb" }, types: ["address"]});
        destinationAutocompleteRef.current = autocomplete; // save the instance to the ref
        autocomplete.addListener('place_changed', handleDestinationChange);
      }}
    >
      <TextField id="destination" placeholder="Destination" fullWidth />
    </Autocomplete>
  );
}

export default DestinationField;
