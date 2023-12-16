import { useEffect, useState } from 'react'
import './notifications.css'
import axios from 'axios';
import useSWR, { mutate } from 'swr';
import moment from 'moment';
import { useGlobalContext } from '../../context/context';

const fetcher = url => axios.get(url).then(res => res.data);

const Notifications = () => {

  const {data, error, isLoading} = useSWR('https://unishare-backend.vercel.app/api/post/get', fetcher);
  const {user} = useGlobalContext();
  let posts = data?.data;
  console.log(user);
  
  console.log(data);
  const [showPostDescription, setShowPostDescription] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const selectedPost = posts?.find(post => post._id === selectedPostId);

  console.log(selectedPost);
  const handleSubmit = async (e) => {
  
      e.preventDefault();

      

  }
 

  return (
    <div className='notifications'>
      <div className='recentNotifications'>
        <div className='filterSystem'>
          <div className='searchFilter'>
            <form onSubmit={handleSubmit} className='searchForm'>
              <input type="text" placeholder='search' className='searchInput'/>
              <button className='searchButton'>
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </form>
          </div>
          <div className='filterButtons'>
            <button>All</button>
            <button>Resources</button>
            <button>Assignments</button>
            <button>Announcements</button>
          </div>

        </div>
      {error && <div>Failed to load posts</div>}
      {posts?.length > 0 ? [...posts].reverse().map(post => (
        <div 
          className='notificationCard' 
          key={post._id}
          onClick={() => {
            setShowPostDescription(true);
            setSelectedPostId(post._id);
          }}
          >
          <div className='topContent'>
            <p className='notificationType'>{post.postType}</p>
            <p className='notificationTime'>{moment(post.createdAt).fromNow()}</p>
          </div>
          <p className='notificationCourseName'>{post.course}</p>
          <p className='notificationTitle'>{post.title}</p>
          <p className='notificationDescription'>{post.description}</p>
        </div>
      )):
        (<div className='noNotificationsMessage'>
          <h1 className='noNotificationtext'>You don't have any Notifications</h1>
        </div>)
      }
    </div>


    <div className='notificationForm'>
        
        {
        showPostDescription 
            ?
        ( <div className='notificationDetail'>
           {selectedPost &&
            
              (<div className='notificationDetails'>
                <h2 className='selectedNotificationTitle'>{selectedPost.title}</h2>
                <p className='selectedNotificationType'>Type: {selectedPost.postType}</p>
                <p className='selectedNotificationTime'>Posted: {moment(selectedPost.createdAt).fromNow()}</p>
                <p className='selectedNotificationTime'>Course: {selectedPost.course}</p>
                <p className='selectedNotificationDescription'>Description: {selectedPost.description}</p>
                {/* Add more details as needed */}
              </div>)
              
           }
      </div>) : 

    (<h1 className='clickMessage'>Click one of the notification cards to see more</h1>)
       
      }

      </div>
    </div>
  )
}

export default Notifications