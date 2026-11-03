const db = require('../config/db');

// Helper to generate next Employee ID if not manually entered
async function generateEmployeeId() {
  const [rows] = await db.query(
    "SELECT employee_id FROM employees WHERE employee_id LIKE 'EMP-%' ORDER BY id DESC LIMIT 1"
  );
  if (rows.length > 0) {
    const match = rows[0].employee_id.match(/EMP-(\d+)/);
    if (match) {
      const nextNum = parseInt(match[1], 10) + 1;
      return `EMP-${nextNum}`;
    }
  }
  return 'EMP-1001';
}

// Get paginated and filtered employees
exports.getAllEmployees = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      departmentId = '',
      status = '',
      sortBy = 'e.created_at',
      sortOrder = 'DESC'
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
    const offset = (pageNum - 1) * limitNum;

    const whereClauses = [];
    const queryParams = [];

    // Search filter: First name, Last name, or Employee ID
    if (search && search.trim() !== '') {
      const searchTerm = `%${search.trim()}%`;
      whereClauses.push(
        '(e.first_name LIKE ? OR e.last_name LIKE ? OR CONCAT(e.first_name, " ", e.last_name) LIKE ? OR e.employee_id LIKE ? OR e.email LIKE ?)'
      );
      queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // Department filter
    if (departmentId && departmentId !== 'all') {
      whereClauses.push('e.department_id = ?');
      queryParams.push(departmentId);
    }

    // Status filter
    if (status && status !== 'all') {
      whereClauses.push('e.status = ?');
      queryParams.push(status);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    // Validate sort column to avoid SQL injection
    const allowedSortFields = {
      'name': 'e.first_name',
      'employee_id': 'e.employee_id',
      'department': 'd.name',
      'position': 'e.position',
      'hire_date': 'e.hire_date',
      'salary': 'e.salary',
      'status': 'e.status',
      'created_at': 'e.created_at'
    };
    const validatedSortBy = allowedSortFields[sortBy] || 'e.id';
    const validatedSortOrder = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // Count query for total matching records
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      ${whereSql}
    `;
    const [countResult] = await db.query(countQuery, queryParams);
    const total = countResult[0].total;

    // Main paginated query
    const dataQuery = `
      SELECT 
        e.id,
        e.employee_id,
        e.first_name,
        e.last_name,
        CONCAT(e.first_name, ' ', e.last_name) AS full_name,
        e.email,
        e.phone,
        e.department_id,
        d.name AS department_name,
        d.code AS department_code,
        e.position,
        e.employment_type,
        DATE_FORMAT(e.hire_date, '%Y-%m-%d') AS hire_date,
        e.salary,
        e.status,
        e.created_at
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      ${whereSql}
      ORDER BY ${validatedSortBy} ${validatedSortOrder}
      LIMIT ? OFFSET ?
    `;

    const [rows] = await db.query(dataQuery, [...queryParams, limitNum, offset]);

    res.json({
      success: true,
      data: rows,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum) || 1
      }
    });
  } catch (error) {
    console.error('Error getting employees:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve employees', error: error.message });
  }
};

// Export all matching records for CSV/JSON
exports.exportEmployees = async (req, res) => {
  try {
    const { search = '', departmentId = '', status = '' } = req.query;

    const whereClauses = [];
    const queryParams = [];

    if (search && search.trim() !== '') {
      const searchTerm = `%${search.trim()}%`;
      whereClauses.push(
        '(e.first_name LIKE ? OR e.last_name LIKE ? OR CONCAT(e.first_name, " ", e.last_name) LIKE ? OR e.employee_id LIKE ? OR e.email LIKE ?)'
      );
      queryParams.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
    }

    if (departmentId && departmentId !== 'all') {
      whereClauses.push('e.department_id = ?');
      queryParams.push(departmentId);
    }

    if (status && status !== 'all') {
      whereClauses.push('e.status = ?');
      queryParams.push(status);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const query = `
      SELECT 
        e.employee_id AS 'Employee ID',
        CONCAT(e.first_name, ' ', e.last_name) AS 'Full Name',
        e.email AS 'Email',
        e.phone AS 'Phone',
        COALESCE(d.name, 'Unassigned') AS 'Department',
        e.position AS 'Designation',
        e.employment_type AS 'Type',
        DATE_FORMAT(e.hire_date, '%d/%m/%Y') AS 'Hire Date',
        e.salary AS 'Salary ($)',
        e.status AS 'Status'
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      ${whereSql}
      ORDER BY e.first_name ASC
    `;

    const [rows] = await db.query(query, queryParams);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ success: false, message: 'Failed to export employee records' });
  }
};

// Get single employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT 
        e.id,
        e.employee_id,
        e.first_name,
        e.last_name,
        CONCAT(e.first_name, ' ', e.last_name) AS full_name,
        e.email,
        e.phone,
        e.department_id,
        d.name AS department_name,
        d.code AS department_code,
        e.position,
        e.employment_type,
        DATE_FORMAT(e.hire_date, '%Y-%m-%d') AS hire_date,
        e.salary,
        e.status,
        e.created_at,
        e.updated_at
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      WHERE e.id = ?
    `;
    const [rows] = await db.query(query, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch employee record' });
  }
};

// Create new employee
exports.createEmployee = async (req, res) => {
  try {
    const {
      employee_id,
      first_name,
      last_name,
      email,
      phone,
      department_id,
      position,
      employment_type = 'Full-time',
      hire_date,
      salary = 0,
      status = 'Active'
    } = req.body;

    // Basic validation
    if (!first_name || !last_name || !email || !position || !hire_date) {
      return res.status(400).json({
        success: false,
        message: 'First name, last name, email, position, and hire date are required.'
      });
    }

    // Check duplicate email
    const [existingEmail] = await db.query('SELECT id FROM employees WHERE email = ?', [email.trim()]);
    if (existingEmail.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'An employee with this email address already exists.'
      });
    }

    // Determine employee ID
    let finalEmpId = employee_id ? employee_id.trim() : null;
    if (!finalEmpId) {
      finalEmpId = await generateEmployeeId();
    } else {
      const [existingId] = await db.query('SELECT id FROM employees WHERE employee_id = ?', [finalEmpId]);
      if (existingId.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Employee ID "${finalEmpId}" is already taken.`
        });
      }
    }

    // Insert
    const insertSql = `
      INSERT INTO employees 
      (employee_id, first_name, last_name, email, phone, department_id, position, employment_type, hire_date, salary, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(insertSql, [
      finalEmpId,
      first_name.trim(),
      last_name.trim(),
      email.trim().toLowerCase(),
      phone || null,
      department_id || null,
      position.trim(),
      employment_type,
      hire_date,
      salary ? parseFloat(salary) : 0,
      status
    ]);

    res.status(201).json({
      success: true,
      message: 'Employee registered successfully',
      data: { id: result.insertId, employee_id: finalEmpId }
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ success: false, message: 'Failed to create employee record', error: error.message });
  }
};

// Update employee
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      email,
      phone,
      department_id,
      position,
      employment_type,
      hire_date,
      salary,
      status
    } = req.body;

    // Check employee exists
    const [existing] = await db.query('SELECT id FROM employees WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }

    // Check email uniqueness if email provided
    if (email) {
      const [emailDup] = await db.query('SELECT id FROM employees WHERE email = ? AND id != ?', [email.trim().toLowerCase(), id]);
      if (emailDup.length > 0) {
        return res.status(400).json({ success: false, message: 'Another employee with this email already exists' });
      }
    }

    const updateSql = `
      UPDATE employees 
      SET 
        first_name = COALESCE(?, first_name),
        last_name = COALESCE(?, last_name),
        email = COALESCE(?, email),
        phone = COALESCE(?, phone),
        department_id = ?,
        position = COALESCE(?, position),
        employment_type = COALESCE(?, employment_type),
        hire_date = COALESCE(?, hire_date),
        salary = COALESCE(?, salary),
        status = COALESCE(?, status)
      WHERE id = ?
    `;

    await db.query(updateSql, [
      first_name ? first_name.trim() : null,
      last_name ? last_name.trim() : null,
      email ? email.trim().toLowerCase() : null,
      phone !== undefined ? phone : null,
      department_id !== undefined ? (department_id || null) : null,
      position ? position.trim() : null,
      employment_type || null,
      hire_date || null,
      salary !== undefined ? parseFloat(salary) : null,
      status || null,
      id
    ]);

    res.json({ success: true, message: 'Employee updated successfully' });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ success: false, message: 'Failed to update employee record', error: error.message });
  }
};

// Delete employee
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM employees WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.json({ success: true, message: 'Employee record deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ success: false, message: 'Failed to delete employee record', error: error.message });
  }
};

