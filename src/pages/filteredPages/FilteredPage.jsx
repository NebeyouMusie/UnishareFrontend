import { useEffect, useState } from "react";
import "./filteredPage.css";
import axios from "axios";
import useSWR, { mutate } from "swr";
import moment from "moment";
import { useGlobalContext } from "../../context/context";
import { useLocation } from "react-router-dom";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const Notifications = () => {
  const location = useLocation();
  console.log(location)
  const { data, error, isLoading } = useSWR(
    "https://unishare-backend.vercel.app/api/post/get",
    fetcher
  ); // https://unishare-backend.vercel.app/api/post/get
  const { user } = useGlobalContext();
  // let posts = data?.data;
  const posts = data?.data.filter(post => {
    if(location.pathname === "/announcements"){
        return "Announcement" === post.postType;
    }else if(location.pathname === "/assignments"){
        return "Assignment" === post.postType;
    }else if(location.pathname === "/resources"){
        return "Resource" === post.postType;
    }else{
        return "Score" === post.postType;
    }
  });
  console.log(data);
  console.log(posts);
  console.log(user);

  console.log(data);
  const [showPostDescription, setShowPostDescription] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const selectedPost = posts?.find((post) => post._id === selectedPostId);

  console.log(selectedPost);
  
  // states for the search functionality
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [resultDisplay, setResultDisplay] = useState(false);

  console.log(results);


  function fetchData(value){

    const results = posts.filter(post => {

        return value && post && post.course && post.course.toLowerCase().includes(value);
    })
   
    setResults(results);

  }

  function handleChange(value){
    setResultDisplay(false);
    setInput(value);
    fetchData(value);
  }

  const handleSubmit = (e, input) => {
    e.preventDefault();
    fetchData(input);
    if(results?.length === 0){
      setResultDisplay(true);
    }else{
      setResultDisplay(false);
    }
  };




  return (
    <div className="notifications">
      <div className="recentNotifications">
        <div className="filterSystem">
          <div className="searchFilter">
            <form onSubmit={(e) => handleSubmit(e, input)} className="searchForm">
              <input
                type="text"
                placeholder="Search course"
                className="searchInput"
                value={input}
                onChange={(e) => handleChange(e.target.value)}
              />
              <button className="searchButton">
                <i className="fa-solid fa-magnifying-glass"></i>
              </button>
            </form>
          </div>
        </div>
        {error && <div>Failed to load posts</div>}
        {resultDisplay ? 
              <h2 className='resultDisplayMessage'>No results for "{input}"</h2> 
              : 
            
              posts?.length > 0 ? (
                (results?.length > 0 ? results : [...posts]).reverse().map((post) =>  
                (
                  <div
                    className="notificationCard"
                    key={post._id}
                    onClick={() => {
                      setShowPostDescription(true);
                      setSelectedPostId(post._id);
                    }}
                  >
                    <div className="topContent">
                      <p className="notificationType">{post.postType}</p>
                      <p className="notificationTime">
                        {moment(post.createdAt).fromNow()}
                      </p>
                    </div>
                    <p className="notificationCourseName">{post.course}</p>
                    <p className="notificationTitle">{post.title}</p>
                    <p className="notificationDescription">{post.description}</p>
                  </div>
                ))
              ) : (
                <div className="noNotificationsMessage">
                  <h1 className="noNotificationtext">
                    {`You don't have any ${location.pathname.slice(1)}`}
                  </h1>
                </div>
              )
              
        
        }
      </div>

      <div className="notificationForm">
        {showPostDescription ? (
          <div className="notificationDetail">
            {selectedPost && (
              <div className="notificationDetails">
                <h2 className="selectedNotificationTitle">
                  {selectedPost.title}
                </h2>
                <p className="selectedNotificationType">
                  Type: {selectedPost.postType}
                </p>
                <p className="selectedNotificationTime">
                  Posted: {moment(selectedPost.createdAt).fromNow()}
                </p>
                <p className="selectedNotificationTime">
                  Course: {selectedPost.course}
                </p>
                {selectedPost.file && <div>
                    <a
                      href={selectedPost.file}
                      download
                      target="_blank"
                      className="submittedFile"
                    >
                      <i className="fa-solid fa-download"></i>
                      <p>Download File</p>
                    </a>
                  </div>}
                <p className="selectedNotificationDescription">
                  Description: {selectedPost.description}
                </p>
                {/* Add more details as needed */}
              </div>
            )}
          </div>
        ) : (
            posts?.length > 0
             ? 
            (<h1 className="clickMessage">
            Click one of the notification cards to see more
            </h1>) : 
           ( <div className="noNotificationsMessage">
                  <h1 className="noNotificationtext">
                  {`You don't have any ${location.pathname.slice(1)} to click`}
                  </h1>
              </div>)
          
        )}
      </div>
    </div>
  );
};

export default Notifications;
