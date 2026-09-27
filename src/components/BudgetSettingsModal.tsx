import React, { useState } from 'react';
import { X, Check, Calendar, Wallet, RotateCcw } from 'lucide-react';
import { BudgetConfig } from '../types';

interface BudgetSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BudgetConfig;
  onSaveConfig: (newConfig: BudgetConfig) => void;
  onResetAllData: () => void;
}

const PRESET_PLANS = [
  { label: 'เดือนใหม่ 30 วัน (฿12,000)', budget: 12000, days: 30 },
  { label: 'ครึ่งเดือน 15 วัน (฿5,000)', budget: 5000, days: 15 },
  { label: 'สัปดาห์นี้ 7 วัน (฿2,000)', budget: 2000, days: 7 },
  { label: 'โค้งสุดท้าย 5 วัน (฿1,000)', budget: 1000, days: 5 },
  { label: 'ฉุกเฉิน 3 วัน (฿300)', budget: 300, days: 3 },
];

export const BudgetSettingsModal: React.FC<BudgetSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  onResetAllData,
}) => {
  const [totalBudget, setTotalBudget] = useState<string>(String(config.totalBudget));
  const [totalDays, setTotalDays] = useState<string>(String(config.totalDays));
  const [startDate, setStartDate] = useState<string>(config.startDate);
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const budgetNum = parseFloat(totalBudget);
    const daysNum = parseInt(totalDays, 10);

    if (isNaN(budgetNum) || budgetNum <= 0) {
      setError('กรุณาระบุจำนวนเงินที่มากกว่า 0');
      return;
    }
    if (isNaN(daysNum) || daysNum < 1) {
      setError('กรุณาระบุจำนวนวันที่มากกว่าหรือเท่ากับ 1 วัน');
      return;
    }

    onSaveConfig({
      ...config,
      totalBudget: budgetNum,
      totalDays: daysNum,
      startDate: startDate || new Date().toISOString().split('T')[0],
      emergencyReserve: 0,
    });

    onClose();
  };

  const handleApplyPreset = (p: typeof PRESET_PLANS[0]) => {
    setTotalBudget(String(p.budget));
    setTotalDays(String(p.days));
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-slate-900">
              ตั้งค่างบประมาณและจำนวนวัน
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Quick Presets */}
          <div>
            <span className="text-[11px] font-medium text-slate-500 mb-1.5 block">
              เลือกแพลนสำเร็จรูปด่วน:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_PLANS.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleApplyPreset(p)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Total Budget */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              จำนวนเงินรวมที่มีอยู่ (บาท) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400 font-mono">
                ฿
              </span>
              <input
                type="number"
                step="any"
                min="1"
                required
                value={totalBudget}
                onChange={(e) => {
                  setTotalBudget(e.target.value);
                  setError('');
                }}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-lg font-bold font-mono text-slate-900 outline-none transition-all"
              />
            </div>
          </div>

          {/* Total Days */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              จำนวนวันที่ต้องบริหารให้รอด (วัน) *
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="365"
                required
                value={totalDays}
                onChange={(e) => {
                  setTotalDays(e.target.value);
                  setError('');
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-base font-bold font-mono text-slate-900 outline-none transition-all"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">
                วัน
              </span>
            </div>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              วันที่เริ่มนับงบนี้
            </label>
            <div className="relative">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none"
              />
            </div>
          </div>

          {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}

          {/* Quick preview calculation */}
          {parseFloat(totalBudget) > 0 && parseInt(totalDays, 10) > 0 && (
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center justify-between text-xs">
              <span className="text-emerald-900 font-medium">เงินเฉลี่ยตั้งต้น:</span>
              <span className="font-mono font-bold text-emerald-800 text-sm">
                ฿{Math.round(parseFloat(totalBudget) / parseInt(totalDays, 10)).toLocaleString()} /วัน
              </span>
            </div>
          )}

          {/* Reset / Demo options */}
          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('คุณต้องการรีเซ็ตข้อมูลและคืนค่าตัวอย่างเริ่มต้นหรือไม่?')) {
                  onResetAllData();
                  onClose();
                }
              }}
              className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>รีเซ็ตคืนค่าเริ่มต้น</span>
            </button>
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>บันทึกการตั้งค่า</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
