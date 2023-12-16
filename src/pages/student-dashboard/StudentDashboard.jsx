import { Link } from 'react-router-dom'
import './studentDashboard.css'

export default function Dashboard() {
  return (
    <div className='studentDashboardContainer'>
      <div className='studentDashboard'>
        <Link className='announcementsCard' to='/notifications'>
            <h1 className='announcementText'>ANNOUNCEMENTS</h1>
        </Link>
        <Link className='assignmentsCard'>
          <h1 className='assignmentsText'> ASSIGNMENTS</h1>
        </Link>
        <Link className='resourcesCard'>
            <h1 className='resourcesText'>RESOURCES</h1>
        </Link>
      </div>
    </div>
  )
}
