import React from 'react';
import { Wallet, Calendar, Sparkles, RefreshCw, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { BudgetConfig, BudgetStatus } from '../types';

interface QuickBudgetCalculatorProps {
  config: BudgetConfig;
  status: BudgetStatus;
  onChangeBudget: (budget: number) => void;
  onChangeDays: (days: number) => void;
  onSimulateLowBudget: () => void;
  onRestoreBudget: () => void;
}

const QUICK_BUDGET_AMOUNTS = [300, 500, 1000, 2000, 3000, 5000];
const QUICK_DAYS = [1, 3, 5, 7, 10, 15, 30];

export const QuickBudgetCalculator: React.FC<QuickBudgetCalculatorProps> = ({
  config,
  status,
  onChangeBudget,
  onChangeDays,
  onSimulateLowBudget,
  onRestoreBudget,
}) => {
  const instantRate =
    config.totalDays > 0 ? Math.round(config.totalBudget / config.totalDays) : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base text-slate-900">
                ใส่จำนวนเงินและวัน (แสดงคำแนะนำทันที)
              </h2>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                เว็บเอาชีวิตรอด ไม่หักเงินเก็บ
              </span>
            </div>
            <p className="text-xs text-slate-500">
              พิมพ์จำนวนเงินและวัน ระบบจะคำนวณและแสดงรายการแนะนำ 3 มื้อด้านล่างให้ทันที
            </p>
          </div>
        </div>

        {/* Quick test trigger for low money alert */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {status.isCritical ? (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              onClick={onRestoreBudget}
              className="text-[11px] font-medium text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>คืนค่างบปกติ</span>
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              onClick={onSimulateLowBudget}
              title="ทดสอบดูหน้าตาปุ่มเตือนสีแดงและคำแนะนำประหยัด"
              className="text-[11px] font-medium text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>🧪 ทดลองโหมดเงินใกล้หมด</span>
            </motion.button>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Input 1: Total Budget */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-emerald-600" />
              1. มีเงินอยู่ทั้งหมด (บาท)
            </span>
            <span className="text-[11px] text-slate-400 font-normal">
              พิมพ์ตัวเลขหรือกดเลือกด่วน
            </span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400 font-mono">
              ฿
            </span>
            <input
              type="number"
              min="0"
              step="any"
              value={config.totalBudget === 0 ? '' : config.totalBudget}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onChangeBudget(isNaN(val) ? 0 : val);
              }}
              placeholder="เช่น 1000"
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-lg font-bold font-mono text-slate-900 outline-none transition-all placeholder:text-slate-300"
            />
          </div>

          {/* Quick Amount Buttons */}
          <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-0.5">
            <span className="text-[11px] text-slate-400 shrink-0">เลือกด่วน:</span>
            {QUICK_BUDGET_AMOUNTS.map((amt) => (
              <motion.button
                key={amt}
                whileTap={{ scale: 0.92 }}
                type="button"
                onClick={() => onChangeBudget(amt)}
                className={`px-2.5 py-1 text-xs rounded-lg font-mono transition-colors cursor-pointer ${
                  config.totalBudget === amt
                    ? 'bg-emerald-600 text-white font-bold shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium'
                }`}
              >
                ฿{amt.toLocaleString()}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Input 2: Total Days */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              2. ต้องใช้อีกกี่วัน (วัน)
            </span>
            <span className="text-[11px] text-slate-400 font-normal">
              ระบุจำนวนวันในรอบนี้
            </span>
          </label>
          <div className="relative">
            <input
              type="number"
              min="1"
              max="365"
              value={config.totalDays === 0 ? '' : config.totalDays}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                onChangeDays(isNaN(val) ? 1 : Math.max(1, val));
              }}
              placeholder="เช่น 5"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-xl text-lg font-bold font-mono text-slate-900 outline-none transition-all placeholder:text-slate-300"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">
              วัน
            </span>
          </div>

          {/* Quick Days Buttons */}
          <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-0.5">
            <span className="text-[11px] text-slate-400 shrink-0">เลือกด่วน:</span>
            {QUICK_DAYS.map((days) => (
              <motion.button
                key={days}
                whileTap={{ scale: 0.92 }}
                type="button"
                onClick={() => onChangeDays(days)}
                className={`px-2.5 py-1 text-xs rounded-lg font-mono transition-colors cursor-pointer ${
                  config.totalDays === days
                    ? 'bg-blue-600 text-white font-bold shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium'
                }`}
              >
                {days} วัน
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Instant Result Summary Bar */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">⚡ เงินที่ใช้ได้ต่อวัน:</span>
          <span className="font-mono font-extrabold text-emerald-700 text-base">
            ฿{instantRate.toLocaleString()} /วัน
          </span>
          <span className="text-slate-400">
            (฿{config.totalBudget.toLocaleString()} ÷ {config.totalDays} วัน)
          </span>
        </div>
        <div className="text-[11px] text-emerald-800 font-medium bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 self-start sm:self-auto">
          ✓ ไม่หักเงินเก็บ ทุกบาทเอาไว้ใช้ประคองชีพจนครบกำหนด
        </div>
      </div>
    </div>
  );
};
