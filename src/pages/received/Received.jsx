import useSWR, { mutate } from "swr";
import "./received.css";
import { useGlobalContext } from "../../context/context";
import { useEffect, useLayoutEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import image from "../../assets/images/presentation management.jpg";

const fetcher = (url) => axios.get(url).then((res) => res.data);

const Received = () => {
  const { data, error, isLoading } = useSWR(
    "https://unishare-backend.vercel.app/api/assignment/getAssignment",
    fetcher
  ); // https://unishare-backend.vercel.app/api/post/get
  const { user } = useGlobalContext();
  console.log(user)
  console.log(data);
  const [posts, setPosts] = useState([]);
  const [checkedPosts, setCheckedPosts] = useState(
    JSON.parse(localStorage.getItem("checkedPosts")) || {}
  );
  const [editedPostIds, setEditedPostIds] = useState(
    JSON.parse(localStorage.getItem("editedIds")) || []
  );
  const [duePassedIds, setDuePassedIds] = useState(
    JSON.parse(localStorage.getItem("duePassedIds")) || []
  );

  // let posts = data?.data.filter((post) => {
  //   return post.username === user.others.name;
  // });

  useEffect(() => {
    mutate("https://unishare-backend.vercel.app/api/assignment/getAssignment");
    localStorage.setItem("checkedPosts", JSON.stringify(checkedPosts));
    if (data && data.data) {
      const filteredData = data.data.filter(post => post.course === user.others.course);
      setPosts(filteredData);
    }
  }, [data, checkedPosts, user.others.course]);

  // State for the type filter
  const [typeFilter, setTypeFilter] = useState("Unchecked");
  console.log(typeFilter);

  // const handleFilterChange = (type) => {
  //   setTypeFilter(type);
  //   if(typeFilter === 'Checked' || typeFilter === 'Unchecked'){
  //     setPosts([...data?.data]);
  //   }
  //   setPosts(posts => [...posts].filter(post => {
  //         if(type === ""){
  //           return true;
  //         }else{
  //           return type === post.postType;
  //         }
  //   }));

  //   console.log(posts.length);
  // }

  const handleCheckboxChange = (postId) => {
    setCheckedPosts((prevCheckedPosts) => ({
      ...prevCheckedPosts,
      [postId]: !prevCheckedPosts[postId],
    }));
  };

  const handleFilterChange = (type) => {
    setTypeFilter(type);
    // No need to setPosts here as the rendering will be handled by the filter logic below
  };

  // Filter logic based on the typeFilter state and checkedPosts state
  const filteredPosts = posts.filter((post) => {
    const isChecked = checkedPosts[post._id];
    if (typeFilter === "Checked") {
      return isChecked;
    } else if (typeFilter === "Unchecked") {
      return !isChecked;
    }
    return true; // If you have an "All" filter or similar
  });

  return (
    <div className="received">
      <div className="receivedAssignments">
        <div className="filterButtons">
          {/* <button
              className={typeFilter === "All" ? "selected" : ""}
              onClick={() => handleFilterChange("All")}>All</button> */}
          <button
            className={typeFilter === "Unchecked" ? "selected" : ""}
            onClick={() => handleFilterChange("Unchecked")}
          >
            Unchecked
          </button>
          <button
            className={typeFilter === "Checked" ? "selected" : ""}
            onClick={() => handleFilterChange("Checked")}
          >
            Checked
          </button>
        </div>
        {/* {error && (
          <div
            style={{
              color: "coral",
              textAlign: "center",
            }}
          >
            Failed to load received assignments
          </div>
        )} */}
        {filteredPosts?.length > 0 ? (
          [...filteredPosts].sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt)).reverse().map((post) => (
            <div
              className="receivedCard"
              key={post._id}
              // onClick={() => {
              //   setShowPostDescription(true);
              //   setSelectedPostId(post._id);
              // }}
            >
              <div className="topContent">
                <p className="receivedType">ASSIGNMENT</p>
                <p className="receivedTime">
                  {moment(post.updatedAt).fromNow()}
                </p>
              </div>

              {/* <p className='receivedTitle'>{post.title}</p> */}
              <p className="receivedDescription">
                Sent by: {post.username} {`(${post?.userid})`}
              </p>
              <div className="fileContainer">
                <div>
                  <a
                    href={post.file}
                    download
                    target="_blank"
                    className="receivedFile"
                  >
                    <i className="fa-solid fa-download"></i>
                    <p>Download File</p>
                  </a>
                </div>
                <input
                  type="checkbox"
                  checked={!!checkedPosts[post._id]}
                  onChange={() => handleCheckboxChange(post._id)}
                  className="receivedCheckbox"
                />
              </div>
              <div className="submissionMessages">
                {editedPostIds.includes(post._id) && (
                  <p className="submissionEditedText">edited</p>
                )}
                {duePassedIds.includes(post._id) && (
                  <p className="dueDatePassedMessage">Due date has passed</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="noReceivedMessage">
            <h1 className="noPosttext">
              You don't have any{" "}
              {typeFilter === "Checked" ? "Checked" : "Unchecked"} Assignments
            </h1>
          </div>
        )}
      </div>

      <div className="receivedImageContainer">
        <img src={image} alt="" className="receivedImage" />
      </div>
    </div>
  );
};

export default Received;
