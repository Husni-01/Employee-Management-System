const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function initializeDatabase() {
  const host = process.env.DB_HOST || '127.0.0.1';
  const port = parseInt(process.env.DB_PORT, 10) || 3306;
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'employee_management_db';

  let rootConnection;
  try {
    console.log(`[DB Init] Connecting to MySQL at ${host}:${port}...`);
    rootConnection = await mysql.createConnection({ host, port, user, password });

    await rootConnection.query(
      `CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    console.log(`[DB Init] Database "${database}" verified/created.`);
    await rootConnection.end();

    const pool = await mysql.createPool({
      host,
      port,
      user,
      password,
      database,
      multipleStatements: true
    });

    console.log('[DB Init] Creating schema tables and optimized indexes...');

    const schemaSql = `
      CREATE TABLE IF NOT EXISTS departments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        code VARCHAR(20) NOT NULL UNIQUE,
        description TEXT,
        location VARCHAR(100) DEFAULT 'Main Headquarters',
        budget DECIMAL(12, 2) DEFAULT 0.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_dept_name (name),
        INDEX idx_dept_code (code)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

      CREATE TABLE IF NOT EXISTS employees (
        id INT AUTO_INCREMENT PRIMARY KEY,
        employee_id VARCHAR(30) NOT NULL UNIQUE,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        phone VARCHAR(25),
        department_id INT NULL,
        position VARCHAR(100) NOT NULL,
        employment_type ENUM('Full-time', 'Part-time', 'Contract', 'Intern') DEFAULT 'Full-time',
        hire_date DATE NOT NULL,
        salary DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
        status ENUM('Active', 'On Leave', 'Terminated', 'Probation') DEFAULT 'Active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_employee_department
          FOREIGN KEY (department_id)
          REFERENCES departments(id)
          ON DELETE SET NULL
          ON UPDATE CASCADE,
        INDEX idx_emp_search (first_name, last_name, employee_id),
        INDEX idx_emp_dept (department_id),
        INDEX idx_emp_status (status),
        INDEX idx_emp_hire_date (hire_date)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await pool.query(schemaSql);
    console.log('[DB Init] Tables created successfully.');

    // Seed departments if empty
    const [deptRows] = await pool.query('SELECT COUNT(*) as count FROM departments');
    if (deptRows[0].count === 0) {
      console.log('[DB Init] Seeding initial departments...');
      const depts = [
        ['Engineering', 'ENG', 'Software development, cloud infrastructure & DevOps', 'Floor 4, Tech Wing', 450000.00],
        ['Human Resources', 'HR', 'Talent acquisition, employee welfare & policy compliance', 'Floor 2, HR Suite', 180000.00],
        ['Finance & Accounting', 'FIN', 'Budget planning, auditing, payroll & tax management', 'Floor 3, Executive Wing', 260000.00],
        ['Marketing & Growth', 'MKT', 'Brand strategy, social media campaigns & customer acquisition', 'Floor 2, Creative Hub', 220000.00],
        ['Product & Design', 'PRD', 'UI/UX research, wireframing, feature planning & prototyping', 'Floor 4, Innovation Lab', 290000.00],
        ['Operations & Logistics', 'OPS', 'Facilities, vendor relations, procurement & customer support', 'Floor 1, Logistics Area', 150000.00]
      ];

      for (const dept of depts) {
        await pool.query(
          'INSERT INTO departments (name, code, description, location, budget) VALUES (?, ?, ?, ?, ?)',
          dept
        );
      }
      console.log('[DB Init] Seeded 6 departments.');
    }

    // Seed sample employees if empty
    const [empRows] = await pool.query('SELECT COUNT(*) as count FROM employees');
    if (empRows[0].count === 0) {
      console.log('[DB Init] Seeding initial employee records...');
      const [departments] = await pool.query('SELECT id, code FROM departments');
      const deptMap = {};
      departments.forEach(d => { deptMap[d.code] = d.id; });

      const employees = [
        ['EMP-1001', 'Abebe', 'Gemechu', 'abebe.gemechu@xceltech.com', '+1 (555) 234-5678', deptMap['ENG'], 'Senior Software Engineer', 'Full-time', '2022-04-22', 88000.00, 'Active'],
        ['EMP-1002', 'Aman', 'Bey', 'aman.bey@xceltech.com', '+1 (555) 345-6789', deptMap['HR'], 'HR Operations Lead', 'Full-time', '2022-04-22', 72000.00, 'Active'],
        ['EMP-1003', 'Feven', 'Tesfaye', 'feven.tesfaye@xceltech.com', '+1 (555) 456-7890', deptMap['PRD'], 'Lead Product Designer', 'Full-time', '2022-04-22', 91000.00, 'On Leave'],
        ['EMP-1004', 'Gelila', 'Moges', 'gelila.moges@xceltech.com', '+1 (555) 567-8901', deptMap['ENG'], 'Full Stack Developer', 'Full-time', '2022-04-22', 79000.00, 'Active'],
        ['EMP-1005', 'Yanet', 'Tesfaye', 'yanet.tesfaye@xceltech.com', '+1 (555) 678-9012', deptMap['FIN'], 'Senior Financial Analyst', 'Full-time', '2022-04-22', 84000.00, 'Active'],
        ['EMP-1006', 'Beti', 'Woloe', 'beti.woloe@xceltech.com', '+1 (555) 789-0123', deptMap['MKT'], 'Marketing Specialist', 'Full-time', '2022-04-22', 65000.00, 'Active'],
        ['EMP-1007', 'Dawit', 'Int', 'dawit.int@xceltech.com', '+1 (555) 890-1234', deptMap['OPS'], 'Operations Coordinator', 'Full-time', '2022-04-22', 62000.00, 'Active'],
        ['EMP-1008', 'Marcus', 'Vance', 'marcus.vance@xceltech.com', '+1 (555) 901-2345', deptMap['ENG'], 'Cloud DevOps Architect', 'Full-time', '2023-01-15', 96000.00, 'Active'],
        ['EMP-1009', 'Elena', 'Rostova', 'elena.rostova@xceltech.com', '+1 (555) 012-3456', deptMap['HR'], 'Talent Acquisition Partner', 'Contract', '2023-03-10', 68000.00, 'Active'],
        ['EMP-1010', 'Samuel', 'Kofi', 'samuel.kofi@xceltech.com', '+1 (555) 123-4567', deptMap['FIN'], 'Payroll & Tax Accountant', 'Full-time', '2023-06-01', 74000.00, 'Probation'],
        ['EMP-1011', 'Zoe', 'Chen', 'zoe.chen@xceltech.com', '+1 (555) 234-8765', deptMap['PRD'], 'UX Researcher', 'Full-time', '2023-08-20', 80000.00, 'Active'],
        ['EMP-1012', 'Tariq', 'Al-Mansoor', 'tariq.mansoor@xceltech.com', '+1 (555) 345-9876', deptMap['ENG'], 'QA Automation Engineer', 'Full-time', '2023-10-12', 76000.00, 'Active'],
        ['EMP-1013', 'Chloe', 'Dubois', 'chloe.dubois@xceltech.com', '+1 (555) 456-0987', deptMap['MKT'], 'Content & SEO Strategist', 'Part-time', '2024-02-01', 48000.00, 'Active'],
        ['EMP-1014', 'Liam', 'O\'Connor', 'liam.oconnor@xceltech.com', '+1 (555) 567-1098', deptMap['OPS'], 'Facilities & Procurement Specialist', 'Full-time', '2024-04-18', 64000.00, 'Active']
      ];

      for (const emp of employees) {
        await pool.query(
          `INSERT INTO employees 
           (employee_id, first_name, last_name, email, phone, department_id, position, employment_type, hire_date, salary, status) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          emp
        );
      }
      console.log(`[DB Init] Seeded ${employees.length} employees.`);
    }

    console.log('[DB Init] Database initialization complete!');
    await pool.end();
  } catch (err) {
    console.error('[DB Init Error]:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase;

