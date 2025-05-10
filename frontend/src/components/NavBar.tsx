'use client';

import { 
  AppBar, 
  Box, 
  Toolbar, 
  Typography, 
  IconButton, 
  Avatar, 
  Tooltip,
  Menu,
  MenuItem,
  Container
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from 'react';

interface NavBarProps {
  handleDrawerToggle: () => void;
}

const NavBar = ({ handleDrawerToggle }: NavBarProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchorEl(null);
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: '#fff',
        color: '#333',
        boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.1)'
      }}
    >
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' }, color: (theme) => theme.palette.primary.main, fontWeight: 600 }}
          >
            KOSMOS HOSPITAL Demo test by Hiram Acevedo
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Notificaciones">
              <IconButton 
                size="large"
                color="inherit"
                onClick={handleNotificationMenuOpen}
              >
                <NotificationsIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Perfil">
              <IconButton
                onClick={handleProfileMenuOpen}
                size="small"
                sx={{ ml: 2 }}
              >
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32,
                    bgcolor: (theme) => theme.palette.primary.main
                  }}
                >
                  A
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
      
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleMenuClose}>Mi Perfil</MenuItem>
        <MenuItem onClick={handleMenuClose}>Configuración</MenuItem>
        <MenuItem onClick={handleMenuClose}>Cerrar Sesión</MenuItem>
      </Menu>
      
      <Menu
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={handleNotificationMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            width: 320,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleNotificationMenuClose}>
          <Box sx={{ py: 0.5 }}>
            <Typography variant="subtitle2" component="div">
              No tienes notificaciones nuevas
            </Typography>
          </Box>
        </MenuItem>
      </Menu>
    </AppBar>
  );
};

export default NavBar; 