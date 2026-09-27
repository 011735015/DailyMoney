import React from 'react';
import {
  Calendar,
  Wallet,
  TrendingDown,
  Clock,
  Edit3,
  Coffee,
  CheckCircle,
} from 'lucide-react';
import { BudgetStatus, BudgetConfig } from '../types';

interface BudgetOverviewProps {
  status: BudgetStatus;
  config: BudgetConfig;
  onOpenSettings: () => void;
  onOpenNewExpense: () => void;
  onOpenMenuTab: () => void;
}

export const BudgetOverview: React.FC<BudgetOverviewProps> = ({
  status,
  config,
  onOpenSettings,
  onOpenNewExpense,
  onOpenMenuTab,
}) => {
  const percentageSpent = status.burnRatePercentage;
  const timeElapsedPercent = Math.min(
    100,
    Math.round((status.daysPassed / status.daysTotal) * 100)
  );

  return (
    <div className="space-y-6">
      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Key Focus - Daily Allowance (เงินที่ใช้ได้ต่อวัน) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                เงินที่ใช้ได้ต่อวัน
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span
                  className={`text-4xl sm:text-5xl font-extrabold tracking-tight font-mono tabular-nums ${
                    status.isCritical
                      ? 'text-rose-600'
                      : status.isWarning
                      ? 'text-amber-600'
                      : 'text-emerald-700'
                  }`}
                >
                  ฿{status.dailyAllowance.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500 font-medium">/วัน</span>
              </div>
            </div>
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                status.isCritical
                  ? 'bg-rose-50 text-rose-600'
                  : status.isWarning
                  ? 'bg-amber-50 text-amber-600'
                  : 'bg-emerald-50 text-emerald-600'
              }`}
            >
              <Wallet className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">
              วันนี้ใช้ไปแล้ว:{' '}
              <strong className="text-slate-800 font-mono tabular-nums">
                ฿{status.todaySpent.toLocaleString()}
              </strong>
            </span>
            <span
              className={`font-semibold font-mono tabular-nums ${
                status.todayRemaining >= 0 ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {status.todayRemaining >= 0
                ? `เหลือใช้ได้วันนี้ ฿${status.todayRemaining.toLocaleString()}`
                : `เกินงบวันนี้ไป ฿${Math.abs(status.todayRemaining).toLocaleString()}`}
            </span>
          </div>
        </div>

        {/* Card 2: Remaining Budget & Total Spent */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                ยอดเงินคงเหลือรวม
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono tabular-nums text-slate-900">
                  ฿{status.remainingBudget.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400">
                  / ฿{status.totalBudget.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-5">
            <div className="flex justify-between text-xs text-slate-500 mb-1.5 font-medium">
              <span>ใช้ไปแล้ว {percentageSpent}%</span>
              <span className="font-mono tabular-nums">฿{status.totalSpent.toLocaleString()}</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  percentageSpent > 85
                    ? 'bg-rose-500'
                    : percentageSpent > 65
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, percentageSpent)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Days Remaining & Plan Timing */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                เวลาที่ต้องบริหาร
              </span>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono tabular-nums text-slate-900">
                  {status.daysRemaining}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  วันที่เหลือ / {status.daysTotal} วัน
                </span>
              </div>
            </div>
            <button
              onClick={onOpenSettings}
              title="แก้ไขจำนวนวันหรือยอดเงิน"
              className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            >
              <Edit3 className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>ผ่านไปแล้ว {status.daysPassed} วัน</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>เริ่ม {config.startDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Status & Smart Action Strip */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 w-full sm:w-auto">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
              status.isCritical
                ? 'bg-rose-100 text-rose-700'
                : status.isWarning
                ? 'bg-amber-100 text-amber-700'
                : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            {status.isCritical ? (
              <TrendingDown className="w-6 h-6" />
            ) : status.isWarning ? (
              <Clock className="w-6 h-6" />
            ) : (
              <CheckCircle className="w-6 h-6" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900">
                {status.isCritical
                  ? 'สถานะ: วิกฤตเงินเหลือน้อย'
                  : status.isWarning
                  ? 'สถานะ: การเงินตึงตัว ควรระวัง'
                  : 'สถานะ: การใช้จ่ายอยู่ในเกณฑ์ควบคุมได้ดี'}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500">
                ความคืบหน้าเวลา {timeElapsedPercent}%
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              {status.isCritical
                ? 'เงินเหลือน้อยกว่าค่าครองชีพพื้นฐาน แนะนำปรับลดเป็นเมนูประหยัดและตัดของไม่จำเป็น'
                : status.isWarning
                ? 'เงินที่เหลือใช้ได้พอดีๆ แต่หากมีค่าใช้จ่ายพิเศษอาจติดลบได้'
                : 'คุณจัดสรรเงินได้เหมาะสม สามารถทานอาหารมาตรฐานและมีเงินเหลือเก็บบางส่วน'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 justify-end">
          <button
            onClick={onOpenMenuTab}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>ดูเมนูที่กินได้ในงบนี้</span>
          </button>
          <button
            onClick={onOpenNewExpense}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <span>+ บันทึกค่าใช้จ่าย</span>
          </button>
        </div>
      </div>
    </div>
  );
};
