import { Link } from 'react-router-dom'
import './studentDashboard.css'
import { useGlobalContext } from '../../context/context'

export default function Dashboard() {
  const {hideSidebar} = useGlobalContext();

  return (
    <div className='studentDashboardContainer'>
      <div className='studentDashboard'>
        <Link 
          className='announcementsCard' 
          to='/announcements'
          onClick={hideSidebar}
          >
            <h1 className='announcementText'>ANNOUNCEMENTS</h1>
        </Link>
        <Link 
          className='assignmentsCard' 
          to='/assignments'
          onClick={hideSidebar}
          >
          <h1 className='assignmentsText'>ASSIGNMENTS</h1>
        </Link>
        <Link 
          className='resourcesCard' 
          to='/resources'
          onClick={hideSidebar}
          >
            <h1 className='resourcesText'>RESOURCES</h1>
        </Link>
        <Link 
          className='scoresCard' 
          to='/scores'
          onClick={hideSidebar}
          >
            <h1 className='scoresText'>SCORES</h1>
        </Link>
      </div>
    </div>
  )
}
