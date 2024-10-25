import React, { useContext, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import { styled } from '@mui/system';
import { AuthContext } from '../Context/AuthContext'; 
import { Link, useLocation, useNavigate } from 'react-router-dom'; 
import logout from '../Actions/Logout';

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, var(--orange) 30%, var(--orange) 30%)',
  borderRadius: 3,
  border: 0,
  color: 'white',
  height: 48,
  padding: '0 30px',
  margin: theme.spacing(1),
  '&:hover': {
    background: 'var(--text-primary)',
  },
}));

const activeLinkStyle = {
  color: 'var(--orange)',
  textDecoration: 'underline',
};

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, token, logout: clearAuth } = useContext(AuthContext);
  const location = useLocation(); 
  const navigate = useNavigate(); 

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isSignupPage = location.pathname === '/signup';
  
  const handleLogout = async () => {
    await logout(token, clearAuth);
    navigate('/signin'); 
  };

  // Check if user is admin
  const isAdmin = user && (user.mail === 'admin@example.com' || user.name === 'admin');

  return (
    <AppBar position="static" sx={{ backgroundColor: 'var(--background-color)', boxShadow: '0 4px 6px var(--shadow-color)' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <RestaurantMenuIcon sx={{ color: 'var(--orange)', mr: 1 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'var(--text-primary)' }}>
            MealManager
          </Typography>

          {user ? (
            <>
              {isAdmin && (
                <>
                  <Link to="/dashboard" style={{ textDecoration: 'none', color: 'inherit', marginRight: '50px' , fontWeight:'bold' }}>
                    <Typography variant="body1" sx={location.pathname === '/dashboard' ? activeLinkStyle : { color: 'var(--text-primary)', cursor: 'pointer' }}>
                      Dashboard
                    </Typography>
                  </Link>
                  <Link to="/orders" style={{ textDecoration: 'none', color: 'inherit', marginRight: '50px', fontWeight:'bold' }}>
                    <Typography variant="body1" sx={location.pathname === '/orders' ? activeLinkStyle : { color: 'var(--text-primary)', cursor: 'pointer' }}>
                      Orders
                    </Typography>
                  </Link>
                  <Link to="/manage-emp" style={{ textDecoration: 'none', color: 'inherit', marginRight: '50px', fontWeight:'bold' }}>
                    <Typography variant="body1" sx={location.pathname === '/manage-emp' ? activeLinkStyle : { color: 'var(--text-primary)', cursor: 'pointer' }}>
                      Employees
                    </Typography>
                  </Link>
                </>
              )}
              <div>
                <Typography
                  variant="body1"
                  onClick={handleMenu}
                  sx={{
                    color: 'var(--orange)',
                    cursor: 'pointer',
                    fontWeight:'bold',
                    fontSize:'1.5rem',
                    mx: 3,
                    ml:6,
                  }}
                >
                  {user.name}
                </Typography>
              </div>
              <GradientButton onClick={handleLogout}>Sign Out</GradientButton>
            </>
          ) : (
            <Link to={isSignupPage ? '/signin' : '/signup'} style={{ textDecoration: 'none' }}>
              <GradientButton>
                {isSignupPage ? 'Sign In' : 'Sign Up'}
              </GradientButton>
            </Link>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
