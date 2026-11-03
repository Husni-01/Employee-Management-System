import React, { useState } from 'react';
import { Building2, Plus, Edit2, Trash2, Users, DollarSign, X } from 'lucide-react';

export default function DepartmentView({
  departments = [],
  onCreateDepartment,
  onUpdateDepartment,
  onDeleteDepartment
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '', description: '', location: '', budget: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const openCreateModal = () => {
    setEditingDept(null);
    setFormData({ name: '', code: '', description: '', location: 'Main Headquarters', budget: '' });
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (dept) => {
    setEditingDept(dept);
    setFormData({
      name: dept.name,
      code: dept.code,
      description: dept.description || '',
      location: dept.location || 'Main Headquarters',
      budget: dept.budget || ''
    });
    setError('');
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      setError('Department name and code are required.');
      return;
    }

    try {
      setSubmitting(true);
      if (editingDept) {
        await onUpdateDepartment(editingDept.id, formData);
      } else {
        await onCreateDepartment(formData);
      }
      setModalOpen(false);
    } catch (err) {
      setError(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
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
            Department Management
          </h3>
          <p style={{ fontSize: '13px', color: '#7e8ba3', marginTop: '4px' }}>
            Organize divisions, allocated budgets, and staff assignments
          </p>
        </div>

        <button
          onClick={openCreateModal}
          style={{
            backgroundColor: '#1c326d',
            color: '#ffffff',
            padding: '10px 20px',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 10px rgba(28, 50, 109, 0.25)'
          }}
        >
          <Plus size={18} />
          <span>New Department</span>
        </button>
      </div>

      {/* Department Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        {departments.map((dept) => (
          <div
            key={dept.id}
            style={{
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '20px',
              backgroundColor: '#f8fafc',
              position: 'relative',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  backgroundColor: '#1c326d',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '14px'
                }}>
                  {dept.code}
                </div>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#141f36', margin: 0 }}>
                    {dept.name}
                  </h4>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>{dept.location}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => openEditModal(dept)}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    color: '#1c326d',
                    padding: '6px',
                    borderRadius: '8px'
                  }}
                  title="Edit Department"
                >
                  <Edit2 size={15} />
                </button>
                <button
                  onClick={() => onDeleteDepartment(dept)}
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    color: '#ef4444',
                    padding: '6px',
                    borderRadius: '8px'
                  }}
                  title="Delete Department"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            <p style={{ fontSize: '13px', color: '#475569', minHeight: '38px', marginBottom: '16px', lineHeight: 1.4 }}>
              {dept.description || 'No department overview provided.'}
            </p>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '14px',
              borderTop: '1px solid #e2e8f0',
              fontSize: '12.5px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#1c326d', fontWeight: '700' }}>
                <Users size={16} />
                <span>{dept.employee_count || 0} Staff</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#16a34a', fontWeight: '700' }}>
                <DollarSign size={16} />
                <span>Budget: ${Number(dept.budget || 0).toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Department Modal */}
      {modalOpen && (
        <div className="modal-overlay">
          <div
            className="animate-fade-in"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '480px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
              overflow: 'hidden'
            }}
          >
            <div style={{
              backgroundColor: '#0e172e',
              color: '#ffffff',
              padding: '18px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h3 style={{ fontSize: '17px', fontWeight: '800', margin: 0 }}>
                {editingDept ? 'Edit Department' : 'Create New Department'}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                style={{ background: 'transparent', color: '#cbd5e1', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
              {error && (
                <div style={{
                  backgroundColor: '#fef2f2',
                  color: '#b91c1c',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  padding: '10px',
                  fontSize: '13px',
                  marginBottom: '16px'
                }}>
                  {error}
                </div>
              )}

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>
                  Department Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Artificial Intelligence Research"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13.5px'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>
                    Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="AIR"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13.5px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>
                    Annual Budget ($)
                  </label>
                  <input
                    type="number"
                    placeholder="250000"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '13.5px'
                    }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>
                  Office Location
                </label>
                <input
                  type="text"
                  placeholder="Floor 4, Innovation Lab"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13.5px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', color: '#1e293b', marginBottom: '6px' }}>
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Responsibilities, scope, and objectives of the department..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13.5px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    padding: '9px 16px',
                    borderRadius: '8px',
                    backgroundColor: '#f1f5f9',
                    color: '#475569',
                    fontWeight: '600',
                    fontSize: '13px'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    padding: '9px 20px',
                    borderRadius: '8px',
                    backgroundColor: '#1c326d',
                    color: '#ffffff',
                    fontWeight: '700',
                    fontSize: '13px'
                  }}
                >
                  {submitting ? 'Saving...' : (editingDept ? 'Save Changes' : 'Create Department')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

