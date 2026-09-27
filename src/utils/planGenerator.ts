import { MealRecommendation, LivingCostItem } from '../types';
import { THAI_MEAL_DATABASE, LIVING_COST_GUIDE } from '../data/thaiMeals';

export interface GeneratedPlan {
  dailyAllowance: number;
  tier: 'survival' | 'tight' | 'balanced' | 'comfortable';
  tierName: string;
  tierDescription: string;
  badgeColor: string;
  isCriticalAlert: boolean;
  meals: {
    breakfast: MealRecommendation;
    lunch: MealRecommendation;
    dinner: MealRecommendation;
    totalMealCost: number;
  };
  livingCosts: {
    transport: { name: string; cost: number; advice: string };
    drink: { name: string; cost: number; advice: string };
    necessity: { name: string; cost: number; advice: string };
    totalLivingCost: number;
  };
  dailySummary: {
    totalDailyEstimated: number;
    dailySafetyBuffer: number;
  };
  keyAdvice: string[];
}

export function generateRecommendationPlan(
  dailyAllowance: number,
  totalBudget: number,
  totalDays: number,
  currentDay: number = 1
): GeneratedPlan {
  // Determine Tier
  let tier: 'survival' | 'tight' | 'balanced' | 'comfortable' = 'balanced';
  let tierName = 'โหมดเอาตัวรอดทั่วไป';
  let tierDescription = 'งบพอดีสำหรับการเอาชีวิตรอด ทานอาหารตามสั่งได้ 3 มื้อ และมีเงินเหลือเผื่อฉุกเฉิน';
  let badgeColor = 'emerald';
  let isCriticalAlert = false;

  if (dailyAllowance <= 90) {
    tier = 'survival';
    tierName = 'โหมดเอาตัวรอดขั้นวิกฤต';
    tierDescription = 'งบจำกัดมาก ต้องเน้นเมนูทำเองหรือไข่ต้ม/มาม่า และงดของฟุ่มเฟือยทั้งหมด';
    badgeColor = 'rose';
    isCriticalAlert = true;
  } else if (dailyAllowance <= 180) {
    tier = 'tight';
    tierName = 'โหมดคุมเข้มประหยัด';
    tierDescription = 'ควรเน้นข้าวราดแกงหรืออาหารจานเดียว 1 อย่าง ระวังค่าเครื่องดื่มหวานและวินมอเตอร์ไซค์';
    badgeColor = 'amber';
    isCriticalAlert = false;
  } else if (dailyAllowance <= 350) {
    tier = 'balanced';
    tierName = 'โหมดเอาตัวรอดทั่วไป';
    tierDescription = 'สามารถทานอาหารตามสั่ง ก๋วยเตี๋ยว มีกาแฟหรือเครื่องดื่มได้ เอาชีวิตรอดได้สบาย';
    badgeColor = 'emerald';
    isCriticalAlert = false;
  } else {
    tier = 'comfortable';
    tierName = 'โหมดสบายใจ เอาตัวรอดชิลๆ';
    tierDescription = 'งบสบายสำหรับการเอาตัวรอด สามารถทานอาหารในห้างหรือคาเฟ่ได้';
    badgeColor = 'indigo';
    isCriticalAlert = false;
  }

  // Pick Meals dynamically by currentDay (Day 1, 2, 3, etc. each get distinct rotating meals!)
  const mealTierKey =
    tier === 'survival'
      ? 'survival'
      : tier === 'tight'
      ? 'survival'
      : tier === 'balanced'
      ? 'standard'
      : 'comfort';
  
  const breakfasts = THAI_MEAL_DATABASE.filter(
    (m) =>
      m.mealTime === 'เช้า' &&
      (m.tier === mealTierKey || (tier === 'tight' && m.tier === 'survival'))
  );
  const lunches = THAI_MEAL_DATABASE.filter(
    (m) =>
      m.mealTime === 'กลางวัน' &&
      (m.tier === mealTierKey || (tier === 'tight' && m.tier === 'standard'))
  );
  const dinners = THAI_MEAL_DATABASE.filter(
    (m) =>
      m.mealTime === 'เย็น' &&
      (m.tier === mealTierKey || (tier === 'tight' && m.tier === 'standard'))
  );

  const dayIndex = Math.max(0, (currentDay || 1) - 1);
  const breakfast =
    breakfasts[dayIndex % (breakfasts.length || 1)] || THAI_MEAL_DATABASE[0];
  const lunch =
    lunches[dayIndex % (lunches.length || 1)] || THAI_MEAL_DATABASE[7] || THAI_MEAL_DATABASE[0];
  const dinner =
    dinners[dayIndex % (dinners.length || 1)] || THAI_MEAL_DATABASE[14] || THAI_MEAL_DATABASE[0];
  const totalMealCost = breakfast.estimatedPrice + lunch.estimatedPrice + dinner.estimatedPrice;

  // Pick Living Costs based on tier
  let transportCost = 20;
  let transportAdvice = 'ใช้รถเมล์ธรรมดา (ร้อน) หรือเดินระยะสั้นเพื่อเซฟเงิน';
  if (tier === 'survival') {
    transportCost = 10;
    transportAdvice = 'เดินเท้าหรือใช้รถเมล์ธรรมดา 8-10 บาท หลีกเลี่ยงวินมอเตอร์ไซค์';
  } else if (tier === 'comfortable') {
    transportCost = 60;
    transportAdvice = 'เดินทางสะดวกด้วย BTS / MRT หรือรถปรับอากาศ';
  }

  let drinkCost = tier === 'survival' ? 5 : tier === 'tight' ? 15 : tier === 'balanced' ? 30 : 55;
  let drinkAdvice =
    tier === 'survival'
      ? 'พกกระบอกน้ำส่วนตัว เติมฟรีจากตู้กดน้ำ งดซื้อน้ำหวาน'
      : tier === 'tight'
      ? 'ชงกาแฟซองเองที่ห้อง ลดรายจ่ายได้เดือนละหลายร้อย'
      : 'ดื่มกาแฟสดหรือชงเองตามสะดวก';

  let necessityCost = tier === 'survival' ? 5 : tier === 'tight' ? 10 : 20;
  let necessityAdvice = 'ซื้อของใช้เฉพาะที่จำเป็นจริงๆ หรือซื้อแบบรีฟิล';

  const totalLivingCost = transportCost + drinkCost + necessityCost;
  const totalDailyEstimated = totalMealCost + totalLivingCost;
  const dailySafetyBuffer = Math.max(0, dailyAllowance - totalDailyEstimated);

  // Key survival advice
  const keyAdvice: string[] = [];
  keyAdvice.push('เว็บเอาชีวิตรอด: คำนวณเต็มจำนวน ไม่หักเงินเก็บ ทุกบาทคือเงินใช้ประคองชีพจนครบกำหนด');
  keyAdvice.push('หากกดบันทึกมื้ออาหารผิด สามารถกดปุ่ม "รี (คืนเงิน)" เพื่อคืนเงินกลับเข้ากระเป๋าได้ทันที');
  if (tier === 'survival') {
    keyAdvice.push('ซื้อไข่ไก่ 1 แผงและข้าวสารติดห้อง ประหยัดค่ากินได้เกิน 60% เพื่อเอาชีวิตรอด');
    keyAdvice.push('ห้ามสั่ง Food Delivery เด็ดขาด เพราะมีค่าส่งและบวกราคาหน้าร้าน');
  } else if (tier === 'tight') {
    keyAdvice.push('จำกัดค่าน้ำหวาน/ชานม ไม่เกินวันละ 1 แก้ว หรือสลับดื่มน้ำเปล่า');
    keyAdvice.push('ตั้งโควต้าเงินสดรายวัน ห้ามดึงเงินของวันพรุ่งนี้มาใช้ล่วงหน้าเด็ดขาด');
  } else {
    keyAdvice.push(`คุณมีเงินเหลือในกระเป๋าหลังจากอาหารและค่าเดินทางวันละ ~฿${dailySafetyBuffer}`);
  }

  return {
    dailyAllowance,
    tier,
    tierName,
    tierDescription,
    badgeColor,
    isCriticalAlert,
    meals: {
      breakfast,
      lunch,
      dinner,
      totalMealCost,
    },
    livingCosts: {
      transport: { name: 'ค่าเดินทาง', cost: transportCost, advice: transportAdvice },
      drink: { name: 'ค่าน้ำดื่ม/เครื่องดื่ม', cost: drinkCost, advice: drinkAdvice },
      necessity: { name: 'ของใช้ & สำรอง', cost: necessityCost, advice: necessityAdvice },
      totalLivingCost,
    },
    dailySummary: {
      totalDailyEstimated,
      dailySafetyBuffer,
    },
    keyAdvice,
  };
}
