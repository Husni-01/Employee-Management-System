import React from 'react';
import { 
  LayoutDashboard, 
  Mail, 
  Briefcase, 
  Users, 
  FileText, 
  UserCheck, 
  BookOpen, 
  Award, 
  CreditCard, 
  Power,
  Layers
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) {
  const navItems = [
    {
      section: 'Features',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'messages', label: 'Messages', icon: Mail, badge: 13 }
      ]
    },
    {
      section: 'Recruitment',
      items: [
        { id: 'jobs', label: 'Jobs', icon: Briefcase },
        { id: 'candidates', label: 'Candidates', icon: Users },
        { id: 'resumes', label: 'Resumes', icon: FileText }
      ]
    },
    {
      section: 'Organization',
      items: [
        { id: 'employees', label: 'Employee Management', icon: UserCheck },
        { id: 'leave', label: 'Leave Management', icon: BookOpen },
        { id: 'performance', label: 'Performance Management', icon: Award },
        { id: 'payroll', label: 'Payroll Management', icon: CreditCard }
      ]
    }
  ];

  return (
    <aside
      style={{
        width: sidebarOpen ? '260px' : '0px',
        minWidth: sidebarOpen ? '260px' : '0px',
        backgroundColor: '#0e172e',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 50,
        overflow: 'hidden',
        transition: 'width 0.3s ease, min-width 0.3s ease',
        userSelect: 'none'
      }}
    >
      <div style={{ padding: '24px 20px', flex: 1, overflowY: 'auto' }}>
        {/* Brand Logo matching XCELTECH */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}>
            <Layers size={22} />
          </div>
          <span style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '1px', color: '#ffffff' }}>
            XCELTECH
          </span>
        </div>

        {/* User Card */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '28px' }}>
          <div style={{
            position: 'relative',
            width: '52px',
            height: '52px',
            borderRadius: '50%',
            padding: '3px',
            background: 'linear-gradient(135deg, #fdb827, #f59e0b)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
              alt="Aman Admin"
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.innerText = 'AA';
              }}
            />
          </div>
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff', margin: 0 }}>
              Aman Admin
            </h4>
            <span style={{ fontSize: '12px', color: '#93a3c2', fontWeight: '500' }}>
              Admin
            </span>
          </div>
        </div>

        {/* Navigation Sections */}
        {navItems.map((sec, idx) => (
          <div key={idx} style={{ marginBottom: '20px' }}>
            <div style={{
              fontSize: '11px',
              textTransform: 'uppercase',
              color: '#6c7d9e',
              fontWeight: '700',
              letterSpacing: '0.8px',
              marginBottom: '10px',
              paddingLeft: '12px'
            }}>
              {sec.section}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {sec.items.map((item) => {
                const Icon = item.icon;
                // If this item is active
                const isActive = (item.id === 'employees' && (activeTab === 'employees' || activeTab === 'departments')) ||
                                 (item.id === 'dashboard' && activeTab === 'dashboard') ||
                                 (item.id === 'payroll' && activeTab === 'reports');

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'employees') setActiveTab('employees');
                      else if (item.id === 'dashboard') setActiveTab('dashboard');
                      else if (item.id === 'payroll' || item.id === 'performance') setActiveTab('reports');
                      else setActiveTab(item.id);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      backgroundColor: isActive ? '#fdb827' : 'transparent',
                      color: isActive ? '#111827' : '#d2d9e6',
                      fontWeight: isActive ? '700' : '500',
                      fontSize: '13.5px',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.07)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Icon size={18} color={isActive ? '#111827' : '#cbd5e1'} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span style={{
                        backgroundColor: '#ef4444',
                        color: '#ffffff',
                        fontSize: '11px',
                        fontWeight: '700',
                        borderRadius: '9999px',
                        padding: '1px 6px',
                        minWidth: '18px',
                        textAlign: 'center'
                      }}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Log Out Section */}
      <div style={{ padding: '0 20px 14px' }}>
        <button
          onClick={() => alert('Logged out successfully.')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            width: '100%',
            padding: '12px 16px',
            borderRadius: '9999px',
            backgroundColor: '#ea2b2b',
            color: '#ffffff',
            fontWeight: '700',
            fontSize: '14px',
            boxShadow: '0 4px 12px rgba(234, 43, 43, 0.35)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ea2b2b'}
        >
          <Power size={18} strokeWidth={2.5} />
          <span>Log Out</span>
        </button>
      </div>

      {/* Bottom Artistic Circular Pattern from screenshot */}
      <div style={{ height: '36px', overflow: 'hidden', position: 'relative', opacity: 0.9 }}>
        <svg viewBox="0 0 260 40" width="260" height="40" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="40" r="28" fill="#1e3a8a" />
          <circle cx="60" cy="40" r="24" fill="#0284c7" />
          <circle cx="95" cy="40" r="26" fill="#0891b2" />
          <circle cx="140" cy="40" r="28" fill="#0284c7" />
          <circle cx="185" cy="40" r="25" fill="#e11d48" />
          <circle cx="225" cy="40" r="28" fill="#1e3a8a" />
          <circle cx="255" cy="40" r="22" fill="#f59e0b" />
        </svg>
      </div>
    </aside>
  );
}

