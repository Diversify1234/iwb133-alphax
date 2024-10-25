import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import PlaceOrder from './PlaceOrder'; // Adjust the path based on your file structure

const PlaceOrderButton = ({ Date}) => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>

            <Button variant="contained" color="var(--green)" onClick={handleClickOpen}>
                Place Order
            </Button>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle sx={{ color: 'var(--orange)', textAlign: 'center' ,fontSize: '2rem',fontWeight:'bold'}}>Place Your Meal Order</DialogTitle>
                <DialogContent>
                    <PlaceOrder Date={Date}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary" 
            sx={{ backgroundColor: 'var(--green)', color: 'var(--background-color)' }}
            >
                        Done
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default PlaceOrderButton;
