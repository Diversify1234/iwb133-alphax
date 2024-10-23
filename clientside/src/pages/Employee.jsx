import React from 'react'
import './Dashboard.css'
import Calendar from '../Components/Calendar'
import Selector from '../Components/Selector'
import '../index.css'
import Menu from '../Components/Menu'
import PlaceOrder from '../Components/PlaceOrder'


const Dashboard = () => {
  return (
    <div className='dashboard' style={{backgroundColor: 'var(--background-color)'}}>
      <div className='left' style={{backgroundColor: 'var(--background-color)'}}>
        <div className='flex'>
       
          <Menu/>
          </div>
      
      </div>
      
      <div>
      <div className='right' style={{backgroundColor: 'var(--background-color2)'}}>
         <Calendar />
         
      </div>
      <div className='order-card'>
      <PlaceOrder/>
      </div>
     
      </div>

    </div>
  )
}

export default Dashboard