import React, { useState } from 'react';
import {
  Utensils,
  PlusCircle,
  RefreshCw,
  Sparkles,
  Info,
  Layers,
  Check,
  Search,
} from 'lucide-react';
import { MealRecommendation, BudgetStatus } from '../types';
import { THAI_MEAL_DATABASE, LIVING_COST_GUIDE } from '../data/thaiMeals';

interface DailyMenuPlannerProps {
  status: BudgetStatus;
  onQuickAddMealExpense: (name: string, amount: number) => void;
}

export const DailyMenuPlanner: React.FC<DailyMenuPlannerProps> = ({
  status,
  onQuickAddMealExpense,
}) => {
  // Determine suitable tier based on daily allowance
  const defaultTier =
    status.dailyAllowance < 130
      ? 'survival'
      : status.dailyAllowance < 320
      ? 'standard'
      : 'comfort';

  const [selectedTier, setSelectedTier] = useState<'survival' | 'standard' | 'comfort'>(defaultTier);
  const [selectedMealTime, setSelectedMealTime] = useState<'all' | 'เช้า' | 'กลางวัน' | 'เย็น'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [shuffleKey, setShuffleKey] = useState(0);
  const [addedMealId, setAddedMealId] = useState<string | null>(null);

  // Filter meals
  const filteredMeals = THAI_MEAL_DATABASE.filter((meal) => {
    const matchTier = meal.tier === selectedTier;
    const matchTime = selectedMealTime === 'all' || meal.mealTime === selectedMealTime;
    const matchSearch =
      !searchQuery.trim() ||
      meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meal.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTier && matchTime && matchSearch;
  });

  const handleQuickAdd = (meal: MealRecommendation) => {
    onQuickAddMealExpense(meal.name, meal.estimatedPrice);
    setAddedMealId(meal.id);
    setTimeout(() => {
      setAddedMealId(null);
    }, 1500);
  };

  // Calculate day total for current tier
  const breakfastSample = THAI_MEAL_DATABASE.find(
    (m) => m.tier === selectedTier && m.mealTime === 'เช้า'
  )?.estimatedPrice || 35;
  const lunchSample = THAI_MEAL_DATABASE.find(
    (m) => m.tier === selectedTier && m.mealTime === 'กลางวัน'
  )?.estimatedPrice || 60;
  const dinnerSample = THAI_MEAL_DATABASE.find(
    (m) => m.tier === selectedTier && m.mealTime === 'เย็น'
  )?.estimatedPrice || 55;
  const estimatedDailyMealCost = breakfastSample + lunchSample + dinnerSample;

  return (
    <div className="space-y-6">
      {/* Banner matching tier with budget */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">
                เมนูอาหารแนะนำตามงบประมาณ
              </h2>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs font-mono font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                งบต่อวันของคุณ ฿{status.dailyAllowance.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              คำนวณอาหาร 3 มื้อที่เหมาะสมกับเงินคงเหลือ เพื่อให้กินอิ่ม สารอาหารครบ และเงินไม่หมดก่อนกำหนด
            </p>
          </div>

          {/* Tier Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setSelectedTier('survival')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                selectedTier === 'survival'
                  ? 'bg-white text-rose-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ประหยัดสุดขีด (≤฿35/มื้อ)
            </button>
            <button
              onClick={() => setSelectedTier('standard')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                selectedTier === 'standard'
                  ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              มาตรฐานทั่วไป (~฿55/มื้อ)
            </button>
            <button
              onClick={() => setSelectedTier('comfort')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                selectedTier === 'comfort'
                  ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              สบายใจจัดเต็ม (฿100+/มื้อ)
            </button>
          </div>
        </div>

        {/* Meal Time Filter, Search & Stats bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">มื้ออาหาร:</span>
            <div className="flex items-center gap-1">
              {(['all', 'เช้า', 'กลางวัน', 'เย็น'] as const).map((time) => (
                <button
                  key={time}
                  onClick={() => setSelectedMealTime(time)}
                  className={`px-2.5 py-1 text-xs rounded-md transition-colors cursor-pointer ${
                    selectedMealTime === time
                      ? 'bg-slate-900 text-white font-medium'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {time === 'all' ? 'ทุกมื้อ' : `มื้อ${time}`}
                </button>
              ))}
            </div>
          </div>

          {/* Search Box */}
          <div className="flex items-center gap-2 flex-1 max-w-xs">
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาชื่ออาหาร / วัตถุดิบ..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 focus:border-emerald-600 focus:bg-white rounded-lg text-xs outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 shrink-0">
            <span className="bg-emerald-50 text-emerald-800 font-medium px-2 py-0.5 rounded text-[11px]">
              พบ {filteredMeals.length} เมนู
            </span>
            <span>·</span>
            <span>
              รวม 3 มื้อ:{' '}
              <strong className="text-slate-900 font-mono font-bold">
                ~฿{estimatedDailyMealCost}
              </strong>
            </span>
            <span>·</span>
            <button
              onClick={() => setShuffleKey((k) => k + 1)}
              className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-medium cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>สลับเมนู</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recommended Meals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" key={shuffleKey}>
        {filteredMeals.map((meal) => {
          const isAdded = addedMealId === meal.id;
          return (
            <div
              key={meal.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <span className="text-emerald-700 font-semibold">มื้อ{meal.mealTime}</span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {meal.category === 'home-cooked'
                        ? 'ทำเองที่บ้าน'
                        : meal.category === 'street-food'
                        ? 'อาหารตามสั่ง/สตรีทฟู้ด'
                        : 'ร้านสะดวกซื้อ'}
                    </span>
                  </div>
                  <span className="font-mono text-sm font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                    ~฿{meal.estimatedPrice}
                  </span>
                </div>

                <h3 className="font-semibold text-slate-900 text-sm leading-snug">
                  {meal.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {meal.description}
                </p>

                <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-relaxed">{meal.savingTip}</span>
                </div>
              </div>

              {/* 1-Click Quick Log Button */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">ทานเมนูนี้วันนี้?</span>
                <button
                  onClick={() => handleQuickAdd(meal)}
                  disabled={isAdded}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isAdded
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs active:scale-95'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>บันทึกแล้ว!</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>บันทึกลงรายจ่าย</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Daily Living Expenses Guide (ค่าใช้จ่ายในชีวิตประจำวัน) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-base">
              โครงสร้างค่าใช้จ่ายในชีวิตประจำวันทั่วไป
            </h3>
          </div>
          <span className="text-xs text-slate-500 hidden sm:inline">
            ประเมินค่าครองชีพเฉลี่ยต่อวันในกรุงเทพฯ และเมืองใหญ่
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {LIVING_COST_GUIDE.map((item) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-slate-900">{item.title}</span>
                <span className="font-mono text-xs font-bold text-slate-800">
                  ~฿{item.estimatedCost}/วัน
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed mb-2">
                {item.advice}
              </p>
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-400">หมวด: {item.category}</span>
                <span
                  className={`px-1.5 py-0.5 rounded font-medium ${
                    item.urgency === 'จำเป็นมาก'
                      ? 'bg-rose-50 text-rose-700'
                      : item.urgency === 'ยืดหยุ่นได้'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-emerald-50 text-emerald-700'
                  }`}
                >
                  {item.urgency}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl text-xs text-indigo-900 flex items-start gap-2">
          <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong>คำแนะนำจัดสรร:</strong> หากเงินต่อวันเหลือต่ำกว่า 150 บาท
            ควรโฟกัสเฉพาะรายการ "จำเป็นมาก" (อาหารหลัก + เดินทางประหยัด + น้ำดื่ม)
            และตัดรายการ "ตัดออกได้" (ชาไข่มุก/กาแฟคาเฟ่/ของจุกจิก) ออกชั่วคราว
          </p>
        </div>
      </div>
    </div>
  );
};
