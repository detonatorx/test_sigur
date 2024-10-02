import React from 'react';
import { Container, Box, useTheme, useMediaQuery, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();

  const isFirstScreen = location.pathname === '/'; // Adjust this if your first screen has a different path

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          padding: isMobile ? theme.spacing(2) : theme.spacing(4),
          [theme.breakpoints.up('md')]: {
            padding: theme.spacing(6),
          },
        }}
      >
        {children}
      </Box>
    </Container>
  );
}
