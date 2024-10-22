import React, { useState } from 'react';
import { Card, CardContent, Typography, Grid, TextField, Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCarrot, faDrumstickBite, faEgg } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const OrderPage = () => {
  const [date, setDate] = useState('');
  const [mealCounts, setMealCounts] = useState(null);

  const fetchMealCounts = async () => {
    try {
      const response = await axios.get(`http://localhost:9090/api/orderCountsForDate`, {
        params: { inputDate: date }
      });
      setMealCounts(response.data);
    } catch (error) {
      console.error("Error fetching meal counts:", error);
    }
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  const handleFetchData = () => {
    fetchMealCounts();
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Order Counts by Date
      </Typography>

      {/* Date Input */}
      <div style={{ marginBottom: '20px' }}>
        <TextField
          label="Enter Date"
          type="date"
          value={date}
          onChange={handleDateChange}
          InputLabelProps={{
            shrink: true,
          }}
          style={{ marginRight: '10px' }}
        />
        <Button variant="contained" color="primary" onClick={handleFetchData}>
          Fetch Data
        </Button>
      </div>

      {/* Meal Counts */}
      {mealCounts && (
        <Grid container spacing={3}>
          {Object.keys(mealCounts).map((meal) => (
            <Grid item xs={12} md={4} key={meal}>
              <Card style={{ padding: '20px', borderRadius: '10px' }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {meal}
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Card style={{ borderRadius: '10px', textAlign: 'center', padding: '10px' }}>
                        <FontAwesomeIcon icon={faCarrot} size="lg" />
                        <Typography variant="body2">Veg</Typography>
                        <Typography variant="h4" style={{ fontWeight: 'bold' }}>
                          {mealCounts[meal].veg_count}
                        </Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Card style={{ borderRadius: '10px', textAlign: 'center', padding: '10px' }}>
                        <FontAwesomeIcon icon={faDrumstickBite} size="lg" />
                        <Typography variant="body2">Non-Veg</Typography>
                        <Typography variant="h4" style={{ fontWeight: 'bold' }}>
                          {mealCounts[meal].nonveg_count}
                        </Typography>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Card style={{ borderRadius: '10px', textAlign: 'center', padding: '10px' }}>
                        <FontAwesomeIcon icon={faEgg} size="lg" />
                        <Typography variant="body2">Egg</Typography>
                        <Typography variant="h4" style={{ fontWeight: 'bold' }}>
                          {mealCounts[meal].egg_count}
                        </Typography>
                      </Card>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default OrderPage;
