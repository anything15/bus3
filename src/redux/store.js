import { configureStore } from '@reduxjs/toolkit';
import formBusReducer from './formBusSlice';

export default configureStore({
  reducer: {
    formBus: formBusReducer
  }
});
