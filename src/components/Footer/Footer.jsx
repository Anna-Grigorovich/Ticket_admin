import React from 'react';
import { Box, Link, Typography } from '@mui/material';

export const Footer = () => {
  return (
    <Box component="footer" sx={{ p: 2, textAlign: 'center' }}>
      <Typography variant="body1">© 2024 Tickets</Typography>
      <Link href="https://www.instagram.com" target="_blank" sx={{ mx: 1 }}>
        Instagram
      </Link>
      <Link href="https://www.facebook.com" target="_blank" sx={{ mx: 1 }}>
        Facebook
      </Link>
    </Box>
  );
};
