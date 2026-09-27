import React from 'react';
import {
  Utensils,
  PlusCircle,
  Bus,
  Coffee,
  ShoppingBag,
  Sparkles,
  AlertTriangle,
  Check,
  ShieldAlert,
  ArrowRight,
  Lightbulb,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { GeneratedPlan } from '../utils/planGenerator';
import { BudgetStatus, BudgetConfig } from '../types';

interface InstantPlanResultProps {
  plan: GeneratedPlan;
  status: BudgetStatus;
  config: BudgetConfig;
  onLogMeal: (name: string, price: number, mealType: 'breakfast' | 'lunch' | 'dinner') => void;
  onUndoMeal: (mealType: 'breakfast' | 'lunch' | 'dinner') => void;
  onUndoAllTodayMeals?: () => void;
  isMealLoggedToday: (mealType: 'breakfast' | 'lunch' | 'dinner') => boolean;
  onOpenEmergencyModal: () => void;
  onNextDay: () => void;
  onCompletePlan: () => void;
}

export const InstantPlanResult: React.FC<InstantPlanResultProps> = ({
  plan,
  status,
  config,
  onLogMeal,
  onUndoMeal,
  onUndoAllTodayMeals,
  isMealLoggedToday,
  onOpenEmergencyModal,
  onNextDay,
  onCompletePlan,
}) => {
  const isCritical = plan.isCriticalAlert || status.isCritical;
  const currentDay = config.currentDay || 1;

  const isBreakfastDone = isMealLoggedToday('breakfast');
  const isLunchDone = isMealLoggedToday('lunch');
  const isDinnerDone = isMealLoggedToday('dinner');

  const completedMealsCount =
    (isBreakfastDone ? 1 : 0) + (isLunchDone ? 1 : 0) + (isDinnerDone ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* 1. Main Calculation Banner */}
      <div
        className={`rounded-3xl border p-6 sm:p-8 shadow-sm transition-all ${
          isCritical
            ? 'bg-rose-50/80 border-rose-300'
            : plan.tier === 'tight'
            ? 'bg-amber-50/70 border-amber-300'
            : 'bg-white border-slate-200'
        }`}
      >
        {/* Survival Mode Notice Bar */}
        <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white text-[11px] font-semibold rounded-full shadow-2xs">
          <span>⚡ เว็บเอาชีวิตรอด:</span>
          <span className="text-emerald-400 font-normal">
            คำนวณเต็มจำนวน ไม่หักเงินเก็บ ทุกบาทคือเงินประคองชีพ
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b border-slate-200/80">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  isCritical
                    ? 'bg-rose-600 text-white animate-pulse'
                    : plan.tier === 'tight'
                    ? 'bg-amber-500 text-white'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {plan.tierName}
              </span>
              <span className="text-xs text-slate-500">
                รอบ {config.totalDays} วัน (เงินรวม ฿{config.totalBudget.toLocaleString()})
              </span>
            </div>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                คุณใช้ได้เฉลี่ยวันละ
              </span>
              <span
                className={`text-4xl sm:text-5xl font-extrabold font-mono tracking-tight tabular-nums ${
                  isCritical
                    ? 'text-rose-600'
                    : plan.tier === 'tight'
                    ? 'text-amber-600'
                    : 'text-emerald-700'
                }`}
              >
                ฿{plan.dailyAllowance.toLocaleString()}
              </span>
              <span className="text-sm font-medium text-slate-600">/ วัน</span>
            </div>

            <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
              {plan.tierDescription}
            </p>
          </div>

          {/* Quick tracker & actions for this single-use round */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 justify-end">
            <div className="flex items-center justify-between gap-2 bg-white/80 border border-slate-200 px-3.5 py-2 rounded-xl text-xs">
              <span className="text-slate-500">ความคืบหน้ารอบนี้:</span>
              <span className="font-bold text-slate-900 font-mono">
                วันที่ {currentDay} / {config.totalDays} วัน
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onNextDay}
                title="ขยับไปวันถัดไป เมนูจะเปลี่ยนเป็นเมนูใหม่ทันที"
                className="flex-1 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer text-center shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>⏩ ผ่านไปวันถัดไป (เปลี่ยนเมนู)</span>
              </button>
              <button
                onClick={onCompletePlan}
                title="จบรอบการใช้งานเพื่อดูสรุป"
                className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-2xs whitespace-nowrap"
              >
                🏁 จบรอบ
              </button>
            </div>
          </div>
        </div>

        {/* Critical Alert Red Button (If Low Budget) */}
        {isCritical && (
          <div className="mt-4 p-4 bg-rose-600 text-white rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md animate-pulse">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 shrink-0" />
              <div>
                <h4 className="font-bold text-sm">
                  🚨 แจ้งเตือน: เงินต่อวันอยู่ในระดับต่ำมาก (เหลือน้อยวิกฤต)
                </h4>
                <p className="text-xs text-rose-100 mt-0.5">
                  ต้องใช้เงินอย่างระมัดระวังสูงสุดเพื่อให้อยู่รอดครบ {config.totalDays} วัน
                </p>
              </div>
            </div>

            <button
              onClick={onOpenEmergencyModal}
              className="w-full sm:w-auto px-4 py-2 bg-white text-rose-700 hover:bg-rose-50 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <span>กดดูคำแนะนำประหยัดทันที</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 2. Three Recommended Meals for this Day (Clickable once per day & rotates each day) */}
        <div className="mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Utensils className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-slate-900 text-sm">
                เมนูอาหารแนะนำ 3 มื้อ วันที่ {currentDay} ของรอบนี้
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">
                (กดได้มื้อละ 1 ครั้ง/วัน)
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <span className="text-slate-500">
                ทานแล้ววันนี้:{' '}
                <strong className="text-emerald-700 font-mono">
                  {completedMealsCount}/3 มื้อ
                </strong>
              </span>
              <span className="text-slate-300">·</span>
              <span className="font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                รวมค่าอาหาร ~฿{plan.meals.totalMealCost}/วัน
              </span>
              {completedMealsCount > 0 && onUndoAllTodayMeals && (
                <button
                  onClick={onUndoAllTodayMeals}
                  title="กดยกเลิกและคืนเงินค่าอาหารทุกมื้อของวันนี้กลับเข้ากระเป๋า"
                  className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer ml-1 active:scale-95"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>รีคืนเงินทุกมื้อวันนี้</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Breakfast */}
            <div
              className={`border rounded-2xl p-4 flex flex-col justify-between transition-all ${
                isBreakfastDone
                  ? 'bg-emerald-50/50 border-emerald-300 shadow-xs'
                  : 'bg-white border-slate-200 shadow-2xs hover:border-emerald-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded flex items-center gap-1">
                    <span>มื้อเช้า (วันที่ {currentDay})</span>
                    {isBreakfastDone && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-900">
                    ~฿{plan.meals.breakfast.estimatedPrice}
                  </span>
                </div>
                <h4 className="font-semibold text-xs text-slate-900 mt-2">
                  {plan.meals.breakfast.name}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  {plan.meals.breakfast.description}
                </p>
                <div className="mt-2 text-[10px] text-emerald-700 bg-emerald-50/70 p-1.5 rounded-lg">
                  💡 {plan.meals.breakfast.savingTip}
                </div>
              </div>

              {isBreakfastDone ? (
                <div className="mt-3 flex items-center gap-1.5">
                  <div className="flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 bg-emerald-600 text-white shadow-2xs">
                    <Check className="w-3.5 h-3.5" />
                    <span>ทานแล้ววันนี้ (+฿{plan.meals.breakfast.estimatedPrice})</span>
                  </div>
                  <button
                    onClick={() => onUndoMeal('breakfast')}
                    title={`กดยกเลิกและคืนเงิน ฿${plan.meals.breakfast.estimatedPrice} กลับเข้ากระเป๋าทันที`}
                    className="py-2 px-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-xl transition-all cursor-pointer text-xs font-bold flex items-center gap-1 shrink-0 active:scale-95 shadow-2xs"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>รี (คืนเงิน ฿{plan.meals.breakfast.estimatedPrice})</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() =>
                    onLogMeal(
                      plan.meals.breakfast.name,
                      plan.meals.breakfast.estimatedPrice,
                      'breakfast'
                    )
                  }
                  className="mt-3 w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs active:scale-95 transition-all cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>ทานมื้อนี้ (+฿{plan.meals.breakfast.estimatedPrice})</span>
                </button>
              )}
            </div>

            {/* Lunch */}
            <div
              className={`border rounded-2xl p-4 flex flex-col justify-between transition-all ${
                isLunchDone
                  ? 'bg-emerald-50/50 border-emerald-300 shadow-xs'
                  : 'bg-white border-slate-200 shadow-2xs hover:border-emerald-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                    <span>มื้อกลางวัน (วันที่ {currentDay})</span>
                    {isLunchDone && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-900">
                    ~฿{plan.meals.lunch.estimatedPrice}
                  </span>
                </div>
                <h4 className="font-semibold text-xs text-slate-900 mt-2">
                  {plan.meals.lunch.name}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  {plan.meals.lunch.description}
                </p>
                <div className="mt-2 text-[10px] text-emerald-700 bg-emerald-50/70 p-1.5 rounded-lg">
                  💡 {plan.meals.lunch.savingTip}
                </div>
              </div>

              {isLunchDone ? (
                <div className="mt-3 flex items-center gap-1.5">
                  <div className="flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 bg-emerald-600 text-white shadow-2xs">
                    <Check className="w-3.5 h-3.5" />
                    <span>ทานแล้ววันนี้ (+฿{plan.meals.lunch.estimatedPrice})</span>
                  </div>
                  <button
                    onClick={() => onUndoMeal('lunch')}
                    title={`กดยกเลิกและคืนเงิน ฿${plan.meals.lunch.estimatedPrice} กลับเข้ากระเป๋าทันที`}
                    className="py-2 px-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-xl transition-all cursor-pointer text-xs font-bold flex items-center gap-1 shrink-0 active:scale-95 shadow-2xs"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>รี (คืนเงิน ฿{plan.meals.lunch.estimatedPrice})</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() =>
                    onLogMeal(
                      plan.meals.lunch.name,
                      plan.meals.lunch.estimatedPrice,
                      'lunch'
                    )
                  }
                  className="mt-3 w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs active:scale-95 transition-all cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>ทานมื้อนี้ (+฿{plan.meals.lunch.estimatedPrice})</span>
                </button>
              )}
            </div>

            {/* Dinner */}
            <div
              className={`border rounded-2xl p-4 flex flex-col justify-between transition-all ${
                isDinnerDone
                  ? 'bg-emerald-50/50 border-emerald-300 shadow-xs'
                  : 'bg-white border-slate-200 shadow-2xs hover:border-emerald-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded flex items-center gap-1">
                    <span>มื้อเย็น (วันที่ {currentDay})</span>
                    {isDinnerDone && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-900">
                    ~฿{plan.meals.dinner.estimatedPrice}
                  </span>
                </div>
                <h4 className="font-semibold text-xs text-slate-900 mt-2">
                  {plan.meals.dinner.name}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  {plan.meals.dinner.description}
                </p>
                <div className="mt-2 text-[10px] text-emerald-700 bg-emerald-50/70 p-1.5 rounded-lg">
                  💡 {plan.meals.dinner.savingTip}
                </div>
              </div>

              {isDinnerDone ? (
                <div className="mt-3 flex items-center gap-1.5">
                  <div className="flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 bg-emerald-600 text-white shadow-2xs">
                    <Check className="w-3.5 h-3.5" />
                    <span>ทานแล้ววันนี้ (+฿{plan.meals.dinner.estimatedPrice})</span>
                  </div>
                  <button
                    onClick={() => onUndoMeal('dinner')}
                    title={`กดยกเลิกและคืนเงิน ฿${plan.meals.dinner.estimatedPrice} กลับเข้ากระเป๋าทันที`}
                    className="py-2 px-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-xl transition-all cursor-pointer text-xs font-bold flex items-center gap-1 shrink-0 active:scale-95 shadow-2xs"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>รี (คืนเงิน ฿{plan.meals.dinner.estimatedPrice})</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() =>
                    onLogMeal(
                      plan.meals.dinner.name,
                      plan.meals.dinner.estimatedPrice,
                      'dinner'
                    )
                  }
                  className="mt-3 w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs active:scale-95 transition-all cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>ทานมื้อนี้ (+฿{plan.meals.dinner.estimatedPrice})</span>
                </button>
              )}
            </div>
          </div>

          {/* Explicit Helper Note for Refund and Rotation */}
          <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2 text-[11px] text-slate-600">
            <span className="text-emerald-600 font-bold text-xs shrink-0">💡 วิธีใช้งาน:</span>
            <span>
              กดปุ่ม &quot;ทานมื้อนี้&quot; ได้วันละ 1 ครั้ง หากกดผิดให้กดปุ่มสีแดง <strong className="text-rose-700 font-semibold">&quot;รี (คืนเงิน)&quot;</strong> เงินจะคืนเข้ากระเป๋าทันที และเมื่อกด &quot;⏩ ผ่านไปวันถัดไป&quot; เมนูอาหารจะเปลี่ยนเป็นเมนูใหม่ให้อัตโนมัติ
            </span>
          </div>
        </div>

        {/* 3. Daily Living Expenses Breakdown */}
        <div className="mt-6 pt-5 border-t border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Bus className="w-4 h-4 text-blue-600" />
              <span>ค่าใช้จ่ายจำเป็นในชีวิตประจำวัน</span>
            </h3>
            <span className="text-xs font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
              รวมค่าครองชีพ ~฿{plan.livingCosts.totalLivingCost}/วัน
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between font-semibold text-slate-900 mb-1">
                <span>{plan.livingCosts.transport.name}</span>
                <span className="font-mono text-emerald-700">
                  ฿{plan.livingCosts.transport.cost}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {plan.livingCosts.transport.advice}
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between font-semibold text-slate-900 mb-1">
                <span>{plan.livingCosts.drink.name}</span>
                <span className="font-mono text-emerald-700">
                  ฿{plan.livingCosts.drink.cost}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {plan.livingCosts.drink.advice}
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between font-semibold text-slate-900 mb-1">
                <span>{plan.livingCosts.necessity.name}</span>
                <span className="font-mono text-emerald-700">
                  ฿{plan.livingCosts.necessity.cost}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {plan.livingCosts.necessity.advice}
              </p>
            </div>
          </div>
        </div>

        {/* 4. Key Advice Checklist */}
        <div className="mt-5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 space-y-1.5">
          <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>คำแนะนำการคุมงบสำหรับรอบนี้:</span>
          </div>
          {plan.keyAdvice.map((adv, idx) => (
            <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-600">
              <span className="text-emerald-600 font-bold">•</span>
              <span>{adv}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
