import React from 'react';
import { useParams } from 'react-router-dom';

// TODO: Migrate from app/agent/dashboard/[formsRole]/page.js

const AgentFormsRole = () => {
  const { formsRole } = useParams();
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">
        {formsRole ? formsRole.charAt(0).toUpperCase() + formsRole.slice(1) : 'Forms'}
      </h1>
      <p>TODO: Migrate from app/agent/dashboard/[formsRole]/page.js</p>
      <p className="mt-2 text-gray-600">Current role: {formsRole}</p>
    </div>
  );
};

export default AgentFormsRole;
