import React from 'react';
import Admin from './Admin'
import Employee from './Employee'
import NotSignedIn from '../Components/NotSignedIn';
import { useAuth } from '../Context/AuthContext'

const DashboardMain = () => {
  const { user } = useAuth();

 
  if (user) {
    if (user.mail === 'admin@gmail.com' || user.name === 'admin') {
      return <Admin />; 
    } else {
      return <Employee />; 
    }
  } else {
    return <NotSignedIn />; 
  }
};

export default DashboardMain;
