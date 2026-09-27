import React, { useState } from 'react';
import { Plus, Check, Utensils, Bus, Coffee, ShoppingBag, ArrowRight } from 'lucide-react';
import { ExpenseCategory } from '../types';

interface QuickExpenseBarProps {
  onAddExpense: (amount: number, category: ExpenseCategory, note: string) => void;
  onOpenFullModal: () => void;
}

const INSTANT_PRESETS: {
  label: string;
  amount: number;
  category: ExpenseCategory;
  note: string;
}[] = [
  { label: '🍚 ข้าวแกง ฿35', amount: 35, category: 'food', note: 'ข้าวราดแกง' },
  { label: '🍳 กะเพราไข่ดาว ฿50', amount: 50, category: 'food', note: 'ข้าวกะเพราหมูสับไข่ดาว' },
  { label: '🚌 เดินทาง ฿20', amount: 20, category: 'transport', note: 'ค่ารถเมล์/สองแถว' },
  { label: '☕ ชา/กาแฟ ฿30', amount: 30, category: 'food', note: 'กาแฟ/เครื่องดื่ม' },
  { label: '🍜 ก๋วยเตี๋ยว ฿50', amount: 50, category: 'food', note: 'ก๋วยเตี๋ยว' },
  { label: '🛒 ของใช้ ฿100', amount: 100, category: 'necessities', note: 'ของใช้จำเป็น' },
];

export const QuickExpenseBar: React.FC<QuickExpenseBarProps> = ({
  onAddExpense,
  onOpenFullModal,
}) => {
  const [customAmount, setCustomAmount] = useState('');
  const [customNote, setCustomNote] = useState('');
  const [selectedCat, setSelectedCat] = useState<ExpenseCategory>('food');
  const [justAddedMsg, setJustAddedMsg] = useState<string | null>(null);

  const triggerFeedback = (text: string) => {
    setJustAddedMsg(text);
    setTimeout(() => {
      setJustAddedMsg(null);
    }, 2000);
  };

  const handlePresetClick = (preset: typeof INSTANT_PRESETS[0]) => {
    onAddExpense(preset.amount, preset.category, preset.note);
    triggerFeedback(`บันทึก ${preset.note} -฿${preset.amount} สำเร็จ!`);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(customAmount);
    if (isNaN(val) || val <= 0) return;

    const note = customNote.trim() || 'รายการทั่วไป';
    onAddExpense(val, selectedCat, note);
    triggerFeedback(`บันทึก ${note} -฿${val} สำเร็จ!`);

    setCustomAmount('');
    setCustomNote('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <h3 className="font-bold text-sm text-slate-900">
            บันทึกรายจ่ายด่วน (แตะ 1 ครั้งบันทึกทันที)
          </h3>
        </div>

        {justAddedMsg ? (
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md flex items-center gap-1 animate-fade-in">
            <Check className="w-3.5 h-3.5" />
            {justAddedMsg}
          </span>
        ) : (
          <button
            onClick={onOpenFullModal}
            className="text-xs text-slate-500 hover:text-emerald-700 font-medium transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>บันทึกแบบละเอียด</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* 1-Tap Preset Buttons */}
      <div className="mt-3.5">
        <span className="text-[11px] font-medium text-slate-400 block mb-1.5">
          แตะเพื่อบันทึกรายการยอดฮิตทันที:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {INSTANT_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePresetClick(preset)}
              className="py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-emerald-50 hover:border-emerald-300 text-slate-800 text-xs font-semibold transition-all active:scale-95 text-center flex flex-col items-center justify-center cursor-pointer shadow-2xs"
            >
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Inline Quick Amount Form */}
      <form
        onSubmit={handleCustomSubmit}
        className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-2"
      >
        <div className="relative w-full sm:w-40">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400 font-mono">
            ฿
          </span>
          <input
            type="number"
            step="any"
            min="1"
            placeholder="จำนวนเงิน"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 rounded-xl text-xs font-mono font-bold text-slate-900 outline-none"
          />
        </div>

        <input
          type="text"
          placeholder="ชื่อรายการ (เช่น ข้าวผัด, ค่ารถ)"
          value={customNote}
          onChange={(e) => setCustomNote(e.target.value)}
          className="w-full sm:flex-1 px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 rounded-xl text-xs text-slate-900 outline-none"
        />

        {/* Category selector */}
        <div className="flex items-center gap-1 w-full sm:w-auto justify-between sm:justify-start">
          <button
            type="button"
            onClick={() => setSelectedCat('food')}
            title="อาหาร"
            className={`p-2 rounded-xl border text-xs cursor-pointer ${
              selectedCat === 'food'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-100'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setSelectedCat('transport')}
            title="เดินทาง"
            className={`p-2 rounded-xl border text-xs cursor-pointer ${
              selectedCat === 'transport'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-100'
            }`}
          >
            <Bus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setSelectedCat('necessities')}
            title="ของใช้"
            className={`p-2 rounded-xl border text-xs cursor-pointer ${
              selectedCat === 'necessities'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-100'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </button>

          <button
            type="submit"
            disabled={!customAmount}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ บันทึก</span>
          </button>
        </div>
      </form>
    </div>
  );
};
