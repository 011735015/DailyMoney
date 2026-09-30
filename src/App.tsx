import { useState, useEffect } from 'react';
import {
  getStoredBudgetConfig,
  saveStoredBudgetConfig,
  getStoredExpenses,
  saveStoredExpenses,
  calculateBudgetStatus,
  DEFAULT_BUDGET_CONFIG,
  INITIAL_SAMPLE_EXPENSES,
} from './utils/storage';
import { BudgetConfig, Expense, ExpenseCategory, UserProfile } from './types';
import { Navbar } from './components/Navbar';
import { HomeOverview } from './components/HomeOverview';
import { PlanCompletedView } from './components/PlanCompletedView';
import { StartNewPlanModal } from './components/StartNewPlanModal';
import { EmergencyModal } from './components/EmergencyModal';
import { DailyMenuPlanner } from './components/DailyMenuPlanner';
import { ExpenseList } from './components/ExpenseList';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { ExpenseFormModal } from './components/ExpenseFormModal';
import { BudgetSettingsModal } from './components/BudgetSettingsModal';
import { OverBudgetModal } from './components/OverBudgetModal';
import { EmergencyAlertBanner } from './components/EmergencyAlertBanner';
import { AuthModal } from './components/AuthModal';
import { getCurrentUser, setCurrentUser as persistCurrentUser } from './utils/authStorage';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [config, setConfig] = useState<BudgetConfig>(getStoredBudgetConfig);
  const [expenses, setExpenses] = useState<Expense[]>(getStoredExpenses);
  const [activeTab, setActiveTab] = useState<'overview' | 'menu' | 'expenses' | 'analytics'>('overview');

  // Backup of config before simulation
  const [savedConfigBeforeSim, setSavedConfigBeforeSim] = useState<BudgetConfig | null>(null);

  // Modals state
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isStartNewPlanModalOpen, setIsStartNewPlanModalOpen] = useState(false);
  const [isOverBudgetModalOpen, setIsOverBudgetModalOpen] = useState(false);
  const [lastExpenseRecorded, setLastExpenseRecorded] = useState<Expense | undefined>(undefined);

  // Authentication State
  const [currentUser, setCurrentUserState] = useState<UserProfile | null>(getCurrentUser);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot'>('login');

  const handleOpenAuth = (mode: 'login' | 'register' | 'forgot' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (user: UserProfile, message: string) => {
    setCurrentUserState(user);
    showToast(message);
  };

  const handleLogout = () => {
    persistCurrentUser(null);
    setCurrentUserState(null);
    showToast('✓ ออกจากระบบเรียบร้อยแล้ว');
  };

  // Pre-fill state for meal logging
  const [mealPreFill, setMealPreFill] = useState<{
    note?: string;
    amount?: number;
    category?: ExpenseCategory;
  } | undefined>(undefined);

  // Toast notification for user actions (especially refunding money)
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  // Calculate live budget status
  const status = calculateBudgetStatus(config, expenses);

  // Sync to storage on state change
  useEffect(() => {
    saveStoredBudgetConfig(config);
  }, [config]);

  useEffect(() => {
    saveStoredExpenses(expenses);
  }, [expenses]);

  // Handlers
  const handleSaveExpense = (newExpenseData: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...newExpenseData,
      id: `exp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: Date.now(),
    };
    const updatedExpenses = [newExpense, ...expenses];
    setExpenses(updatedExpenses);
    setLastExpenseRecorded(newExpense);

    // Calculate new status immediately to trigger over-budget alarm if exceeded
    const nextStatus = calculateBudgetStatus(config, updatedExpenses);
    if (nextStatus.isOverBudget) {
      setIsOverBudgetModalOpen(true);
      showToast(`🚨 เตือนด่วน: คุณใช้เงินเกินงบแล้ว! (ติดลบ ฿${nextStatus.overBudgetAmount.toLocaleString()})`);
    }
  };

  const handleUndoLastExpense = () => {
    if (lastExpenseRecorded) {
      handleDeleteExpense(lastExpenseRecorded.id);
      setLastExpenseRecorded(undefined);
      setIsOverBudgetModalOpen(false);
    }
  };

  const handleDeleteExpense = (id: string) => {
    const target = expenses.find((e) => e.id === id);
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    if (target) {
      showToast(`↺ ลบรายการและคืนเงิน ฿${Number(target.amount).toLocaleString()} กลับเข้ากระเป๋าเรียบร้อยแล้ว`);
    }
  };

  const handleQuickAddExpense = (amount: number, category: ExpenseCategory, note: string) => {
    handleSaveExpense({
      amount,
      category,
      note,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
    });
    showToast(`บันทึกรายจ่าย -฿${amount.toLocaleString()} (${note})`);
  };

  const handleChangeBudget = (newBudget: number) => {
    setConfig((prev) => ({ ...prev, totalBudget: newBudget }));
  };

  const handleChangeDays = (newDays: number) => {
    setConfig((prev) => ({ ...prev, totalDays: newDays }));
  };

  // Day Progression & Completion (Advancing to next day naturally rotates the menu & resets 1-click limit!)
  const handleNextDay = () => {
    const current = config.currentDay || 1;
    if (current >= config.totalDays) {
      // Reached the end! Mark as completed!
      setConfig((prev) => ({
        ...prev,
        currentDay: config.totalDays,
        isCompleted: true,
        completedAt: new Date().toISOString(),
      }));
      showToast(`🎉 ครบกำหนด ${config.totalDays} วันแล้ว! ยินดีด้วยที่คุณเอาชีวิตรอดสำเร็จ`);
    } else {
      setConfig((prev) => ({
        ...prev,
        currentDay: current + 1,
      }));
      showToast(`⏩ ก้าวสู่วันที่ ${current + 1} แล้ว! เปลี่ยนเมนูแนะนำ 3 มื้อใหม่ทันที`);
    }
  };

  const handleCompletePlan = () => {
    setConfig((prev) => ({
      ...prev,
      isCompleted: true,
      completedAt: new Date().toISOString(),
    }));
  };

  // 1-Click per day meal tracker handlers
  const isMealLoggedToday = (mealType: 'breakfast' | 'lunch' | 'dinner'): boolean => {
    const day = config.currentDay || 1;
    return Boolean(config.loggedMealsByDay?.[day]?.[mealType]);
  };

  const handleLogMeal = (
    name: string,
    price: number,
    mealType: 'breakfast' | 'lunch' | 'dinner'
  ) => {
    const day = config.currentDay || 1;
    // Check if already logged for this day
    if (config.loggedMealsByDay?.[day]?.[mealType]) return;

    const mealLabel =
      mealType === 'breakfast'
        ? 'มื้อเช้า'
        : mealType === 'lunch'
        ? 'มื้อกลางวัน'
        : 'มื้อเย็น';

    const mealRef = `meal-day-${day}-${mealType}`;

    // Log the expense with mealRef so we can identify and refund it
    const newExpense: Expense = {
      id: `exp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      amount: price,
      category: 'food',
      note: `${name} (${mealLabel} วันที่ ${day})`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      createdAt: Date.now(),
      mealRef: mealRef,
    };
    const updatedExpenses = [newExpense, ...expenses];
    setExpenses(updatedExpenses);
    setLastExpenseRecorded(newExpense);

    // Lock this meal for today
    setConfig((prev) => ({
      ...prev,
      loggedMealsByDay: {
        ...(prev.loggedMealsByDay || {}),
        [day]: {
          ...(prev.loggedMealsByDay?.[day] || {}),
          [mealType]: true,
        },
      },
    }));

    const nextStatus = calculateBudgetStatus(config, updatedExpenses);
    if (nextStatus.isOverBudget) {
      setIsOverBudgetModalOpen(true);
      showToast(`🚨 เตือนด่วน: คุณใช้เงินเกินงบแล้ว! (ติดลบ ฿${nextStatus.overBudgetAmount.toLocaleString()})`);
    } else {
      showToast(`✓ บันทึก ${name} (-฿${price}) เรียบร้อยแล้ว`);
    }
  };

  // Refund money and unlock meal when clicking the "รี" (รีคืนเงิน) button
  const handleUndoMeal = (mealType: 'breakfast' | 'lunch' | 'dinner') => {
    const day = config.currentDay || 1;
    const mealRef = `meal-day-${day}-${mealType}`;
    const mealLabel =
      mealType === 'breakfast'
        ? 'มื้อเช้า'
        : mealType === 'lunch'
        ? 'มื้อกลางวัน'
        : 'มื้อเย็น';

    // Find the expense to refund
    const targetExpense = expenses.find(
      (e) =>
        e.mealRef === mealRef ||
        (e.note.includes(mealLabel) && e.note.includes(`วันที่ ${day}`))
    );
    const refundAmount = targetExpense ? Number(targetExpense.amount) : 0;

    // 1. Remove the expense from list - This REFUNDS the money back immediately!
    setExpenses((prev) =>
      prev.filter(
        (e) =>
          e.mealRef !== mealRef &&
          !(e.note.includes(mealLabel) && e.note.includes(`วันที่ ${day}`))
      )
    );

    // 2. Unlock this meal so user can log it again if desired
    setConfig((prev) => ({
      ...prev,
      loggedMealsByDay: {
        ...(prev.loggedMealsByDay || {}),
        [day]: {
          ...(prev.loggedMealsByDay?.[day] || {}),
          [mealType]: false,
        },
      },
    }));

    // 3. Show refund notification
    if (refundAmount > 0) {
      showToast(`↺ รีและคืนเงิน ฿${refundAmount.toLocaleString()} เข้ากระเป๋าเรียบร้อยแล้ว!`);
    } else {
      showToast(`↺ รีค่า${mealLabel} เรียบร้อยแล้ว`);
    }
  };

  // Undo all logged meals for current day and refund all money back
  const handleUndoAllTodayMeals = () => {
    const day = config.currentDay || 1;
    const todayMealExpenses = expenses.filter(
      (e) =>
        e.mealRef?.startsWith(`meal-day-${day}-`) ||
        (e.note.includes(`วันที่ ${day}`) &&
          (e.note.includes('มื้อเช้า') || e.note.includes('มื้อกลางวัน') || e.note.includes('มื้อเย็น')))
    );
    const totalRefund = todayMealExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

    // Remove all today's meal expenses (REFUND!)
    setExpenses((prev) =>
      prev.filter(
        (e) =>
          !e.mealRef?.startsWith(`meal-day-${day}-`) &&
          !(
            e.note.includes(`วันที่ ${day}`) &&
            (e.note.includes('มื้อเช้า') || e.note.includes('มื้อกลางวัน') || e.note.includes('มื้อเย็น'))
          )
      )
    );

    // Unlock all meals for today
    setConfig((prev) => ({
      ...prev,
      loggedMealsByDay: {
        ...(prev.loggedMealsByDay || {}),
        [day]: {
          breakfast: false,
          lunch: false,
          dinner: false,
        },
      },
    }));

    if (totalRefund > 0) {
      showToast(`↺ รีและคืนเงินมื้อทั้งหมดวันนี้รวม ฿${totalRefund.toLocaleString()} เข้ากระเป๋าแล้ว!`);
    } else {
      showToast(`↺ รีสถานะมื้ออาหารวันนี้ทั้งหมดแล้ว`);
    }
  };

  // Start Fresh Single-Use Plan (No money combined/pooled)
  const handleConfirmNewPlan = (newBudget: number, newDays: number) => {
    setConfig({
      totalBudget: newBudget,
      totalDays: newDays,
      startDate: new Date().toISOString().split('T')[0],
      emergencyReserve: 0,
      currentDay: 1,
      isCompleted: false,
      loggedMealsByDay: {},
    });
    setExpenses([]); // Fresh list, no old money carried over!
    setSavedConfigBeforeSim(null);
    setActiveTab('overview');
    showToast(`⚡ เริ่มแผนเอาชีวิตรอดรอบใหม่ ฿${newBudget.toLocaleString()} สำหรับ ${newDays} วัน เรียบร้อยแล้ว!`);
  };

  // Test Simulation Mode for Low Budget Alert
  const handleSimulateLowBudget = () => {
    setSavedConfigBeforeSim(config);
    // Set budget to a critical level (total 300 for 5 days -> 60฿/day)
    setConfig((prev) => ({
      ...prev,
      totalBudget: 300,
      totalDays: 5,
      currentDay: 1,
      isCompleted: false,
    }));
  };

  const handleRestoreBudget = () => {
    if (savedConfigBeforeSim) {
      setConfig(savedConfigBeforeSim);
      setSavedConfigBeforeSim(null);
    } else {
      setConfig(DEFAULT_BUDGET_CONFIG);
    }
  };

  const handleResetAllData = () => {
    setConfig(DEFAULT_BUDGET_CONFIG);
    setExpenses(INITIAL_SAMPLE_EXPENSES);
    setSavedConfigBeforeSim(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-emerald-100 selection:text-emerald-900 pb-20 md:pb-12">
      {/* Toast Notification Alert (Money refund & actions) */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 pointer-events-auto max-w-md w-[92vw] sm:w-auto"
          >
            <div className="relative overflow-hidden bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold border border-slate-700/80">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-emerald-400 text-base shrink-0">💰</span>
                <span className="truncate">{toastMessage}</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setToastMessage(null)}
                className="text-slate-400 hover:text-white ml-2 text-xs cursor-pointer shrink-0 p-1"
              >
                ✕
              </motion.button>
              {/* Progress Line */}
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: 3.5, ease: 'linear' }}
                className="absolute bottom-0 left-0 h-0.5 bg-emerald-500"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Bar following Top Bar Contract */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenNewExpense={() => {
          setMealPreFill(undefined);
          setIsExpenseModalOpen(true);
        }}
        onOpenEmergency={() => setIsEmergencyModalOpen(true)}
        onOpenNewPlan={() => setIsStartNewPlanModalOpen(true)}
        isCritical={status.isCritical && !config.isCompleted}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 pb-8">
        {/* Realtime Alert Banner for Over-Budget or Low Budget */}
        {!config.isCompleted && (
          <EmergencyAlertBanner
            status={status}
            onOpenEmergency={() => setIsEmergencyModalOpen(true)}
            onOpenOverBudget={() => setIsOverBudgetModalOpen(true)}
          />
        )}

        {/* Tab 1: Overview or Completed View */}
        {activeTab === 'overview' && (
          <>
            {config.isCompleted ? (
              <PlanCompletedView
                config={config}
                status={status}
                expenses={expenses}
                onStartNewPlan={() => setIsStartNewPlanModalOpen(true)}
                onViewHistory={() => setActiveTab('expenses')}
              />
            ) : (
              <HomeOverview
                config={config}
                status={status}
                expenses={expenses}
                onChangeBudget={handleChangeBudget}
                onChangeDays={handleChangeDays}
                onSimulateLowBudget={handleSimulateLowBudget}
                onRestoreBudget={handleRestoreBudget}
                onQuickAddExpense={handleQuickAddExpense}
                onOpenFullExpenseModal={() => {
                  setMealPreFill(undefined);
                  setIsExpenseModalOpen(true);
                }}
                onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
                onOpenOverBudgetModal={() => setIsOverBudgetModalOpen(true)}
                onOpenMenuTab={() => setActiveTab('menu')}
                onOpenExpensesTab={() => setActiveTab('expenses')}
                onDeleteExpense={handleDeleteExpense}
                onNextDay={handleNextDay}
                onCompletePlan={handleCompletePlan}
                onOpenNewPlanModal={() => setIsStartNewPlanModalOpen(true)}
                onLogMeal={handleLogMeal}
                onUndoMeal={handleUndoMeal}
                onUndoAllTodayMeals={handleUndoAllTodayMeals}
                isMealLoggedToday={isMealLoggedToday}
              />
            )}
          </>
        )}

        {/* Tab 2: Daily Menu & Living Expenses */}
        {activeTab === 'menu' && (
          <DailyMenuPlanner
            status={status}
            onQuickAddMealExpense={(name, amount) => {
              handleQuickAddExpense(amount, 'food', name);
            }}
          />
        )}

        {/* Tab 3: Real-Time Expenses List */}
        {activeTab === 'expenses' && (
          <ExpenseList
            expenses={expenses}
            onDeleteExpense={handleDeleteExpense}
            onOpenNewExpense={() => {
              setMealPreFill(undefined);
              setIsExpenseModalOpen(true);
            }}
          />
        )}

        {/* Tab 4: Analytics Charts */}
        {activeTab === 'analytics' && (
          <AnalyticsCharts expenses={expenses} status={status} />
        )}
      </main>

      {/* Floating Emergency / Over-Budget Button */}
      {(status.isCritical || status.isOverBudget) && !config.isCompleted && (
        <div className="fixed bottom-16 sm:bottom-6 right-4 sm:right-6 z-40">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.94 }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            onClick={() => {
              if (status.isOverBudget) {
                setIsOverBudgetModalOpen(true);
              } else {
                setIsEmergencyModalOpen(true);
              }
            }}
            className="flex items-center gap-2 px-4 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-full shadow-lg shadow-rose-600/30 font-bold text-xs sm:text-sm animate-pulse ring-4 ring-rose-300 ring-offset-2 transition-colors cursor-pointer"
          >
            <ShieldAlert className="w-5 h-5 text-white" />
            <span>
              {status.isOverBudget
                ? `🚨 เงินติดลบ -฿${status.overBudgetAmount.toLocaleString()} (กดดูวิธีแก้)`
                : 'คำแนะนำประหยัดฉุกเฉิน (เงินใกล้หมด!)'}
            </span>
          </motion.button>
        </div>
      )}

      {/* Modals */}
      <StartNewPlanModal
        isOpen={isStartNewPlanModalOpen}
        onClose={() => setIsStartNewPlanModalOpen(false)}
        onConfirmNewPlan={handleConfirmNewPlan}
      />

      <ExpenseFormModal
        isOpen={isExpenseModalOpen}
        onClose={() => {
          setIsExpenseModalOpen(false);
          setMealPreFill(undefined);
        }}
        onSaveExpense={handleSaveExpense}
        initialValues={mealPreFill}
        status={status}
      />

      <OverBudgetModal
        isOpen={isOverBudgetModalOpen}
        onClose={() => setIsOverBudgetModalOpen(false)}
        status={status}
        lastExpense={lastExpenseRecorded}
        onUndoLastExpense={handleUndoLastExpense}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenNewPlan={() => setIsStartNewPlanModalOpen(true)}
      />

      <BudgetSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        config={config}
        onSaveConfig={setConfig}
        onResetAllData={handleResetAllData}
      />

      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        status={status}
        onApplySurvivalPlan={() => setActiveTab('menu')}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authModalMode}
      />
    </div>
  );
}
