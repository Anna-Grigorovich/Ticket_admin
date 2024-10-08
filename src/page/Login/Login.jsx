import React from 'react';
import { Container } from '@mui/material';
import { LoginForm } from '../../components/LoginForm/LoginForm';

export const LoginPage = () => {
  return (
    <Container component="main" maxWidth="xs">
      <LoginForm />
    </Container>
  );
};

export default LoginPage;
