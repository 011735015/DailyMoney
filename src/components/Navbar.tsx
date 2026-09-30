import React, { useState, useRef, useEffect } from 'react';
import {
  SlidersHorizontal,
  AlertTriangle,
  Plus,
  LayoutDashboard,
  Utensils,
  Receipt,
  BarChart3,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';

interface NavbarProps {
  activeTab: 'overview' | 'menu' | 'expenses' | 'analytics';
  setActiveTab: (tab: 'overview' | 'menu' | 'expenses' | 'analytics') => void;
  onOpenSettings: () => void;
  onOpenNewExpense: () => void;
  onOpenEmergency: () => void;
  onOpenNewPlan: () => void;
  isCritical: boolean;
  currentUser: UserProfile | null;
  onOpenAuth: (mode?: 'login' | 'register' | 'forgot') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSettings,
  onOpenNewExpense,
  onOpenEmergency,
  onOpenNewPlan,
  isCritical,
  currentUser,
  onOpenAuth,
  onLogout,
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const NAV_TABS = [
    { id: 'overview' as const, label: 'หน้าแรก & คำนวณ' },
    { id: 'menu' as const, label: 'เมนูอาหาร & ค่าครองชีพ' },
    { id: 'expenses' as const, label: 'ประวัติรายจ่าย' },
    { id: 'analytics' as const, label: 'กราฟสรุป' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3">
          <motion.a
            href="#"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('overview');
            }}
            className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2 group"
          >
            <motion.span
              whileHover={{ rotate: [0, -8, 8, 0], scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-base shadow-xs"
            >
              ฿
            </motion.span>
            <span className="group-hover:text-emerald-700 transition-colors">DailyMoney</span>
          </motion.a>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-600">
          {NAV_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? 'text-emerald-800 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <span>{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="desktop-navbar-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-emerald-600 rounded-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Top Right Controls (Bigger Start Plan Button + Auth positioned right) */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Emergency Alert Button */}
          {isCritical ? (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onOpenEmergency}
              className="animate-pulse flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm transition-colors whitespace-nowrap cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>วิธีประหยัดฉุกเฉิน</span>
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onOpenEmergency}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
            >
              <span>สูตรประหยัดเงิน</span>
            </motion.button>
          )}

          {/* ปุ่มเริ่มแผนใหม่ที่ใหญ่ขึ้น (ตามคำขอ) */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            onClick={onOpenNewPlan}
            title="เริ่มแผนใหม่ (คำนวณเงินและวันรอบใหม่)"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100/90 rounded-xl transition-all whitespace-nowrap cursor-pointer border border-emerald-300 shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>เริ่มแผนใหม่</span>
          </motion.button>

          {/* Quick Settings Icon */}
          <motion.button
            whileHover={{ scale: 1.08, rotate: 30 }}
            whileTap={{ scale: 0.92, rotate: -15 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            onClick={onOpenSettings}
            title="ตั้งค่างบประมาณขั้นสูง"
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </motion.button>

          {/* Quick Add Expense */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            onClick={onOpenNewExpense}
            className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">บันทึกรายจ่าย</span>
            <span className="sm:hidden">เพิ่ม</span>
          </motion.button>

          {/* User Auth Section (Positioned Top-Right / จัดวางไว้ขวาบน) */}
          <div className="relative pl-1 sm:pl-2 border-l border-slate-200" ref={userMenuRef}>
            {currentUser ? (
              <div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1.5 p-1 sm:py-1.5 sm:px-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/70 hover:bg-white transition-colors cursor-pointer"
                >
                  <span className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-sm">
                    {currentUser.avatar || '👤'}
                  </span>
                  <span className="hidden sm:inline text-xs font-bold text-slate-900 max-w-[90px] truncate">
                    {currentUser.name}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </motion.button>

                {/* Profile Popover Menu */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 text-xs"
                    >
                      <div className="px-3 py-2 border-b border-slate-100">
                        <div className="font-bold text-slate-900 truncate">
                          {currentUser.name}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {currentUser.email}
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded w-fit">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span>เข้าสู่ระบบแล้ว</span>
                        </div>
                      </div>

                      <div className="pt-1.5">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onOpenAuth('login');
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer font-medium"
                        >
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span>สลับบัญชีผู้ใช้</span>
                        </button>
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            onLogout();
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-2 cursor-pointer font-medium"
                        >
                          <LogOut className="w-3.5 h-3.5 text-rose-500" />
                          <span>ออกจากระบบ</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onOpenAuth('login')}
                title="เข้าสู่ระบบ หรือ สมัครสมาชิก"
                className="flex items-center gap-1.5 py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer whitespace-nowrap"
              >
                <User className="w-3.5 h-3.5 text-slate-300" />
                <span>เข้าสู่ระบบ</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom-Fixed Navigation bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-1.5 flex justify-around text-[10px] font-medium text-slate-600 shadow-lg">
        {[
          { id: 'overview' as const, label: 'หน้าแรก', icon: LayoutDashboard },
          { id: 'menu' as const, label: 'เมนูอาหาร', icon: Utensils },
          { id: 'expenses' as const, label: 'รายจ่าย', icon: Receipt },
          { id: 'analytics' as const, label: 'กราฟ', icon: BarChart3 },
        ].map((item) => {
          const isActive = activeTab === item.id;
          const IconComponent = item.icon;
          return (
            <motion.button
              key={item.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveTab(item.id)}
              className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors cursor-pointer ${
                isActive ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-navbar-pill"
                  className="absolute inset-0 bg-emerald-50 rounded-xl -z-10"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <IconComponent className="w-4 h-4" />
              <span>{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </header>
  );
};

