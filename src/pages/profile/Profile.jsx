import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGlobalContext } from '../../context/context';
import  './profile.css'
import image from '../../assets/images/profile Image.gif'
import { useState } from 'react';
import axios from 'axios';
const Profile = () => {
  const { user } = useGlobalContext();
  console.log(user);
  const [password, setPassword] = useState("****");
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [changePassword, setChangePassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setChangePassword(true);
  
    try {
      const res = await axios.put("http://localhost:5000/api/user/update", {
        user_id: user.others.user_id,
        oldpassword: oldPassword, // assuming you have oldPassword state variable
        password: newPassword, // new password
      }, { withCredentials: true });
  
      setErrorMessage("");
      setChangePassword(false);
      console.log(res.data);
      setPassword(newPassword);
      toast.success(res.data.msg);
  
    } catch(err) {
      if (err.response) {
        // setErrorMessage(err.response.data);
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
        toast.error(err.response.data);
      } else if (err.request) {
        console.log(err.request);
      } else {
        console.log('Error', err.message);
      }
    }
  }

  return (
    <div className='profile'>
        <ToastContainer />
        <div className='profileContainer'>
          {!changePassword && <h1 className='profileText'>My Profile</h1>}
          <form onSubmit={handleSubmit} className='profileForm'>
            <label htmlFor="username">Username</label>
            <input 
              type="text" 
              placeholder='Username'
              value={user?.others.name}
              readOnly
              id='username'
              />
            <label htmlFor="id">User ID</label>
            <input 
              type="text" 
              placeholder='Id'
              value={user?.others.user_id}
              readOnly
              id='id'
              />
            {!changePassword &&
            <>
             <label htmlFor="password">Password</label>
             <input 
              type="password" 
              placeholder='Password'
              value={password}
              id='password'
              onChange={(e) => {setNewPassword(e.target.value)}}
              />
            </>
              
              }
            {changePassword && 
              <>
              
            <label htmlFor="password">Old Password</label>
            <input 
              type="password" 
              placeholder='Enter your old password'
              value={oldPassword}
              id='password'
              onChange={(e) => {setOldPassword(e.target.value)}}
              />
            <label htmlFor="password">New Password</label>
            <input 
              type="password" 
              placeholder='Enter your new password'
              value={newPassword}
              id='password'
              onChange={(e) => {setNewPassword(e.target.value)}}
              />
              </>
              
              }
            {/* {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>} */}
            {!changePassword && <p 
              className="changePassword"
              onClick={() => setChangePassword(true)}
            >Change Password</p>}
            {changePassword && <button type='submit'>Change Password</button>}
          </form>
        </div>
        <div className='profileImageContainer'>
          <img src={image} alt="Profile Image" className='profileImage'/>
        </div>
     
    </div>
  )
}

export default Profile