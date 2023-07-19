import React from "react";
import { Provider } from "react-redux";
import store from "./redux/store";
import "./App.css";
import Header from "./Header";
import FormBus from "./FormBus";
import SignUp from "./SignUp";
import { LoadScript } from '@react-google-maps/api';

const libraries = ["places"];

function App() {
  return (
    <Provider store={store}>
      <div className="app">
        <Header />
        <LoadScript
          id="script-loader"
          googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
          libraries={libraries}
        >
          <FormBus />
          {/* App Body */}
          {/* Sidebar */}
          {/* Widgets */}
        </LoadScript>
        <SignUp />
      </div>
    </Provider>
  );
}

export default App;