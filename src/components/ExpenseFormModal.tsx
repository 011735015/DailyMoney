import React, { useState } from 'react';
import {
  X,
  Check,
  Utensils,
  Bus,
  ShoppingBag,
  Sparkles,
  Tag,
  FileText,
  AlertOctagon,
  AlertCircle,
} from 'lucide-react';
import { Expense, ExpenseCategory, BudgetStatus } from '../types';

interface ExpenseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void;
  initialValues?: {
    note?: string;
    amount?: number;
    category?: ExpenseCategory;
  };
  status?: BudgetStatus;
}

const CATEGORIES: { id: ExpenseCategory; label: string; icon: React.ReactNode }[] = [
  { id: 'food', label: 'อาหาร & เครื่องดื่ม', icon: <Utensils className="w-3.5 h-3.5" /> },
  { id: 'transport', label: 'การเดินทาง', icon: <Bus className="w-3.5 h-3.5" /> },
  { id: 'necessities', label: 'ของใช้ประจำวัน', icon: <ShoppingBag className="w-3.5 h-3.5" /> },
  { id: 'entertainment', label: 'บันเทิง & สังสรรค์', icon: <Sparkles className="w-3.5 h-3.5" /> },
  { id: 'shopping', label: 'ช้อปปิ้ง', icon: <Tag className="w-3.5 h-3.5" /> },
  { id: 'bills', label: 'บิล & ค่าใช้จ่ายประจำ', icon: <FileText className="w-3.5 h-3.5" /> },
];

const PRESETS = [
  { label: '+฿35 ข้าวแกง', amount: 35, note: 'ข้าวราดแกง', category: 'food' as const },
  { label: '+฿50 กะเพรา', amount: 50, note: 'ข้าวกะเพรา', category: 'food' as const },
  { label: '+฿20 รถเมล์', amount: 20, note: 'ค่าเดินทาง', category: 'transport' as const },
  { label: '+฿30 กาแฟ/ชา', amount: 30, note: 'เครื่องดื่ม', category: 'food' as const },
  { label: '+฿100 ของใช้', amount: 100, note: 'ของใช้จำเป็น', category: 'necessities' as const },
];

export const ExpenseFormModal: React.FC<ExpenseFormModalProps> = ({
  isOpen,
  onClose,
  onSaveExpense,
  initialValues,
  status,
}) => {
  const [amount, setAmount] = useState<string>(
    initialValues?.amount ? String(initialValues.amount) : ''
  );
  const [category, setCategory] = useState<ExpenseCategory>(
    initialValues?.category || 'food'
  );
  const [note, setNote] = useState<string>(initialValues?.note || '');
  const [date, setDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [time, setTime] = useState<string>(
    new Date().toTimeString().slice(0, 5)
  );
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const numAmount = parseFloat(amount) || 0;
  const willExceedBudget =
    status && numAmount > 0
      ? status.totalSpent + numAmount > status.totalBudget
      : false;
  const projectedDeficit =
    status && willExceedBudget
      ? status.totalSpent + numAmount - status.totalBudget
      : 0;
  const willExceedToday =
    status && status.dailyAllowance > 0 && numAmount > 0
      ? status.todaySpent + numAmount > status.dailyAllowance
      : false;
  const projectedTodayExcess =
    status && willExceedToday
      ? status.todaySpent + numAmount - status.dailyAllowance
      : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(amount);
    if (isNaN(num) || num <= 0) {
      setError('กรุณาระบุจำนวนเงินที่ถูกต้อง');
      return;
    }

    onSaveExpense({
      amount: num,
      category,
      note: note.trim() || 'รายการทั่วไป',
      date,
      time,
    });

    onClose();
    // Reset
    setAmount('');
    setNote('');
    setError('');
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setAmount(String(preset.amount));
    setCategory(preset.category);
    setNote(preset.note);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900">
            บันทึกรายการใช้จ่ายใหม่
          </h3>
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
              กดเลือกด่วน:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => applyPreset(p)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors cursor-pointer"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Amount input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              จำนวนเงิน (บาท) *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-400 font-mono">
                ฿
              </span>
              <input
                type="number"
                step="any"
                min="0"
                autoFocus
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError('');
                }}
                className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-2xl font-bold font-mono text-slate-900 outline-none transition-all placeholder:text-slate-300 ${
                  willExceedBudget
                    ? 'border-rose-400 focus:border-rose-600 focus:bg-rose-50/30'
                    : 'border-slate-200 focus:border-emerald-600 focus:bg-white'
                }`}
              />
            </div>
            {error && <p className="text-xs text-rose-600 mt-1">{error}</p>}

            {/* Over-Budget Realtime Warning Callout */}
            {numAmount > 0 && willExceedBudget && (
              <div className="mt-2.5 p-3 bg-rose-50 border border-rose-300 rounded-xl text-xs text-rose-950 flex items-start gap-2.5 animate-in fade-in duration-150">
                <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-rose-900">
                    ⚠️ คำเตือน: ยอดนี้จะทำให้คุณใช้เงินเกินงบ!
                  </div>
                  <p className="mt-0.5 text-rose-800 text-[11px] leading-relaxed">
                    ยอดเงินรวมจะทะลุงบตั้งต้นไป{' '}
                    <span className="font-mono font-bold text-rose-700 underline">
                      ฿{projectedDeficit.toLocaleString()}
                    </span>{' '}
                    (เงินจะติดลบ -฿{projectedDeficit.toLocaleString()})
                  </p>
                </div>
              </div>
            )}

            {/* Exceeding Today Allowance Warning Callout */}
            {!willExceedBudget && numAmount > 0 && willExceedToday && (
              <div className="mt-2.5 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-amber-900">
                    แจ้งเตือน: เกินโควตารายวันที่เหลือของวันนี้
                  </div>
                  <p className="text-[11px] text-amber-800">
                    จะเกินโควตาวันนี้ไป ฿{projectedTodayExcess.toLocaleString()} (โควตาวันนี้เหลือ ฿{Math.max(0, status?.todayRemaining || 0).toLocaleString()})
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Category selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              หมวดหมู่ *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition-all text-left cursor-pointer ${
                    category === cat.id
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold shadow-2xs'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className={category === cat.id ? 'text-emerald-600' : 'text-slate-400'}>
                    {cat.icon}
                  </span>
                  <span className="truncate">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Note input */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              รายละเอียด / ชื่อร้าน / เมนู
            </label>
            <input
              type="text"
              placeholder="เช่น ข้าวกะเพราหมูกรอบ, ค่าวินมอเตอร์ไซค์"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-xs text-slate-900 outline-none transition-all"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                วันที่
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                เวลา
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 outline-none"
              />
            </div>
          </div>

          {/* Action buttons */}
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
              <span>บันทึกทันที</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
