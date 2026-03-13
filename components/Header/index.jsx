'use client';

import { useAuth } from '@/context/AuthContext';
import PublicHeader from './PublicHeader';
import LoggedInHeader from './LoggedInHeader';
import DashboardHeader from './DashboardHeader';

const Header = ({ isDashboard = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // or a simple loading skeleton
  }

  if (isDashboard) {
    return <DashboardHeader userType={user?.role || 'buyer'} />;
  }

  if (!user) {
    return <PublicHeader />;
  }

  return <LoggedInHeader userType={user.role} />;
};

export default Header;