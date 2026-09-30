import React from 'react';
import {
  AlertOctagon,
  X,
  RotateCcw,
  SlidersHorizontal,
  RefreshCw,
  TrendingDown,
  ShieldAlert,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BudgetStatus, Expense } from '../types';

interface OverBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: BudgetStatus;
  lastExpense?: Expense;
  onUndoLastExpense?: () => void;
  onOpenSettings: () => void;
  onOpenNewPlan: () => void;
}

export const OverBudgetModal: React.FC<OverBudgetModalProps> = ({
  isOpen,
  onClose,
  status,
  lastExpense,
  onUndoLastExpense,
  onOpenSettings,
  onOpenNewPlan,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm -z-10"
          />

          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 16 }}
            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
            className="relative bg-white rounded-2xl max-w-lg w-full shadow-2xl border-2 border-rose-400 overflow-hidden"
          >
            {/* Warning Top Accent */}
            <div className="bg-rose-600 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <AlertOctagon className="w-5 h-5 text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-bold tracking-tight">
                    แจ้งเตือน: คุณใช้เงินเกินงบประมาณแล้ว!
                  </h3>
                  <p className="text-xs text-rose-100">
                    ยอดเงินคงเหลือติดลบ กรุณาหยุดใช้จ่ายทันที
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-1.5 rounded-lg text-rose-100 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="p-6 space-y-5">
              {/* Main Deficit Indicator */}
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-center">
                <div className="text-xs font-semibold text-rose-700 uppercase tracking-wider">
                  ยอดเงินที่ใช้เกินกว่างบทั้งหมดที่มี (ติดลบ)
                </div>
                <div className="mt-1 text-3xl sm:text-4xl font-black font-mono text-rose-600 tabular-nums">
                  -฿{status.overBudgetAmount.toLocaleString()}
                </div>
                <div className="mt-2 flex items-center justify-center gap-3 text-xs text-rose-800">
                  <span>งบตั้งต้น: ฿{status.totalBudget.toLocaleString()}</span>
                  <span>•</span>
                  <span className="font-semibold">
                    ใช้ไปแล้ว: ฿{status.totalSpent.toLocaleString()} ({status.burnRatePercentage}%)
                  </span>
                </div>
              </div>

              {/* Last Recorded Item with Instant Undo Action */}
              {lastExpense && onUndoLastExpense && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <span className="text-[11px] font-semibold text-slate-500 block">
                      รายการที่เพิ่งบันทึกล่าสุด:
                    </span>
                    <span className="text-sm font-bold text-slate-900 truncate block">
                      {lastExpense.note} (-฿{Number(lastExpense.amount).toLocaleString()})
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => {
                      onUndoLastExpense();
                      onClose();
                    }}
                    className="shrink-0 flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-rose-50 text-rose-700 border border-rose-200 hover:border-rose-300 rounded-lg text-xs font-semibold shadow-2xs transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>ยกเลิก/คืนเงิน</span>
                  </motion.button>
                </div>
              )}

              {/* Action Recommendations */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-500" />
                  <span>แนวทางแก้ไขสถานการณ์เงินติดลบ</span>
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      1
                    </span>
                    <div className="text-slate-700">
                      <span className="font-semibold text-slate-900">
                        งดการใช้จ่ายทุกประเภท:
                      </span>{' '}
                      หากยังอยู่ในรอบนี้ พยายามใช้วัตถุดิบหรืออาหารที่มีอยู่ หรือเลือกเมนูฟรี/ประหยัดสุดขีด
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl flex items-start justify-between gap-2.5">
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-blue-200 text-blue-900 font-bold flex items-center justify-center shrink-0 text-[10px]">
                        2
                      </span>
                      <div className="text-slate-700">
                        <span className="font-semibold text-slate-900">
                          เติมเงิน/ปรับเพิ่มงบประมาณ:
                        </span>{' '}
                        หากมีเงินก้อนใหม่เข้ามา สามารถขยายงบเพื่อคำนวณใหม่ได้ทันที
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenSettings();
                      }}
                      className="shrink-0 text-blue-700 hover:text-blue-900 font-bold text-xs underline cursor-pointer"
                    >
                      ปรับงบ &gt;
                    </button>
                  </div>

                  <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-start justify-between gap-2.5">
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-900 font-bold flex items-center justify-center shrink-0 text-[10px]">
                        3
                      </span>
                      <div className="text-slate-700">
                        <span className="font-semibold text-slate-900">
                          รีเซ็ตและเริ่มแผนรอบใหม่:
                        </span>{' '}
                        หากต้องการล้างข้อมูลและเริ่มต้นตั้งงบประมาณใหม่อีกครั้ง
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenNewPlan();
                      }}
                      className="shrink-0 text-emerald-700 hover:text-emerald-900 font-bold text-xs underline cursor-pointer"
                    >
                      เริ่มใหม่ &gt;
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    onClose();
                    onOpenSettings();
                  }}
                  className="w-full sm:flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>ปรับงบประมาณใหม่</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={onClose}
                  className="w-full sm:w-auto py-2.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                >
                  รับทราบ / ปิดหน้าต่างนี้
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
