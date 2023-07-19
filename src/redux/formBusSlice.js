// formBusSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pickupLocation: '',
  destination: undefined,
  pickupLocationLatLng: undefined,
  destinationLatLng: undefined,
  mapCenter: {
    lat: 55.3781, 
    lng: -3.4360
  },
  mapZoom: 8,
  pickupDate: undefined,
  pickupTime: undefined,
  passengers: undefined,
  suitcases: undefined,
  vehicleType: '',
  directionsResult: undefined,
  cost: 0,
};

const formBusSlice = createSlice({
  name: 'formBus',
  initialState,
  reducers: {
    setFormState: (state, action) => {
      console.log("Reducer received action with payload:", action.payload);
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const formBusActions = formBusSlice.actions;

export default formBusSlice.reducer;
