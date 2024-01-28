import { useEffect, useLayoutEffect, useState } from "react";
import "./submissions.css";
import axios from "axios";
import useSWR, { mutate } from "swr";
import moment from "moment";
import { useGlobalContext } from "../../context/context";
import { useDropzone } from "react-dropzone";
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

const Submissions = () => {
  const { data, error, isLoading } = useSWR(
    "https://unishare-backend.vercel.app/api/assignment/getAssignment",
    fetcher
  ); // https://unishare-backend.vercel.app/api/post/get
  const { data: instructorPost } = useSWR(
    "https://unishare-backend.vercel.app/api/post/get", //http://localhost:5000/
    fetcher
  );

  console.log(instructorPost?.data);
  const assignment = instructorPost?.data.filter((post) => {
    return post.postType === "Assignment";
  });

  console.log(assignment);
  const { user } = useGlobalContext();
  let posts = data?.data.filter((post) => {
    return post.username === user.others.name;
  });
  console.log(user);

  console.log(posts);
  const [currentGlobalTime, setCurrentGlobalTime] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [postMessage, setPostMessage] = useState(false);
  const [courseName, setCourseName] = useState("Select Course");
  const [file, setFile] = useState({});
  const [editedPostIds, setEditedPostIds] = useState(
    JSON.parse(localStorage.getItem("editedIds")) || []
  );
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [editPost, setEditPost] = useState(false);
  const selectedPost = posts?.find((post) => post._id === selectedPostId);

  // states for the search functionality
  const [input, setInput] = useState("");
  const [results, setResults] = useState([]);
  const [resultDisplay, setResultDisplay] = useState(false);
  const [duePassedIds, setDuePassedIds] = useState(
    JSON.parse(localStorage.getItem("duePassedIds")) || []
  );

  console.log(results);

  // State for the type filter
  const [typeFilter, setTypeFilter] = useState("All");
  console.log(typeFilter);
  const [uploadProgress, setUploadProgress] = useState(0);


  const assignmentDueDate = assignment?.find(
    (post) => post.course === courseName
  )?.date;

  // const assignemntCourseName = assignment?.find(

  // )?.course;

  console.log(assignmentDueDate);

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

  const handleSearchSubmit = (e, input) => {
    e.preventDefault();
    fetchData(input);
    if (results?.length === 0) {
      setResultDisplay(true);
    } else {
      setResultDisplay(false);
    }
  };

  const styles = {
    background: errorMessage ? "red" : "green",
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept:
      "application/pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    onDrop: (acceptedFiles) => {
      console.log(acceptedFiles[0]);
      console.log(isDragActive);
      setFile(acceptedFiles);
    },
  });

  useLayoutEffect(() => {
    async function getCurrentGlobalTime() {
      try {
        const response = await axios.get(
          "https://worldtimeapi.org/api/timezone/Etc/UTC"
        );
        setCurrentGlobalTime(response.data.utc_datetime);
        console.log(response.data.utc_datetime);
        return new Date(response.data.utc_datetime);
      } catch (error) {
        console.error("Error fetching current global time:", error);
        return null;
      }
    }

    getCurrentGlobalTime();
  }, []);

  console.log(user.others.course);
  const handleSubmit = async (e) => {
    e.preventDefault();

    // const dueAssignments = instructorPost?.data.filter((post) => new Date(post.date) < new Date(currentGlobalTime));
    // const dueAssignmentIds = dueAssignments?.map((post) => post._id);
    // setDuePassedIds(dueAssignmentIds);
    // console.log(dueAssignmentIds)

    if (new Date(currentGlobalTime) > new Date(assignmentDueDate)) {
      setDuePassedIds((prevIds) => [...prevIds, selectedPostId]);
    }

    if (editPost && selectedPost) {
      try {
        // const formData = new FormData();
        // formData.append("file", file[0]);
        // formData.append("course", courseName);
        

        // Upload the file to Firebase Storage
        const storageRef = ref(storage, `assignments/${file[0].name}`);
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
                  `https://unishare-backend.vercel.app/api/assignment/EditAssignment/${selectedPostId}`, // Replace with your actual update endpoint
                  {
                    course: courseName,
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
                setFile("");
                setCourseName("");
                setEditPost(false); // Reset edit mode
                mutate("https://unishare-backend.vercel.app/api/assignment/getAssignment"); // Update the SWR cache
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
        // const formData = new FormData();
        // formData.append("file", file[0]);
        // formData.append("course", courseName);
        // formData.append("username", user.others.name);

        // Upload the file to Firebase Storage
        const storageRef = ref(storage, `assignments/${file[0].name}`);
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
                  "https://unishare-backend.vercel.app/api/assignment/submitAssignment",
                  {
                    course: courseName,
                    file: downloadURL, // Store the download URL, not the file name
                    username: user.others.name,
                    userid: user.others.user_id
                  },
                  { withCredentials: true }
                );

                console.log(response.data);
                setPostMessage(true);
                setSuccessMessage(response.data.msg);
                setErrorMessage(""); // Clear any previous error messages
                setCourseName("Select Course");
                setFile("");
                mutate("https://unishare-backend.vercel.app/api/assignment/getAssignment"); // https://unishare-backend.vercel.app/api/post/get
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

  const handleEdit = (post) => {
    setEditPost(true);
    setSelectedPostId(post._id);
    setFile(post.file);
    setCourseName(post.course);
  };

  useEffect(() => {
    const timeId = setTimeout(() => {
      setPostMessage(false);
    }, 3000);

    localStorage.setItem("editedIds", JSON.stringify(editedPostIds));
    localStorage.setItem("duePassedIds", JSON.stringify(duePassedIds));

    return () => clearTimeout(timeId);
  }, [postMessage]);

  console.log(file[0]?.name);

  return (
    <div className="submissions">
      <div className="recentSubmissions">
        <div className="searchFilter">
          <form
            onSubmit={(e) => handleSearchSubmit(e, input)}
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
        {error && <div>Failed to load posts</div>}
        {resultDisplay ? (
          <h2 className="resultDisplayMessage">No results for "{input}"</h2>
        ) : posts?.length > 0 ? (
          (results?.length > 0 ? results : [...posts])
            .sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt))
            .reverse()
            .map((post) => (
              <div className="submissionCard" key={post._id}>
                <div className="topContent">
                  <p className="submissionType">ASSIGNMENT</p>
                  <p className="submissionTime">
                    {moment(post.updatedAt).fromNow()}
                  </p>
                </div>

                <p className="submissionCourse">{post.course}</p>
                <div className="fileContainer">
                  <div>
                    <a
                      href={post.file}
                      download
                      target="_blank"
                      className="submittedFile"
                    >
                      <i className="fa-solid fa-download"></i>
                      <p>Download File</p>
                    </a>
                  </div>
                  <button
                    className="editSubmission"
                    onClick={() => handleEdit(post)}
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                    Edit
                  </button>
                </div>
                <div className="messages">
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
          <div className="noSubmissionMessage">
            <h1 className="noSubmissiontext">You don't have any submissions</h1>
          </div>
        )}
      </div>
      <div className="submissionForm">
        {postMessage && (
          <div
            style={styles}
            className={`${
              postMessage
                ? "submissionMessage displaySubmissionMessage"
                : "submissionMessage"
            }`}
          >
            {errorMessage ? errorMessage : successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="submissionContainer">
            <p>Select Course Name</p>
            <div className="selectCourse">
              <select
                name="submissionType"
                id="submissionType"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="selectPostType"
              >
                <option value="Select course">Select course...</option>
                <option value="Introduction to Software Engineering(CoSc3311)">
                  Introduction to Software Engineering(CoSc3311)
                </option>
                <option value="Applied Numerical Analysis(Math3221)">
                  Applied Numerical Analysis(Math3221)
                </option>
                <option value="Discrete Mathematics and Combinatory(Math2231)">
                  Discrete Mathematics and Combinatory(Math2231)
                </option>
                <option value="Computer Networking & Data Communication(CoSc3211)">
                  Computer Networking & Data Communication(CoSc3211)
                </option>
                <option value="Advanced Database Systems(CoSc3011)">
                  Advanced Database Systems(CoSc3011)
                </option>
                <option value="Data Structures and Algorithms(CoSc3111)">
                  Data Structures and Algorithms(CoSc3111)
                </option>
              </select>
            </div>
            <p className="uploadText">Upload your work</p>
            <div {...getRootProps()} style={{}} className="dragNDropZone">
              <p className="dragText">
                Drag 'n' drop some files here, or click the file icon to select
                your work
              </p>
              <input {...getInputProps()} />
              <label htmlFor="submitFile">
                <i class="fa-solid fa-file-circle-plus"></i>
              </label>
            </div>

            {file.length > 0 && <div className="file">{file[0].name}</div>}
          </div>
          <div className="uploadProgress">
          {uploadProgress > 0 && (
            <p>Upload Progress: {uploadProgress.toFixed(2)}%</p>
          )}
        </div>

          {editPost ? (
            <button className="submitButton" type="submit">
              Update Submission
            </button>
          ) : (
            <button className="submitButton" type="submit">
              Submit
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default Submissions;
