import React from 'react';
import {
  Moon,
  Sun,
  CheckCircle2,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Wallet,
  Calendar,
  Sparkles,
  Utensils,
  AlertTriangle,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BudgetConfig, BudgetStatus, Expense } from '../types';
import { AnimatedNumber } from './AnimatedNumber';

interface DayEndModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: BudgetConfig;
  status: BudgetStatus;
  expenses: Expense[];
  onConfirmNextDay: () => void;
  onCompletePlan: () => void;
}

export const DayEndModal: React.FC<DayEndModalProps> = ({
  isOpen,
  onClose,
  config,
  status,
  expenses,
  onConfirmNextDay,
  onCompletePlan,
}) => {
  const currentDay = config.currentDay || 1;
  const totalDays = config.totalDays;
  const isLastDay = currentDay >= totalDays;

  // Meal completion status for current day
  const mealsLogged = config.loggedMealsByDay?.[currentDay] || {};
  const completedCount = [mealsLogged.breakfast, mealsLogged.lunch, mealsLogged.dinner].filter(Boolean).length;

  // Today's financial summary
  const todaySpent = Number(status.todaySpent || 0);
  const todayAllowance = Number(status.dailyAllowance || 0);
  const isSavedToday = todaySpent <= todayAllowance;
  const diffToday = Math.abs(todayAllowance - todaySpent);

  // Tomorrow's projected daily allowance
  const daysLeftAfterToday = Math.max(1, status.daysRemaining - 1);
  const nextDailyAllowance = Math.max(0, Math.round(status.remainingBudget / daysLeftAfterToday));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm -z-10"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 16 }}
            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
            className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden"
          >
            {/* Header Accent with Sunset/Night Theme */}
            <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-emerald-950 px-6 py-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-300 border border-white/20 shadow-inner">
                  <Moon className="w-5 h-5 fill-amber-300/40 text-amber-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30">
                      จบวันแล้ววันนี้
                    </span>
                    <span className="text-xs text-slate-300">·</span>
                    <span className="text-xs text-slate-300 font-mono">
                      วันที่ {currentDay} / {totalDays}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold tracking-tight text-white mt-0.5">
                    สรุปการใช้ชีวิต วันที่ {currentDay}
                  </h3>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-4">
              {/* Today's Expense Result Banner */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  isSavedToday
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50/80 border-amber-200 text-amber-900'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="flex items-center gap-1.5">
                    {isSavedToday ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                    )}
                    <span>
                      {isSavedToday ? 'ทำได้ดีมาก! วันนี้คุมงบอยู่' : 'วันนี้ใช้เกินงบประจำวันเล็กน้อย'}
                    </span>
                  </span>
                  <span className="font-mono text-xs">
                    งบวันนี้: ฿{todayAllowance.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-baseline justify-between mt-2">
                  <div>
                    <span className="text-xs text-slate-500 block">ยอดใช้จ่ายวันนี้รวม:</span>
                    <span className="text-2xl sm:text-3xl font-extrabold font-mono tabular-nums text-slate-900">
                      ฿<AnimatedNumber value={todaySpent} />
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-slate-500 block">ผลต่างจากงบวันนี้:</span>
                    <span
                      className={`text-base font-bold font-mono ${
                        isSavedToday ? 'text-emerald-700' : 'text-amber-700'
                      }`}
                    >
                      {isSavedToday ? `+ประหยัด ฿${diffToday.toLocaleString()}` : `-เกินงบ ฿${diffToday.toLocaleString()}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2 Key Metric Boxes (Remaining budget & Next Day projection) */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* Overall Remaining */}
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
                  <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                    <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                    <span>เงินรวมคงเหลือ</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black font-mono text-slate-900 tabular-nums">
                    ฿{status.remainingBudget.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    เหลืออีก {Math.max(0, status.daysRemaining - 1)} วันในรอบนี้
                  </div>
                </div>

                {/* Next Day Allowance */}
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
                  <div className="flex items-center gap-1.5 text-slate-500 mb-1">
                    <Sun className="w-3.5 h-3.5 text-amber-500" />
                    <span>งบต่อวันในวันถัดไป</span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black font-mono text-emerald-700 tabular-nums">
                    ~฿{nextDailyAllowance.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {isLastDay ? 'วันพรุ่งนี้คือวันสุดท้าย!' : 'คำนวณเฉลี่ยให้ใหม่'}
                  </div>
                </div>
              </div>

              {/* Meal Status Pills of Today */}
              <div className="bg-slate-50/80 border border-slate-200 rounded-2xl p-3.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-700">อาหารประจำวันนี้:</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                      mealsLogged.breakfast
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200/70 text-slate-500'
                    }`}
                  >
                    เช้า {mealsLogged.breakfast ? '✓' : '-'}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                      mealsLogged.lunch
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200/70 text-slate-500'
                    }`}
                  >
                    กลางวัน {mealsLogged.lunch ? '✓' : '-'}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                      mealsLogged.dinner
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200/70 text-slate-500'
                    }`}
                  >
                    เย็น {mealsLogged.dinner ? '✓' : '-'}
                  </span>
                </div>
              </div>

              {/* The Call to Action Question ("อยากไปวันถัดไปเลยไหม?") */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl text-center space-y-2 shadow-xs">
                <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>คำถามสำคัญ</span>
                </div>
                <h4 className="text-base sm:text-lg font-extrabold tracking-tight">
                  {isLastDay
                    ? `จบวันที่ ${currentDay} แล้ว! จบรอบแผนทั้งหมดเลยไหม?`
                    : `อยากไปวันถัดไป (วันที่ ${currentDay + 1}) เลยไหม?`}
                </h4>
                <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                  {isLastDay
                    ? 'คุณมาถึงวันสุดท้ายของแผนนี้แล้ว กดเพื่อดูบทสรุปความสำเร็จตลอดทั้งรอบ'
                    : 'เมื่อไปวันถัดไป ระบบจะสลับเมนูแนะนำ 3 มื้อใหม่ และรีเซ็ตรายการบันทึกอาหารประจำวันให้ทันที'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-1 flex flex-col sm:flex-row items-center gap-2.5">
                {/* Secondary Button: Review Today */}
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto sm:px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer order-2 sm:order-1"
                >
                  ยังก่อน (ดูหน้าวันนี้ต่อ)
                </button>

                {/* Primary Button: Proceed to Next Day */}
                {isLastDay ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    type="button"
                    onClick={() => {
                      onClose();
                      onCompletePlan();
                    }}
                    className="w-full sm:flex-1 py-3 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer order-1 sm:order-2"
                  >
                    <span>🎉 จบรอบนี้ & ดูสรุปผลทั้งหมด</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    type="button"
                    onClick={() => {
                      onClose();
                      onConfirmNextDay();
                    }}
                    className="w-full sm:flex-1 py-3 px-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer order-1 sm:order-2"
                  >
                    <span>⏩ ไปวันถัดไปเลย (วันที่ {currentDay + 1})</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
