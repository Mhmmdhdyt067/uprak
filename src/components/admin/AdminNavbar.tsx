import React from 'react';
import { User } from '../../types';
import {
  LayoutDashboard,
  Code2,
  Calendar,
  Activity,
  FileSpreadsheet,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export type AdminTab =
  | 'dashboard'
  | 'cases'
  | 'sessions'
  | 'monitoring'
  | 'reports'
  | 'settings';

interface AdminNavbarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  currentUser: User;
  onLogout: () => void;
  onGoToStudent: () => void;
}

export const AdminNavbar: React.FC<AdminNavbarProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  onLogout,
  onGoToStudent,
}) => {
  const navItems: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'cases', label: 'Bank Soal', icon: <Code2 className="w-4 h-4" /> },
    { id: 'sessions', label: 'Sesi Ujian', icon: <Calendar className="w-4 h-4" /> },
    { id: 'monitoring', label: 'Live Monitoring', icon: <Activity className="w-4 h-4" /> },
    { id: 'reports', label: 'Laporan & Nilai', icon: <FileSpreadsheet className="w-4 h-4" /> },
    { id: 'settings', label: 'Pengaturan', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-white text-sm tracking-tight block leading-tight">
                  PRACTICAL CODING
                </span>
                <span className="text-[10px] text-blue-400 font-mono tracking-wider uppercase font-semibold">
                  Examination System
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      isActive
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 border border-transparent'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Action: User Info & Student Portal Switcher */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onGoToStudent}
              title="Buka Portal Ujian Mahasiswa"
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition cursor-pointer"
            >
              <span>Portal Ujian Mahasiswa</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Admin User Chip */}
            <div className="hidden sm:flex items-center space-x-2.5 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
              <div className="w-6 h-6 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center font-bold text-[11px]">
                {currentUser.name[0]}
              </div>
              <div className="text-left">
                <div className="text-slate-200 font-semibold text-xs leading-none">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-400 font-mono leading-none mt-0.5">
                  {currentUser.role === 'super_admin' ? 'Super Admin' : 'Asisten Dosen'}
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              title="Logout"
              className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition border border-transparent hover:border-rose-900/40 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Scrollbar */}
      <div className="md:hidden flex overflow-x-auto px-4 py-2 border-t border-slate-800 space-x-1.5 bg-slate-950/80">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 bg-slate-900 border border-slate-800'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
