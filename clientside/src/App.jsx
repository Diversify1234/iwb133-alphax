import React from 'react'
import {Routes , Route} from 'react-router-dom';
import Dashboard from './pages/Employee'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import './index.css'
import Admin from './pages/Admin';
import Header from './Components/Header';
import DashboardMain from './pages/DashboardMain.jsx';
import Orderpage from './pages/Orderpage.jsx';
import Home from './pages/Home.jsx';
import ManageEmployees from './pages/ManageEmployees.jsx'
import { AuthProvider } from './Context/AuthContext';
import { MenuProvider } from './Context/MenuContext';




const App = () => {
  return (
    <>
    <MenuProvider>
    <AuthProvider>
    <Header/>
    
    <Routes>
   <Route path="/" element={<Home />} />
   <Route path="/employee" element={<Dashboard />} />
   <Route path="/admin" element={<Admin />} />
 
   <Route path="/signin" element={<Signin />} />
   <Route path="/signup" element={<Signup />} />
   <Route path="/dashboard" element={<DashboardMain />} />
   <Route path="/orders" element={<Orderpage />} />
   <Route path="/manage-emp" element={<ManageEmployees/>} />
   
    </Routes>
    </AuthProvider>
    </MenuProvider>
    </>
  )
}

export default App