import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TabsNav from './components/TabsNav';
import EmployeeDirectory from './components/EmployeeDirectory';
import EmployeeModal from './components/EmployeeModal';
import EmployeeDetailModal from './components/EmployeeDetailModal';
import DepartmentView from './components/DepartmentView';
import ReportsView from './components/ReportsView';
import { api } from './services/api';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('employees'); // sidebar tab
  const [currentView, setCurrentView] = useState('directory'); // 'directory' | 'departments' | 'reports'

  // Data states
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);
  const [employeeToView, setEmployeeToView] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Notification Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Sync sidebar tabs with main views
  useEffect(() => {
    if (activeTab === 'dashboard' || activeTab === 'payroll' || activeTab === 'performance') {
      setCurrentView('reports');
    } else if (activeTab === 'employees') {
      setCurrentView('directory');
    }
  }, [activeTab]);

  // Load Departments
  const fetchDepartments = useCallback(async () => {
    try {
      const res = await api.getDepartments();
      if (res.success) {
        setDepartments(res.data);
      }
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  }, []);

  // Load Employees
  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getEmployees({
        page: currentPage,
        limit: 10,
        search: searchQuery,
        departmentId: selectedDeptFilter,
        status: statusFilter
      });
      if (res.success) {
        setEmployees(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, selectedDeptFilter, statusFilter]);

  // Load Summary
  const fetchSummary = useCallback(async () => {
    try {
      const res = await api.getDashboardSummary();
      if (res.success) {
        setSummaryData(res.data);
      }
    } catch (err) {
      console.error('Error fetching reports summary:', err);
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    if (currentView === 'reports') {
      fetchSummary();
    }
  }, [currentView, fetchSummary]);

  // Search trigger on enter or icon click
  const handleSearchSubmit = () => {
    setCurrentPage(1);
    fetchEmployees();
  };

  // Save employee (create or update)
  const handleSaveEmployee = async (formData, id) => {
    if (id) {
      await api.updateEmployee(id, formData);
      showToast('Employee updated successfully!');
    } else {
      await api.createEmployee(formData);
      showToast('New employee registered successfully!');
    }
    fetchEmployees();
    fetchDepartments();
    fetchSummary();
  };

  // Delete employee
  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await api.deleteEmployee(deleteConfirm.id);
      showToast(`Employee "${deleteConfirm.first_name} ${deleteConfirm.last_name}" deleted.`);
      setDeleteConfirm(null);
      fetchEmployees();
      fetchDepartments();
      fetchSummary();
    } catch (err) {
      showToast(err.message || 'Failed to delete employee', 'error');
    }
  };

  // Department CRUD
  const handleCreateDepartment = async (deptData) => {
    await api.createDepartment(deptData);
    showToast('Department created successfully!');
    fetchDepartments();
    fetchSummary();
  };

  const handleUpdateDepartment = async (id, deptData) => {
    await api.updateDepartment(id, deptData);
    showToast('Department updated successfully!');
    fetchDepartments();
    fetchEmployees();
    fetchSummary();
  };

  const handleDeleteDepartment = async (dept) => {
    if (window.confirm(`Are you sure you want to delete department "${dept.name}"? Assigned employees will be unassigned.`)) {
      try {
        await api.deleteDepartment(dept.id);
        showToast('Department deleted successfully.');
        fetchDepartments();
        fetchEmployees();
        fetchSummary();
      } catch (err) {
        showToast(err.message, 'error');
      }
    }
  };

  // Data Export (CSV or JSON)
  const handleExport = async (format) => {
    try {
      showToast('Preparing export data...');
      const res = await api.exportEmployees({
        search: searchQuery,
        departmentId: selectedDeptFilter,
        status: statusFilter
      });

      if (!res.success || !res.data || res.data.length === 0) {
        showToast('No records found to export', 'error');
        return;
      }

      if (format === 'json') {
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(res.data, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', dataStr);
        downloadAnchor.setAttribute('download', `employees_export_${Date.now()}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        showToast('JSON export downloaded!');
      } else {
        // CSV formatting
        const headers = Object.keys(res.data[0]);
        const csvRows = [
          headers.join(','),
          ...res.data.map(row =>
            headers.map(header => {
              const val = row[header] === null || row[header] === undefined ? '' : String(row[header]);
              return `"${val.replace(/"/g, '""')}"`;
            }).join(',')
          )
        ];
        const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvRows.join('\n'));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', csvContent);
        downloadAnchor.setAttribute('download', `employees_export_${Date.now()}.csv`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        showToast('CSV export downloaded!');
      }
    } catch (err) {
      console.error('Export error:', err);
      showToast('Failed to export records', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#edf2f9' }}>
      {/* Toast Notification */}
      {toast && (
        <div
          className="animate-fade-in"
          style={{
            position: 'fixed',
            top: '20px',
            right: '24px',
            zIndex: 9999,
            backgroundColor: toast.type === 'error' ? '#ef4444' : '#10b981',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '14px',
            fontWeight: '600'
          }}
        >
          {toast.type === 'error' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
          <span>{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            style={{ background: 'transparent', color: '#ffffff', marginLeft: '6px' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Sidebar matching screenshot */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header */}
        <Header
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedDeptFilter={selectedDeptFilter}
          setSelectedDeptFilter={setSelectedDeptFilter}
          departments={departments}
          onSearchSubmit={handleSearchSubmit}
        />

        {/* Content Body with Padding */}
        <main style={{ padding: '24px 32px 48px', flex: 1 }}>
          {/* Subheader & Top Action Buttons */}
          <TabsNav
            currentView={currentView}
            setCurrentView={setCurrentView}
            openAddModal={() => {
              setEmployeeToEdit(null);
              setIsEmployeeModalOpen(true);
            }}
          />

          {/* Dynamic Views */}
          {currentView === 'directory' && (
            <EmployeeDirectory
              employees={employees}
              pagination={pagination}
              loading={loading}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              onViewEmployee={(emp) => setEmployeeToView(emp)}
              onEditEmployee={(emp) => {
                setEmployeeToEdit(emp);
                setIsEmployeeModalOpen(true);
              }}
              onDeleteEmployee={(emp) => setDeleteConfirm(emp)}
              onExport={handleExport}
              openAddModal={() => {
                setEmployeeToEdit(null);
                setIsEmployeeModalOpen(true);
              }}
            />
          )}

          {currentView === 'departments' && (
            <DepartmentView
              departments={departments}
              onCreateDepartment={handleCreateDepartment}
              onUpdateDepartment={handleUpdateDepartment}
              onDeleteDepartment={handleDeleteDepartment}
            />
          )}

          {currentView === 'reports' && (
            <ReportsView
              summaryData={summaryData}
              loading={!summaryData}
            />
          )}
        </main>
      </div>

      {/* Modal for Add / Edit Employee */}
      <EmployeeModal
        isOpen={isEmployeeModalOpen}
        onClose={() => setIsEmployeeModalOpen(false)}
        onSave={handleSaveEmployee}
        employeeToEdit={employeeToEdit}
        departments={departments}
      />

      {/* Modal for View Details */}
      <EmployeeDetailModal
        isOpen={Boolean(employeeToView)}
        onClose={() => setEmployeeToView(null)}
        employee={employeeToView}
        onEdit={(emp) => {
          setEmployeeToEdit(emp);
          setIsEmployeeModalOpen(true);
        }}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div
            className="animate-fade-in"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              padding: '28px',
              maxWidth: '420px',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}
          >
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              backgroundColor: '#fee2e2',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <AlertTriangle size={28} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', marginBottom: '8px' }}>
              Delete Employee Record?
            </h3>
            <p style={{ fontSize: '13.5px', color: '#64748b', marginBottom: '24px' }}>
              Are you sure you want to permanently remove <b>{deleteConfirm.first_name} {deleteConfirm.last_name}</b> ({deleteConfirm.employee_id})? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => setDeleteConfirm(null)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '10px',
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  fontWeight: '600',
                  fontSize: '13.5px'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                style={{
                  padding: '10px 22px',
                  borderRadius: '10px',
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  fontWeight: '700',
                  fontSize: '13.5px'
                }}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
