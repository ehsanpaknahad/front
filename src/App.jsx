 
import './App.css' 
import Login from './components/Login';
import Register from './components/Register';
import { useState } from 'react' 
import MapView from './components/MapView'
 
function App() {  
  const [activeForm, setActiveForm] = useState('login');
  const [loggedIn, setLoggedIn]=useState(Boolean(localStorage.getItem("token")) ? true : false)


  if (loggedIn) {
    return <MapView setLoggedIn={setLoggedIn} />;
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
