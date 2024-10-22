import React, { useContext, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
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
    background: 'linear-gradient(45deg, var(--green) 30%, var(--green) 30%)',
  },
}));

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
              <div>
                <Typography
                  variant="body1"
                  onClick={handleMenu}
                  sx={{
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    mx: 2,
                  }}
                >
                  {user.name}
                </Typography>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>Profile</MenuItem>
                </Menu>
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
