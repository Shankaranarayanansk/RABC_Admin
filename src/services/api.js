const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const apiResponse = async (data, shouldError = false) => {
  await delay(500);
  
  if (shouldError) {
    throw new Error('API Error: Operation failed');
  }
  
  return {
    status: 'success',
    data,
    timestamp: new Date().toISOString()
  };
};

export const usersAPI = {
  async getUsers() {
    return apiResponse(JSON.parse(localStorage.getItem('users') || '[]'));
  },

  async createUser(userData) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const newUser = { ...userData, id: Date.now() };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return apiResponse(newUser);
  },

  async updateUser(id, userData) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const index = users.findIndex(user => user.id === id);
    if (index === -1) throw new Error('User not found');
    users[index] = { ...users[index], ...userData };
    localStorage.setItem('users', JSON.stringify(users));
    return apiResponse(users[index]);
  },

  async deleteUser(id) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const filtered = users.filter(user => user.id !== id);
    localStorage.setItem('users', JSON.stringify(filtered));
    return apiResponse({ id });
  }
};

export const rolesAPI = {
  async getRoles() {
    return apiResponse(JSON.parse(localStorage.getItem('roles') || '[]'));
  },

  async createRole(roleData) {
    const roles = JSON.parse(localStorage.getItem('roles') || '[]');
    const newRole = { ...roleData, id: Date.now() };
    roles.push(newRole);
    localStorage.setItem('roles', JSON.stringify(roles));
    return apiResponse(newRole);
  },

  async updateRole(id, roleData) {
    const roles = JSON.parse(localStorage.getItem('roles') || '[]');
    const index = roles.findIndex(role => role.id === id);
    if (index === -1) throw new Error('Role not found');
    roles[index] = { ...roles[index], ...roleData };
    localStorage.setItem('roles', JSON.stringify(roles));
    return apiResponse(roles[index]);
  },

  async deleteRole(id) {
    const roles = JSON.parse(localStorage.getItem('roles') || '[]');
    const filtered = roles.filter(role => role.id !== id);
    localStorage.setItem('roles', JSON.stringify(filtered));
    return apiResponse({ id });
  }
};

export const permissionsAPI = {
  async getPermissions() {
    return apiResponse(JSON.parse(localStorage.getItem('permissions') || '[]'));
  },

  async createPermission(permissionData) {
    const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
    const newPermission = { ...permissionData, id: Date.now() };
    permissions.push(newPermission);
    localStorage.setItem('permissions', JSON.stringify(permissions));
    return apiResponse(newPermission);
  },

  async updatePermission(id, permissionData) {
    const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
    const index = permissions.findIndex(permission => permission.id === id);
    if (index === -1) throw new Error('Permission not found');
    permissions[index] = { ...permissions[index], ...permissionData };
    localStorage.setItem('permissions', JSON.stringify(permissions));
    return apiResponse(permissions[index]);
  },

  async deletePermission(id) {
    const permissions = JSON.parse(localStorage.getItem('permissions') || '[]');
    const filtered = permissions.filter(permission => permission.id !== id);
    localStorage.setItem('permissions', JSON.stringify(filtered));
    return apiResponse({ id });
  }
};