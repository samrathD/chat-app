import React, { useEffect } from 'react'
import Navbar from './Components/Navbar'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './Pages/HomePage'
import SignUpPage from './Pages/SignupPage'
import SettingsPage from './Pages/SettingsPage'
import ProfilePage from './Pages/ProfilePage'
import LoginPage from './Pages/LoginPage'
import { useAuthStore } from './store/useAuthStore'
import { Loader } from "lucide-react"
import { Toaster } from 'react-hot-toast'
import { useThemeStore } from './store/useThemeStore'

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, onlineUsers } = useAuthStore();
  const {theme} = useThemeStore();
  
  console.log(onlineUsers);
  
  useEffect(()=>{
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (<div className='flex items-center justify-center h-screen'>
      <Loader className="size-10 animate-spin" />
    </div>)
  }

  return (
    <div data-theme={theme} className='w-screen min-h-screen'>
      <Navbar />
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path='/settings' element={<SettingsPage />} />
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
      <Toaster position="top-center"
        reverseOrder={false} />
    </div>
  )
}

export default App;