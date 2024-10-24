import React from 'react'
import './Dashboard.css'
import Calendar from '../Components/Calendar'
import '../index.css'
import Menu from '../Components/Menu'
import PlaceOrder from '../Components/PlaceOrder'
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';


const Dashboard = () => {
  const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  return (
    <div className='dashboard'>
      <div className='left col-left'>
          <div className='col1-top'>
              <Button variant="outlined" onClick={handleClickOpen} sx={{marginTop: '2%', color: 'var(--background-color)', backgroundColor: 'var(--orange)'}}>
                  Place Your Order
              </Button>
          </div>
          <div className='col1-bot'>
            <Menu />
          </div>
      </div>
      <div className='right' style={{
        background: 'linear-gradient(to right, transparent 50%, transparent 50%)',
        borderLeft: '1px solid var(--text-primary)'
      }}>
         <Calendar/>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
            width: '100%'
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
    <DialogTitle>Place Your Order</DialogTitle>
        <DialogContent>
        <DialogContentText>
            <PlaceOrder></PlaceOrder>
        </DialogContentText>
        </DialogContent>
        <DialogActions>
        <Button onClick={handleClose} sx={{backgroundColor: 'var(--green)', color: 'var(--background-color)'}}>Cancel</Button>
        </DialogActions>
    </Dialog>
    </div>
  )
}

export default Dashboard