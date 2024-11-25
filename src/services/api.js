const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const simulateNetworkDelay = () => delay(Math.random() * 800 + 200); // Random delay between 200-1000ms

const apiResponse = async (data, shouldError = false) => {
  await simulateNetworkDelay();
  
  if (shouldError) {
    throw new Error('API Error: Operation failed');
  }
  
  return {
    status: 'success',
    data,
    timestamp: new Date().toISOString(),
    requestId: Math.random().toString(36).substring(7)
  };
};

const handleApiError = (operation, entity) => {
  throw new Error(`Failed to ${operation} ${entity}. Please try again later.`);
};

export const usersAPI = {
  async getUsers() {
    try {
      await simulateNetworkDelay();
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      return apiResponse(users);
    } catch (error) {
      handleApiError('fetch', 'users');
    }
  },

  async createUser(userData) {
    try {
      await simulateNetworkDelay();
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Validate required fields
      if (!userData.name || !userData.email) {
        throw new Error('Name and email are required');
      }
      
      // Check for duplicate email
      if (users.some(user => user.email === userData.email)) {
        throw new Error('Email already exists');
      }

      const newUser = {
        ...userData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      return apiResponse(newUser);
    } catch (error) {
      handleApiError('create', 'user');
    }
  },

  async updateUser(id, userData) {
    try {
      await simulateNetworkDelay();
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const index = users.findIndex(user => user.id === id);
      
      if (index === -1) {
        throw new Error('User not found');
      }

      // Check for duplicate email if email is being changed
      if (userData.email && userData.email !== users[index].email) {
        if (users.some(user => user.email === userData.email)) {
          throw new Error('Email already exists');
        }
      }

      users[index] = {
        ...users[index],
        ...userData,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem('users', JSON.stringify(users));
      return apiResponse(users[index]);
    } catch (error) {
      handleApiError('update', 'user');
    }
  },

  async deleteUser(id) {
    try {
      await simulateNetworkDelay();
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userToDelete = users.find(user => user.id === id);
      
      if (!userToDelete) {
        throw new Error('User not found');
      }

      const filtered = users.filter(user => user.id !== id);
      localStorage.setItem('users', JSON.stringify(filtered));
      return apiResponse({ id, deletedAt: new Date().toISOString() });
    } catch (error) {
      handleApiError('delete', 'user');
    }
  }
};

export const rolesAPI = {
  async getRoles() {
    try {
      await simulateNetworkDelay();
      const defaultRoles = [
        {
          id: 1,
          name: 'Admin',
          description: 'Full system access',
          permissions: ['create_user', 'edit_user', 'delete_user', 'manage_roles', 'assign_roles', 'view_roles', 'manage_permissions'],
          isDefault: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Editor',
          description: 'Can edit content and manage users',
          permissions: ['edit_user', 'view_users', 'view_roles'],
          isDefault: true,
          createdAt: new Date().toISOString()
        },
        {
          id: 3,
          name: 'Viewer',
          description: 'Read-only access',
          permissions: ['view_users', 'view_roles'],
          isDefault: true,
          createdAt: new Date().toISOString()
        }
      ];

      const roles = JSON.parse(localStorage.getItem('roles') || JSON.stringify(defaultRoles));
      return apiResponse(roles);
    } catch (error) {
      handleApiError('fetch', 'roles');
    }
  },

  async createRole(roleData) {
    try {
      await simulateNetworkDelay();
      const roles = JSON.parse(localStorage.getItem('roles') || '[]');
      
      // Validate required fields
      if (!roleData.name) {
        throw new Error('Role name is required');
      }
      
      // Check for duplicate role name
      if (roles.some(role => role.name.toLowerCase() === roleData.name.toLowerCase())) {
        throw new Error('Role name already exists');
      }

      const newRole = {
        ...roleData,
        id: Date.now(),
        isDefault: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      roles.push(newRole);
      localStorage.setItem('roles', JSON.stringify(roles));
      return apiResponse(newRole);
    } catch (error) {
      handleApiError('create', 'role');
    }
  },

  async updateRole(id, roleData) {
    try {
      await simulateNetworkDelay();
      const roles = JSON.parse(localStorage.getItem('roles') || '[]');
      const index = roles.findIndex(role => role.id === id);
      
      if (index === -1) {
        throw new Error('Role not found');
      }

      // Prevent modification of default roles
      if (roles[index].isDefault) {
        throw new Error('Default roles cannot be modified');
      }

      // Check for duplicate role name if name is being changed
      if (roleData.name && roleData.name !== roles[index].name) {
        if (roles.some(role => role.name.toLowerCase() === roleData.name.toLowerCase())) {
          throw new Error('Role name already exists');
        }
      }

      roles[index] = {
        ...roles[index],
        ...roleData,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem('roles', JSON.stringify(roles));
      return apiResponse(roles[index]);
    } catch (error) {
      handleApiError('update', 'role');
    }
  },

  async deleteRole(id) {
    try {
      await simulateNetworkDelay();
      const roles = JSON.parse(localStorage.getItem('roles') || '[]');
      const roleToDelete = roles.find(role => role.id === id);
      
      if (!roleToDelete) {
        throw new Error('Role not found');
      }

      // Prevent deletion of default roles
      if (roleToDelete.isDefault) {
        throw new Error('Default roles cannot be deleted');
      }

      const filtered = roles.filter(role => role.id !== id);
      localStorage.setItem('roles', JSON.stringify(filtered));
      return apiResponse({ id, deletedAt: new Date().toISOString() });
    } catch (error) {
      handleApiError('delete', 'role');
    }
  }
};