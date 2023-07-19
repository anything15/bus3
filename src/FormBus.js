import React, { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TextField, Button, Grid, FormControl, Select, MenuItem, InputLabel, Container } from '@mui/material';
import Map from './Map';
import { formBusActions } from './redux/formBusSlice';
import PickupLocation from './PickupLocation';
import DestinationField from './DestinationField';




function FormBus() {


  const formBusState = useSelector((state) => state.formBus);
  const dispatch = useDispatch();


  const [cost, setCost] = useState(0);
  const [mapVisible, setMapVisible] = useState(false);  // State for visibility of the map
  const [formSubmitted, setFormSubmitted] = useState(false);


useEffect(() => {
  console.log("FormBus state changed:", formBusState);
}, [formBusState]);

  function getCostPerMile(timeStr) {
    // Convert the time string to a Date object
    const time = new Date(`1970-01-01T${timeStr}:00`);
  
    // Get the hours
    const hour = time.getHours();
  
    // Check the hour and return the cost per mile
    if ((hour >= 8 && hour < 9) || (hour >= 15 && hour < 18)) {
      return 3.5;
    } else if (hour >= 11 && hour < 13) {
      return 1.5;
    } else {
      return 2.5;
    }
  }



  const handleChange = (event) => {
    console.log(`handleChange called`);
    const { name, value } = event.target;
    let adjustedValue = value;
    if (name === 'passengers' && value < 1) {
      adjustedValue = 1;
    } else if (name === 'suitcases' && value < 0) {
      adjustedValue = 0;
    }

    dispatch(formBusActions.setFormState({
      ...formBusState,
      [name]: adjustedValue
    }));
  };


    
  


const handleSubmit = (event) => {
  event.preventDefault();
  console.log(formBusState); 

  // Validate all fields are filled out
  const requiredFields = ['pickupLocationLatLng', 'destinationLatLng', 'pickupDate', 'pickupTime', 'passengers', 'suitcases', 'vehicleType'];
  const emptyFields = requiredFields.filter(field => formBusState[field] === undefined || formBusState[field] === null);
  


  if (emptyFields.length > 0) {
    const friendlyFieldNames = {
      'pickupLocationLatLng': 'Pickup Location',
      'destinationLatLng': 'Destination',
      'pickupDate': 'Pickup Date',
      'pickupTime': 'Pickup Time',
      'passengers': 'Number of Passengers',
      'suitcases': 'Number of Suitcases',
      'vehicleType': 'Vehicle Type',
    };
    const missingFieldNames = emptyFields.map(field => friendlyFieldNames[field]);
    alert(`Please fill out the following fields: ${missingFieldNames.join(', ')}`);
    return;
  }
  setFormSubmitted(true);
  // Ensure both pickup and destination are filled out
  if (formBusState.pickupLocationLatLng && formBusState.destinationLatLng) {
    setMapVisible(true);

    const DirectionsService = new window.google.maps.DirectionsService();

    DirectionsService.route({
      origin: formBusState.pickupLocationLatLng,
      destination: formBusState.destinationLatLng,
      travelMode: 'DRIVING',
    }, (result, status) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        // Update state with result
        dispatch(formBusActions.setFormState({
          ...formBusState,
          directionsResult: result,
        }));

        // Compute cost
        const totalDistanceInMeters = result.routes[0].legs[0].distance.value;
        const totalDistanceInMiles = totalDistanceInMeters * 0.000621371; // Conversion from meters to miles
        const costPerMile = getCostPerMile(formBusState.pickupTime); 
        const totalCost = totalDistanceInMiles * costPerMile;
        setCost(totalCost.toFixed(2)); 
      } else {
        console.error(`error fetching directions ${result}`);
      }
    });
  }
};
  

  return (
    <Container style={{backgroundColor: 'rgba(0,0,0,0.1)', marginTop: '50px', padding: '50px'}}>
      <form onSubmit={handleSubmit}>
        <Grid container justify="space-around" spacing={3}> 
        <Grid item xs={12} sm={6}>      
            <PickupLocation />         
</Grid>
<Grid item xs={12} sm={6}>
<DestinationField />
</Grid>


          <Grid item xs={12} sm={6}>
            <TextField
              name="pickupDate"
              label="Pickup Date"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="pickupTime"
              label="Pickup Time"
              type="time"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="passengers"
              label="Number of Passengers"
              type="number"
              InputProps={{ inputProps: { min: 1, max: 125 } }}
              fullWidth
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="suitcases"
              label="Number of Suitcases"
              type="number"
              InputProps={{ inputProps: { min: 0, max: 125 } }}
              fullWidth
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel id="vehicleType-label">Vehicle Type</InputLabel>
              <Select
                labelId="vehicleType-label"
                name="vehicleType"
                value={formBusState.vehicleType}
                onChange={handleChange}
                label="Vehicle Type"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="car">Car</MenuItem>
                <MenuItem value="bus">Bus</MenuItem>
                <MenuItem value="motorbike">Motorbike</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Submit
            </Button>
          </Grid>
        </Grid>
         </form> 
          {formSubmitted && (
            <Grid item xs={12}>
              <p>Pickup Location: {formBusState.pickupLocation}</p>
              <p>Destination: {formBusState.destination}</p>
              <p>Pickup Date: {formBusState.pickupDate}</p>
              <p>Pickup Time: {formBusState.pickupTime}</p>
              <p>Number of Passengers: {formBusState.passengers}</p>
              <p>Number of Suitcases: {formBusState.suitcases}</p>
              <p>Vehicle Type: {formBusState.vehicleType}</p>
              <p>Total cost: {cost}</p>
              <Map
                mapCenter={formBusState.mapCenter}
                mapZoom={formBusState.mapZoom}
                pickupLocationLatLng={formBusState.pickupLocationLatLng}
                destinationLatLng={formBusState.destinationLatLng}
                directionsResult={formBusState.directionsResult}
              />
              <Button variant="contained" color="primary">Button Text</Button>
            </Grid>
      )}
        
      
    </Container>
  );
}

