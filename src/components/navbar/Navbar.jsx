import { Link, NavLink } from 'react-router-dom'
import './navbar.css'
import { useGlobalContext } from '../../context/context'

const Navbar = () => {
  const {handleSidebar, hideSidebar} = useGlobalContext();
  const styles = {
    color: '#7BF6F3'
  }

  return (
    <div className='navbar'>
      <div className='barContent'>
        <i 
          className="fa-solid fa-bars"
          onClick={handleSidebar}
          ></i>
        <Link to='/' onClick={hideSidebar}>
          <h1 className='productName'>Unishare.</h1>
        </Link>
      </div>
      {/* <div className='searchBar'>
        <input type="text" className='searchInput'/>
        <button className='searchBtn'>
          <i class="fa-solid fa-magnifying-glass"></i>
        </button>
      </div> */}
      <div className='aboutAndIcon'>
        <NavLink 
          to="/about" 
          className='aboutLink'
          style={({isActive}) => isActive ? styles : {}}
          onClick={hideSidebar}
          >About</NavLink>
        <Link to="/profile"  onClick={hideSidebar}>
          <i className="userIcon fa-solid fa-circle-user"></i>
        </Link>
      </div>
    </div>
  )
}

export default Navbar