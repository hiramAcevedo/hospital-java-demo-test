'use client';

import { useState } from 'react';
import { 
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Divider, Typography, useTheme
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PersonIcon from '@mui/icons-material/Person';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  drawerWidth: number;
}

export default function Sidebar({ isOpen, drawerWidth }: SidebarProps) {
  const theme = useTheme();
  const pathname = usePathname();
  
  const menuItems = [
    { text: 'Inicio', icon: <HomeIcon />, path: '/' },
    { text: 'Citas', icon: <CalendarMonthIcon />, path: '/citas' },
    { text: 'Nueva Cita', icon: <AddCircleOutlineIcon />, path: '/citas/crear' },
    { text: 'Pacientes', icon: <PersonIcon />, path: '/pacientes' },
    { text: 'Doctores', icon: <MedicalServicesIcon />, path: '/doctores' },
    { text: 'Consultorios', icon: <MeetingRoomIcon />, path: '/consultorios' },
  ];

  return (
    <Drawer
      variant="permanent"
      open={isOpen}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
          backgroundColor: theme.palette.background.paper,
          boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.2)',
        },
        display: { xs: 'none', sm: 'block' }
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
          Sistema de Citas
        </Typography>
      </Box>
      <Divider />
      <List sx={{ pt: 1 }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton 
                component={Link} 
                href={item.path}
                sx={{ 
                  backgroundColor: isActive ? `${theme.palette.primary.main}10` : 'transparent',
                  borderLeft: isActive ? `4px solid ${theme.palette.primary.main}` : '4px solid transparent',
                  '&:hover': {
                    backgroundColor: `${theme.palette.primary.main}15`,
                  }
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: isActive ? theme.palette.primary.main : 'inherit',
                    minWidth: '40px'
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? theme.palette.primary.main : 'inherit'
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
} 