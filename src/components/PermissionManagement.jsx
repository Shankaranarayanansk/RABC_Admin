import React, { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const initialPermissions = [
  {
    id: 'create_user',
    name: 'Create User',
    description: 'Allows creating new users in the system',
    category: 'User Management'
  },
  {
    id: 'edit_user',
    name: 'Edit User',
    description: 'Allows editing existing users',
    category: 'User Management'
  },
  {
    id: 'delete_user',
    name: 'Delete User',
    description: 'Allows deleting users from the system',
    category: 'User Management'
  },
  {
    id: 'manage_roles',
    name: 'Manage Roles',
    description: 'Allows creating and modifying roles',
    category: 'Role Management'
  }
];

const PermissionManagement = () => {
  const [permissions, setPermissions] = useState(initialPermissions);
  const [showModal, setShowModal] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPermission) {
      setPermissions(permissions.map(permission =>
        permission.id === editingPermission.id ? { ...formData, id: permission.id } : permission
      ));
    } else {
      const newId = formData.name.toLowerCase().replace(/\s+/g, '_');
      setPermissions([...permissions, { ...formData, id: newId }]);
    }
    setShowModal(false);
    setEditingPermission(null);
    setFormData({ name: '', description: '', category: '' });
  };

  const handleEdit = (permission) => {
    setEditingPermission(permission);
    setFormData(permission);
    setShowModal(true);
  };

  const handleDelete = (permissionId) => {
    setPermissions(permissions.filter(permission => permission.id !== permissionId));
  };

  // Group permissions by category
  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Permission Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus size={20} />
          <span>Add Permission</span>
        </button>
      </div>

      {/* Permissions by Category */}
      {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
        <div key={category} className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700">{category}</h3>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categoryPermissions.map((permission) => (
                  <tr key={permission.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{permission.name}</div>
                      <div className="text-sm text-gray-500">{permission.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{permission.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEdit(permission)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(permission.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {editingPermission ? 'Edit Permission' : 'Add New Permission'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingPermission(null);
                  setFormData({ name: '', description: '', category: '' });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <Trash2 size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Permission Name</label>
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
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="e.g., User Management"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingPermission(null);
                    setFormData({ name: '', description: '', category: '' });
                  }}
                  className="px-4 py-2 border rounded-md hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  {editingPermission ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PermissionManagement;