import React, { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';

// Mock initial roles data
const initialRoles = [
  {
    id: 1,
    name: 'Admin',
    description: 'Full system access',
    permissions: ['create_user', 'edit_user', 'delete_user', 'manage_roles']
  },
  {
    id: 2,
    name: 'Editor',
    description: 'Can edit content',
    permissions: ['edit_user']
  },
  {
    id: 3,
    name: 'Viewer',
    description: 'Read-only access',
    permissions: []
  }
];

const availablePermissions = [
  { id: 'create_user', label: 'Create User' },
  { id: 'edit_user', label: 'Edit User' },
  { id: 'delete_user', label: 'Delete User' },
  { id: 'manage_roles', label: 'Manage Roles' }
];

const RoleManagement = () => {
  const [roles, setRoles] = useState(initialRoles);
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingRole) {
      setRoles(roles.map(role =>
        role.id === editingRole.id ? { ...formData, id: role.id } : role
      ));
    } else {
      setRoles([...roles, { ...formData, id: roles.length + 1 }]);
    }
    setShowModal(false);
    setEditingRole(null);
    setFormData({ name: '', description: '', permissions: [] });
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    setFormData(role);
    setShowModal(true);
  };

  const handleDelete = (roleId) => {
    setRoles(roles.filter(role => role.id !== roleId));
  };

  const handlePermissionToggle = (permissionId) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Role Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          <span>Add Role</span>
        </button>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div key={role.id} className="bg-white rounded-lg shadow p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{role.name}</h3>
                <p className="text-sm text-gray-500">{role.description}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(role)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(role.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Permissions:</h4>
              <div className="flex flex-wrap gap-2">
                {role.permissions.map((permission) => (
                  <span
                    key={permission}
                    className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full"
                  >
                    {availablePermissions.find(p => p.id === permission)?.label || permission}
                  </span>
                ))}
                {role.permissions.length === 0 && (
                  <span className="text-sm text-gray-500">No permissions assigned</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">{editingRole ? 'Edit Role' : 'Add New Role'}</h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingRole(null);
                  setFormData({ name: '', description: '', permissions: [] });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <Trash2 size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Role Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                <div className="space-y-2">
                  {availablePermissions.map((permission) => (
                    <label key={permission.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(permission.id)}
                        onChange={() => handlePermissionToggle(permission.id)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-sm text-gray-700">{permission.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingRole(null);
                    setFormData({ name: '', description: '', permissions: [] });
                  }}
                  className="px-4 py-2 border rounded-md hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  {editingRole ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoleManagement;