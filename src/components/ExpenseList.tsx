import React, { useState } from 'react';
import {
  Search,
  Filter,
  Trash2,
  Utensils,
  Bus,
  ShoppingBag,
  Sparkles,
  Tag,
  FileText,
  HelpCircle,
  Plus,
} from 'lucide-react';
import { Expense, ExpenseCategory } from '../types';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
  onOpenNewExpense: () => void;
}

const CATEGORY_MAP: Record<
  ExpenseCategory,
  { label: string; icon: React.ReactNode; color: string }
> = {
  food: {
    label: 'อาหาร & เครื่องดื่ม',
    icon: <Utensils className="w-3.5 h-3.5" />,
    color: 'text-amber-700 bg-amber-50',
  },
  transport: {
    label: 'การเดินทาง',
    icon: <Bus className="w-3.5 h-3.5" />,
    color: 'text-blue-700 bg-blue-50',
  },
  necessities: {
    label: 'ของใช้ประจำวัน',
    icon: <ShoppingBag className="w-3.5 h-3.5" />,
    color: 'text-emerald-700 bg-emerald-50',
  },
  entertainment: {
    label: 'บันเทิง & สังสรรค์',
    icon: <Sparkles className="w-3.5 h-3.5" />,
    color: 'text-purple-700 bg-purple-50',
  },
  shopping: {
    label: 'ช้อปปิ้ง',
    icon: <Tag className="w-3.5 h-3.5" />,
    color: 'text-rose-700 bg-rose-50',
  },
  bills: {
    label: 'บิล & ค่าใช้จ่าย',
    icon: <FileText className="w-3.5 h-3.5" />,
    color: 'text-indigo-700 bg-indigo-50',
  },
  other: {
    label: 'อื่นๆ',
    icon: <HelpCircle className="w-3.5 h-3.5" />,
    color: 'text-slate-700 bg-slate-50',
  },
};

export const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  onDeleteExpense,
  onOpenNewExpense,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filtered = expenses
    .filter((e) => {
      const matchCategory =
        selectedCategory === 'all' || e.category === selectedCategory;
      const matchSearch =
        e.note.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(e.amount).includes(searchTerm);
      return matchCategory && matchSearch;
    })
    .sort((a, b) => {
      // Sort by date then time desc
      const dateA = `${a.date}T${a.time || '00:00'}`;
      const dateB = `${b.date}T${b.time || '00:00'}`;
      return dateB.localeCompare(dateA);
    });

  const totalFilteredAmount = filtered.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900">
              รายการบันทึกค่าใช้จ่าย
            </h2>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs font-mono text-slate-500">
              {filtered.length} รายการ
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            บันทึกแบบเรียลไทม์ ยอดเงินและงบเฉลี่ยจะคำนวณใหม่ทันที
          </p>
        </div>

        <button
          onClick={onOpenNewExpense}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>เพิ่มรายการใหม่</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ค้นหาชื่อรายการ, จำนวนเงิน..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-emerald-600 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-xs rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white font-medium'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            ทุกหมวด
          </button>
          {Object.entries(CATEGORY_MAP).map(([key, info]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-2.5 py-1.5 text-xs rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                selectedCategory === key
                  ? 'bg-emerald-600 text-white font-medium'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{info.icon}</span>
              <span>{info.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filtered Sum badge */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-100">
          <span>รวมยอดในมุมมองนี้:</span>
          <span className="font-mono font-bold text-slate-900 text-sm">
            ฿{totalFilteredAmount.toLocaleString()}
          </span>
        </div>
      )}

      {/* Table / List */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
            <Filter className="w-5 h-5" />
          </div>
          <h4 className="font-semibold text-slate-800 text-sm">
            ยังไม่มีรายการค่าใช้จ่าย
          </h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {searchTerm || selectedCategory !== 'all'
              ? 'ไม่พบรายการที่ตรงกับเงื่อนไขการค้นหา ลองล้างตัวกรอง'
              : 'เริ่มต้นบันทึกการใช้จ่ายของคุณเพื่อคำนวณเงินคงเหลือรายวันแบบเรียลไทม์'}
          </p>
          <button
            onClick={onOpenNewExpense}
            className="mt-4 px-4 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors cursor-pointer"
          >
            + บันทึกรายการแรก
          </button>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {filtered.map((item) => {
            const cat = CATEGORY_MAP[item.category] || CATEGORY_MAP.other;
            return (
              <div
                key={item.id}
                className="py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/80 px-2 rounded-xl transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${cat.color}`}
                  >
                    {cat.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-slate-900">
                      {item.note}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span>{cat.label}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{item.date}</span>
                      {item.time && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono">{item.time} น.</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-sm text-slate-900 tabular-nums">
                    -฿{Number(item.amount).toLocaleString()}
                  </span>
                  <button
                    onClick={() => onDeleteExpense(item.id)}
                    title="ลบรายการนี้"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
