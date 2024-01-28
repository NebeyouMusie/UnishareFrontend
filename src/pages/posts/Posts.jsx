import { useEffect, useState } from "react";
import "./posts.css";
import axios from "axios";
import useSWR, { mutate } from "swr";
import moment from "moment";
import { useGlobalContext } from "../../context/context";
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAlFnUux7ghs2lWoQZwSuZBBerbPMCERfo",
  authDomain: "unishare-ff82b.firebaseapp.com",
  projectId: "unishare-ff82b",
  storageBucket: "unishare-ff82b.appspot.com",
  messagingSenderId: "473383955964",
  appId: "1:473383955964:web:aec2a659a495522fc6d679",
  measurementId: "G-YH482ZBHF1",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const fetcher = (url) => axios.get(url).then((res) => res.data);

const Posts = () => {
  const { data, error, isLoading } = useSWR(
    "https://unishare-backend.vercel.app/api/post/get",
    fetcher
  ); // https://unishare-backend.vercel.app/api/post/get
  const { user } = useGlobalContext();
  let posts = data?.data.filter((post) => {
    return post.username === user.others.name;
  });
  console.log(user);

  console.log(posts);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [postMessage, setPostMessage] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [postType, setPostType] = useState("Announcement");
  const [file, setFile] = useState({});
  const [dueDate, setDueDate] = useState("");
  const [showPostDescription, setShowPostDescription] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [editPost, setEditPost] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const selectedPost = posts?.find((post) => post._id === selectedPostId);
  const [editedPostIds, setEditedPostIds] = useState(
    JSON.parse(localStorage.getItem("editedIds")) || []
  );
  const styles = {
    background: errorMessage ? "red" : "green",
  };

  console.log(user.others.course);

  // states for the search functionality
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [resultDisplay, setResultDisplay] = useState(false);

  console.log(results);

  function fetchData(value) {
    const results = posts.filter((post) => {
      return (
        (value &&
          post &&
          post.title &&
          post.title.toLowerCase().includes(value)) ||
        (value &&
          post &&
          post.postType &&
          post.postType.toLowerCase().includes(value))
      );
    });

    setResults(results);
  }

  function handleChange(value) {
    setResultDisplay(false);
    setInput(value);
    fetchData(value);
  }

  const handleSearchSubmit = (e, input) => {
    e.preventDefault();
    fetchData(input);
    if (results?.length === 0) {
      setResultDisplay(true);
    } else {
      setResultDisplay(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editPost && selectedPost) {
      try {
        const storageRef = ref(storage, `posts/${file[0].name}`);
        const uploadTask = uploadBytesResumable(storageRef, file[0]);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Calculate the progress percentage
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            setUploadProgress(progress);
          },
          (error) => {
            // Handle unsuccessful uploads
            console.error("Upload failed:", error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                console.log("File available at", downloadURL);

                // Store the download URL in your MongoDB database
                const response = await axios.put(
                  `https://unishare-backend.vercel.app/api/post/update/${selectedPostId}`, // Replace with your actual update endpoint
                  {
                    title,
                    description,
                    postType,
                    date: dueDate,
                    file: downloadURL,
                    // Include any other fields that need to be updated
                  },
                  { withCredentials: true }
                );

                setEditedPostIds((prevIds) => [...prevIds, selectedPostId]); // Add the ID of the edited post
                console.log(response.data);
                setPostMessage(true);
                setSuccessMessage(response.data.msg);
                setErrorMessage(""); // Clear any previous error messages
                setTitle("");
                setDescription("");
                setEditPost(false); // Reset edit mode
                mutate("https://unishare-backend.vercel.app/api/post/get"); // Update the SWR cache
                setUploadProgress(0);
              }
            );
          }
        );
      } catch (err) {
        setPostMessage(true);
        if (err.response) {
          setSuccessMessage("");
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
          setErrorMessage(err.response.data.msg); // Set the error message
        } else if (err.request) {
          console.log(err.request);
        } else {
          console.log("Error", err.message);
        }
      }
    } else {
      try {
        const storageRef = ref(storage, `posts/${file[0].name}`);
        const uploadTask = uploadBytesResumable(storageRef, file[0]);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Calculate the progress percentage
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
            setUploadProgress(progress);
          },
          (error) => {
            // Handle unsuccessful uploads
            console.error("Upload failed:", error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(
              async (downloadURL) => {
                console.log("File available at", downloadURL);

                // Store the download URL in your MongoDB database
                const response = await axios.post(
                  "https://unishare-backend.vercel.app/api/post/add",
                  {
                    //https://unishare-backend.vercel.app/api/post/add
                    title,
                    description,
                    postType,
                    username: user.others.name,
                    course: user.others.course,
                    date: dueDate,
                    file: downloadURL,
                  },
                  { withCredentials: true }
                );
                console.log(response.data);
                setPostMessage(true);
                setSuccessMessage(response.data.msg);
                setErrorMessage(""); // Clear any previous error messages
                setTitle("");
                setDescription("");
                mutate("https://unishare-backend.vercel.app/api/post/get"); // https://unishare-backend.vercel.app/api/post/get
                setUploadProgress(0);
              }
            );
          }
        );

        // setPosts(prevPost => prevPost?.filter((post) => {
        //   return post.username === user.others.name;
        // }));
      } catch (err) {
        setPostMessage(true);
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          setSuccessMessage("");
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
          setErrorMessage(err.response.data.msg); // Set the error message
        } else if (err.request) {
          // The request was made but no response was received
          console.log(err.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", err.message);
        }
      }
    }
  };

  const handlecBackToSubmission = () => {
    setShowPostDescription(false);
    setEditPost(false);
    setTitle("");
    setDescription("");
  };

  const handleEdit = (selectedPost) => {
    setEditPost(true);
    setShowPostDescription(false);
    setTitle(selectedPost.title);
    setDescription(selectedPost.description);
    setPostType(selectedPost.postType);
    setDueDate(selectedPost.date);
  };

  useEffect(() => {
    const timeId = setTimeout(() => {
      setPostMessage(false);
    }, 3000);

    localStorage.setItem("editedIds", JSON.stringify(editedPostIds));

    return () => clearTimeout(timeId);
  }, [postMessage, editedPostIds]);

  return (
    <div className="posts">
      <div className="recentPosts">
        <div className="searchFilter">
          <form
            onSubmit={(e) => handleSearchSubmit(e, input)}
            className="searchForm"
          >
            <input
              type="text"
              placeholder="Search title or post type..."
              className="searchInput"
              value={input}
              onChange={(e) => handleChange(e.target.value)}
            />
            <button className="searchButton">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </form>
        </div>
        {/* {error && <div>Failed to load posts</div>} */}
        {resultDisplay ? (
          <h2 className="resultDisplayMessage">No results for "{input}"</h2>
        ) : posts?.length > 0 ? (
          (results?.length > 0 ? results : [...posts])
            .sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt))
            .reverse()
            .map((post) => (
              <div
                className="postCard"
                key={post._id}
                onClick={() => {
                  setShowPostDescription(true);
                  setSelectedPostId(post._id);
                }}
              >
                <div className="topContent">
                  <p className="postType">{post.postType}</p>
                  <p className="posttime">{moment(post.updatedAt).fromNow()}</p>
                </div>

                <p className="postTitle">{post.title}</p>
                <p className="postDescription">{post.description}</p>
                {editedPostIds.includes(post._id) && (
                  <p className="postEditedText">edited</p>
                )}
              </div>
            ))
        ) : (
          <div className="noPostMessage">
            <h1 className="noPosttext">You don't have any posts</h1>
          </div>
        )}
      </div>
      <div className="postForm">
        {postMessage && (
          <div
            style={styles}
            className={`${
              postMessage ? "postMessage displayPostMessage" : "postMessage"
            }`}
          >
            {errorMessage ? errorMessage : successMessage}
          </div>
        )}

        {showPostDescription ? (
          <div className="postDetail">
            {selectedPost && (
              <>
                <div className="postDetails">
                  <div className="selectedPostTopContent">
                    <h2 className="selectedPostTitle">{selectedPost.title}</h2>
                    <button
                      className="editPost"
                      onClick={() => handleEdit(selectedPost)}
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                      Edit
                    </button>
                  </div>
                  <p className="selectedPostType">
                    Type: {selectedPost.postType}
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <p className="selectedPostTime">
                      Posted: {moment(selectedPost.createdAt).fromNow()}
                    </p>
                    {editedPostIds.includes(selectedPost._id) && (
                      <p className="postDetailEditedText">edited</p>
                    )}
                  </div>
                  {selectedPost.date && (
                    <p className="selectedPostDueDate">
                      Due Date: {selectedPost.date}
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
                  <p className="selectedPostDescription">
                    Description: {selectedPost.description}
                  </p>
                  {/* Add more details as needed */}
                </div>
              </>
            )}
            <button onClick={handlecBackToSubmission} className="returnButton">
              Back to Submission
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="postFile">
              <p>Select post type</p>
              <div className="chooseFile">
                {postType !== "Announcement" && (
                  <label htmlFor="postFile">
                    <i class="fa-solid fa-file-circle-plus"></i>
                  </label>
                )}
                <input
                  style={{ display: "none" }}
                  type="file"
                  id="postFile"
                  onChange={(e) => setFile(e.target.files)}
                />
                <select
                  name="posttype"
                  id="postType"
                  value={postType}
                  onChange={(e) => setPostType(e.target.value)}
                  className="selectPostType"
                >
                  <option value="Announcement">Announcement</option>
                  <option value="Resource">Resource</option>
                  <option value="Assignment">Assignment</option>
                  <option value="Score">Score</option>
                </select>
              </div>
            </div>
            <div className="postTitle">
              <p>Title</p>
              <input
                type="text"
                placeholder="Enter post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="postDesc">
              <p>Description</p>
              <textarea
                type="text"
                rows="4"
                placeholder="Enter post description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            {postType === "Assignment" && (
              <div className="postDueDate">
                <p>Due Date</p>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            )}
        <div className="uploadProgress">
          {uploadProgress > 0 && (
            <p>Upload Progress: {uploadProgress.toFixed(2)}%</p>
          )}
        </div>
            {editPost ? (
              <button className="postButton" type="submit">
                Update Post
              </button>
            ) : (
              <button className="postButton" type="submit">
                Post
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default Posts;
