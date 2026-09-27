export type ExpenseCategory =
  | 'food' // อาหารและเครื่องดื่ม
  | 'transport' // การเดินทาง
  | 'necessities' // ของใช้ประจำวัน
  | 'shopping' // ช้อปปิ้ง
  | 'entertainment' // บันเทิงและผ่อนคลาย
  | 'bills' // บิลและค่าใช้จ่ายประจำ
  | 'other'; // อื่นๆ

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  note: string;
  date: string; // ISO YYYY-MM-DD
  time: string; // HH:mm
  createdAt: number;
  mealRef?: string; // e.g. "day-1-breakfast" for 1-click refunding
}

export interface BudgetConfig {
  totalBudget: number; // จำนวนเงินรอบนี้
  totalDays: number; // จำนวนวันรอบนี้
  startDate: string; // วันที่เริ่มนับ (YYYY-MM-DD)
  emergencyReserve: number; // เงินสำรองฉุกเฉินที่อยากเก็บไว้
  currentDay: number; // วันปัจจุบันของรอบนี้ (1, 2, ..., totalDays)
  isCompleted: boolean; // ถึงกำหนดเสร็จสิ้นแล้วหรือไม่
  completedAt?: string;
  loggedMealsByDay?: Record<number, { breakfast?: boolean; lunch?: boolean; dinner?: boolean }>;
}


export interface MealRecommendation {
  id: string;
  name: string;
  mealTime: 'เช้า' | 'กลางวัน' | 'เย็น';
  tier: 'survival' | 'standard' | 'comfort'; // survival (<120/day), standard (120-300), comfort (>300)
  estimatedPrice: number;
  description: string;
  savingTip: string;
  category: 'street-food' | 'home-cooked' | 'quick-meal' | 'convenience';
}

export interface LivingCostItem {
  id: string;
  title: string;
  category: string;
  estimatedCost: number;
  urgency: 'จำเป็นมาก' | 'ยืดหยุ่นได้' | 'ตัดออกได้';
  advice: string;
}

export interface BudgetStatus {
  totalBudget: number;
  totalSpent: number;
  remainingBudget: number;
  rawRemainingBudget: number; // can be negative if over budget
  isOverBudget: boolean; // totalSpent > totalBudget
  overBudgetAmount: number; // amount exceeded beyond totalBudget
  isTodayOverBudget: boolean; // todaySpent > dailyAllowance
  todayOverAmount: number; // amount today exceeded dailyAllowance
  daysTotal: number;
  daysPassed: number;
  daysRemaining: number;
  dailyAllowance: number; // เงินที่ใช้ได้ต่อวันเฉลี่ยที่เหลืออยู่
  todaySpent: number;
  todayRemaining: number;
  burnRatePercentage: number;
  isCritical: boolean; // เงินใกล้หมด (< 15% หรือ เหลือน้อยกว่า 85บ./วัน หรือเกินงบ)
  isWarning: boolean; // เงินเริ่มตึง (15% - 30%)
  healthScore: 'healthy' | 'warning' | 'critical';
}
