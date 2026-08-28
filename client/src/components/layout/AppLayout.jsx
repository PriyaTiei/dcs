import React from 'react';
import { useSelector } from 'react-redux';
import Topbar from './Topbar';
import Sidebar from './Sidebar';

export const AppLayout = ({ children }) => {
  const { visible } = useSelector((state) => state.navBar);

  return (
    <div className="app-container">
      <Topbar />
      <Sidebar />
      <main
        className="main-content"
        style={{
          marginLeft: visible ? '260px' : '0px',
          width: visible ? 'calc(100% - 260px)' : '100%',
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
