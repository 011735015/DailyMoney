import { BudgetConfig, Expense, BudgetStatus } from '../types';

const BUDGET_CONFIG_KEY = 'dailymoney_budget_config';
const LEGACY_BUDGET_CONFIG_KEY = 'krapow_budget_config';
const EXPENSES_KEY = 'dailymoney_expenses_list';
const LEGACY_EXPENSES_KEY = 'krapow_expenses_list';

export const DEFAULT_BUDGET_CONFIG: BudgetConfig = {
  totalBudget: 1000,
  totalDays: 5,
  startDate: new Date().toISOString().split('T')[0],
  emergencyReserve: 0,
  currentDay: 1,
  isCompleted: false,
};

export const INITIAL_SAMPLE_EXPENSES: Expense[] = [];

export function getStoredBudgetConfig(): BudgetConfig {
  try {
    const raw = localStorage.getItem(BUDGET_CONFIG_KEY) || localStorage.getItem(LEGACY_BUDGET_CONFIG_KEY);
    if (!raw) return DEFAULT_BUDGET_CONFIG;
    const parsed = JSON.parse(raw);
    return {
      totalBudget: Number(parsed.totalBudget) || DEFAULT_BUDGET_CONFIG.totalBudget,
      totalDays: Number(parsed.totalDays) || DEFAULT_BUDGET_CONFIG.totalDays,
      startDate: parsed.startDate || DEFAULT_BUDGET_CONFIG.startDate,
      emergencyReserve: 0, // เว็บเอาชีวิตรอด ไม่ต้องคิดเงินเก็บ
      currentDay: Number(parsed.currentDay) || 1,
      isCompleted: Boolean(parsed.isCompleted),
      completedAt: parsed.completedAt,
      loggedMealsByDay: parsed.loggedMealsByDay || {},
    };
  } catch {
    return DEFAULT_BUDGET_CONFIG;
  }
}

export function saveStoredBudgetConfig(config: BudgetConfig): void {
  try {
    localStorage.setItem(BUDGET_CONFIG_KEY, JSON.stringify(config));
  } catch (err) {
    console.error('Failed to save budget config', err);
  }
}

export function getStoredExpenses(): Expense[] {
  try {
    const raw = localStorage.getItem(EXPENSES_KEY) || localStorage.getItem(LEGACY_EXPENSES_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveStoredExpenses(expenses: Expense[]): void {
  try {
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  } catch (err) {
    console.error('Failed to save expenses', err);
  }
}

export function calculateBudgetStatus(config: BudgetConfig, expenses: Expense[]): BudgetStatus {
  const totalBudget = Math.max(0, config.totalBudget);
  const totalDays = Math.max(1, config.totalDays);
  
  // Calculate total spent across all recorded expenses
  const totalSpent = expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const rawRemainingBudget = totalBudget - totalSpent;
  const isOverBudget = totalSpent > totalBudget;
  const overBudgetAmount = isOverBudget ? totalSpent - totalBudget : 0;
  const remainingBudget = Math.max(0, rawRemainingBudget);

  // Pure survival day calculation:
  // Current day is within 1 .. totalDays
  const currentDay = Math.max(1, Math.min(totalDays, config.currentDay || 1));
  const daysPassed = currentDay;
  const daysRemaining = Math.max(1, totalDays - currentDay + 1);

  // Daily allowance = remaining budget / days remaining
  // (Pure survival calculation: 100% of money is for living, NO savings held back)
  const dailyAllowance = Math.max(0, Math.round(remainingBudget / daysRemaining));

  // Today's spending
  const todayStr = new Date().toISOString().split('T')[0];
  const todayExpenses = expenses.filter((e) => e.date === todayStr);
  const todaySpent = todayExpenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const todayRemaining = Math.round(dailyAllowance - todaySpent);
  const isTodayOverBudget = dailyAllowance > 0 ? todaySpent > dailyAllowance : todaySpent > 0;
  const todayOverAmount = Math.max(0, todaySpent - dailyAllowance);

  // Burn rate: percentage of budget spent
  const burnRatePercentage = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : (totalSpent > 0 ? 100 : 0);

  // Critical condition for survival:
  // 1. Over budget (spent more than available budget) OR
  // 2. Remaining budget is <= 15% of total budget OR
  // 3. Daily allowance is less than 85 Baht (survival threshold in Thailand) OR
  // 4. Remaining budget is less than 250 Baht and daysRemaining >= 2
  const isCritical =
    isOverBudget ||
    remainingBudget <= 0 ||
    (totalBudget > 0 && remainingBudget / totalBudget <= 0.15) ||
    dailyAllowance <= 85 ||
    (remainingBudget < 250 && daysRemaining > 1);

  const isWarning =
    !isCritical &&
    ((totalBudget > 0 && remainingBudget / totalBudget <= 0.30) || dailyAllowance <= 130);

  const healthScore = isCritical ? 'critical' : isWarning ? 'warning' : 'healthy';

  return {
    totalBudget,
    totalSpent,
    remainingBudget,
    rawRemainingBudget,
    isOverBudget,
    overBudgetAmount,
    isTodayOverBudget,
    todayOverAmount,
    daysTotal: totalDays,
    daysPassed,
    daysRemaining,
    dailyAllowance,
    todaySpent,
    todayRemaining,
    burnRatePercentage,
    isCritical,
    isWarning,
    healthScore,
  };
}
