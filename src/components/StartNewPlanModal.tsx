import React, { useState } from 'react';
import { X, Sparkles, Wallet, Calendar, ArrowRight, Zap } from 'lucide-react';

interface StartNewPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmNewPlan: (budget: number, days: number) => void;
}

const QUICK_BUDGETS = [300, 500, 1000, 2000, 3000, 5000];
const QUICK_DAYS = [1, 2, 3, 5, 7, 10, 15, 30];

export const StartNewPlanModal: React.FC<StartNewPlanModalProps> = ({
  isOpen,
  onClose,
  onConfirmNewPlan,
}) => {
  const [budget, setBudget] = useState('1000');
  const [days, setDays] = useState('5');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const numBudget = parseFloat(budget) || 0;
  const numDays = parseInt(days, 10) || 1;
  const dailyAllowance = Math.round(numBudget / numDays);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (numBudget <= 0) {
      setError('กรุณาระบุจำนวนเงินที่มากกว่า 0');
      return;
    }
    if (numDays < 1) {
      setError('กรุณาระบุจำนวนวันอย่างน้อย 1 วัน');
      return;
    }

    onConfirmNewPlan(numBudget, numDays);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-600 text-white px-6 py-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base">
                เริ่มแผนใหม่ (ใช้ครั้งเดียวรอบนี้)
              </h3>
              <p className="text-xs text-emerald-100 mt-0.5">
                กำหนดเงินและวันใหม่ ไม่รวมกับเงินรอบเดิม
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-100 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Field 1: Budget */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-emerald-600" />
                จำนวนเงินที่ต้องการใช้ในรอบนี้ (บาท) *
              </span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400 font-mono">
                ฿
              </span>
              <input
                type="number"
                step="any"
                min="1"
                required
                autoFocus
                placeholder="เช่น 1000"
                value={budget}
                onChange={(e) => {
                  setBudget(e.target.value);
                  setError('');
                }}
                className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 rounded-xl text-xl font-bold font-mono text-slate-900 outline-none transition-all"
              />
            </div>

            {/* Quick buttons */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {QUICK_BUDGETS.map((amt) => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => setBudget(String(amt))}
                  className={`px-2.5 py-1 text-xs rounded-lg font-mono transition-colors cursor-pointer ${
                    numBudget === amt
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium'
                  }`}
                >
                  ฿{amt.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Field 2: Days */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-600" />
                ระยะเวลาที่ต้องใช้ (กี่วัน) *
              </span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                max="365"
                required
                placeholder="เช่น 5"
                value={days}
                onChange={(e) => {
                  setDays(e.target.value);
                  setError('');
                }}
                className="w-full px-3.5 py-3 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 rounded-xl text-lg font-bold font-mono text-slate-900 outline-none transition-all"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">
                วัน
              </span>
            </div>

            {/* Quick days */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {QUICK_DAYS.map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setDays(String(d))}
                  className={`px-2.5 py-1 text-xs rounded-lg font-mono transition-colors cursor-pointer ${
                    numDays === d
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium'
                  }`}
                >
                  {d} วัน
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}

          {/* Calculation Preview */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center">
            <span className="text-xs text-emerald-800 font-semibold block">
              ⚡ เงินเอาชีวิตรอดเฉลี่ยต่อวัน (ไม่หักเงินเก็บ)
            </span>
            <span className="text-3xl font-extrabold font-mono text-emerald-700 mt-1 block tabular-nums">
              ฿{dailyAllowance.toLocaleString()}
              <span className="text-xs font-normal text-slate-500 ml-1">/วัน</span>
            </span>
            <span className="text-[11px] text-slate-500 mt-1 block">
              คำนวณเต็มจำนวนทุกบาทเพื่อเอาชีวิตรอด เมื่อครบ {numDays} วัน ระบบจะขึ้นสรุปเสร็จสิ้นรอบให้ทันที
            </span>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <span>เริ่มแผนรอบนี้ทันที</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
