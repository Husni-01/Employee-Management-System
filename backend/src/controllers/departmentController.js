const db = require('../config/db');

// Get all departments with employee counts
exports.getAllDepartments = async (req, res) => {
  try {
    const query = `
      SELECT 
        d.id,
        d.name,
        d.code,
        d.description,
        d.location,
        d.budget,
        d.created_at,
        COUNT(e.id) AS employee_count,
        COALESCE(SUM(e.salary), 0) AS total_payroll
      FROM departments d
      LEFT JOIN employees e ON d.id = e.department_id
      GROUP BY d.id
      ORDER BY d.name ASC;
    `;
    const [rows] = await db.query(query);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching departments:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve departments', error: error.message });
  }
};

// Get single department by ID with member list
exports.getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const [deptRows] = await db.query('SELECT * FROM departments WHERE id = ?', [id]);
    if (deptRows.length === 0) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    const [empRows] = await db.query(
      'SELECT id, employee_id, first_name, last_name, email, position, status, hire_date FROM employees WHERE department_id = ? ORDER BY first_name ASC',
      [id]
    );

    res.json({
      success: true,
      data: {
        ...deptRows[0],
        employees: empRows
      }
    });
  } catch (error) {
    console.error('Error fetching department details:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve department details' });
  }
};

// Create new department
exports.createDepartment = async (req, res) => {
  try {
    const { name, code, description, location, budget } = req.body;

    if (!name || !code) {
      return res.status(400).json({ success: false, message: 'Department name and code are required' });
    }

    // Check uniqueness
    const [existing] = await db.query('SELECT id FROM departments WHERE name = ? OR code = ?', [name, code]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'A department with this name or code already exists' });
    }

    const [result] = await db.query(
      'INSERT INTO departments (name, code, description, location, budget) VALUES (?, ?, ?, ?, ?)',
      [name, code.toUpperCase(), description || null, location || 'Main Headquarters', budget || 0]
    );

    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: { id: result.insertId, name, code: code.toUpperCase() }
    });
  } catch (error) {
    console.error('Error creating department:', error);
    res.status(500).json({ success: false, message: 'Failed to create department', error: error.message });
  }
};

// Update department
exports.updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, description, location, budget } = req.body;

    if (!name || !code) {
      return res.status(400).json({ success: false, message: 'Department name and code are required' });
    }

    // Check duplicate code or name on other departments
    const [dup] = await db.query('SELECT id FROM departments WHERE (name = ? OR code = ?) AND id != ?', [name, code, id]);
    if (dup.length > 0) {
      return res.status(400).json({ success: false, message: 'Another department is already using this name or code' });
    }

    await db.query(
      'UPDATE departments SET name = ?, code = ?, description = ?, location = ?, budget = ? WHERE id = ?',
      [name, code.toUpperCase(), description || null, location || 'Main Headquarters', budget || 0, id]
    );

    res.json({ success: true, message: 'Department updated successfully' });
  } catch (error) {
    console.error('Error updating department:', error);
    res.status(500).json({ success: false, message: 'Failed to update department', error: error.message });
  }
};

// Delete department
exports.deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    // Check how many employees belong to this department
    const [empCount] = await db.query('SELECT COUNT(*) as count FROM employees WHERE department_id = ?', [id]);
    
    // Set employees department_id to NULL before deleting or cascade
    await db.query('UPDATE employees SET department_id = NULL WHERE department_id = ?', [id]);

    const [result] = await db.query('DELETE FROM departments WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    res.json({
      success: true,
      message: `Department deleted successfully. ${empCount[0].count} employees unassigned.`
    });
  } catch (error) {
    console.error('Error deleting department:', error);
    res.status(500).json({ success: false, message: 'Failed to delete department', error: error.message });
  }
};

