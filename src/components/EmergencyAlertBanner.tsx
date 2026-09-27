import React from 'react';
import { AlertCircle, ArrowRight, ShieldAlert } from 'lucide-react';
import { BudgetStatus } from '../types';

interface EmergencyAlertBannerProps {
  status: BudgetStatus;
  onOpenEmergency: () => void;
  onOpenOverBudget?: () => void;
}

export const EmergencyAlertBanner: React.FC<EmergencyAlertBannerProps> = ({
  status,
  onOpenEmergency,
  onOpenOverBudget,
}) => {
  if (!status.isCritical && !status.isWarning && !status.isOverBudget) {
    return null;
  }

  // Highest priority: Over Budget
  if (status.isOverBudget) {
    return (
      <div className="relative overflow-hidden rounded-xl border-2 border-rose-500 bg-rose-50 px-4 py-3.5 mb-6 text-rose-950 shadow-md animate-in fade-in duration-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 animate-pulse shadow-sm">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-sm text-rose-900">
                  🚨 แจ้งเตือนด่วน: คุณใช้เงินเกินงบที่มีอยู่แล้ว!
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-mono font-bold bg-rose-600 text-white">
                  ติดลบ -฿{status.overBudgetAmount.toLocaleString()}
                </span>
              </div>
              <p className="text-xs text-rose-800 mt-0.5">
                ใช้จ่ายรวม ฿{status.totalSpent.toLocaleString()} ทะลุงบ ฿{status.totalBudget.toLocaleString()} แล้ว ({status.burnRatePercentage}%) กรุณาระงับการใช้จ่ายหรือปรับงบด่วน
              </p>
            </div>
          </div>

          <button
            onClick={onOpenOverBudget || onOpenEmergency}
            className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 shadow-sm transition-all cursor-pointer ring-2 ring-rose-400 ring-offset-1"
          >
            <span>ดูวิธีแก้ไขด่วน</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  const isSevere = status.isCritical;

  return (
    <div
      className={`relative overflow-hidden rounded-xl border px-4 py-3.5 mb-6 transition-all ${
        isSevere
          ? 'bg-rose-50 border-rose-200 text-rose-950 shadow-xs'
          : 'bg-amber-50 border-amber-200 text-amber-950 shadow-xs'
      }`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              isSevere
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-amber-500 text-white'
            }`}
          >
            {isSevere ? (
              <ShieldAlert className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm">
                {isSevere
                  ? '🚨 แจ้งเตือน: เงินของคุณใกล้จะหมดแล้ว!'
                  : '⚠️ แจ้งเตือน: งบประมาณเริ่มตึงตัว'}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded font-mono font-medium ${
                  isSevere
                    ? 'bg-rose-200/70 text-rose-800'
                    : 'bg-amber-200/70 text-amber-800'
                }`}
              >
                เหลือ ฿{status.dailyAllowance.toLocaleString()} /วัน
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              {isSevere
                ? `เงินคงเหลือ ฿${status.remainingBudget.toLocaleString()} ต้องใช้ให้รอดอีก ${status.daysRemaining} วัน กรุณาเปิดดูวิธีเอาตัวรอดทันที`
                : `ใช้จ่ายไปแล้ว ${status.burnRatePercentage}% ของงบ ควรระวังรายจ่ายฟุ่มเฟือยในอีก ${status.daysRemaining} วันข้างหน้า`}
            </p>
          </div>
        </div>

        {/* The prominent red action button specified in user prompt */}
        <button
          onClick={onOpenEmergency}
          className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white shadow-xs transition-all cursor-pointer ${
            isSevere
              ? 'bg-rose-600 hover:bg-rose-700 active:scale-95 animate-bounce sm:animate-none ring-2 ring-rose-400 ring-offset-1'
              : 'bg-amber-600 hover:bg-amber-700 active:scale-95'
          }`}
        >
          <span>{isSevere ? 'เปิดดูคำแนะนำประหยัดทันที' : 'ดูเทคนิคเซฟงบ'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
