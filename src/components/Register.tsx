 
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { BsFillTelephoneFill } from "react-icons/bs";
import axios from 'axios';
import { useState } from 'react' 
 
import { FaExclamationCircle } from "react-icons/fa";
 
import { IoCheckmarkDoneSharp } from "react-icons/io5";

function Register({activeForm,setActiveForm}) { 
   const [showMessage, setShowMessage] = useState(false);
   const [usernameError, setUsernameError] = useState('');
    const [username,setUsername] = useState('')
    const [password,setPassword] = useState('')
    const [info,setInfo] = useState('')

     
    const handleUsernameFocus = () => {
      // When user focuses on input, clear the error text
      if (usernameError) {
        setUsernameError('');
         
      }
    };


   async function handleRegisterSubmit(e) {
      e.preventDefault()
  
      try {  
        const response = await axios.post('/user/register',
        {username,password,info}, 
        {headers: {'Content-Type': 'application/json'}})        
  
      //  console.log(response.data) 
        setShowMessage(true);  
      //   setUsername('')
      //   setPassword('')
      //   setInfo('')
        setUsernameError(''); // Clear any errors  

      } catch(e) {
       
      //  console.log(e.response)
        const { data, status } = e.response;
        if (status === 409 && data.field === 'username') {
         setUsernameError(data.error);
       } 
      }
    }
 
   return (
      <div className= {`form-box register ${activeForm === 'register' ? 'active' : 'inactive-right'}`}>

        {showMessage && (
            <div className="form-overlay">
               <div className="overlay-content">
                  <IoCheckmarkDoneSharp className="check-icon" />
                  <h3>Waiting for Admin Confirmation</h3>                  
                  
                  <div className="call-info">                  
                     <span>Your account has been submitted successfully. Please wait for admin to confirm it.</span>
                  </div>
                  
                  <button 
                   className="close-overlay-btn"
                   onClick={() => {
                      setShowMessage(false)
                      setPassword('')
                      setUsername('')
                      setInfo('')
                     }}
                  >
                   Close Message
                  </button>
               </div>
            </div>
         )}

         <form onSubmit={handleRegisterSubmit} >
            <h1>Registration</h1>
            <div className="input-box">
               {usernameError && (
                  <i className="error-icon-inside">
                     <FaExclamationCircle style={{ color: '#ff4d4d' }} />
                  </i>
               )}
               <input 
                 type="text" 
                 name="username"
                 placeholder={usernameError || "Username"} 
                 autoComplete="off"
                 className={usernameError ? 'error-input' : ''}
                 onChange={e => {
                  setUsernameError('')  
                  setUsername(e.target.value)}}
                // value={formData.username}
                 onFocus={handleUsernameFocus}
                 value={username}
               />                 

               <i><FaUser /></i>                           
            </div>
            <div className="input-box">              
               <input 
                 type="password"
                 name="password" 
                 placeholder="Password" 
                 autoComplete="off"   
                 onChange={e => setPassword(e.target.value)}  
                 value={password}           
               />
               <i><FaLock /></i>
              
            </div>  
            <div className="input-box">
               <input 
                 type="text" 
                 name="info"
                 placeholder="Tell number and Unit" 
                 autoComplete="off" 
                 onChange={e => setInfo(e.target.value)}
                 value={info} 
                 />
               <i><BsFillTelephoneFill /></i>              
            </div>         
            <button type="submit" className="btn">Register</button>
            <label className="form-label-login" htmlFor='back2login'>Already have an account?</label >          
            <button id='back2login' type="button" className="btn toggle" onClick={() => setActiveForm('login')}>Back to Login</button>
         </form>
       </div>
   )
}
export default Register