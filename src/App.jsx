import {createBrowserRouter, createRoutesFromElements, RouterProvider, Route} from "react-router-dom"
import Layout from "./components/layout/Layout";
import Login from "./pages/login/Login";
import Dashboard from "./pages/dashboard/Dashboard"
import StudentDasboard from "./pages/student-dashboard/StudentDashboard"
import Posts from "./pages/posts/Posts";
import { useGlobalContext } from "./context/context";
import Notifications from "./pages/notifications/Notifications";
import About from "./pages/about/About";
import Received from "./pages/received/Received";
import Submissions from "./pages/submissions/Submissions";

export default function App() {
  const {user} = useGlobalContext();
  console.log(user);
  const router = createBrowserRouter(createRoutesFromElements(
    <>
      <Route path="/" element={user ? <Layout /> : <Login />}>
        <Route index element={user ? (user.others.role === "instructor" ? <Dashboard /> : <StudentDasboard />) : <Login /> }/>
        <Route path="/posts" element={<Posts />}/>
        <Route path="/notifications" element={<Notifications />}/>
        <Route path="/received" element={<Received />}/>
        <Route path="/submissions" element={<Submissions />}/>
        <Route path="/about"element={<About />}/>
      </Route>
      <Route path="/login" element={user ? (user.others.role === "instructor" ? <Dashboard/> : <StudentDasboard />) : <Login />}/>
    </>
  ));

  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  )
}
