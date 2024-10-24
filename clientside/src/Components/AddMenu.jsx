import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Select, MenuItem, Modal, TextField } from '@mui/material';
import './AddMenu.css';
import { useMenu } from '../Context/MenuContext';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';

const AddMenu = () => {
  const { menu, setMenu } = useMenu();
  const [foodItems, setFoodItems] = useState([]);
  const [newFood, setNewFood] = useState({ foodName: '', foodType: '' });
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:9090/api/fooditems')
      .then((response) => setFoodItems(response.data))
      .catch((error) => console.error('Error fetching food items:', error));
  }, []);

  const handleSelect = (mealType, selected) => {
    setMenu((prevMenu) => ({
      ...prevMenu,
      [mealType]: selected
    }));
  };

  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);

  const handleAddFood = () => {
    axios.post('http://localhost:9090/api/fooditems', newFood)
      .then(() => {
        setFoodItems([...foodItems, newFood]);
        setNewFood({ foodName: '', foodType: '' });
        handleModalClose();
      })
      .catch((error) => console.error('Error adding food item:', error));
  };

  return (
    <div className="add-menu">
       
      <div className="meal-section">
        <h3>Breakfast</h3>
        <Select
          multiple
          value={menu.breakfast}
          onChange={(e) => handleSelect('breakfast', e.target.value)}
          renderValue={(selected) => selected.join(', ')}
        >
          {foodItems.map((item) => (
            <MenuItem key={item.id} value={item.foodName}>
              {item.foodName}
            </MenuItem>
          ))}
        </Select>
      </div>

      <div className="meal-section">
        <h3>Lunch</h3>
        <Select
          multiple
          value={menu.lunch}
          onChange={(e) => handleSelect('lunch', e.target.value)}
          renderValue={(selected) => selected.join(', ')}
        >
          {foodItems.map((item) => (
            <MenuItem key={item.id} value={item.foodName}>
              {item.foodName}
            </MenuItem>
          ))}
        </Select>
      </div>

      <div className="meal-section">
        <h3>Dinner</h3>
        <Select
          multiple
          value={menu.dinner}
          onChange={(e) => handleSelect('dinner', e.target.value)}
          renderValue={(selected) => selected.join(', ')}
        >
          {foodItems.map((item) => (
            <MenuItem key={item.id} value={item.foodName}>
              {item.foodName}
            </MenuItem>
          ))}
        </Select>
      </div>

      <Button variant="contained" onClick={handleModalOpen} >
        Add New Food Item
      </Button>

      <Modal open={openModal} onClose={handleModalClose}>
        <div className="modal-content">
          <h2>Add New Food Item</h2>
          <TextField
            label="Food Name"
            value={newFood.foodName}
            onChange={(e) => setNewFood({ ...newFood, foodName: e.target.value })}
            fullWidth
          />
          <TextField
            label="Food Type"
            value={newFood.foodType}
            onChange={(e) => setNewFood({ ...newFood, foodType: e.target.value })}
            fullWidth
          />
          <Button variant="contained" onClick={handleAddFood}>
            Add Food Item
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AddMenu;
