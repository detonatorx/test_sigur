import React from 'react';
import { Container, Box, useTheme, useMediaQuery, Button } from '@mui/material';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
