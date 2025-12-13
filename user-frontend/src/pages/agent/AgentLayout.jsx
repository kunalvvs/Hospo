import React from 'react';
import { Outlet } from 'react-router-dom';

// TODO: Create AgentSidebar component similar to Sidebar

const AgentLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* <AgentSidebar /> */}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AgentLayout;
