import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, TextField, Button } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCarrot, faDrumstickBite, faEgg } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import '../index.css'

const OrderPage = () => {
  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [date, setDate] = useState(getCurrentDate());
  const [mealCounts, setMealCounts] = useState(null);

  useEffect(() => {
    // Fetch today's order counts when the component loads
    fetchMealCounts();
  }, []);

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

  const calculateTotals = () => {
    if (!mealCounts) return { veg: 0, nonveg: 0, egg: 0 };

    return Object.keys(mealCounts).reduce(
      (acc, meal) => {
        acc.veg += parseInt(mealCounts[meal].veg_count) || 0;
        acc.nonveg += parseInt(mealCounts[meal].nonveg_count) || 0;
        acc.egg += parseInt(mealCounts[meal].egg_count) || 0;
        return acc;
      },
      { veg: 0, nonveg: 0, egg: 0 }
    );
  };

  const calculateMealTotals = (meal) => {
    return (
      (parseInt(mealCounts[meal].veg_count) || 0) +
      (parseInt(mealCounts[meal].nonveg_count) || 0) +
      (parseInt(mealCounts[meal].egg_count) || 0)
    );
  };

  const totals = calculateTotals();

  return (
    <div style={{ padding: '20px' }}>
     

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
        <Button variant="contained" color="primary" onClick={handleFetchData} 
        sx={{
          backgroundColor: 'var(--orange)',
          '&:hover': {
                        backgroundColor: 'var(--text-primary)',
                    }
          }}>
          Fetch Orders
        </Button>
      </div>
      <Typography variant="h5" gutterBottom style={{backgroundColor:"var(--green" , padding:30, borderRadius:10, color:"white"}}>
        Order Counts for {date}
      </Typography>

      {/* Meal Counts */}
      {mealCounts && (
        <Grid container spacing={3}>
          {Object.keys(mealCounts).map((meal) => (
            <Grid item xs={12} md={4} key={meal}>
              <Card style={{ padding: '20px', borderRadius: '10px' }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    {meal} (Total: {calculateMealTotals(meal)})
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

          {/* Total Counts */}
          <Grid item xs={12}>
            <Card style={{ padding: '20px', borderRadius: '10px' }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Total Counts
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Card style={{ borderRadius: '10px', textAlign: 'center', padding: '10px' }}>
                      <FontAwesomeIcon icon={faCarrot} size="lg" />
                      <Typography variant="body2">Total Veg</Typography>
                      <Typography variant="h4" style={{ fontWeight: 'bold' }}>
                        {totals.veg}
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={4}>
                    <Card style={{ borderRadius: '10px', textAlign: 'center', padding: '10px' }}>
                      <FontAwesomeIcon icon={faDrumstickBite} size="lg" />
                      <Typography variant="body2">Total Non-Veg</Typography>
                      <Typography variant="h4" style={{ fontWeight: 'bold' }}>
                        {totals.nonveg}
                      </Typography>
                    </Card>
                  </Grid>
                  <Grid item xs={4}>
                    <Card style={{ borderRadius: '10px', textAlign: 'center', padding: '10px' }}>
                      <FontAwesomeIcon icon={faEgg} size="lg" />
                      <Typography variant="body2">Total Egg</Typography>
                      <Typography variant="h4" style={{ fontWeight: 'bold' }}>
                        {totals.egg}
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default OrderPage;
