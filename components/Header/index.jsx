// components/Header/index.jsx
'use client';

import PublicHeader from './PublicHeader';
import LoggedInHeader from './LoggedInHeader';
import DashboardHeader from './DashboardHeader';

const Header = ({ userType = 'public', isDashboard = false }) => {
  if (isDashboard) {
    return <DashboardHeader userType={userType === 'public' ? 'buyer' : userType} />;
  }

  if (userType === 'public') {
    return <PublicHeader />;
  }

  return <LoggedInHeader userType={userType} />;
};

export default Header;