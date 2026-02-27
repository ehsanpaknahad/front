  
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { useState,useContext } from 'react' 
import axios from 'axios';
import DispatchContext from "../DispatchContext";

function Login({activeForm,setActiveForm}) {
   const [username,setUsername] = useState('');
   const [password,setPassword] = useState('');
   const appDispatch = useContext(DispatchContext);

   async function handleLoginSubmit(e) {
      e.preventDefault()  
      try {  
        const response = await axios.post('/user/login',
           {username,password}, 
           {headers: {'Content-Type': 'application/json'}})        
  
        console.log("login:",response.data)
        if(response.data) {
             
           appDispatch({ type: "login", data: response.data })
           setPassword('')
           setUsername('')  
         } else {
            console.log("Incorrect Username or Password")
         }    
      } catch(e) {
        console.log("error:", e)
      }
    }
    
 
   return (
      <div className= {`form-box login ${activeForm === 'login' ? 'active' : 'inactive-left'}`}>
        <form onSubmit={handleLoginSubmit}>
            <h1 style={{ marginBottom: '30px' }}>Login</h1>
            <div className="input-box">
               <input 
                  type="text" 
                  placeholder="Username" 
                  autoComplete="off" 
                  onChange={e => setUsername(e.target.value)}
                  value={username}
                  />
               <i ><FaUser /></i>              
            </div>
            <div className="input-box">              
               <input 
                  type="password" 
                  placeholder="Password" 
                  autoComplete="off"
                  onChange={e => setPassword(e.target.value)}
                  value={password} 
                   />
               <i><FaLock /></i>
            </div>
            <button type="submit" className="btn">Login</button>
            <label className="form-label-register" htmlFor='go2register'>Don't have an account?</label>
            <button id='go2register' type="button" className="btn toggle" onClick={() => setActiveForm('register')}>Go to Register</button>
       </form>
      </div>
   )
}
export default Login