import React from 'react';
import {
  SlidersHorizontal,
  AlertTriangle,
  Plus,
  LayoutDashboard,
  Utensils,
  Receipt,
  BarChart3,
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'overview' | 'menu' | 'expenses' | 'analytics';
  setActiveTab: (tab: 'overview' | 'menu' | 'expenses' | 'analytics') => void;
  onOpenSettings: () => void;
  onOpenNewExpense: () => void;
  onOpenEmergency: () => void;
  onOpenNewPlan: () => void;
  isCritical: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSettings,
  onOpenNewExpense,
  onOpenEmergency,
  onOpenNewPlan,
  isCritical,
}) => {

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('overview');
            }}
            className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-2"
          >
            <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-base shadow-xs">
              ฿
            </span>
            <span>DailyMoney</span>
          </a>
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('overview')}
            className={`transition-colors pb-1 border-b-2 cursor-pointer ${
              activeTab === 'overview'
                ? 'border-emerald-600 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            หน้าแรก & คำนวณ
          </button>
          <button
            onClick={() => setActiveTab('menu')}
            className={`transition-colors pb-1 border-b-2 cursor-pointer ${
              activeTab === 'menu'
                ? 'border-emerald-600 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            เมนูอาหาร & ค่าครองชีพ
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`transition-colors pb-1 border-b-2 cursor-pointer ${
              activeTab === 'expenses'
                ? 'border-emerald-600 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            ประวัติรายจ่าย
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`transition-colors pb-1 border-b-2 cursor-pointer ${
              activeTab === 'analytics'
                ? 'border-emerald-600 text-slate-900 font-semibold'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            กราฟสรุป
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Emergency Alert Button - prominent when critical */}
          {isCritical ? (
            <button
              onClick={onOpenEmergency}
              className="animate-pulse flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors whitespace-nowrap cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>วิธีประหยัดฉุกเฉิน</span>
            </button>
          ) : (
            <button
              onClick={onOpenEmergency}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <span>สูตรประหยัดเงิน</span>
            </button>
          )}

          <button
            onClick={onOpenNewPlan}
            title="เริ่มแผนใหม่ (ใช้ครั้งเดียวรอบนี้)"
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors whitespace-nowrap cursor-pointer border border-emerald-200"
          >
            <span>✨ เริ่มแผนใหม่</span>
          </button>

          <button
            onClick={onOpenSettings}
            title="ตั้งค่างบประมาณขั้นสูง"
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>


          <button
            onClick={onOpenNewExpense}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">บันทึกรายจ่าย</span>
            <span className="xs:hidden">เพิ่ม</span>
          </button>
        </div>
      </div>

      {/* Mobile Bottom-Fixed Navigation bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-1.5 flex justify-around text-[10px] font-medium text-slate-600 shadow-lg">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'overview'
              ? 'text-emerald-700 font-bold bg-emerald-50'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>หน้าแรก</span>
        </button>
        <button
          onClick={() => setActiveTab('menu')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'menu'
              ? 'text-emerald-700 font-bold bg-emerald-50'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>เมนูอาหาร</span>
        </button>
        <button
          onClick={() => setActiveTab('expenses')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'expenses'
              ? 'text-emerald-700 font-bold bg-emerald-50'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>รายจ่าย</span>
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'analytics'
              ? 'text-emerald-700 font-bold bg-emerald-50'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>กราฟ</span>
        </button>
      </div>
    </header>
  );
};

