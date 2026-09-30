import React, { useState } from 'react';
import { Plus, Check, Utensils, Bus, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ExpenseCategory } from '../types';

interface QuickExpenseBarProps {
  onAddExpense: (amount: number, category: ExpenseCategory, note: string) => void;
  onOpenFullModal: () => void;
}

const INSTANT_PRESETS: {
  id: string;
  label: string;
  amount: number;
  category: ExpenseCategory;
  note: string;
}[] = [
  { id: 'p1', label: '🍚 ข้าวแกง ฿35', amount: 35, category: 'food', note: 'ข้าวราดแกง' },
  { id: 'p2', label: '🍳 กะเพราไข่ดาว ฿50', amount: 50, category: 'food', note: 'ข้าวกะเพราหมูสับไข่ดาว' },
  { id: 'p3', label: '🚌 เดินทาง ฿20', amount: 20, category: 'transport', note: 'ค่ารถเมล์/สองแถว' },
  { id: 'p4', label: '☕ ชา/กาแฟ ฿30', amount: 30, category: 'food', note: 'กาแฟ/เครื่องดื่ม' },
  { id: 'p5', label: '🍜 ก๋วยเตี๋ยว ฿50', amount: 50, category: 'food', note: 'ก๋วยเตี๋ยว' },
  { id: 'p6', label: '🛒 ของใช้ ฿100', amount: 100, category: 'necessities', note: 'ของใช้จำเป็น' },
];

export const QuickExpenseBar: React.FC<QuickExpenseBarProps> = ({
  onAddExpense,
  onOpenFullModal,
}) => {
  const [customAmount, setCustomAmount] = useState('');
  const [customNote, setCustomNote] = useState('');
  const [selectedCat, setSelectedCat] = useState<ExpenseCategory>('food');
  const [justAddedMsg, setJustAddedMsg] = useState<string | null>(null);
  const [activeFloatingId, setActiveFloatingId] = useState<{ id: string; amount: number } | null>(null);

  const triggerFeedback = (text: string, presetId?: string, amount?: number) => {
    setJustAddedMsg(text);
    if (presetId && amount) {
      setActiveFloatingId({ id: presetId, amount });
      setTimeout(() => {
        setActiveFloatingId(null);
      }, 1000);
    }
    setTimeout(() => {
      setJustAddedMsg(null);
    }, 2200);
  };

  const handlePresetClick = (preset: typeof INSTANT_PRESETS[0]) => {
    onAddExpense(preset.amount, preset.category, preset.note);
    triggerFeedback(`บันทึก ${preset.note} -฿${preset.amount} สำเร็จ!`, preset.id, preset.amount);
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
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <h3 className="font-bold text-sm text-slate-900">
            บันทึกรายจ่ายด่วน (แตะ 1 ครั้งบันทึกทันที)
          </h3>
        </div>

        <AnimatePresence mode="wait">
          {justAddedMsg ? (
            <motion.span
              key="msg"
              initial={{ opacity: 0, y: -4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md flex items-center gap-1 border border-emerald-200/60"
            >
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>{justAddedMsg}</span>
            </motion.span>
          ) : (
            <motion.button
              key="btn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onOpenFullModal}
              whileHover={{ x: 2 }}
              className="text-xs text-slate-500 hover:text-emerald-700 font-medium transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>บันทึกแบบละเอียด</span>
              <ArrowRight className="w-3 h-3" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* 1-Tap Preset Buttons */}
      <div className="mt-3.5">
        <span className="text-[11px] font-medium text-slate-400 block mb-1.5">
          แตะเพื่อบันทึกรายการยอดฮิตทันที:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {INSTANT_PRESETS.map((preset) => (
            <div key={preset.id} className="relative">
              <motion.button
                type="button"
                whileHover={{ y: -2, scale: 1.02 }}
                whileTap={{ scale: 0.94 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                onClick={() => handlePresetClick(preset)}
                className="w-full py-2.5 px-3 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-emerald-50 hover:border-emerald-300 text-slate-800 text-xs font-semibold transition-colors text-center flex flex-col items-center justify-center cursor-pointer shadow-2xs group"
              >
                <span className="group-hover:text-emerald-800 transition-colors">{preset.label}</span>
              </motion.button>

              {/* Microinteraction Floating Badge */}
              <AnimatePresence>
                {activeFloatingId?.id === preset.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 0, scale: 0.7 }}
                    animate={{ opacity: 1, y: -30, scale: 1 }}
                    exit={{ opacity: 0, y: -45, scale: 0.8 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    className="absolute inset-x-0 -top-1 pointer-events-none flex justify-center z-20"
                  >
                    <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-mono font-bold text-[11px] shadow-md">
                      -฿{activeFloatingId.amount}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
            className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 rounded-xl text-xs font-mono font-bold text-slate-900 outline-none transition-colors"
          />
        </div>

        <input
          type="text"
          placeholder="ชื่อรายการ (เช่น ข้าวผัด, ค่ารถ)"
          value={customNote}
          onChange={(e) => setCustomNote(e.target.value)}
          className="w-full sm:flex-1 px-3 py-2 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 rounded-xl text-xs text-slate-900 outline-none transition-colors"
        />

        {/* Category selector */}
        <div className="flex items-center gap-1 w-full sm:w-auto justify-between sm:justify-start">
          <motion.button
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={() => setSelectedCat('food')}
            title="อาหาร"
            className={`p-2 rounded-xl border text-xs cursor-pointer transition-colors ${
              selectedCat === 'food'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-100'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={() => setSelectedCat('transport')}
            title="เดินทาง"
            className={`p-2 rounded-xl border text-xs cursor-pointer transition-colors ${
              selectedCat === 'transport'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-100'
            }`}
          >
            <Bus className="w-3.5 h-3.5" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={() => setSelectedCat('necessities')}
            title="ของใช้"
            className={`p-2 rounded-xl border text-xs cursor-pointer transition-colors ${
              selectedCat === 'necessities'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-100'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!customAmount}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ บันทึก</span>
          </motion.button>
        </div>
      </form>
    </div>
  );
};