export default FormBus;



/* import React, { useState, useEffect } from 'react';
import { LoadScript, Autocomplete, GoogleMap, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import { TextField, Button, Grid, FormControl, Select, MenuItem, InputLabel, Container } from '@mui/material';
import { connect } from 'react-redux';
import { setMapData } from './redux/actions'; 

const libraries = ["places"];
const mapContainerStyle = {
  height: "400px",
  width: "100%"
};

function FormBus(props) {
  const { mapData, setMapData } = props;
  const [localMapData, setLocalMapData] = useState({}); // local form state
  const [mapVisible, setMapVisible] = useState(false);


  useEffect(() => {
    if(localMapData.pickupLocation && localMapData.destination) {
      // We have both addresses, let's trigger the DirectionsService
      new window.google.maps.DirectionsService().route({
        origin: localMapData.pickupLocationLatLng,
        destination: localMapData.destinationLatLng,
        travelMode: "DRIVING"
      }, (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          setLocalMapData({ ...localMapData, directionsResult: result });
        } else {
          console.error(`error fetching directions ${result}`);
        }
      });
    }
  }, [localMapData.pickupLocation, localMapData.destination]); // The effect depends on these values, will be executed when they change
  

  const directionsCallback = (response) => {
    if (response !== null) {
      console.log("Response from Directions API: ", response);
      if (response.status === 'OK') {
        setLocalMapData({ ...localMapData, directionsResult: response });
      } else {
        console.log('response: ', response);
      }
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setLocalMapData({ ...localMapData, [name]: value });
  };

  const handlePlacesChange = (id) => (ref) => {
    if (ref) {
      console.log(`handlePlacesChange called for ${id}`);  // Log the id
      const place = ref.getPlace();
      console.log(place);  // Log the place object
      if (place) {
        const latLng = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setLocalMapData({
          ...localMapData,
          [id]: place.formatted_address,
          [id + 'LatLng']: latLng,
          mapCenter: latLng,
          mapZoom: 10
        });

        if (id === 'pickupLocation') {
          setMapVisible(true);
        }
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setMapData(localMapData);
    console.log(localMapData);
  };

  return (
    <Container style={{backgroundColor: 'rgba(0,0,0,0.1)', marginTop: '50px', padding: '50px'}}>
      <form onSubmit={handleSubmit}>
        <Grid container justify="space-around" spacing={3}>
        <LoadScript
            id="script-loader"
            googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
            libraries={libraries}
          >
            <Grid item xs={12} sm={6}>
              <Autocomplete
                onLoad={(autocomplete) => {
                  autocomplete.setFields(['address_components', 'geometry', 'icon', 'name', 'formatted_address']);
                  autocomplete.setOptions({componentRestrictions: { country: "gb" }, types: ["address"]});
                  autocomplete.addListener('place_changed', () => handlePlacesChange('pickupLocation')(autocomplete));
                }}
              >
                <TextField id="pickupLocation" placeholder="Pickup Location" fullWidth />
              </Autocomplete>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                onLoad={(autocomplete) => {
                  autocomplete.setFields(['address_components', 'geometry', 'icon', 'name', 'formatted_address']);
                  autocomplete.setOptions({componentRestrictions: { country: "gb" }, types: ["address"]});
                  autocomplete.addListener('place_changed', () => handlePlacesChange('destination')(autocomplete));
                }}
              >
                <TextField id="destination" placeholder="Destination" fullWidth />
              </Autocomplete>
            </Grid>
            {mapVisible && (
              <Grid item xs={12} style={{paddingTop: '30px'}}>
                <GoogleMap
                  id="map"
                  mapContainerStyle={mapContainerStyle}
                  zoom={localMapData.mapZoom}
                  center={localMapData.mapCenter}
                  options={{disableDefaultUI: true, zoomControl: true}}
                >
                  {localMapData.pickupLocationLatLng && <Marker position={localMapData.pickupLocationLatLng} />}
                  {localMapData.destinationLatLng && <Marker position={localMapData.destinationLatLng} />}

                  {localMapData.directionsResult && (
                    <DirectionsRenderer
                      // required
                      options={{
                        directions: localMapData.directionsResult,
                      }}
                    />
                  )}
                </GoogleMap>
              </Grid>
            )}
          </LoadScript>
          <Grid item xs={12} sm={6}>
            <TextField
              name="pickupDate"
              label="Pickup Date"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="pickupTime"
              label="Pickup Time"
              type="time"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="passengers"
              label="Number of Passengers"
              type="number"
              InputProps={{ inputProps: { max: 125 } }}
              fullWidth
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="suitcases"
              label="Number of Suitcases"
              type="number"
              InputProps={{ inputProps: { max: 125 } }}
              fullWidth
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel id="vehicleType-label">Vehicle Type</InputLabel>
              <Select
                labelId="vehicleType-label"
                name="vehicleType"
                value={mapData.vehicleType}
                onChange={handleChange}
                label="Vehicle Type"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="car">Car</MenuItem>
                <MenuItem value="bus">Bus</MenuItem>
                <MenuItem value="motorbike">Motorbike</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );

}

const mapStateToProps = state => ({
  mapData: state.mapData
});

const mapDispatchToProps = dispatch => ({
  setMapData: data => dispatch(setMapData(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(FormBus);








/*import React, { useState, useRef } from 'react';
import { LoadScript, Autocomplete, GoogleMap, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import { TextField, Button, Grid, FormControl, Select, MenuItem, InputLabel, Container } from '@mui/material';

const libraries = ["places"];
const mapContainerStyle = {
  height: "400px",
  width: "100%"
};

function FormBus() {
  const [state, setState] = useState({
    pickupLocation: '',
    destination: '',
    pickupLocationLatLng: null,
    destinationLatLng: null,
    mapCenter: {
      lat: 55.3781, 
      lng: -3.4360
    },
    mapZoom: 8,
    pickupDate: '',
    pickupTime: '',
    passengers: '',
    suitcases: '',
    vehicleType: '',
    directionsResult: null
  });
  
  const [mapVisible, setMapVisible] = useState(false);  // State for visibility of the map

  const directionsCallback = (response) => {
    if (response !== null) {
      if (response.status === 'OK') {
        setState((prevState) => ({
          ...prevState,
          directionsResult: response,
        }));
      } else {
        console.log('response: ', response);
      }
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handlePlacesChange = (id) => (ref) => {
    if (ref) {
      const place = ref.getPlace();
      if (place) {
        const latLng = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setState(prevState => ({
          ...prevState,
          [id]: place.formatted_address,
          [id + 'LatLng']: latLng,
          mapCenter: latLng,
          mapZoom: 10
        }));

        // Set map visibility to true if the pickup location has been selected
        if (id === 'pickupLocation') {
          setMapVisible(true);
        }
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(process.env.REACT_APP_GOOGLE_MAPS_API_KEY)
    console.log(state);
  };

  return (
    <Container style={{backgroundColor: 'rgba(0,0,0,0.1)', marginTop: '50px', padding: '50px'}}>
      <form onSubmit={handleSubmit}>
        <Grid container justify="space-around" spacing={3}>
        <LoadScript
            id="script-loader"
            googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
            libraries={libraries}
          >
            <Grid item xs={12} sm={6}>
              <Autocomplete
                onLoad={(autocomplete) => {
                  autocomplete.setFields(['address_components', 'geometry', 'icon', 'name']);
                  autocomplete.setOptions({componentRestrictions: { country: "gb" }, types: ["address"]});
                  autocomplete.addListener('place_changed', () => handlePlacesChange('pickupLocation')(autocomplete));
                }}
              >
                <TextField id="pickupLocation" placeholder="Pickup Location" fullWidth />
              </Autocomplete>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                onLoad={(autocomplete) => {
                  autocomplete.setFields(['address_components', 'geometry', 'icon', 'name']);
                  autocomplete.setOptions({componentRestrictions: { country: "gb" }, types: ["address"]});
                  autocomplete.addListener('place_changed', () => handlePlacesChange('destination')(autocomplete));
                }}
              >
                <TextField id="destination" placeholder="Destination" fullWidth />
              </Autocomplete>
            </Grid>
            {mapVisible && (
              <Grid item xs={12} style={{paddingTop: '30px'}}>
                <GoogleMap
                  id="map"
                  mapContainerStyle={mapContainerStyle}
                  zoom={state.mapZoom}
                  center={state.mapCenter}
                  options={{disableDefaultUI: true, zoomControl: true}}
                >
                  {state.pickupLocationLatLng && <Marker position={state.pickupLocationLatLng} />}
                  {state.destinationLatLng && <Marker position={state.destinationLatLng} />}

                  {state.pickupLocationLatLng && state.destinationLatLng && (
                    <DirectionsService
                      // required
                      options={{
                        destination: state.destinationLatLng,
                        origin: state.pickupLocationLatLng,
                        travelMode: "DRIVING"
                      }}
                      // required
                      callback={directionsCallback}
                    />
                  )}

                  {state.directionsResult && (
                    <DirectionsRenderer
                      // required
                      options={{
                        directions: state.directionsResult,
                      }}
                    />
                  )}
                </GoogleMap>
              </Grid>
            )}
          </LoadScript>
          <Grid item xs={12} sm={6}>
            <TextField
              name="pickupDate"
              label="Pickup Date"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="pickupTime"
              label="Pickup Time"
              type="time"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="passengers"
              label="Number of Passengers"
              type="number"
              InputProps={{ inputProps: { max: 125 } }}
              fullWidth
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="suitcases"
              label="Number of Suitcases"
              type="number"
              InputProps={{ inputProps: { max: 125 } }}
              fullWidth
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel id="vehicleType-label">Vehicle Type</InputLabel>
              <Select
                labelId="vehicleType-label"
                name="vehicleType"
                value={state.vehicleType}
                onChange={handleChange}
                label="Vehicle Type"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value="car">Car</MenuItem>
                <MenuItem value="bus">Bus</MenuItem>
                <MenuItem value="motorbike">Motorbike</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default FormBus;















/*import React, { useState } from 'react';
import { LoadScript, Autocomplete, GoogleMap, Marker } from '@react-google-maps/api';
import { TextField, Button, Grid, FormControl, Select, MenuItem, InputLabel, Container } from '@mui/material';

const libraries = ["places"];
const mapContainerStyle = {
  height: "400px",
  width: "100%"
};

function FormBus() {
  const [state, setState] = useState({
    pickupLocation: '',
    destination: '',
    pickupLocationLatLng: null,
    destinationLatLng: null,
    mapCenter: {
      lat: 55.3781, 
      lng: -3.4360 // default location is roughly at the center of the UK
    },
    mapZoom: 8,
    pickupDate: '',
    pickupTime: '',
    passengers: '',
    suitcases: '',
    vehicleType: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handlePlacesChange = (id) => (ref) => {
    if (ref) {
      const place = ref.getPlace();
      if (place) {
        const latLng = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        };
        setState(prevState => ({
          ...prevState,
          [id]: place.formatted_address,
          [id + 'LatLng']: latLng,
          mapCenter: latLng,
          mapZoom: 10 // set a closer zoom when a location is selected
        }));
      }
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(process.env.REACT_APP_GOOGLE_MAPS_API_KEY)
    console.log(state);
  };

  return (
    <Container style={{backgroundColor: 'rgba(0,0,0,0.1)', marginTop: '50px', padding: '50px'}}>
      <form onSubmit={handleSubmit}>
        <Grid container justify="space-around" spacing={3}>
        <LoadScript
            id="script-loader"
            googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
            libraries={libraries}
          >
            <Grid item xs={12} sm={6}>
              <Autocomplete
                onLoad={(autocomplete) => {
                  autocomplete.setFields(['address_components', 'geometry', 'icon', 'name']);
                  autocomplete.setOptions({componentRestrictions: { country: "gb" }, types: ["address"]});
                  autocomplete.addListener('place_changed', () => handlePlacesChange('pickupLocation')(autocomplete));
                }}
              >
                <TextField id="pickupLocation" placeholder="Pickup Location" fullWidth />
              </Autocomplete>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                onLoad={(autocomplete) => {
                  autocomplete.setFields(['address_components', 'geometry', 'icon', 'name']);
                  autocomplete.setOptions({componentRestrictions: { country: "gb" }, types: ["address"]});
                  autocomplete.addListener('place_changed', () => handlePlacesChange('destination')(autocomplete));
                }}
              >
                <TextField id="destination" placeholder="Destination" fullWidth />
              </Autocomplete>
            </Grid>
            <Grid item xs={12}>
              <GoogleMap
                id="map"
                mapContainerStyle={mapContainerStyle}
                zoom={state.mapZoom}
                center={state.mapCenter}
                options={{disableDefaultUI: true, zoomControl: true}}
              >
                {state.pickupLocationLatLng && <Marker position={state.pickupLocationLatLng} />}
                {state.destinationLatLng && <Marker position={state.destinationLatLng} />}
              </GoogleMap>
            </Grid>
          </LoadScript>
          <Grid item xs={12} sm={6}>
            <TextField
              name="pickupDate"
              label="Pickup Date"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="pickupTime"
              label="Pickup Time"
              type="time"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="passengers"
              label="Number of Passengers"
              type="number"
              InputProps={{ inputProps: { max: 125 } }}
              fullWidth
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="suitcases"
              label="Number of Suitcases"
              type="number"
              InputProps={{ inputProps: { max: 125 } }}
              fullWidth
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
          <FormControl variant="outlined" fullWidth>
  <InputLabel id="vehicleType-label">Vehicle Type</InputLabel>
  <Select
    labelId="vehicleType-label"
    name="vehicleType"
    value={state.vehicleType}
    onChange={handleChange}
    label="Vehicle Type"
  >
    <MenuItem value="">
      <em>None</em>
    </MenuItem>
    <MenuItem value="car">Car</MenuItem>
    <MenuItem value="bus">Bus</MenuItem>
    <MenuItem value="motorbike">Motorbike</MenuItem>
  </Select>
</FormControl>

          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default FormBus;








/*import React, { useState } from 'react';
import { LoadScript, Autocomplete, GoogleMap } from '@react-google-maps/api';
import { TextField, Button, Grid, FormControl, Select, MenuItem, InputLabel, Container } from '@mui/material';

const libraries = ["places"];
const mapContainerStyle = {
  height: "400px",
  width: "100%"
};
const center = {
  lat: 55.3781, 
  lng: -3.4360 // default location is roughly at the center of the UK
};

function FormBus() {
  const [state, setState] = useState({
    pickupLocation: '',
    destination: '',
    pickupDate: '',
    pickupTime: '',
    passengers: '',
    suitcases: '',
    vehicleType: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handlePlacesChange = (id) => (ref) => {
    if (ref) {
      const place = ref.getPlace();
      if (place) {
        setState(prevState => ({
          ...prevState,
          [id]: place.formatted_address
        }));
      }
    }
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(process.env.REACT_APP_GOOGLE_MAPS_API_KEY)
    console.log(state);
  };

  return (
    <Container style={{backgroundColor: 'rgba(0,0,0,0.1)', marginTop: '50px', padding: '50px'}}>
      <form onSubmit={handleSubmit}>
        <Grid container justify="space-around" spacing={3}>
        <LoadScript
            id="script-loader"
            googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
            libraries={libraries}
          >
            <Grid item xs={12} sm={6}>
              <Autocomplete
                onLoad={(autocomplete) => {
                  autocomplete.setFields(['address_components', 'geometry', 'icon', 'name']);
                  autocomplete.setOptions({componentRestrictions: { country: "gb" }, types: ["address"]});
                  autocomplete.addListener('place_changed', () => handlePlacesChange('pickupLocation')(autocomplete));
                }}
              >
                <TextField id="pickupLocation" placeholder="Pickup Location" fullWidth />
              </Autocomplete>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                onLoad={(autocomplete) => {
                  autocomplete.setFields(['address_components', 'geometry', 'icon', 'name']);
                  autocomplete.setOptions({componentRestrictions: { country: "gb" }, types: ["address"]});
                  autocomplete.addListener('place_changed', () => handlePlacesChange('destination')(autocomplete));
                }}
              >
                <TextField id="destination" placeholder="Destination" fullWidth />
              </Autocomplete>
            </Grid>
            <Grid item xs={12}>
              <GoogleMap
                id="map"
                mapContainerStyle={mapContainerStyle}
                zoom={8}
                center={center}
              />
            </Grid>
          </LoadScript>
          <Grid item xs={12} sm={6}>
            <TextField
              name="pickupDate"
              label="Pickup Date"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="pickupTime"
              label="Pickup Time"
              type="time"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="passengers"
              label="Number of Passengers"
              type="number"
              InputProps={{ inputProps: { max: 125 } }}
              fullWidth
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="suitcases"
              label="Number of Suitcases"
              type="number"
              InputProps={{ inputProps: { max: 125 } }}
              fullWidth
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
          <FormControl variant="outlined" fullWidth>
  <InputLabel id="vehicleType-label">Vehicle Type</InputLabel>
  <Select
    labelId="vehicleType-label"
    name="vehicleType"
    value={state.vehicleType}
    onChange={handleChange}
    label="Vehicle Type"
  >
    <MenuItem value="">
      <em>None</em>
    </MenuItem>
    <MenuItem value="car">Car</MenuItem>
    <MenuItem value="bus">Bus</MenuItem>
    <MenuItem value="motorbike">Motorbike</MenuItem>
  </Select>
</FormControl>

          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default FormBus;











/*import React, { useState } from 'react';
import { LoadScript, Autocomplete, StandaloneSearchBox } from '@react-google-maps/api';
import { TextField, Button, Grid, FormControl, Select, MenuItem, InputLabel, Container } from '@mui/material';




const libraries = ["places"];

function FormBus() {
  const [state, setState] = useState({
    pickupLocation: '',
    destination: '',
    pickupDate: '',
    pickupTime: '',
    passengers: '',
    suitcases: '',
    vehicleType: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handlePlacesChange = (id) => (ref) => {
    if (ref) {
      const place = ref.getPlace();
      if (place) {
        setState(prevState => ({
          ...prevState,
          [id]: place.formatted_address
        }));
      }
    }
  };
  

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(process.env.REACT_APP_GOOGLE_MAPS_API_KEY)
    console.log(state);
  };

  return (
    <Container style={{backgroundColor: 'rgba(0,0,0,0.1)', marginTop: '50px', padding: '50px'}}>
      <form onSubmit={handleSubmit}>
        <Grid container justify="space-around" spacing={3}>
        <LoadScript
            id="script-loader"
            googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
            libraries={libraries}
          >
            <Grid item xs={12} sm={6}>
              <Autocomplete
                onLoad={(autocomplete) => {
                  autocomplete.setFields(['address_components', 'geometry', 'icon', 'name']);
                  autocomplete.setOptions({componentRestrictions: { country: "gb" }, types: ["address"]});
                  autocomplete.addListener('place_changed', () => handlePlacesChange('pickupLocation')(autocomplete));
                }}
              >
                <TextField id="pickupLocation" placeholder="Pickup Location" fullWidth />
              </Autocomplete>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Autocomplete
                onLoad={(autocomplete) => {
                  autocomplete.setFields(['address_components', 'geometry', 'icon', 'name']);
                  autocomplete.setOptions({componentRestrictions: { country: "gb" }, types: ["address"]});
                  autocomplete.addListener('place_changed', () => handlePlacesChange('destination')(autocomplete));
                }}
              >
                <TextField id="destination" placeholder="Destination" fullWidth />
              </Autocomplete>
            </Grid>
          </LoadScript>
          <Grid item xs={12} sm={6}>
            <TextField
              name="pickupDate"
              label="Pickup Date"
              type="date"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="pickupTime"
              label="Pickup Time"
              type="time"
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="passengers"
              label="Number of Passengers"
              type="number"
              InputProps={{ inputProps: { max: 125 } }}
              fullWidth
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="suitcases"
              label="Number of Suitcases"
              type="number"
              InputProps={{ inputProps: { max: 125 } }}
              fullWidth
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
          <FormControl variant="outlined" fullWidth>
  <InputLabel id="vehicleType-label">Vehicle Type</InputLabel>
  <Select
    labelId="vehicleType-label"
    name="vehicleType"
    value={state.vehicleType}
    onChange={handleChange}
    label="Vehicle Type"
  >
    <MenuItem value="">
      <em>None</em>
    </MenuItem>
    <MenuItem value="car">Car</MenuItem>
    <MenuItem value="bus">Bus</MenuItem>
    <MenuItem value="motorbike">Motorbike</MenuItem>
  </Select>
</FormControl>

          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Submit
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default FormBus;

/*          <FormControl fullWidth>
              <InputLabel id="vehicleType-label">Vehicle Type</InputLabel>
              <Select
                labelId="vehicleType-label"
                id="vehicleType"
                onChange={handleChange}
              >
                <MenuItem value="car">Car</MenuItem>
                <MenuItem value="bus">Bus</MenuItem>
                <MenuItem value="motorbike">Motorbike</MenuItem>
              </Select>
            </FormControl> */



/*import React, {useRef} from 'react';
import { GoogleMap, LoadScript, StandaloneSearchBox } from '@react-google-maps/api';


const FormBus = () => {
    const inputRef = useRef();

    const handlePlaceChanged = () => {
        const [place] = inputRef.current.getPlaces();
        if (place) {
            console.log(place.formatted_address);
            console.log(place.geometry.location.lat);
            console.log(place.geometry.location.lng);
        }
    };
    return (
        <LoadScript
        googleMapsApiKey={process.env.REACT_APP_GOOGLE_API_KEY}
        libraries={["places"]}
        >
            <StandaloneSearchBox
            onLoad={ref => (inputRef.current= ref)}
            onPlacesChanged={handlePlaceChanged}
            >
            <input
            type="text"
            className="form-control"
            placeholder='enter location'
            />
            </StandaloneSearchBox>

        </LoadScript>
    );
};

export default FormBus;*/