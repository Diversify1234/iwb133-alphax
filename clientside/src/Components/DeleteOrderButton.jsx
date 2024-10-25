import React from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const DeleteOrderButton = ({ Orderid }) => {
    const handleDelete = async () => {
        try {
            const response = await axios.delete(`http://localhost:9090/api/orders?id=${Orderid}`);
            console.log('Order deleted:', response.data);
            alert('Order deleted successfully');
        } catch (error) {
            console.error('Error deleting order:', error);
            alert('Failed to delete order');
        }
    };

    return (
        <button 
        onClick={handleDelete} 
        className="delete-order-button" 
        style={{ backgroundColor: 'var(--green)' }}>
          <FontAwesomeIcon icon={faTrash} /> Delete Order
      </button>
      
    );
};

export default DeleteOrderButton;
