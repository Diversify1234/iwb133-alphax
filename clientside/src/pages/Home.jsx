import React, { useState, useEffect } from 'react';
import './Dashboard.css';  
import img1 from '../Components/Images/img1.jpeg';  
import img2 from '../Components/Images/img2.jpeg';  
import img3 from '../Components/Images/img3.jpeg';  
import { Typography } from '@mui/material';
import '../index.css'

function Home() {
  const images = [img1, img2, img3];  // Array of images
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className='dashboard'>
      <div className='left' 
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      >
        <hr
            style={{
                width: '50%',          /* Adjust the width of the line */
                margin: '20px auto',   
                opacity: 0.9          
            }}
        />
         <Typography variant="h6"
         style={{
            display: 'block',
            fontSize: 'var(--font-size-large)',
            color: 'var(--text-primary)',
            lineHeight: '1.2',
            letterSpacing: '0',
            paddingLeft: '2%'
            
         }}
         >
          <span style={{fontSize: 'var(--font-size-subheading)', fontFamily: 'var(--font-family-2)'}}>What Would You</span> <br />
          <b>Like</b> to <span style={{ color: 'var(--orange)'}}><b> Order Today ?</b></span>
         </Typography>
      </div>
      <div className='right'>
      
          <div className='circular-base'>
          <img
            src={images[currentImageIndex]}
            alt="Food"
            className='circular-image'
          />
          </div>
        
      </div>
    </div>
  );
}

export default Home;