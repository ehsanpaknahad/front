import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";
import { useState ,useEffect} from "react";
import MapViewer from "./components/MapViewer";
import axios from "axios";
import StateContext from "./stateContext";
import DispatchContext from "./DispatchContext";
import { useImmerReducer } from "use-immer";

//Axios.defaults.baseURL = "http://10.17.216.89:8082"  // on sirri server
axios.defaults.baseURL = "http://localhost:8080";

function App() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("token")),
    user: {
      token: localStorage.getItem("token"),
      username: localStorage.getItem("username"),
      role: null,
      attributeEditing:  [],
      geometryEditing: [],  
    },
  };

  function ourReducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.loggedIn = true;
        draft.user = action.data;
        return;
      case "logout":
        draft.loggedIn = false;
        draft.user = {};
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

   useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("token", state.user.token)
      localStorage.setItem("username", state.user.username)
      
    } else {
      localStorage.removeItem("token")
      localStorage.removeItem("username")
     
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.loggedIn])

  const [activeForm, setActiveForm] = useState("login");

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
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
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

export default App;
