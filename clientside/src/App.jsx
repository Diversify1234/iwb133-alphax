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
import { AuthProvider } from './Context/Authcontext.jsx';



const App = () => {
  return (
    <>
    <AuthProvider>
    <Header/>
    
    <Routes>
    <Route path="/" element={<Signup />} />
   <Route path="/employee" element={<Dashboard />} />
   <Route path="/admin" element={<Admin />} />
 
   <Route path="/signin" element={<Signin />} />
   <Route path="/signup" element={<Signup />} />
   <Route path="/dashboard" element={<DashboardMain />} />
   <Route path="/order" element={<Orderpage />} />

    </Routes>
    </AuthProvider>
    </>
  )
}

export default App