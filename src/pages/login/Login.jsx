import axios from 'axios';
import './login.css'
import { useGlobalContext } from '../../context/context';
import { useState } from 'react';

export default function Login() {
  const [errorMessage, setErrorMessage] = useState("");
  const { LoginStart, LoginSuccess, LoginFailure } = useGlobalContext();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    // dispatch({ type: "LOGIN_START" });
    LoginStart();

    try{
      const res = await axios.post("http://localhost:5000/api/user/login", {  //https://unishare-backend.vercel.app/api/user/login
        user_id: userId,
        password 
      }, { withCredentials: true });

      // dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
      setErrorMessage("");
      LoginSuccess(res.data);
      console.log(res.data);
      window.location.replace('/');

    }catch(err){
      // dispatch({ type: "LOGIN_FAILURE" });
      LoginFailure();
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setErrorMessage(err.response.data);
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
      } else if (err.request) {
        // The request was made but no response was received
        console.log(err.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', err.message);
      }
    }
  }

  return (
    <div className='login'>
      <div className='unishareDescription'>
        <div className='descriptionContainer alignDescription'>
          <h1 className='introduction'>Welcome to Unishare</h1>
          <h2 className='text'>Simplifying Instructor-Student Communication</h2>
          <p className='descText'>Streamline your learning experience with our intuitive platform designed to connect instructors and students seamlessly</p>
        </div>
      </div>
      <div className='unishareLoginForm alignLoginForm'>
        <div className='loginContainer'>
          <h1 className='loginText'>Login to continue</h1>
          <form onSubmit={handleSubmit} className='loginForm'>
            <input 
              type="text" 
              placeholder='Enter your id'
              onChange={(e) => setUserId(e.target.value)}
              />
            <input 
              type="password" 
              placeholder='Enter your Password'
              onChange={(e) => setPassword(e.target.value)}
              />
            {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}
            <button type='submit'>Login</button>
          </form>
        </div>
      </div>
    </div>
  )
}
