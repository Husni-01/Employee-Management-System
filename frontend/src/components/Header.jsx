import React, { useState } from 'react';
import { 
  Menu, 
  Search, 
  Bell, 
  Wrench, 
  Mail, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';

export default function Header({
  sidebarOpen,
  setSidebarOpen,
  searchQuery,
  setSearchQuery,
  selectedDeptFilter,
  setSelectedDeptFilter,
  departments = [],
  onSearchSubmit
}) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const selectedDeptName = selectedDeptFilter === 'all'
    ? 'All Departments'
    : (departments.find(d => String(d.id) === String(selectedDeptFilter))?.name || 'All Departments');

  return (
    <header
      style={{
        height: '74px',
        backgroundColor: '#edf2f9',
        padding: '0 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}
    >
      {/* Left: Hamburger + Search Combo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '28px', flex: 1, maxWidth: '680px' }}>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            background: 'transparent',
            padding: '8px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#141f36'
          }}
          title="Toggle Navigation"
        >
          <Menu size={26} strokeWidth={2.4} />
        </button>

        {/* Search Combo Pill matching Screenshot */}
        <div style={{
          display: 'flex',
          alignItems: 'stretch',
          backgroundColor: '#ffffff',
          borderRadius: '9999px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
          position: 'relative',
          width: '100%',
          maxWidth: '460px',
          height: '42px',
          border: '1px solid #e2e8f0'
        }}>
          {/* Dark Blue Dropdown Button on Left */}
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              backgroundColor: '#1c326d',
              color: '#ffffff',
              borderRadius: '9999px 0 0 9999px',
              padding: '0 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              fontWeight: '600',
              whiteSpace: 'nowrap'
            }}
          >
            <span>{selectedDeptName.length > 15 ? `${selectedDeptName.slice(0, 15)}...` : selectedDeptName}</span>
            {dropdownOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {/* Department selection dropdown menu */}
          {dropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '48px',
                left: '0',
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.12)',
                border: '1px solid #e2e8f0',
                zIndex: 60,
                minWidth: '220px',
                maxHeight: '260px',
                overflowY: 'auto',
                padding: '6px'
              }}
            >
              <div
                onClick={() => {
                  setSelectedDeptFilter('all');
                  setDropdownOpen(false);
                }}
                style={{
                  padding: '9px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: selectedDeptFilter === 'all' ? '700' : '500',
                  color: selectedDeptFilter === 'all' ? '#1c326d' : '#334155',
                  backgroundColor: selectedDeptFilter === 'all' ? '#eff6ff' : 'transparent'
                }}
              >
                All Departments
              </div>
              {departments.map((d) => (
                <div
                  key={d.id}
                  onClick={() => {
                    setSelectedDeptFilter(d.id);
                    setDropdownOpen(false);
                  }}
                  style={{
                    padding: '9px 12px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: String(selectedDeptFilter) === String(d.id) ? '700' : '500',
                    color: String(selectedDeptFilter) === String(d.id) ? '#1c326d' : '#334155',
                    backgroundColor: String(selectedDeptFilter) === String(d.id) ? '#eff6ff' : 'transparent'
                  }}
                >
                  {d.name} ({d.code})
                </div>
              ))}
            </div>
          )}

          {/* Input field */}
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && onSearchSubmit) onSearchSubmit();
            }}
            style={{
              flex: 1,
              border: 'none',
              padding: '0 14px',
              fontSize: '13.5px',
              color: '#1e293b',
              backgroundColor: 'transparent'
            }}
          />

          {/* Search Icon on right */}
          <button
            type="button"
            onClick={onSearchSubmit}
            style={{
              background: 'transparent',
              padding: '0 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8'
            }}
          >
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* Right Circular Icon Buttons from Screenshot */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* Blue Bell with red 13 badge */}
        <div style={{ position: 'relative' }}>
          <button
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: '#1c326d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 2px 6px rgba(28, 50, 109, 0.25)'
            }}
            title="Notifications"
          >
            <Bell size={20} />
          </button>
          <span style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            backgroundColor: '#ea2b2b',
            color: '#ffffff',
            fontSize: '10px',
            fontWeight: '700',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #edf2f9'
          }}>
            13
          </span>
        </div>

        {/* Yellow Wrench/Tool */}
        <button
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            backgroundColor: '#fdb827',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#141f36',
            boxShadow: '0 2px 6px rgba(253, 184, 39, 0.25)'
          }}
          title="System Settings"
        >
          <Wrench size={19} strokeWidth={2.4} />
        </button>

        {/* Green Mail with red 13 badge */}
        <div style={{ position: 'relative' }}>
          <button
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: '#328332',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 2px 6px rgba(50, 131, 50, 0.25)'
            }}
            title="Inbox Messages"
          >
            <Mail size={20} />
          </button>
          <span style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            backgroundColor: '#ea2b2b',
            color: '#ffffff',
            fontSize: '10px',
            fontWeight: '700',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid #edf2f9'
          }}>
            13
          </span>
        </div>
      </div>
    </header>
  );
}

