import React from 'react';
import {
  CheckCircle2,
  Trophy,
  Wallet,
  Calendar,
  RotateCcw,
  Sparkles,
  ArrowRight,
  TrendingDown,
} from 'lucide-react';
import { BudgetConfig, BudgetStatus, Expense } from '../types';

interface PlanCompletedViewProps {
  config: BudgetConfig;
  status: BudgetStatus;
  expenses: Expense[];
  onStartNewPlan: () => void;
  onViewHistory: () => void;
}

export const PlanCompletedView: React.FC<PlanCompletedViewProps> = ({
  config,
  status,
  expenses,
  onStartNewPlan,
  onViewHistory,
}) => {
  const isSavingsSuccess = status.remainingBudget > 0;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Celebration Hero Card */}
      <div className="bg-white rounded-3xl border border-emerald-200 p-8 text-center shadow-lg relative overflow-hidden">
        {/* Soft background glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-600/30 mb-5">
            <Trophy className="w-10 h-10" />
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            ภารกิจครบกำหนดแล้ว
          </span>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
            เสร็จสิ้นรอบการใช้งาน {config.totalDays} วัน!
          </h2>

          <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
            {isSavingsSuccess
              ? `ยินดีด้วย! คุณเอาชีวิตรอดผ่านพ้นครบ ${config.totalDays} วันได้สำเร็จ และยังมีเงินเหลือติดกระเป๋า!`
              : `ยอดเยี่ยมมาก! คุณบริหารเงินเอาชีวิตรอดครบ ${config.totalDays} วันได้สำเร็จตามเป้าหมาย!`}
          </p>

          {/* Stats summary of this single run */}
          <div className="mt-8 grid grid-cols-3 gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <span className="text-[11px] text-slate-500 font-medium block">
                เงินตั้งต้นรอบนี้
              </span>
              <span className="text-lg sm:text-xl font-extrabold font-mono text-slate-900 mt-1 block tabular-nums">
                ฿{config.totalBudget.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                สำหรับ {config.totalDays} วัน
              </span>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
              <span className="text-[11px] text-slate-500 font-medium block">
                ใช้จ่ายไปจริง
              </span>
              <span className="text-lg sm:text-xl font-extrabold font-mono text-rose-600 mt-1 block tabular-nums">
                ฿{status.totalSpent.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                {expenses.length} รายการ
              </span>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
              <span className="text-[11px] text-emerald-800 font-medium block">
                {isSavingsSuccess ? 'เงินเหลือติดตัว' : 'ผลลัพธ์'}
              </span>
              <span className="text-lg sm:text-xl font-extrabold font-mono text-emerald-700 mt-1 block tabular-nums">
                {isSavingsSuccess
                  ? `฿${status.remainingBudget.toLocaleString()}`
                  : 'รอดพอดี!'}
              </span>
              <span className="text-[10px] text-emerald-600 mt-0.5 block">
                {isSavingsSuccess ? 'เหลือติดกระเป๋า' : 'รอดชีวิตไม่ติดลบ'}
              </span>
            </div>
          </div>

          {/* Big Action Button to start new plan */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onStartNewPlan}
              className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>เริ่มแผนรอบใหม่ (ใส่เงินและวันใหม่)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onViewHistory}
              className="w-full sm:w-auto px-5 py-3 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              ดูรายการใช้จ่ายรอบนี้
            </button>
          </div>
        </div>
      </div>

      {/* Summary of expenses in this plan */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
          <span>สรุปรายการใช้จ่ายทั้งหมดในรอบนี้</span>
          <span className="text-xs font-normal text-slate-400">
            ({expenses.length} รายการ)
          </span>
        </h3>

        <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
          {expenses.map((item) => (
            <div
              key={item.id}
              className="py-2.5 flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-medium text-slate-900">{item.note}</span>
                <span className="text-[11px] text-slate-400 ml-2 font-mono">
                  {item.date} {item.time && `· ${item.time}`}
                </span>
              </div>
              <span className="font-mono font-bold text-slate-900 tabular-nums">
                -฿{Number(item.amount).toLocaleString()}
              </span>
            </div>
          ))}

          {expenses.length === 0 && (
            <div className="py-6 text-center text-xs text-slate-400">
              ไม่มีการบันทึกรายจ่ายในรอบนี้
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
