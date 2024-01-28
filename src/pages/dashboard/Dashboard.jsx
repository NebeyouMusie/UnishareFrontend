import { Link } from 'react-router-dom'
import './dashboard.css'
import { useGlobalContext } from '../../context/context'

export default function Dashboard() {
  const {hideSidebar} = useGlobalContext();

  return (
    <div className='dashboard'>
      <Link 
        className='receivedAssignmentsCard' 
        to='/received'
        onClick={hideSidebar}
        >
        <h1 className='receivedText'>RECEIVED ASSIGNMENTS</h1>
      </Link>
      <Link 
        className='yourPostsCard' 
        to='/posts'
        onClick={hideSidebar}
        >
          <h1 className='postsText'>YOUR POSTS</h1>
      </Link>
    </div>
  )
}
