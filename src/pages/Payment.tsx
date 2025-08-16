import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';


const Payment = () => {
  const { token, login, logout, user } = useContext(AuthContext);

  if (token) {
    return <div>Logged in</div>;
  }

  return <div>Not logged in</div>;
};
