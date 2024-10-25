import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './OrderCalendar.css';
import { useAuth } from '../Context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Modal from './OrderDetailsModal';
import DeleteOrderButton from './DeleteOrderButton';
import PlaceOrderButton from './PlaceOrderButton';

const OrderCalendar = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deadline, setDeadline] = useState(new Date().setHours(8, 0, 0, 0)); 

  const mealTypes = [
    { id: 1, name: 'Veg' },
    { id: 2, name: 'Non Veg' },
    { id: 3, name: 'Egg' },
  ];
  const mealOptions = [
    { id: 1, name: 'Breakfast'},
    { id: 2, name: 'Lunch'},
    { id: 3, name: 'Dinner'},
  ];
  
  const getMealTypeName = (id) => mealTypes.find(type => type.id === id)?.name || 'Unknown';
  const getMealOptionName = (id) => mealOptions.find(option => option.id === id)?.name || 'Unknown';

  useEffect(() => {
    if (user) {
      axios.get(`http://localhost:9090/api/ordersForEmployee/${user.id}`)
        .then(response => {
          setOrders(response.data);
          console.log(response.data);
        })
        .catch(error => console.error('Error fetching orders:', error));
    }
  }, [user]);

  useEffect(() => {
    let intervalId; 
  
    if (user && selectedDate) {
      const fetchData = () => {
        const formattedDate = selectedDate.toLocaleDateString('en-CA'); // 'en-CA' gives yyyy-mm-dd format
        axios.get(`http://localhost:9090/api/orderDetailsForEmployeeOnDate?employeeId=${user.id}&orderDate=${formattedDate}`)
          .then(response => {
           
            if (Array.isArray(response.data)) {
              const enrichedOrders = response.data.map(order => ({
                ...order,
                mealTypeName: getMealTypeName(order.mealtypeId),
                mealTimeName: getMealOptionName(order.mealtimeId),
              }));
              setOrderDetails(enrichedOrders);
              console.log(enrichedOrders);
            } else {
              
              console.log('No orders:', response.data); 
              setOrderDetails([]); 
            }
          })
          .catch(error => {
            console.error('Error fetching order details:', error);
            setOrderDetails([]); 
          });
      };
    
      fetchData();  
  
      intervalId = setInterval(fetchData, 2000); 
    }
    return () => clearInterval(intervalId);
  
  }, [user, selectedDate]);
  

  
  const groupOrdersByMealTime = (orders) => {
    return orders.reduce((groups, order) => {
      const mealTime = order.mealTimeName;
      if (!groups[mealTime]) {
        groups[mealTime] = [];
      }
      groups[mealTime].push(order);
      return groups;
    }, {});
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = date.toLocaleDateString('en-CA');
      const hasOrder = orders.some(order => order.date === dateStr);
      const isPast = date < new Date().setHours(0, 0, 0, 0);

      if (hasOrder) {
        return (
          <div className={`order-indicator ${isPast ? 'past-order' : ''}`}>
            <FontAwesomeIcon icon={faCheck} />
          </div>
        );
      }
    }
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const today = new Date();
      today.setHours(0, 0, 0, 0); 

      const isPast = date < today || (date.getTime() === today.getTime() && new Date() > deadline);

      if (isPast) {
        return 'past-date';
      }
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setOrderDetails([]);
  };

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (date < today) return true;
  
    if (date.toDateString() === today.toDateString()) {
      const currentTime = new Date();
      const deadline = new Date();
      deadline.setHours(8, 0, 0, 0);
      return currentTime > deadline;
    }
    return false;
  };
  

  const groupedOrders = groupOrdersByMealTime(orderDetails);

  return (
    <div className="order-calendar">
      <Calendar 
        tileContent={tileContent} 
        tileClassName={tileClassName}
        onClickDay={handleDateClick}
      />
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {orderDetails.length > 0 ? (
          <div className="order-details">
            <h3>Order Details for {selectedDate ? selectedDate.toLocaleDateString('en-CA') : ''}</h3> 
            {Object.keys(groupedOrders).map(mealTime => (
              <div key={mealTime} className="meal-section">
                <h4 className="meal-time-title">{mealTime}</h4>
                <ul>
                  {groupedOrders[mealTime].map(order => (
                    <li key={order.id} className="order-item">
                      <p className="meal-type">{order.mealTypeName}</p>
                      <p className="order-date">{order.date}</p>
                      {/* Disable DeleteOrderButton for past dates */}
                      {!isPastDate(selectedDate) && <DeleteOrderButton Orderid={order.id} />}

                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <p>No orders for this date.</p>
            {/* Disable PlaceOrderButton for past dates */}
           {selectedDate && !isPastDate(selectedDate) && <PlaceOrderButton Date={selectedDate.toLocaleDateString('en-CA')} />}


          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderCalendar;
