import './layout.css'
import { Outlet } from 'react-router-dom' 
import Sidebar from '../sidebar/Sidebar'
import Navbar from '../navbar/Navbar'
import { useLayoutEffect } from 'react'
import { useGlobalContext } from '../../context/context'

const Layout = () => {
  const {hideSidebar} = useGlobalContext();
  useLayoutEffect(() => {
    hideSidebar();
  }, [])
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