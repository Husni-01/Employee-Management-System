import React from 'react';
import { X, Mail, Phone, Building, Calendar, DollarSign, Award, Clock } from 'lucide-react';

export default function EmployeeDetailModal({ isOpen, onClose, employee, onEdit }) {
  if (!isOpen || !employee) return null;

  return (
    <div className="modal-overlay">
      <div
        className="animate-fade-in"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '560px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
          overflow: 'hidden'
        }}
      >
        {/* Top Header Card */}
        <div style={{
          backgroundColor: '#0e172e',
          color: '#ffffff',
          padding: '28px',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: '#ffffff',
              padding: '6px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#fdb827',
              color: '#111827',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              fontWeight: '800'
            }}>
              {employee.first_name[0]}{employee.last_name[0]}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: '800', margin: 0 }}>
                  {employee.first_name} {employee.last_name}
                </h3>
                <span style={{
                  backgroundColor: '#1c326d',
                  color: '#93c5fd',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: '700'
                }}>
                  {employee.employee_id}
                </span>
              </div>
              <p style={{ fontSize: '13.5px', color: '#cbd5e1', margin: '4px 0 0' }}>
                {employee.position}
              </p>
            </div>
          </div>
        </div>

        {/* Details List */}
        <div style={{ padding: '28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <Building size={18} color="#1c326d" style={{ marginTop: '2px' }} />
              <div>
                <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>
                  Department
                </span>
                <p style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', margin: '2px 0 0' }}>
                  {employee.department_name || 'Unassigned'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <Award size={18} color="#1c326d" style={{ marginTop: '2px' }} />
              <div>
                <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>
                  Status
                </span>
                <p style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', margin: '2px 0 0' }}>
                  {employee.status}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <Mail size={18} color="#1c326d" style={{ marginTop: '2px' }} />
              <div>
                <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>
                  Email
                </span>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: '2px 0 0', wordBreak: 'break-all' }}>
                  {employee.email}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <Phone size={18} color="#1c326d" style={{ marginTop: '2px' }} />
              <div>
                <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>
                  Phone
                </span>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: '2px 0 0' }}>
                  {employee.phone || 'N/A'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <Calendar size={18} color="#1c326d" style={{ marginTop: '2px' }} />
              <div>
                <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>
                  Hire Date
                </span>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: '2px 0 0' }}>
                  {employee.hire_date ? employee.hire_date.split('-').reverse().join('/') : '-'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <Clock size={18} color="#1c326d" style={{ marginTop: '2px' }} />
              <div>
                <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>
                  Employment Type
                </span>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: '2px 0 0' }}>
                  {employee.employment_type || 'Full-time'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', gridColumn: 'span 2' }}>
              <DollarSign size={18} color="#16a34a" style={{ marginTop: '2px' }} />
              <div>
                <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>
                  Annual Salary
                </span>
                <p style={{ fontSize: '16px', fontWeight: '800', color: '#16a34a', margin: '2px 0 0' }}>
                  ${Number(employee.salary || 0).toLocaleString()} / year
                </p>
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '10px',
            marginTop: '28px',
            paddingTop: '16px',
            borderTop: '1px solid #f1f5f9'
          }}>
            <button
              onClick={onClose}
              style={{
                padding: '9px 18px',
                borderRadius: '10px',
                backgroundColor: '#f1f5f9',
                color: '#475569',
                fontWeight: '600',
                fontSize: '13.5px'
              }}
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onEdit(employee);
              }}
              style={{
                padding: '9px 20px',
                borderRadius: '10px',
                backgroundColor: '#1c326d',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '13.5px'
              }}
            >
              Edit Information
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

