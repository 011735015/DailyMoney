import React, { useState } from 'react';
import {
  X,
  AlertTriangle,
  CheckCircle2,
  Utensils,
  Ban,
  Wallet,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { BudgetStatus } from '../types';
import { EMERGENCY_SAVING_TIPS } from '../data/emergencyTips';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: BudgetStatus;
  onApplySurvivalPlan?: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  status,
  onApplySurvivalPlan,
}) => {
  const [checkedRules, setCheckedRules] = useState<Record<string, boolean>>({
    'freeze-1': true,
    'freeze-2': true,
  });

  if (!isOpen) return null;

  const toggleCheck = (id: string) => {
    setCheckedRules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const dailyAllowance = status.dailyAllowance;
  // Calculate recommended rationing per meal
  const breakfastBudget = Math.max(15, Math.floor(dailyAllowance * 0.25));
  const lunchBudget = Math.max(25, Math.floor(dailyAllowance * 0.45));
  const dinnerBudget = Math.max(20, Math.floor(dailyAllowance * 0.3));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-rose-200 overflow-hidden">
        {/* Header */}
        <div className="bg-rose-600 text-white px-6 py-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                คู่มือเอาตัวรอด & คำแนะนำการประหยัดค่าใช้จ่ายฉุกเฉิน
              </h2>
              <p className="text-xs text-rose-100 mt-0.5">
                วางแผนประคองเงินคงเหลือ ฿{status.remainingBudget.toLocaleString()} ให้อยู่รอดได้อีก {status.daysRemaining} วัน
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-rose-100 hover:text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-sm">
          {/* Situation Box */}
          <div className="bg-rose-50/70 border border-rose-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-rose-200/60">
              <span className="font-semibold text-rose-900 text-xs flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-rose-600" />
                โควต้าเงินที่ใช้ได้สูงสุดต่อวันขณะนี้
              </span>
              <span className="text-base font-bold font-mono text-rose-700">
                ฿{dailyAllowance.toLocaleString()} /วัน
              </span>
            </div>

            <p className="text-xs text-rose-800 leading-relaxed mb-3">
              ระบบแนะนำให้แบ่งเงินรายวันออกเป็น 3 มื้ออย่างเคร่งครัด หากมื้อไหนกินประหยัดได้ ให้เก็บสะสมเป็นส่วนต่างสำรองวันพรุ่งนี้ทันที
            </p>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-white rounded-lg p-2.5 border border-rose-100 shadow-2xs">
                <div className="text-slate-500 font-medium text-[11px]">มื้อเช้า (25%)</div>
                <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">฿{breakfastBudget}</div>
                <div className="text-[10px] text-slate-500 mt-1">โจ๊ก/หมูปิ้ง/ไข่ต้ม</div>
              </div>
              <div className="bg-white rounded-lg p-2.5 border border-rose-100 shadow-2xs">
                <div className="text-slate-500 font-medium text-[11px]">มื้อกลางวัน (45%)</div>
                <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">฿{lunchBudget}</div>
                <div className="text-[10px] text-slate-500 mt-1">ข้าวราดแกง/มาม่าใส่ไข่</div>
              </div>
              <div className="bg-white rounded-lg p-2.5 border border-rose-100 shadow-2xs">
                <div className="text-slate-500 font-medium text-[11px]">มื้อเย็น (30%)</div>
                <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">฿{dinnerBudget}</div>
                <div className="text-[10px] text-slate-500 mt-1">ไข่เจียว/ยำปลากระป๋อง</div>
              </div>
            </div>
          </div>

          {/* Quick Survival Grocery Guide */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              สูตรซื้อวัตถุดิบ 100 บาท อยู่ได้ 3-4 วัน (ทำเองประหยัดสุด)
            </h3>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200">
                <span className="font-medium text-slate-800">1. ไข่ไก่ 10 ฟอง</span>
                <span className="font-mono text-slate-700 font-semibold">~45 บาท (มื้อละ 4.5 บาท)</span>
              </div>
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200">
                <span className="font-medium text-slate-800">2. ข้าวสาร 1 กิโลกรัม</span>
                <span className="font-mono text-slate-700 font-semibold">~35 บาท (หุงได้ 10-12 จาน)</span>
              </div>
              <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-200">
                <span className="font-medium text-slate-800">3. ผักบุ้ง 1 กำ + พริกกระเทียม</span>
                <span className="font-mono text-slate-700 font-semibold">~20 บาท</span>
              </div>
              <p className="text-[11px] text-slate-500 pt-1">
                💡 นำมาทำ: ข้าวผัดไข่, ข้าวไข่เจียวทรงเครื่อง, ข้าวไข่ต้มยางมะตูมพริกน้ำปลา, ผัดผักบุ้งราดข้าว ได้อาหารครบสารอาหารและอร่อยโดยใช้เงินไม่เกินวันละ 30 บาท!
              </p>
            </div>
          </div>

          {/* Emergency Stop Leak Checklist */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
              <Ban className="w-4 h-4 text-rose-600" />
              เช็กลิสต์ "ตัดรายจ่ายรั่วไหลทันที"
            </h3>
            <div className="space-y-2">
              {[
                {
                  id: 'freeze-1',
                  text: 'งดซื้อชานมไข่มุก กาแฟคาเฟ่ และน้ำอัดลม (ดื่มน้ำเปล่าฟรีจากตู้กด)',
                  saving: 'เซฟทันที 40-80฿/วัน',
                },
                {
                  id: 'freeze-2',
                  text: 'งดสั่งอาหารผ่าน Delivery ทุกกรณี (มีค่าส่งและราคาบวกเพิ่ม 25-35%)',
                  saving: 'เซฟทันที 50-100฿/ครั้ง',
                },
                {
                  id: 'freeze-3',
                  text: 'ห้ามเดินเล่นในมินิมาร์ทหรือร้านสะดวกซื้อตอนกำลังหิว',
                  saving: 'ลดการซื้อของจุกจิก',
                },
                {
                  id: 'freeze-4',
                  text: 'ใช้รถเมล์ธรรมดา (ร้อน 8-10 บาท) หรือเดินเท้าแทนการนั่งวินมอเตอร์ไซค์',
                  saving: 'เซฟทันที 30-60฿/เที่ยว',
                },
                {
                  id: 'freeze-5',
                  text: 'หยุดซื้อของออนไลน์และสตรีมมิ่งชั่วคราวจนกว่าจะเริ่มรอบงบถัดไป',
                  saving: 'ปิดรูรั่วเงินหมด',
                },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    checkedRules[item.id]
                      ? 'bg-emerald-50/60 border-emerald-200 text-slate-900'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className="pt-0.5">
                    {checkedRules[item.id] ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded border border-slate-300 shrink-0" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium">{item.text}</p>
                    <span className="text-[10px] text-emerald-700 font-semibold font-mono">
                      {item.saving}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Strategy Cards */}
          <div>
            <h3 className="font-bold text-slate-900 text-sm mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              กลยุทธ์เสริมเพื่อความอยู่รอด
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {EMERGENCY_SAVING_TIPS.slice(0, 2).map((tip) => (
                <div
                  key={tip.id}
                  className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs"
                >
                  <div className="text-xs font-semibold text-slate-900">{tip.title}</div>
                  <div className="text-[11px] text-slate-500 mt-1">{tip.subtitle}</div>
                  <div className="text-[10px] text-emerald-600 font-semibold font-mono mt-2 bg-emerald-50 px-2 py-0.5 rounded inline-block">
                    {tip.expectedSavingPerDay}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-500 text-center sm:text-left">
            หากทำตามเช็กลิสต์ด้านบน คุณจะประหยัดเพิ่มได้ถึง 100 - 200 บาทต่อวัน!
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onApplySurvivalPlan && (
              <button
                onClick={() => {
                  onApplySurvivalPlan();
                  onClose();
                }}
                className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Utensils className="w-3.5 h-3.5" />
                <span>ดูเมนูโหมดประหยัด</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors"
            >
              เข้าใจแล้ว
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
