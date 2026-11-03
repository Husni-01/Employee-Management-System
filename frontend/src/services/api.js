const BASE_URL = '/api';

export const api = {
  // Employees
  async getEmployees(params = {}) {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page);
    if (params.limit) query.append('limit', params.limit);
    if (params.search) query.append('search', params.search);
    if (params.departmentId && params.departmentId !== 'all') query.append('departmentId', params.departmentId);
    if (params.status && params.status !== 'all') query.append('status', params.status);
    if (params.sortBy) query.append('sortBy', params.sortBy);
    if (params.sortOrder) query.append('sortOrder', params.sortOrder);

    const res = await fetch(`${BASE_URL}/employees?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch employees');
    return res.json();
  },

  async getEmployeeById(id) {
    const res = await fetch(`${BASE_URL}/employees/${id}`);
    if (!res.ok) throw new Error('Failed to fetch employee record');
    return res.json();
  },

  async createEmployee(data) {
    const res = await fetch(`${BASE_URL}/employees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to create employee');
    return result;
  },

  async updateEmployee(id, data) {
    const res = await fetch(`${BASE_URL}/employees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to update employee');
    return result;
  },

  async deleteEmployee(id) {
    const res = await fetch(`${BASE_URL}/employees/${id}`, {
      method: 'DELETE'
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to delete employee');
    return result;
  },

  async exportEmployees(params = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.departmentId && params.departmentId !== 'all') query.append('departmentId', params.departmentId);
    if (params.status && params.status !== 'all') query.append('status', params.status);

    const res = await fetch(`${BASE_URL}/employees/export?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to export employee data');
    return res.json();
  },

  // Departments
  async getDepartments() {
    const res = await fetch(`${BASE_URL}/departments`);
    if (!res.ok) throw new Error('Failed to fetch departments');
    return res.json();
  },

  async getDepartmentById(id) {
    const res = await fetch(`${BASE_URL}/departments/${id}`);
    if (!res.ok) throw new Error('Failed to fetch department');
    return res.json();
  },

  async createDepartment(data) {
    const res = await fetch(`${BASE_URL}/departments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to create department');
    return result;
  },

  async updateDepartment(id, data) {
    const res = await fetch(`${BASE_URL}/departments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to update department');
    return result;
  },

  async deleteDepartment(id) {
    const res = await fetch(`${BASE_URL}/departments/${id}`, {
      method: 'DELETE'
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Failed to delete department');
    return result;
  },

  // Reports
  async getDashboardSummary() {
    const res = await fetch(`${BASE_URL}/reports/summary`);
    if (!res.ok) throw new Error('Failed to fetch reports summary');
    return res.json();
  }
};

