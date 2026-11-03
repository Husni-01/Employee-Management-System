const db = require('../config/db');

exports.getDashboardSummary = async (req, res) => {
  try {
    // 1. Basic counts
    const [empCount] = await db.query('SELECT COUNT(*) as total FROM employees');
    const [deptCount] = await db.query('SELECT COUNT(*) as total FROM departments');
    const [activeCount] = await db.query("SELECT COUNT(*) as total FROM employees WHERE status = 'Active'");
    const [leaveCount] = await db.query("SELECT COUNT(*) as total FROM employees WHERE status = 'On Leave'");
    const [probationCount] = await db.query("SELECT COUNT(*) as total FROM employees WHERE status = 'Probation'");
    
    // Financial metrics
    const [payrollStats] = await db.query(`
      SELECT 
        COALESCE(SUM(salary), 0) as total_payroll,
        COALESCE(AVG(salary), 0) as avg_salary,
        COALESCE(MIN(salary), 0) as min_salary,
        COALESCE(MAX(salary), 0) as max_salary
      FROM employees
    `);

    // Department breakdown
    const [deptBreakdown] = await db.query(`
      SELECT 
        d.id,
        d.name,
        d.code,
        COUNT(e.id) as employee_count,
        COALESCE(SUM(e.salary), 0) as total_salary
      FROM departments d
      LEFT JOIN employees e ON d.id = e.department_id
      GROUP BY d.id
      ORDER BY employee_count DESC
    `);

    // Status breakdown
    const [statusBreakdown] = await db.query(`
      SELECT status, COUNT(*) as count 
      FROM employees 
      GROUP BY status
    `);

    // Employment type breakdown
    const [typeBreakdown] = await db.query(`
      SELECT employment_type, COUNT(*) as count 
      FROM employees 
      GROUP BY employment_type
    `);

    // Recent hires (top 6)
    const [recentHires] = await db.query(`
      SELECT 
        e.id,
        e.employee_id,
        CONCAT(e.first_name, ' ', e.last_name) AS full_name,
        d.name as department_name,
        e.position,
        DATE_FORMAT(e.hire_date, '%d/%m/%Y') as hire_date,
        e.status
      FROM employees e
      LEFT JOIN departments d ON e.department_id = d.id
      ORDER BY e.hire_date DESC, e.id DESC
      LIMIT 6
    `);

    res.json({
      success: true,
      data: {
        metrics: {
          totalEmployees: empCount[0].total,
          totalDepartments: deptCount[0].total,
          activeEmployees: activeCount[0].total,
          onLeaveEmployees: leaveCount[0].total,
          probationEmployees: probationCount[0].total,
          totalPayroll: payrollStats[0].total_payroll,
          avgSalary: Math.round(payrollStats[0].avg_salary)
        },
        deptBreakdown,
        statusBreakdown,
        typeBreakdown,
        recentHires
      }
    });
  } catch (error) {
    console.error('Error generating reports:', error);
    res.status(500).json({ success: false, message: 'Failed to generate report summaries', error: error.message });
  }
};

