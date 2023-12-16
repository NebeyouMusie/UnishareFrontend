import './layout.css'
import { Outlet } from 'react-router-dom' 
import Sidebar from '../sidebar/Sidebar'
import Navbar from '../navbar/Navbar'

const Layout = () => {
  return (
    <div className='layout'>
      <Sidebar />
      <div className='rightContents'>
        <Navbar />
        <Outlet />
      </div>
    </div>
  )
}

export default Layout