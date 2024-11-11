import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;
const NavigationDrawer = ({ open, toggleDrawer }) => {
  const navigate = useNavigate();

  const handleListItemClick = (path) => {
    navigate(path);
    toggleDrawer(); // Закрываем Drawer при выборе элемента
  };

  return (
    <Drawer
      variant="temporary"
      anchor="left"
      open={open}
      onClose={toggleDrawer} // Закрытие при клике вне Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Toolbar />
      <List>
        <ListItem button onClick={() => handleListItemClick('/')}>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="Користувач" />
        </ListItem>
        <ListItem button onClick={() => handleListItemClick('/events')}>
          <ListItemIcon>
            <EventIcon />
          </ListItemIcon>
          <ListItemText primary="Події" />
        </ListItem>
        <ListItem button onClick={() => handleListItemClick('/cash')}>
          <ListItemIcon>
            <ShoppingCartIcon />
          </ListItemIcon>
          <ListItemText primary="Касса" />
        </ListItem>
      </List>
    </Drawer>
  );
};
export default NavigationDrawer;
