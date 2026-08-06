import "./App.css";
import Login from "./components/Login.js";
import Register from "./components/Register.js";
import { useState } from "react";
import MapViewer from "./components/MapViewer.tsx";
import axios from "axios";

 

import { useAuth } from "./auth/AuthProvider.js";
//Axios.defaults.baseURL = "http://10.17.216.89:8082"  // on sirri server
axios.defaults.baseURL = "http://localhost:8080";

function App() {
  const { state } = useAuth();
  const [activeForm, setActiveForm] = useState("login");
  //

  return (
    <>
      {state.loggedIn ? (
        <MapViewer />
      ) : (
        <div className="body-part">
          <div className="container">
            <Login activeForm={activeForm} setActiveForm={setActiveForm} />
            <Register activeForm={activeForm} setActiveForm={setActiveForm} />
          </div>
        </div>
      )}
    </>
  );
}

export default App;
