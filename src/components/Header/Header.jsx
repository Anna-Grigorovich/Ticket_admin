import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import c from './Header.module.css';
import { UserMenu } from '../UserMenu/UserMenu';
import { useSelector } from 'react-redux';

export const Header = ({ toggleDrawer }) => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: '#000000', color: '#ffffff' }}
      className={c.header}
    >
      <Toolbar className={c.headerWrap}>
        {isLoggedIn && (
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{ display: 'block', color: 'white' }}
          >
            <MenuIcon sx={{ fontSize: 30 }} />
          </IconButton>
        )}

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Tickets
        </Typography>
        {isLoggedIn && <UserMenu />}
      </Toolbar>
    </AppBar>
  );
};
