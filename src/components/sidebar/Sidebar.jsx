import { NavLink } from 'react-router-dom'
import './sidebar.css'
import unishareLogo from '/src/assets/Unishare-01 1.svg'
import { useGlobalContext } from '../../context/context';
import { mutate } from 'swr';
import { useEffect, useState } from 'react';
import axios from 'axios';



const Sidebar = () => {
  const [notificationAmount, setNotificationAmount] = useState(0);
  const [receivedAmount, setReceivedAmount] = useState(0); 
  console.log(notificationAmount);
  console.log(receivedAmount);
  const [count,setCount] = useState(true);
  const currentDate = new Date();
  const currentyear = currentDate.getFullYear();
  const { user, Logout, showSidebar, hideSidebar } = useGlobalContext();
  console.log(user);

  const style = {
    color: "white",
    background: "#046E5D"
  }

  const handleLogout = () => {
    Logout();
    hideSidebar();
  }

  useEffect(() => {
    const fetchAmount = async () => {
      try{
        const response1 = await axios.get("http://localhost:5000/api/assignment/getAssignment");
        console.log(response1);
        const filteredReceivedAmount = response1?.data.data.filter(post => post.course === user.others.course)?.length;
        setReceivedAmount(filteredReceivedAmount);
        const response2 = await axios.get("http://localhost:5000/api/post/get");
        console.log(response2);
        const filteredAssignmentAmount = response2?.data.data.filter(post => post.course === user.others.course)?.length;
        setNotificationAmount(filteredAssignmentAmount);
        mutate("http://localhost:5000/api/assignment/getAssignment");
        mutate("http://localhost:5000/api/post/get");
      }catch(err){
        console.log(err);
      }
    }
    fetchAmount();
  }, []);

  const handleClick = () => {
    hideSidebar();
    setCount(false);
  }

  return (
    <div className={`sidebar ${showSidebar ? 'show' : ''}`}>
      <div className='logoAndText'>
        <img src={unishareLogo} alt="Unishare Logo" className='unishareLogo'/>
        <p className='greeting'>Hello 👋,</p>
        <p className='userName'>{user.others.name}</p>
      </div>
      <div className='navigationButtons'>
          <NavLink 
            to='/' 
            className='navigationBtn'
            style={({isActive}) => isActive ? style : null}
            onClick={hideSidebar}
            >Dashboard</NavLink>
          <NavLink
            to={`${user.others.role === "instructor" ? '/received' : 'notifications'}`}
            style={({isActive}) => isActive ? style : null}
            className='navigationBtn'
            onClick={handleClick}
          >{`${user.others.role === "instructor" ? "Received" : "Notifications"}`}
            {count && <div className='notificationCount'>{user.others.role === "instructor" ? receivedAmount : notificationAmount}</div>}
          </NavLink>
          <NavLink
            to={`${user.others.role === "instructor" ? "posts" : "submissions"}`}
            className='navigationBtn'
            style={({isActive}) => isActive ? style : null}
            onClick={hideSidebar}
          >{`${user.others.role === "instructor" ? "Posts" : "Submissions"}`}</NavLink>
      </div>
      <div className='sidebarBottom'>
        <button 
          className='logoutBtn'
          onClick={handleLogout}
          >Log out</button>
        <p className='copyrightText'>Copyright © {currentyear}</p>
      </div>
    </div>
  )
}

export default Sidebar