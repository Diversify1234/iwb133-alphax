import React from 'react';
import { useMenu } from '../Context/MenuContext';
import './Menu.css';

const Menu = () => {
  const { menu } = useMenu();

  return (
    <div className="menu-card2">
      <h3 className="menu-title">Today's Menu</h3>

      <div className="meal-container">
        <div className="meal-time">
          
            <h4 className="meal-title">Breakfast</h4>
            <ul className="meal-list">
              {menu.breakfast.length > 0 ? (
                menu.breakfast.map((item, index) => <li key={index}>{item}</li>)
              ) : (
                <li>No items for breakfast</li>
              )}
            </ul>
          </div>
          <div className="meal-time">
            <h4 className="meal-title">Lunch</h4>
            <ul className="meal-list">
              {menu.lunch.length > 0 ? (
                menu.lunch.map((item, index) => <li key={index}>{item}</li>)
              ) : (
                <li>No items for lunch</li>
              )}
            </ul>
         
        </div>

        <div className="meal-time">
          <h4 className="meal-title">Dinner</h4>
          <ul className="meal-list">
            {menu.dinner.length > 0 ? (
              menu.dinner.map((item, index) => <li key={index}>{item}</li>)
            ) : (
              <li>No items for dinner</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Menu;
