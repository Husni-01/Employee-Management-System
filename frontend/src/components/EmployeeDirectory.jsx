import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronDown, 
  Download, 
  FileSpreadsheet, 
  Eye, 
  Edit3, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  UserPlus
} from 'lucide-react';

export default function EmployeeDirectory({
  employees = [],
  pagination = {},
  loading = false,
  currentPage,
  setCurrentPage,
  onViewEmployee,
  onEditEmployee,
  onDeleteEmployee,
  onExport,
  statusFilter,
  setStatusFilter,
  openAddModal
}) {
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [activeActionId, setActiveActionId] = useState(null);
  const actionMenuRef = useRef(null);
  const exportMenuRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target)) {
        setActiveActionId(null);
      }
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setExportDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Active':
        return { bg: '#e6f4ea', color: '#137333', border: '1px solid #ceead6' };
      case 'On Leave':
        return { bg: '#fef7e0', color: '#b06000', border: '1px solid #feefc3' };
      case 'Probation':
        return { bg: '#e8f0fe', color: '#1a73e8', border: '1px solid #d2e3fc' };
      case 'Terminated':
        return { bg: '#fce8e6', color: '#c5221f', border: '1px solid #fad2cf' };
      default:
        return { bg: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' };
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        padding: '28px 32px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
        border: '1px solid #e8eef7'
      }}
    >
      {/* Container Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#141f36', margin: 0 }}>
            Employee Records
          </h3>
          <p style={{ fontSize: '13px', color: '#7e8ba3', marginTop: '4px' }}>
            Comprehensive directory of current personnel, assignments, and employment states
          </p>
        </div>

        {/* Right Action Tools: Status Filter + Green Export Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Status quick filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f8fafc', padding: '6px 12px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <Filter size={15} color="#64748b" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: '13px',
                fontWeight: '600',
                color: '#334155',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Probation">Probation</option>
              <option value="Terminated">Terminated</option>
            </select>
          </div>

          {/* Export Button matching reference screenshot */}
          <div style={{ position: 'relative' }} ref={exportMenuRef}>
            <button
              onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
              style={{
                backgroundColor: '#328332',
                color: '#ffffff',
                padding: '9px 20px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '700',
                boxShadow: '0 4px 10px rgba(50, 131, 50, 0.25)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#296d29'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#328332'}
            >
              <span>Export</span>
              <ChevronDown size={16} />
            </button>

            {/* Export Dropdown */}
            {exportDropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '46px',
                  right: '0',
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
                  border: '1px solid #e2e8f0',
                  padding: '6px',
                  minWidth: '170px',
                  zIndex: 70
                }}
              >
                <button
                  onClick={() => {
                    onExport('csv');
                    setExportDropdownOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    background: 'transparent',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#334155',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <FileSpreadsheet size={16} color="#328332" />
                  <span>Export to CSV</span>
                </button>
                <button
                  onClick={() => {
                    onExport('json');
                    setExportDropdownOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    background: 'transparent',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#334155',
                    textAlign: 'left'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <Download size={16} color="#1c326d" />
                  <span>Export to JSON</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Table Container matching exact layout */}
      <div style={{ overflowX: 'auto', position: 'relative' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px' }}>
          <thead>
            <tr style={{ backgroundColor: '#dbe7f6', color: '#141f36' }}>
              <th style={{ padding: '14px 18px', textAlign: 'left', fontWeight: '800', fontSize: '13.5px', borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px' }}>
                Name(s)
              </th>
              <th style={{ padding: '14px 14px', textAlign: 'left', fontWeight: '800', fontSize: '13.5px' }}>
                Employee ID
              </th>
              <th style={{ padding: '14px 14px', textAlign: 'left', fontWeight: '800', fontSize: '13.5px' }}>
                Department
              </th>
              <th style={{ padding: '14px 14px', textAlign: 'left', fontWeight: '800', fontSize: '13.5px' }}>
                Role / Position
              </th>
              <th style={{ padding: '14px 14px', textAlign: 'left', fontWeight: '800', fontSize: '13.5px' }}>
                Join Date
              </th>
              <th style={{ padding: '14px 14px', textAlign: 'left', fontWeight: '800', fontSize: '13.5px' }}>
                Status
              </th>
              <th style={{ padding: '14px 18px', textAlign: 'center', fontWeight: '800', fontSize: '13.5px', borderTopRightRadius: '10px', borderBottomRightRadius: '10px' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '48px', color: '#64748b', fontSize: '14px' }}>
                  Loading employee records...
                </td>
              </tr>
            ) : employees.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '56px 20px', color: '#64748b' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <p style={{ fontSize: '15px', fontWeight: '600' }}>No employees found matching your criteria.</p>
                    <button
                      onClick={openAddModal}
                      style={{
                        backgroundColor: '#1c326d',
                        color: '#fff',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <UserPlus size={16} />
                      <span>Onboard New Employee</span>
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              employees.map((emp) => {
                const statusStyle = getStatusBadgeStyle(emp.status);
                const isActionActive = activeActionId === emp.id;

                return (
                  <tr
                    key={emp.id}
                    style={{
                      backgroundColor: '#ffffff',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                  >
                    {/* Name: formatted in lowercase style as in reference image */}
                    <td style={{ padding: '16px 18px', fontSize: '14px', color: '#1e293b', fontWeight: '600', borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          backgroundColor: '#e2e8f0',
                          color: '#1c326d',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: '700'
                        }}>
                          {emp.first_name[0]}{emp.last_name[0]}
                        </div>
                        <div>
                          <div>{`${emp.first_name} ${emp.last_name}`.toLowerCase()}</div>
                          <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '400' }}>{emp.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Employee ID */}
                    <td style={{ padding: '16px 14px', fontSize: '13.5px', color: '#475569', fontWeight: '600' }}>
                      <span style={{ backgroundColor: '#f1f5f9', padding: '3px 8px', borderRadius: '6px' }}>
                        {emp.employee_id}
                      </span>
                    </td>

                    {/* Department */}
                    <td style={{ padding: '16px 14px', fontSize: '13.5px', color: '#334155', fontWeight: '500' }}>
                      {emp.department_name || <span style={{ color: '#94a3b8' }}>Unassigned</span>}
                    </td>

                    {/* Position */}
                    <td style={{ padding: '16px 14px', fontSize: '13.5px', color: '#334155', fontWeight: '500' }}>
                      {emp.position}
                    </td>

                    {/* Join Date: DD/MM/YYYY */}
                    <td style={{ padding: '16px 14px', fontSize: '13.5px', color: '#475569', fontWeight: '500' }}>
                      {emp.hire_date ? emp.hire_date.split('-').reverse().join('/') : '-'}
                    </td>

                    {/* Status Badge */}
                    <td style={{ padding: '16px 14px' }}>
                      <span
                        style={{
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.color,
                          border: statusStyle.border,
                          padding: '4px 10px',
                          borderRadius: '9999px',
                          fontSize: '12px',
                          fontWeight: '700',
                          display: 'inline-block'
                        }}
                      >
                        {emp.status}
                      </span>
                    </td>

                    {/* Actions Rounded Dark Blue Button from screenshot */}
                    <td style={{ padding: '16px 18px', textAlign: 'center', borderTopRightRadius: '10px', borderBottomRightRadius: '10px', position: 'relative' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveActionId(isActionActive ? null : emp.id);
                        }}
                        style={{
                          backgroundColor: '#1c326d',
                          color: '#ffffff',
                          padding: '7px 16px',
                          borderRadius: '10px',
                          fontSize: '13px',
                          fontWeight: '700',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: '0 2px 6px rgba(28, 50, 109, 0.25)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#162758'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1c326d'}
                      >
                        <span>Actions</span>
                        <ChevronDown size={14} />
                      </button>

                      {/* Dropdown Action Popover */}
                      {isActionActive && (
                        <div
                          ref={actionMenuRef}
                          style={{
                            position: 'absolute',
                            right: '18px',
                            top: '52px',
                            backgroundColor: '#ffffff',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                            border: '1px solid #e2e8f0',
                            padding: '6px',
                            zIndex: 80,
                            minWidth: '150px',
                            textAlign: 'left'
                          }}
                        >
                          <button
                            onClick={() => {
                              onViewEmployee(emp);
                              setActiveActionId(null);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              width: '100%',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              background: 'transparent',
                              fontSize: '13px',
                              fontWeight: '600',
                              color: '#334155',
                              textAlign: 'left'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <Eye size={15} color="#1c326d" />
                            <span>View Details</span>
                          </button>

                          <button
                            onClick={() => {
                              onEditEmployee(emp);
                              setActiveActionId(null);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              width: '100%',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              background: 'transparent',
                              fontSize: '13px',
                              fontWeight: '600',
                              color: '#334155',
                              textAlign: 'left'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <Edit3 size={15} color="#f59e0b" />
                            <span>Edit Record</span>
                          </button>

                          <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '4px 0' }} />

                          <button
                            onClick={() => {
                              onDeleteEmployee(emp);
                              setActiveActionId(null);
                            }}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              width: '100%',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              background: 'transparent',
                              fontSize: '13px',
                              fontWeight: '600',
                              color: '#ef4444',
                              textAlign: 'left'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <Trash2 size={15} color="#ef4444" />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '24px',
        paddingTop: '18px',
        borderTop: '1px solid #f1f5f9',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>
          Showing <b>{employees.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0}</b> to{' '}
          <b>{Math.min(pagination.page * pagination.limit, pagination.total || 0)}</b> of{' '}
          <b>{pagination.total || 0}</b> employee entries
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            disabled={pagination.page <= 1}
            onClick={() => setCurrentPage(pagination.page - 1)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              backgroundColor: pagination.page <= 1 ? '#f1f5f9' : '#ffffff',
              border: '1px solid #e2e8f0',
              color: pagination.page <= 1 ? '#cbd5e1' : '#1e293b',
              fontSize: '13px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: pagination.page <= 1 ? 'not-allowed' : 'pointer'
            }}
          >
            <ChevronLeft size={16} />
            <span>Prev</span>
          </button>

          <span style={{ fontSize: '13px', fontWeight: '700', padding: '0 8px', color: '#1c326d' }}>
            Page {pagination.page || 1} of {pagination.totalPages || 1}
          </span>

          <button
            disabled={pagination.page >= (pagination.totalPages || 1)}
            onClick={() => setCurrentPage(pagination.page + 1)}
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              backgroundColor: pagination.page >= (pagination.totalPages || 1) ? '#f1f5f9' : '#ffffff',
              border: '1px solid #e2e8f0',
              color: pagination.page >= (pagination.totalPages || 1) ? '#cbd5e1' : '#1e293b',
              fontSize: '13px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: pagination.page >= (pagination.totalPages || 1) ? 'not-allowed' : 'pointer'
            }}
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

