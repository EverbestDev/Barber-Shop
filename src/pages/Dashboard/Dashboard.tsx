import React from 'react';
import { useAuth } from '../../context/AuthContext';
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';
import BarberDashboard from './BarberDashboard';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'barber':
      return <BarberDashboard />;
    default:
      return <UserDashboard />;
  }
};

export default Dashboard;
