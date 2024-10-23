import React, { useState } from 'react';
import { useAuth } from '../Context/AuthContext';
import axios from 'axios';
import { Button, Card, CardContent, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Box } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils, faCoffee, faHamburger } from '@fortawesome/free-solid-svg-icons'; 


const mealTypes = [
  { id: 1, name: 'Veg' },
  { id: 2, name: 'Non Veg' },
  { id: 3, name: 'Egg' },
];
const mealOptions = [
  { id: 1, name: 'Breakfast', icon: <FontAwesomeIcon icon={faCoffee} /> },
  { id: 2, name: 'Lunch', icon: <FontAwesomeIcon icon={faHamburger} /> },
  { id: 3, name: 'Dinner', icon: <FontAwesomeIcon icon={faUtensils} /> },
];



const PlaceOrder = () => {
  const { user } = useAuth();
  const [selections, setSelections] = useState({
    1: null,
    2: null, 
    3: null, 
  });

  const handleMealSelection = (mealId, mealTypeId) => {
    setSelections(prev => ({ ...prev, [mealId]: mealTypeId }));
  };

  const handlePlaceOrder = async () => {
    const date = new Date().toISOString().split('T')[0]; 
  
    const orders = Object.entries(selections)
      .filter(([mealtimeId, mealtypeId]) => mealtypeId !== null) 
      .map(([mealtimeId, mealtypeId]) => ({
        employeeId: user.id,
        mealtimeId: parseInt(mealtimeId),
        mealtypeId,
        date,
      }));
  
    try {
      for (const order of orders) {
        await axios.post('http://localhost:9090/api/orders', order);
      }
      alert('Orders placed successfully');
    } catch (error) {
      console.error('Error placing orders:', error);
      alert('Failed to place orders');
    }
  };

  return (
    <Card sx={{
      maxWidth: 450, 
      mx: 'auto',
      mt: 3, 
      p: 2,  
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
      borderRadius: '12px',
      backgroundColor: '#f9fafb',
    }}>
      <CardContent>
        <Typography variant="h5" component="h1" gutterBottom sx={{ textAlign: 'center', color: '#0049a2', fontWeight: 'bold' }}>
          Place Your Meal Order
        </Typography>

        {mealOptions.map(meal => (
          <FormControl key={meal.id} component="fieldset" sx={{ mb: 2 }}> 
            <FormLabel component="legend" sx={{ display: 'flex', alignItems: 'center', fontSize: '1.1rem', fontWeight: '500', color: '#061C36' }}> {/* Slightly smaller font */}
              <Box sx={{ mr: 0.75 }}>{meal.icon}</Box> {meal.name} 
            </FormLabel>
            <RadioGroup
              value={selections[meal.id] || ''}
              onChange={(e) => handleMealSelection(meal.id, parseInt(e.target.value))}
              row
            >
              {mealTypes.map(type => (
                <FormControlLabel
                  key={type.id}
                  value={type.id}
                  control={<Radio sx={{ color: '#0049a2', '&.Mui-checked': { color: '#007bff' } }} />}
                  label={type.name}
                  sx={{ '& .MuiFormControlLabel-label': { color: '#333', fontSize: '0.95rem' } }}  // Reduced label size
                />
              ))}
            </RadioGroup>
          </FormControl>
        ))}

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            backgroundColor: '#007bff',
            color: '#fff',
            py: 1.2,  
            fontSize: '1.05rem',  
            borderRadius: '10px',  
            textTransform: 'none',
            boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.15)',  
            '&:hover': {
              backgroundColor: '#0056b3',
            },
          }}
          onClick={handlePlaceOrder}
        >
          Place Order
        </Button>
      </CardContent>
    </Card>
  );
};

export default PlaceOrder;
