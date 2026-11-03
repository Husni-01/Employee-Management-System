import React from 'react';
import { 
  Users, 
  Building2, 
  UserCheck, 
  Coffee, 
  DollarSign, 
  TrendingUp, 
  PieChart, 
  Briefcase 
} from 'lucide-react';

export default function ReportsView({ summaryData, loading }) {
  if (loading || !summaryData) {
    return (
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        padding: '48px',
        textAlign: 'center',
        color: '#64748b'
      }}>
        Gathering organizational reports...
      </div>
    );
  }

  const { metrics, deptBreakdown = [], statusBreakdown = [], typeBreakdown = [], recentHires = [] } = summaryData;

  const statCards = [
    {
      title: 'Total Personnel',
      value: metrics.totalEmployees,
      sub: `${metrics.activeEmployees} active currently`,
      icon: Users,
      color: '#1c326d',
      bg: '#eff6ff'
    },
    {
      title: 'Active Departments',
      value: metrics.totalDepartments,
      sub: 'Operating divisions',
      icon: Building2,
      color: '#f59e0b',
      bg: '#fefce8'
    },
    {
      title: 'On Leave',
      value: metrics.onLeaveEmployees,
      sub: `${metrics.probationEmployees} on probation`,
      icon: Coffee,
      color: '#0284c7',
      bg: '#f0f9ff'
    },
    {
      title: 'Total Payroll',
      value: `$${Number(metrics.totalPayroll || 0).toLocaleString()}`,
      sub: `Avg: $${Number(metrics.avgSalary || 0).toLocaleString()}/yr`,
      icon: DollarSign,
      color: '#16a34a',
      bg: '#f0fdf4'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 4 Top KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px'
      }}>
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '20px',
                padding: '22px 24px',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.03)',
                border: '1px solid #e8eef7',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                backgroundColor: stat.bg,
                color: stat.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon size={24} />
              </div>
              <div>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
                  {stat.title}
                </span>
                <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#141f36', margin: '2px 0' }}>
                  {stat.value}
                </h3>
                <span style={{ fontSize: '11.5px', color: '#94a3b8', fontWeight: '500' }}>
                  {stat.sub}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid: Department Allocation & Employment Types */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Department Headcount Breakdown */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '24px 28px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
          border: '1px solid #e8eef7'
        }}>
          <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#141f36', marginBottom: '18px' }}>
            Workforce Allocation by Department
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {deptBreakdown.map((dept) => {
              const percentage = metrics.totalEmployees > 0
                ? Math.round((dept.employee_count / metrics.totalEmployees) * 100)
                : 0;
              return (
                <div key={dept.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '600', marginBottom: '5px' }}>
                    <span style={{ color: '#1e293b' }}>{dept.name} ({dept.code})</span>
                    <span style={{ color: '#64748b' }}>{dept.employee_count} staff ({percentage}%)</span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '9999px',
                    backgroundColor: '#e2e8f0',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${percentage}%`,
                      height: '100%',
                      borderRadius: '9999px',
                      backgroundColor: '#1c326d'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status & Contract Distribution */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          padding: '24px 28px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
          border: '1px solid #e8eef7'
        }}>
          <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#141f36', marginBottom: '18px' }}>
            Employment & Operational Status
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
                Employment Arrangement
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px' }}>
                {typeBreakdown.map((t, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '8px 14px',
                      fontSize: '13px',
                      fontWeight: '700',
                      color: '#1e293b'
                    }}
                  >
                    {t.employment_type}: <span style={{ color: '#1c326d' }}>{t.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
                Status Distribution
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '8px' }}>
                {statusBreakdown.map((s, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: s.status === 'Active' ? '#e6f4ea' : (s.status === 'On Leave' ? '#fef7e0' : '#e8f0fe'),
                      borderRadius: '12px',
                      padding: '8px 14px',
                      fontSize: '13px',
                      fontWeight: '700',
                      color: s.status === 'Active' ? '#137333' : (s.status === 'On Leave' ? '#b06000' : '#1a73e8')
                    }}
                  >
                    {s.status}: {s.count}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Onboarded Personnel Card */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        padding: '24px 28px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
        border: '1px solid #e8eef7'
      }}>
        <h4 style={{ fontSize: '16px', fontWeight: '800', color: '#141f36', marginBottom: '16px' }}>
          Recent Organizational Additions
        </h4>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13.5px' }}>
            <thead>
              <tr style={{ color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ textAlign: 'left', padding: '10px 14px', fontWeight: '700' }}>Employee</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', fontWeight: '700' }}>ID</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', fontWeight: '700' }}>Department</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', fontWeight: '700' }}>Designation</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', fontWeight: '700' }}>Hire Date</th>
                <th style={{ textAlign: 'left', padding: '10px 14px', fontWeight: '700' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentHires.map((hire) => (
                <tr key={hire.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '12px 14px', fontWeight: '700', color: '#1e293b' }}>{hire.full_name}</td>
                  <td style={{ padding: '12px 14px', color: '#64748b' }}>{hire.employee_id}</td>
                  <td style={{ padding: '12px 14px', color: '#334155' }}>{hire.department_name}</td>
                  <td style={{ padding: '12px 14px', color: '#334155' }}>{hire.position}</td>
                  <td style={{ padding: '12px 14px', color: '#64748b' }}>{hire.hire_date}</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{
                      backgroundColor: hire.status === 'Active' ? '#e6f4ea' : '#fef7e0',
                      color: hire.status === 'Active' ? '#137333' : '#b06000',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '700'
                    }}>
                      {hire.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

