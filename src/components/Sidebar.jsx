import React from 'react';
import PropTypes from 'prop-types';
import { Shield, Users, Settings } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'users', icon: Users, label: 'Users' },
    { id: 'roles', icon: Shield, label: 'Roles' },
    { id: 'permissions', icon: Settings, label: 'Permissions' }
  ];

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 p-4">
      <div className="flex items-center space-x-2 mb-8">
        <Shield className="h-8 w-8 text-indigo-600" />
        <h1 className="text-xl font-bold text-gray-800">RBAC Admin</h1>
      </div>
      <nav className="space-y-1">
        {menuItems.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === id
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

Sidebar.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired
};

export default Sidebar;