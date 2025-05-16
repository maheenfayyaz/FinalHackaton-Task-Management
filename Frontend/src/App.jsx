import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Profile from "./pages/Profile"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Showalltask from "./pages/Showalltask"
import CreateTaskForm from "./pages/CreateTaskForm"
import ResetPassword from "./pages/ResetPassword"
import { useSelector} from 'react-redux'

function App() {

  const userName = useSelector((state) => state.auth.userName);
  const userImage = useSelector((state) => state.auth.userImage);
  

  return (
    <>
    <Routes>
      <Route path="/" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path='/showalltask' element={<Showalltask />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/resetpassword/:id/:token" element={<ResetPassword />} />
      <Route path="/createtaskform" element={<CreateTaskForm />} />
    </Routes>
    </>
  )
  };

 


export default App
