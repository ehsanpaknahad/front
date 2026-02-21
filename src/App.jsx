 
import './App.css' 
import Login from './components/Login';
import Register from './components/Register';
import { useState } from 'react'; 
import MapViewer from './components/MapViewer';
import axios from "axios"

//Axios.defaults.baseURL = "http://10.17.216.89:8082"  // on sirri server
axios.defaults.baseURL = "http://localhost:8080"
 
function App() {  
  const [activeForm, setActiveForm] = useState('login');
  const [loggedIn, setLoggedIn]=useState(Boolean(localStorage.getItem("token")) ? true : false)


  if (loggedIn) {
    return <MapViewer setLoggedIn={setLoggedIn} />;
  }

  return (       
    <div className="body-part">   
      <div className="container"> 
              <Login 
                activeForm={activeForm} 
                setActiveForm={setActiveForm}
                setLoggedIn={setLoggedIn} />        
              <Register
                activeForm={activeForm}
                setActiveForm={setActiveForm}
               />
      </div>
    </div>)       
}

export default App
