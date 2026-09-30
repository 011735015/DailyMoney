import React from 'react';
import {
  Wallet,
  Calendar,
  AlertOctagon,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { motion } from 'motion/react';
import { BudgetConfig, BudgetStatus, Expense, ExpenseCategory } from '../types';
import { QuickBudgetCalculator } from './QuickBudgetCalculator';
import { QuickExpenseBar } from './QuickExpenseBar';
import { InstantPlanResult } from './InstantPlanResult';
import { AnimatedNumber } from './AnimatedNumber';
import { AnalyticsCharts } from './AnalyticsCharts';
import { generateRecommendationPlan } from '../utils/planGenerator';

interface HomeOverviewProps {
  config: BudgetConfig;
  status: BudgetStatus;
  expenses: Expense[];
  onChangeBudget: (budget: number) => void;
  onChangeDays: (days: number) => void;
  onSimulateLowBudget: () => void;
  onRestoreBudget: () => void;
  onQuickAddExpense: (amount: number, category: ExpenseCategory, note: string) => void;
  onOpenFullExpenseModal: () => void;
  onOpenEmergencyModal: () => void;
  onOpenOverBudgetModal?: () => void;
  onOpenMenuTab: () => void;
  onOpenExpensesTab: () => void;
  onDeleteExpense: (id: string) => void;
  onNextDay: () => void;
  onCompletePlan: () => void;
  onOpenNewPlanModal: () => void;
  onLogMeal: (name: string, price: number, mealType: 'breakfast' | 'lunch' | 'dinner') => void;
  onUndoMeal: (mealType: 'breakfast' | 'lunch' | 'dinner') => void;
  onUndoAllTodayMeals: () => void;
  isMealLoggedToday: (mealType: 'breakfast' | 'lunch' | 'dinner') => boolean;
}

export const HomeOverview: React.FC<HomeOverviewProps> = ({
  config,
  status,
  expenses,
  onChangeBudget,
  onChangeDays,
  onSimulateLowBudget,
  onRestoreBudget,
  onQuickAddExpense,
  onOpenFullExpenseModal,
  onOpenEmergencyModal,
  onOpenOverBudgetModal,
  onOpenExpensesTab,
  onDeleteExpense,
  onNextDay,
  onCompletePlan,
  onLogMeal,
  onUndoMeal,
  onUndoAllTodayMeals,
  isMealLoggedToday,
}) => {
  // Generate instant recommendation plan matching currentDay (Day 1, 2, 3, etc.)
  const generatedPlan = generateRecommendationPlan(
    status.dailyAllowance,
    config.totalBudget,
    config.totalDays,
    config.currentDay || 1
  );

  return (
    <div className="space-y-6">
      {/* 1. Quick Budget Input & Days Adjuster (Direct on screen) */}
      <QuickBudgetCalculator
        config={config}
        status={status}
        onChangeBudget={onChangeBudget}
        onChangeDays={onChangeDays}
        onSimulateLowBudget={onSimulateLowBudget}
        onRestoreBudget={onRestoreBudget}
      />

      {/* 2. Instant Recommendation Plan & Breakdown (Rotates each day & 1 click per day & Refund capability) */}
      <InstantPlanResult
        plan={generatedPlan}
        status={status}
        config={config}
        onLogMeal={onLogMeal}
        onUndoMeal={onUndoMeal}
        onUndoAllTodayMeals={onUndoAllTodayMeals}
        isMealLoggedToday={isMealLoggedToday}
        onOpenEmergencyModal={onOpenEmergencyModal}
        onNextDay={onNextDay}
        onCompletePlan={onCompletePlan}
      />

      {/* 3. Hero Status Display (Remaining Money & Days in this round) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Total Remaining Money */}
        <motion.div
          layout
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-2xl border p-6 flex flex-col justify-between shadow-xs transition-colors ${
            status.isOverBudget
              ? 'bg-rose-50/70 border-rose-300 ring-1 ring-rose-300'
              : 'bg-white border-slate-200'
          }`}
        >
          <div>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold uppercase tracking-wider ${
                status.isOverBudget ? 'text-rose-700' : 'text-slate-500'
              }`}>
                {status.isOverBudget ? '⚠️ เงินติดลบ (ใช้เกินงบ)' : 'เงินคงเหลือในรอบนี้'}
              </span>
              {status.isOverBudget ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onOpenOverBudgetModal}
                  className="flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-200/80 px-2 py-0.5 rounded-full cursor-pointer hover:bg-rose-300 transition-colors"
                >
                  <AlertOctagon className="w-3 h-3 text-rose-700 animate-pulse" />
                  <span>ดูรายละเอียด</span>
                </motion.button>
              ) : (
                <motion.div whileHover={{ scale: 1.2, rotate: 12 }} transition={{ type: 'spring', stiffness: 400 }}>
                  <Wallet className="w-4 h-4 text-emerald-600" />
                </motion.div>
              )}
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              {status.isOverBudget ? (
                <span className="text-3xl sm:text-4xl font-black tracking-tight font-mono tabular-nums text-rose-600">
                  -฿<AnimatedNumber value={status.overBudgetAmount} />
                </span>
              ) : (
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono tabular-nums text-slate-900">
                  ฿<AnimatedNumber value={status.remainingBudget} />
                </span>
              )}
              <span className={`text-xs ${status.isOverBudget ? 'text-rose-600 font-semibold' : 'text-slate-400'}`}>
                / ฿{status.totalBudget.toLocaleString()}
              </span>
            </div>

            {status.isOverBudget && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="text-[11px] text-rose-700 mt-1"
              >
                ใช้จ่ายเกินงบไปแล้ว ฿{status.overBudgetAmount.toLocaleString()} บาท จากยอดตั้งต้น
              </motion.p>
            )}
          </div>

          <div className="mt-4">
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span className={status.isOverBudget ? 'text-rose-700 font-bold' : ''}>
                ใช้ไปแล้ว {status.burnRatePercentage}%
              </span>
              <span className={`font-mono ${status.isOverBudget ? 'text-rose-700 font-bold' : ''}`}>
                ฿<AnimatedNumber value={status.totalSpent} />
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, status.burnRatePercentage)}%` }}
                transition={{ type: 'spring', stiffness: 50, damping: 14 }}
                className={`h-full rounded-full transition-colors duration-500 ${
                  status.isOverBudget
                    ? 'bg-rose-600'
                    : status.burnRatePercentage > 85
                    ? 'bg-rose-500'
                    : status.burnRatePercentage > 65
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
              />
            </div>
          </div>
        </motion.div>

        {/* Days Progress in this round */}
        <motion.div
          layout
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                ความคืบหน้าของรอบนี้
              </span>
              <motion.div whileHover={{ scale: 1.2, rotate: -12 }} transition={{ type: 'spring', stiffness: 400 }}>
                <Calendar className="w-4 h-4 text-blue-600" />
              </motion.div>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <motion.span
                key={config.currentDay}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono tabular-nums text-slate-900 inline-block"
              >
                วันที่ {config.currentDay || 1}
              </motion.span>
              <span className="text-xs text-slate-500 font-medium">
                / ทั้งหมด {config.totalDays} วัน (เหลืออีก {status.daysRemaining} วัน)
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={onNextDay}
              title="ขยับไปวันถัดไป เมนูอาหารจะเปลี่ยนเป็นเมนูใหม่ทันที"
              className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors text-center cursor-pointer shadow-xs flex items-center justify-center gap-1.5 group"
            >
              <span className="group-hover:translate-x-0.5 transition-transform inline-block">⏩</span>
              <span>ผ่านไป 1 วัน (เปลี่ยนเมนูใหม่)</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCompletePlan}
              title="กดเพื่อดูสรุปเสร็จสิ้นรอบนี้"
              className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              🏁 จบรอบนี้
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* 4. Instant 1-Click Quick Expense Logger */}
      <QuickExpenseBar
        onAddExpense={onQuickAddExpense}
        onOpenFullModal={onOpenFullExpenseModal}
      />

      {/* 5. Recent Expenses & Analytics Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Expenses in this round */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">
                ประวัติรายการใช้จ่ายรอบนี้
              </h3>
              <button
                onClick={onOpenExpensesTab}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
              >
                ดูทั้งหมด ({expenses.length}) &gt;
              </button>
            </div>

            <div className="mt-3 divide-y divide-slate-100">
              {expenses.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="py-2.5 flex items-center justify-between text-xs group"
                >
                  <div>
                    <div className="font-medium text-slate-900">{item.note}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {item.date} {item.time && `· ${item.time}`}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 tabular-nums">
                      -฿{Number(item.amount).toLocaleString()}
                    </span>
                    <button
                      onClick={() => onDeleteExpense(item.id)}
                      className="text-slate-300 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                      title="ลบ"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
              {expenses.length === 0 && (
                <div className="py-8 text-center text-xs text-slate-400">
                  ยังไม่มีการใช้จ่ายในรอบนี้
                </div>
              )}
            </div>
          </div>

          <button
            onClick={onOpenFullExpenseModal}
            className="mt-4 w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-center border border-slate-200"
          >
            + บันทึกรายการใหม่แบบระบุรายละเอียด
          </button>
        </div>

        {/* Analytics Charts */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <AnalyticsCharts expenses={expenses} status={status} />
        </div>
      </div>
    </div>
  );
};
