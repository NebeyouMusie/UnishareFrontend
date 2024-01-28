import { useEffect, useState } from "react";
import "./notifications.css";
import axios from "axios";
import useSWR, { mutate } from "swr";
import moment from "moment";
import { useGlobalContext } from "../../context/context";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const Notifications = () => {
  const { data, error } = useSWR(
    "https://unishare-backend.vercel.app/api/post/get",
    fetcher,
    { refreshInterval: 5000 } // Poll every 5 seconds
  ); // https://unishare-backend.vercel.app/api/post/get
  const { user } = useGlobalContext();
  // let posts = data?.data;
  const [posts, setPosts] = useState([]);
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

  // State for the type filter
  const [typeFilter, setTypeFilter] = useState("All");
  console.log(typeFilter);

  useEffect(() => {
    if (data && data.data) {
      setPosts(data.data);
    }
  }, [data]);

  function fetchData(value) {
    const results = posts.filter((post) => {
      return (
        value &&
        post &&
        post.course &&
        post.course.toLowerCase().includes(value)
      );
    });

    setResults(results);
  }

  function handleChange(value) {
    setResultDisplay(false);
    setInput(value);
    fetchData(value);
  }

  const handleSubmit = (e, input) => {
    e.preventDefault();
    fetchData(input);
    if (results?.length === 0) {
      setResultDisplay(true);
    } else {
      setResultDisplay(false);
    }
  };

  const handleFilterChange = (type) => {
    setTypeFilter(type);
    if (
      typeFilter === "All" ||
      typeFilter === "Resource" ||
      typeFilter === "Assignment" ||
      typeFilter === "Announcement" ||
      typeFilter === "Score"
    ) {
      setPosts([...data?.data]);
    }
    setPosts((posts) =>
      [...posts].filter((post) => {
        if (type === "All") {
          return true;
        } else {
          return type === post.postType;
        }
      })
    );

    console.log(posts.length);
  };

  return (
    <div className="notifications">
      <div className="recentNotifications">
        <div className="filterSystem">
          <div className="searchFilter">
            <form
              onSubmit={(e) => handleSubmit(e, input)}
              className="searchForm"
            >
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
          <div className="filterButtons">
            <button
              className={typeFilter === "All" ? "selected" : ""}
              onClick={() => handleFilterChange("All")}
            >
              All
            </button>
            <button
              className={typeFilter === "Resource" ? "selected" : ""}
              onClick={() => handleFilterChange("Resource")}
            >
              Resources
            </button>
            <button
              className={typeFilter === "Assignment" ? "selected" : ""}
              onClick={() => handleFilterChange("Assignment")}
            >
              Assignments
            </button>
            <button
              className={typeFilter === "Announcement" ? "selected" : ""}
              onClick={() => handleFilterChange("Announcement")}
            >
              Announcements
            </button>
            <button
              className={typeFilter === "Score" ? "selected" : ""}
              onClick={() => handleFilterChange("Score")}
            >
              Scores
            </button>
          </div>
        </div>
        {error && <div>Failed to load posts</div>}
        {resultDisplay ? (
          <h2 className="resultDisplayMessage">No results for "{input}"</h2>
        ) : posts?.length > 0 ? (
          (results?.length > 0 ? results : [...posts])
            .sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt))
            .reverse()
            .map((post) => (
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
                {post.updatedAt > post.createdAt && (
                  <p className="postEditedText">edited</p>
                )}
              </div>
            ))
        ) : (
          <div className="noNotificationsMessage">
            <h1 className="noNotificationtext">
              {`You don't have any ${
                typeFilter === "All" ? "Notifications" : typeFilter + "s"
              }`}
            </h1>
          </div>
        )}
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
                  <span>Type:</span> {selectedPost.postType}
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <p className="selectedNotificationTime">
                    <span>Posted:</span>{" "}
                    {moment(selectedPost.createdAt).fromNow()}
                  </p>
                  {selectedPost.updatedAt > selectedPost.createdAt && (
                    <p className="postDetailEditedText">edited</p>
                  )}
                </div>
                <p className="selectedNotificationTime">
                  <span>Course:</span> {selectedPost.course}
                </p>
                {selectedPost.date && (
                  <p className="selectedPostDueDate">
                    <span>Due date: </span>
                    {selectedPost.date}
                  </p>
                )}
               
                {selectedPost.file && (
                  <div>
                    <a
                      href={selectedPost.file}
                      download
                      target="_blank"
                      className="submittedFile"
                    >
                      <i className="fa-solid fa-download"></i>
                      <p>Download File</p>
                    </a>
                  </div>
                )}
                <p className="selectedNotificationDescription">
                  Description: {selectedPost.description}
                </p>
                {/* Add more details as needed */}
              </div>
            )}
          </div>
        ) : posts?.length > 0 ? (
          <h1 className="clickMessage">
            Click one of the notification cards to see more
          </h1>
        ) : (
          <div className="noNotificationsMessage">
            <h1 className="noNotificationtext">
              {`You don't have any ${
                typeFilter === "All" ? "Notifications" : typeFilter + "s"
              } to click`}
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
