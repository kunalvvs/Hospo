import React from 'react';

// Placeholder pages - These need to be migrated from the Next.js app folder
// Follow the pattern from HomePage.jsx:
// 1. Remove "use client" directive
// 2. Replace next/link with react-router-dom Link
// 3. Replace next/image with regular img tags
// 4. Replace useRouter from next/navigation with useNavigate from react-router-dom
// 5. Update API calls to use the service layer from src/services

const AdminPage = () => <div className="flex items-center justify-center h-screen text-gray-600">Admin Page - TODO: Migrate from app/admin/page.js</div>;
const AgentPage = () => <div className="flex items-center justify-center h-screen text-gray-600">Agent Page - TODO: Migrate from app/agent/page.js</div>;

export {
  AdminPage,
  AgentPage,
};
