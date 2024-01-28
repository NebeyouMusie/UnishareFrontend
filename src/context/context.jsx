import { createContext, useContext, useEffect, useReducer, useState } from "react"
import reducer from "./reducer";


const Context = createContext();


export const ContextProvider = ({children}) => {
  const INITIAL_STATE = {
    user: JSON.parse(localStorage.getItem("user")) || null,
    isFetching: false,
    error: false,
  };
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [showSidebar, setShowSidebar] = useState(true);

  const handleSidebar = () => {
    setShowSidebar(!showSidebar);
  }

  const hideSidebar = () => {
    setShowSidebar(false);
  }
  const LoginStart = (userCredentials) => {
    dispatch({ type: "LOGIN_START" })
  };
  
  
  const LoginSuccess = (user) => {
    dispatch({ type: "LOGIN_SUCCESS", payload: user })
  };
  
  const LoginFailure = () => {
    dispatch({ type: "LOGIN_FAILURE" })
  };

  const Logout = () => {
    dispatch({ type: "LOGOUT" })
  };


  const UpdateStart = (userCredentials) => {
    dispatch({ type: "UPDATE_START" })
  };
  
  
  const UpdateSuccess = (user) => {
    dispatch({ type: "UPDATE_SUCCESS", payload: user })
  };
  
  const UpdateFailure = () => {
    dispatch({ type: "UPDATE_FAILURE" })
  };

  const DeleteUser = () => {
    dispatch({ type: "DELETE_USER" })
  };

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
  }, [state.user]);

   return (
    <Context.Provider value={{
      user: state.user,
      isFetching: state.isFetching,
      error: state.error,
      LoginStart,
      LoginSuccess,
      LoginFailure,
      Logout,
      UpdateStart,
      UpdateFailure,
      UpdateSuccess,
      DeleteUser,
      showSidebar,
      handleSidebar,
      hideSidebar
    }
      }>
      {children}
    </Context.Provider>
   );
}

export const useGlobalContext = () => {
  return useContext(Context);
}