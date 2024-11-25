import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { rolesAPI } from '../services/api';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const defaultPermissions = [
  { id: 'create_user', label: 'Create User', category: 'User Management' },
  { id: 'edit_user', label: 'Edit User', category: 'User Management' },
  { id: 'delete_user', label: 'Delete User', category: 'User Management' },
  { id: 'view_users', label: 'View Users', category: 'User Management' },
  { id: 'manage_roles', label: 'Manage Roles', category: 'Role Management' },
  { id: 'assign_roles', label: 'Assign Roles', category: 'Role Management' },
  { id: 'view_roles', label: 'View Roles', category: 'Role Management' },
  { id: 'manage_permissions', label: 'Manage Permissions', category: 'Permission Management' }
];

const RoleManagement = () => {
  const { execute, loading, error } = useApi();
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: []
  });

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const data = await execute(rolesAPI.getRoles);
      setRoles(data);
    } catch (err) {
      console.error('Failed to load roles:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRole) {
        await execute(rolesAPI.updateRole, editingRole.id, formData);
      } else {
        await execute(rolesAPI.createRole, formData);
      }
      await loadRoles();
      setShowModal(false);
      setEditingRole(null);
      setFormData({ name: '', description: '', permissions: [] });
    } catch (err) {
      console.error('Failed to save role:', err);
    }
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions || []
    });
    setShowModal(true);
  };

  const handleDelete = async (roleId) => {
    if (window.confirm('Are you sure you want to delete this role? This action cannot be undone.')) {
      try {
        await execute(rolesAPI.deleteRole, roleId);
        await loadRoles();
      } catch (err) {
        console.error('Failed to delete role:', err);
      }
    }
  };

  const handlePermissionToggle = (permissionId) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  // Group permissions by category
  const groupedPermissions = defaultPermissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {});

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div key={role.id} className="bg-white rounded-lg shadow-md p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{role.description}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(role)}
                  className="p-1 text-indigo-600 hover:text-indigo-900 transition-colors"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => handleDelete(role.id)}
                  className="p-1 text-red-600 hover:text-red-900 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Permissions:</h4>
              <div className="flex flex-wrap gap-2">
                {role.permissions?.map((permissionId) => {
                  const permission = defaultPermissions.find(p => p.id === permissionId);
                  return permission ? (
                    <span
                      key={permissionId}
                      className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full"
                    >
                      {permission.label}
                    </span>
                  ) : null;
                })}
                {!role.permissions?.length && (
                  <span className="text-sm text-gray-500">No permissions assigned</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-6 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {editingRole ? 'Edit Role' : 'Add New Role'}
              </h3>
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
            <form onSubmit={handleSubmit} className="space-y-6">
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
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Permissions</label>
                {Object.entries(groupedPermissions).map(([category, permissions]) => (
                  <div key={category} className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-600">{category}</h4>
                    <div className="space-y-2">
                      {permissions.map((permission) => (
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
                ))}
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingRole(null);
                    setFormData({ name: '', description: '', permissions: [] });
                  }}
                  className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  {editingRole ? 'Update Role' : 'Create Role'}
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