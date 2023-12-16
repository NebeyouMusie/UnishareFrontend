import { NavLink } from 'react-router-dom'
import './sidebar.css'
import unishareLogo from '/src/assets/Unishare-01 1.svg'
import { useGlobalContext } from '../../context/context';

const Sidebar = () => {
  const currentDate = new Date();
  const currentyear = currentDate.getFullYear();
  const { user, Logout } = useGlobalContext();
  console.log(user);

  const style = {
    color: "white",
    background: "#046E5D"
  }


  return (
    <div className='sidebar'>
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
            >Dashboard</NavLink>
          <NavLink
            to={`${user.others.role === "instructor" ? '/received' : '/notifications'}`}
            style={({isActive}) => isActive ? style : null}
            className='navigationBtn'
          >{`${user.others.role === "instructor" ? "Received" : "Notifications"}`}</NavLink>
          <NavLink
            to={`${user.others.role === "instructor" ? "posts" : "submissions"}`}
            className='navigationBtn'
            style={({isActive}) => isActive ? style : null}
          >{`${user.others.role === "instructor" ? "Posts" : "Submissions"}`}</NavLink>
      </div>
      <div className='sidebarBottom'>
        <button 
          className='logoutBtn'
          onClick={Logout}
          >Log out</button>
        <p className='copyrightText'>Copyright © {currentyear}</p>
      </div>
    </div>
  )
}

export default Sidebar