import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Button,
  Box,
} from '@mui/material';
import { NavLink } from 'react-router-dom';

import c from './Header.module.css';

export const Header = () => {
  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: '#000000', color: '#ffffff' }}
      className={c.header}
    >
      <Toolbar className={c.headerWrap}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Tickets
        </Typography>
        <Box sx={{ display: 'flex' }}>
          <Button
            component={NavLink}
            to="/"
            sx={{
              color: 'white',
              textDecoration: 'none',
              marginRight: 2,
              '&.active': {
                textDecoration: 'underline',
                color: '#ffffff',
              },
            }}
            exact
          >
            Події
          </Button>
          <Button
            component={NavLink}
            to="/events"
            sx={{
              color: 'white',
              textDecoration: 'none',
              '&.active': {
                textDecoration: 'underline',
                color: '#ffffff',
              },
            }}
          >
            Адмін
          </Button>
          <Button
            component={NavLink}
            to="/events"
            sx={{
              color: 'white',
              textDecoration: 'none',
              '&.active': {
                textDecoration: 'underline',
                color: '#ffffff',
              },
            }}
          >
            Касир
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
