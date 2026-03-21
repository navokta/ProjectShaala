// components/Header/index.jsx
'use client';

import { useAuth } from '@/context/AuthContext';
import PublicHeader from './PublicHeader';
import LoggedInHeader from './LoggedInHeader';
import DashboardHeader from './DashboardHeader';

const Header = ({ isDashboard = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // or a simple loading spinner
  }

  if (isDashboard) {
    return <DashboardHeader userType={user?.role === 'developer' ? 'developer' : 'buyer'} />;
  }

  if (!user) {
    return <PublicHeader />;
  }

  // For logged-in users, pass userType (buyer/developer) and role (buyer/developer/admin/owner)
  const userType = user.role === 'developer' ? 'developer' : 'buyer';
  return <LoggedInHeader userType={userType} role={user.role} />;
};

export default Header;