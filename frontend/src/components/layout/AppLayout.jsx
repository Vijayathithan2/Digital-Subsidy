import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { GovBanner } from './GovBanner';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="app-container">
      <GovBanner />
      <Header onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
      <div className="app-main-layout">
        <Sidebar isOpen={sidebarOpen} />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
