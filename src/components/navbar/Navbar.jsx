import { Link, NavLink } from 'react-router-dom'
import './navbar.css'

const Navbar = () => {
  const styles = {
    color: '#7BF6F3'
  }

  return (
    <div className='navbar'>
      <Link to='/'>
        <h1 className='productName'>Unishare.</h1>
      </Link>
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
          >About</NavLink>
        <i className="userIcon fa-solid fa-circle-user"></i>
      </div>
    </div>
  )
}

export default Navbar