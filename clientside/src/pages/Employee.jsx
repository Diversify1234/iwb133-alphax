import React, { useState } from 'react';
import './Dashboard.css';
import '../index.css';
import Menu from '../Components/Menu';
import PlaceOrder from '../Components/PlaceOrder';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import OrderCalendar from '../Components/Order-Calendar';
import Lottie from 'react-lottie';
import Chef from '../Components/Images/Chef.json';

const Dashboard = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: Chef,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  const [open, setOpen] = useState(false);
  const date = new Date().toISOString().split('T')[0];

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Function to check if the current time is before 8 am
  const isBeforeDeadline = () => {
    const now = new Date();
    const deadline = new Date();
    deadline.setHours(8, 0, 0, 0); // Set deadline to 8:00 am today
    return now < deadline;
  };

  return (
    <div className='dashboard'>
      <div className='left col-left'>
        <div className='col1-top'>
          <h1>Click on a date & Place your order</h1>
          <Button 
  variant="outlined" 
  onClick={handleClickOpen} 
  disabled={!isBeforeDeadline()}  
  sx={{ marginTop: 0, color: 'var(--background-color)', backgroundColor: 'var(--orange)' }}
>
  Place Today's Order
</Button>
{!isBeforeDeadline() && (
  <p style={{ color: 'gray', marginTop: '8px' }}>
    You missed the 8 AM cutoff, but feel free to order for tomorrow!
  </p>
)}

        </div>
        <OrderCalendar />
      </div>
      
      <div className='right' style={{
        background: 'linear-gradient(to right, transparent 50%, transparent 50%)',
        borderLeft: '1px solid var(--text-primary)', 
        display: 'flex', 
        flexDirection: "column"
      }}>
        <div>
          <Lottie options={defaultOptions} height={150} width={300} />
        </div>
        <div className='col1-bot'>
          <Menu />
        </div>
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          width: '100%',
        }}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const email = formJson.email;
            console.log(email);
            handleClose();
          },
        }}
      >
        <DialogTitle sx={{ color: 'var(--orange)', textAlign: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
          Place Your Order
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <PlaceOrder Date={date} />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            sx={{ backgroundColor: 'var(--green)', color: 'var(--background-color)' }}
          >
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Dashboard;
