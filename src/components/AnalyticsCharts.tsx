import React, { useState } from 'react';
import {
  BarChart3,
  PieChart as PieIcon,
  TrendingDown,
  Info,
} from 'lucide-react';
import { Expense, BudgetStatus, ExpenseCategory } from '../types';

interface AnalyticsChartsProps {
  expenses: Expense[];
  status: BudgetStatus;
}

const CATEGORY_NAMES: Record<ExpenseCategory, string> = {
  food: 'อาหาร & เครื่องดื่ม',
  transport: 'การเดินทาง',
  necessities: 'ของใช้ประจำวัน',
  entertainment: 'บันเทิง & สังสรรค์',
  shopping: 'ช้อปปิ้ง',
  bills: 'บิล & ค่าใช้จ่าย',
  other: 'อื่นๆ',
};

const CATEGORY_COLORS: Record<ExpenseCategory, string> = {
  food: '#f59e0b', // amber
  transport: '#3b82f6', // blue
  necessities: '#10b981', // emerald
  entertainment: '#8b5cf6', // purple
  shopping: '#ec4899', // pink
  bills: '#6366f1', // indigo
  other: '#94a3b8', // slate
};

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({
  expenses,
  status,
}) => {
  const [activeChart, setActiveChart] = useState<'daily' | 'category' | 'burndown'>('daily');

  // 1. Calculate Daily Spending over the past 7 days
  const today = new Date();
  const pastDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  const dailyData = pastDays.map((dateStr) => {
    const dayExpenses = expenses.filter((e) => e.date === dateStr);
    const total = dayExpenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    const dayLabel = new Date(dateStr).toLocaleDateString('th-TH', {
      weekday: 'short',
      day: 'numeric',
    });
    return {
      date: dateStr,
      label: dayLabel,
      total,
      isOverBudget: total > status.dailyAllowance && status.dailyAllowance > 0,
    };
  });

  const maxDailyValue = Math.max(
    ...dailyData.map((d) => d.total),
    status.dailyAllowance * 1.3,
    100
  );

  // 2. Calculate Category Breakdown
  const categoryTotals: Record<string, number> = {};
  expenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + Number(e.amount || 0);
  });

  const totalSpent = status.totalSpent || 1;
  const categorySegments = Object.entries(categoryTotals)
    .map(([cat, amount]) => ({
      category: cat as ExpenseCategory,
      amount,
      percentage: Math.round((amount / totalSpent) * 100),
      name: CATEGORY_NAMES[cat as ExpenseCategory] || cat,
      color: CATEGORY_COLORS[cat as ExpenseCategory] || '#94a3b8',
    }))
    .sort((a, b) => b.amount - a.amount);

  // Generate SVG Donut slices
  let cumulativePercent = 0;
  const donutSlices = categorySegments.map((seg) => {
    const startAngle = cumulativePercent * 3.6;
    cumulativePercent += seg.percentage;
    const endAngle = cumulativePercent * 3.6;

    // SVG arc calculation (center: 100, 100, radius: 75, innerRadius: 50)
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);

    const x1 = 100 + 75 * Math.cos(startRad);
    const y1 = 100 + 75 * Math.sin(startRad);
    const x2 = 100 + 75 * Math.cos(endRad);
    const y2 = 100 + 75 * Math.sin(endRad);

    const ix1 = 100 + 48 * Math.cos(endRad);
    const iy1 = 100 + 48 * Math.sin(endRad);
    const ix2 = 100 + 48 * Math.cos(startRad);
    const iy2 = 100 + 48 * Math.sin(startRad);

    const largeArc = seg.percentage > 50 ? 1 : 0;

    const pathData =
      seg.percentage >= 99
        ? `M 100 25 A 75 75 0 1 0 100 175 A 75 75 0 1 0 100 25 M 100 52 A 48 48 0 1 1 100 148 A 48 48 0 1 1 100 52 Z`
        : `M ${x1} ${y1} A 75 75 0 ${largeArc} 1 ${x2} ${y2} L ${ix1} ${iy1} A 48 48 0 ${largeArc} 0 ${ix2} ${iy2} Z`;

    return { ...seg, pathData };
  });

  return (
    <div className="space-y-6">
      {/* Chart Navigation Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              กราฟและบทวิเคราะห์ทางการเงิน
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              ติดตามพฤติกรรมการใช้จ่ายและตรวจสอบว่าเงินจะพอใช้จนถึงวันสุดท้ายหรือไม่
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setActiveChart('daily')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                activeChart === 'daily'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>รายวัน vs โควต้า</span>
            </button>
            <button
              onClick={() => setActiveChart('category')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                activeChart === 'category'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <PieIcon className="w-3.5 h-3.5" />
              <span>สัดส่วนตามหมวดหมู่</span>
            </button>
            <button
              onClick={() => setActiveChart('burndown')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                activeChart === 'burndown'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingDown className="w-3.5 h-3.5" />
              <span>การลดลงของงบ</span>
            </button>
          </div>
        </div>

        {/* View 1: Daily Bar Chart vs Allowance Target Line */}
        {activeChart === 'daily' && (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-700">
                  สถิติใช้จ่าย 7 วันล่าสุด
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-emerald-700 font-mono font-medium">
                  เส้นประ = โควต้าที่ใช้ได้ (฿{status.dailyAllowance}/วัน)
                </span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 inline-block" />
                  ในเกณฑ์
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-xs bg-rose-500 inline-block" />
                  เกินงบ
                </span>
              </div>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="h-64 w-full relative pt-6 pb-2">
              {/* Daily Allowance Target Guide Line */}
              {status.dailyAllowance > 0 && maxDailyValue > 0 && (
                <div
                  className="absolute left-0 right-0 border-b-2 border-dashed border-emerald-500 z-10 pointer-events-none"
                  style={{
                    bottom: `${Math.min(
                      85,
                      Math.max(15, (status.dailyAllowance / maxDailyValue) * 100)
                    )}%`,
                  }}
                >
                  <span className="absolute right-0 -top-4 text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                    เป้าหมาย ฿{status.dailyAllowance}
                  </span>
                </div>
              )}

              {/* Bar columns */}
              <div className="h-full flex items-end justify-between gap-2 sm:gap-4 px-2">
                {dailyData.map((d) => {
                  const heightPercent =
                    maxDailyValue > 0
                      ? Math.min(100, Math.max(4, (d.total / maxDailyValue) * 100))
                      : 4;

                  return (
                    <div
                      key={d.date}
                      className="flex-1 flex flex-col items-center h-full justify-end group"
                    >
                      {/* Tooltip value */}
                      <span className="text-[10px] font-mono text-slate-500 group-hover:text-slate-900 group-hover:font-bold mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        ฿{d.total}
                      </span>

                      {/* Bar body */}
                      <div
                        className={`w-full max-w-[48px] rounded-t-lg transition-all duration-300 relative ${
                          d.total === 0
                            ? 'bg-slate-100'
                            : d.isOverBudget
                            ? 'bg-rose-500 group-hover:bg-rose-600'
                            : 'bg-emerald-500 group-hover:bg-emerald-600'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      >
                        {d.total > 0 && (
                          <div className="absolute top-1 left-0 right-0 text-center text-[9px] font-mono font-bold text-white hidden sm:block">
                            ฿{d.total}
                          </div>
                        )}
                      </div>

                      {/* Day Label */}
                      <span className="text-[11px] text-slate-600 mt-2 font-medium truncate w-full text-center">
                        {d.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 p-3 bg-slate-50 rounded-xl text-xs text-slate-600 flex items-center justify-between">
              <span>
                💡 แนะนำ: วันไหนที่ใช้จ่ายต่ำกว่าเส้นประ ยอดเงินส่วนต่างจะช่วยเพิ่มเงินให้วันถัดไปโดยอัตโนมัติ
              </span>
              <span className="font-mono font-bold text-slate-900">
                รวม 7 วัน: ฿
                {dailyData.reduce((s, x) => s + x.total, 0).toLocaleString()}
              </span>
            </div>
          </div>
        )}

        {/* View 2: Category Breakdown Donut */}
        {activeChart === 'category' && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Donut chart */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-52 h-52">
                <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
                  {donutSlices.map((slice, i) => (
                    <path
                      key={i}
                      d={slice.pathData}
                      fill={slice.color}
                      className="hover:opacity-85 transition-opacity cursor-pointer"
                    />
                  ))}
                  {donutSlices.length === 0 && (
                    <circle cx="100" cy="100" r="60" fill="#f1f5f9" />
                  )}
                </svg>

                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[11px] text-slate-400 font-medium">ยอดใช้รวม</span>
                  <span className="text-xl font-extrabold font-mono text-slate-900 tabular-nums">
                    ฿{status.totalSpent.toLocaleString()}
                  </span>
                </div>
              </div>
              <span className="text-xs text-slate-400 mt-2">
                คลิกหรือดูรายละเอียดสัดส่วนตามหมวด
              </span>
            </div>

            {/* Category breakdown table */}
            <div className="space-y-2.5">
              {categorySegments.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  ยังไม่มีข้อมูลการใช้จ่ายเพื่อแสดงสัดส่วน
                </div>
              ) : (
                categorySegments.map((cat) => (
                  <div
                    key={cat.category}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 bg-slate-50/50"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="text-xs font-medium text-slate-800">
                        {cat.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-500 font-mono">
                        {cat.percentage}%
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-900 tabular-nums min-w-[70px] text-right">
                        ฿{cat.amount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* View 3: Budget Burndown / Trajectory */}
        {activeChart === 'burndown' && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">
                เส้นทางเงินคงเหลือเทียบกับจำนวนวันที่เหลือ
              </span>
              <span className="text-xs text-slate-500 font-mono">
                เป้าหมายคงเหลือสิ้นสุด {status.daysTotal} วัน
              </span>
            </div>

            {/* Trajectory visual */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="text-slate-500 text-xs">งบตั้งต้นทั้งหมด</div>
                  <div className="text-lg font-bold font-mono text-slate-900 mt-1">
                    ฿{status.totalBudget.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    สำหรับ {status.daysTotal} วัน
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="text-slate-500 text-xs">เงินคงเหลือปัจจุบัน</div>
                  <div className="text-lg font-bold font-mono text-emerald-700 mt-1">
                    ฿{status.remainingBudget.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    เหลืออีก {status.daysRemaining} วัน
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="text-slate-500 text-xs">อัตราเผาผลาญงบ (Burn Rate)</div>
                  <div
                    className={`text-lg font-bold font-mono mt-1 ${
                      status.burnRatePercentage > 80
                        ? 'text-rose-600'
                        : status.burnRatePercentage > 50
                        ? 'text-amber-600'
                        : 'text-emerald-700'
                    }`}
                  >
                    {status.burnRatePercentage}%
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    ของยอดเงินตั้งต้น
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-200/80 text-xs text-slate-600 space-y-2">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-emerald-600 shrink-0" />
                  <p className="text-[11px] leading-relaxed">
                    <strong>การคาดการณ์:</strong> หากคุณรักษาการใช้จ่ายไม่เกิน{' '}
                    <strong>฿{status.dailyAllowance} ต่อวัน</strong>{' '}
                    เงินของคุณจะเพียงพอจนครบ {status.daysTotal} วันอย่างแน่นอน!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
