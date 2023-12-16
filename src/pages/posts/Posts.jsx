import { useEffect, useState } from 'react'
import './posts.css'
import axios from 'axios';
import useSWR, { mutate } from 'swr';
import moment from 'moment';
import { useGlobalContext } from '../../context/context';

const fetcher = url => axios.get(url).then(res => res.data);

const Posts = () => {

  const {data, error, isLoading} = useSWR('https://unishare-backend.vercel.app/api/post/get', fetcher);
  const {user} = useGlobalContext();
  let posts = data?.data.filter((post) => {
    return post.username === user.others.name;
  })
  console.log(user);
  
  console.log(posts);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [postMessage, setPostMessage] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [postType, setPostType] = useState("Announcement");

  const [showPostDescription, setShowPostDescription] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const selectedPost = posts?.find(post => post._id === selectedPostId);

  const styles = {
    background: errorMessage ? 'red': 'green' 
  }

  // useEffect(() => {
  //   setPosts(prevPost => prevPost.filter((post) => {
  //     return post.username === user.others.name;
  //   }));
  // }, [posts]);
  console.log(user.others.course)
  const handleSubmit = async (e) => {

  
      e.preventDefault();

      try{
        const response = await axios.post('https://unishare-backend.vercel.app/api/post/add', {
          title,
          description,
          postType,
          username: user.others.name,
          course: user.others.course,
        }, {withCredentials: true});
        // setPosts(prevPost => prevPost?.filter((post) => {
        //   return post.username === user.others.name;
        // }));

        console.log(response.data);
        setPostMessage(true);
        setSuccessMessage(response.data.msg);
        setErrorMessage(""); // Clear any previous error messages
        setTitle("");
        setDescription("");
        mutate('https://unishare-backend.vercel.app/api/post/get');
      } catch(err) {
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
          console.log('Error', err.message);
        }
      }
      // finally{
        
      //   setPostType("");
      //   setPostMessage("");
      //   setErrorMessage("");
      //   setSuccessMessage("");
      // }

  }
 
  useEffect(() => {
    const timeId = setTimeout(() => {
      setPostMessage(false);
    }, 3000);

    return () => clearTimeout(timeId);      

  }, [postMessage]);

  return (
    <div className='posts'>
      <div className='recentPosts'>
      {error && <div>Failed to load posts</div>}
      {posts?.length > 0 ? [...posts].reverse().map(post => (
        <div 
          className='postCard' 
          key={post._id}
          onClick={() => {
            setShowPostDescription(true);
            setSelectedPostId(post._id);
          }}
          >
          <div className='topContent'>
            <p className='postType'>{post.postType}</p>
            <p className='posttime'>{moment(post.createdAt).fromNow()}</p>
          </div>
          
          <p className='postTitle'>{post.title}</p>
          <p className='postDescription'>{post.description}</p>
        </div>
      )):
        (<div className='noPostMessage'>
          <h1 className='noPosttext'>You don't have any posts</h1>
        </div>)
      }
    </div>
      <div className='postForm'>
        {postMessage && 
        <div 
          style={styles}
          className={`${postMessage ? "postMessage displayPostMessage": "postMessage"}`}>
            {errorMessage ? errorMessage : successMessage}
          
        </div>
        }
        
        {
        showPostDescription 
            ? 
        ( <div className='postDetail'>
           {selectedPost && (
            <>
              <div className='postDetails'>
                <h2 className='selectedPostTitle'>{selectedPost.title}</h2>
                <p className='selectedPostType'>Type: {selectedPost.postType}</p>
                <p className='selectedPostTime'>Posted: {moment(selectedPost.createdAt).fromNow()}</p>
                <p className='selectedPostDescription'>Description: {selectedPost.description}</p>
                {/* Add more details as needed */}
              </div>
              
            </>
          )}
        <button 
          onClick={() => setShowPostDescription(false)}
          className='returnButton'
          >Back to Submission</button>
      </div>) 
        :
        (        
    <form onSubmit={handleSubmit}>
        <div className='postFile'>
          <p>Select post type</p>
          <div className='chooseFile'>
            {postType !== 'Announcement'  && <label htmlFor="postFile">
              <i class="fa-solid fa-file-circle-plus"></i> 
            </label>}
            <input style={{display: "none"}} type="file" id='postFile'/>
            <select 
              name="posttype" 
              id="postType"
              value={postType}
              onChange={(e) => setPostType(e.target.value)}
              className='selectPostType'
              >
              <option value="Announcement">Announcement</option>
              <option value="Resource">Resource</option>
              <option value="Assignment">Assignment</option>
            </select>
          </div>
        </div>
        <div className='postTitle'>
          <p>Title</p>
          <input 
            type="text" 
            placeholder='Enter post title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            />
        </div>
        <div className='postDesc'>
          <p>Description</p>
          <textarea 
            type="text" 
            rows="4" 
            placeholder='Enter post description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            />
        </div>
       {postType === 'Assignment' && <div className='postDueDate'>
          <p>Due Date</p>
          <input type="date" />
        </div> }
        <button 
          className="postButton" 
          type='submit'
          >post</button>
      </form>)
      }

        


      </div>
    </div>
  )
}

export default Posts