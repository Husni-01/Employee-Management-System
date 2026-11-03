import React from 'react';
import { UserCheck } from 'lucide-react';

export default function TabsNav({ currentView, setCurrentView, openAddModal }) {
  const tabs = [
    { id: 'directory', label: 'Employee Records' },
    { id: 'departments', label: 'Department Directory' },
    { id: 'add', label: 'Add New Employee', action: true },
    { id: 'reports', label: 'Reports & Analytics' }
  ];

  return (
    <div style={{ marginBottom: '24px' }}>
      {/* Title with icon matching screenshot */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
        <UserCheck size={26} color="#141f36" strokeWidth={2.4} />
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#141f36', margin: 0 }}>
          Employee Management
        </h2>
      </div>

      {/* Pill action buttons row matching screenshot */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        alignItems: 'center'
      }}>
        {tabs.map((tab) => {
          const isActive = currentView === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.action) {
                  openAddModal();
                } else {
                  setCurrentView(tab.id);
                }
              }}
              style={{
                flex: '1 1 200px',
                minWidth: '180px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: isActive ? '#fdb827' : '#1c326d',
                color: isActive ? '#141f36' : '#ffffff',
                fontWeight: isActive ? '700' : '600',
                fontSize: '14.5px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isActive 
                  ? '0 4px 12px rgba(253, 184, 39, 0.3)' 
                  : '0 4px 12px rgba(28, 50, 109, 0.2)'
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = '#162758';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = '#1c326d';
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

