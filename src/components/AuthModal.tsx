import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';
import {
  loginUser,
  registerUser,
  requestPasswordReset,
  verifyAndResetPassword,
} from '../utils/authStorage';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserProfile, message: string) => void;
  initialMode?: 'login' | 'register' | 'forgot';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Forgot Password Flow States
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [resetCode, setResetCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  // Status & Error
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setError(null);
    setForgotStep(1);
    setResetCode('');
    setGeneratedCode(null);
    setShowPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const switchMode = (newMode: 'login' | 'register' | 'forgot') => {
    setError(null);
    setMode(newMode);
    setForgotStep(1);
  };

  // Quick 1-tap demo account login
  const handleQuickDemoLogin = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      const res = loginUser('demo@dailymoney.app', '123456');
      setLoading(false);
      if (res.success && res.user) {
        onAuthSuccess(res.user, `ยินดีต้อนรับคุณ ${res.user.name}!`);
        handleClose();
      } else {
        setError(res.error || 'เกิดข้อผิดพลาด');
      }
    }, 250);
  };

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('กรุณากรอกอีเมลและรหัสผ่าน');
      return;
    }

    setLoading(true);
    setError(null);
    setTimeout(() => {
      const res = loginUser(email, password);
      setLoading(false);
      if (res.success && res.user) {
        onAuthSuccess(res.user, `เข้าสู่ระบบสำเร็จ ยินดีต้อนรับ ${res.user.name}`);
        handleClose();
      } else {
        setError(res.error || 'เข้าสู่ระบบไม่สำเร็จ');
      }
    }, 300);
  };

  // Handle Register
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('รหัสผ่านและยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    setLoading(true);
    setError(null);
    setTimeout(() => {
      const res = registerUser(name, email, password);
      setLoading(false);
      if (res.success && res.user) {
        onAuthSuccess(res.user, `สมัครสมาชิกสำเร็จ! ยินดีต้อนรับคุณ ${res.user.name}`);
        handleClose();
      } else {
        setError(res.error || 'สมัครสมาชิกไม่สำเร็จ');
      }
    }, 350);
  };

  // Handle Request Reset Code (Forgot Step 1)
  const handleRequestCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('กรุณาระบุอีเมลที่ใช้ลงทะเบียน');
      return;
    }

    setLoading(true);
    setError(null);
    setTimeout(() => {
      const res = requestPasswordReset(email);
      setLoading(false);
      if (res.success && res.code) {
        setGeneratedCode(res.code);
        setForgotStep(2);
      } else {
        setError(res.error || 'ไม่พบอีเมลนี้ในระบบ');
      }
    }, 300);
  };

  // Handle Verify Code & Set New Password (Forgot Step 2)
  const handleVerifyReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน');
      return;
    }

    setLoading(true);
    setError(null);
    setTimeout(() => {
      const res = verifyAndResetPassword(email, resetCode, password);
      setLoading(false);
      if (res.success) {
        const loginRes = loginUser(email, password);
        if (loginRes.user) {
          onAuthSuccess(loginRes.user, 'ตั้งรหัสผ่านใหม่สำเร็จ และเข้าสู่ระบบเรียบร้อยแล้ว!');
        }
        handleClose();
      } else {
        setError(res.error || 'การเปลี่ยนรหัสผ่านไม่สำเร็จ');
      }
    }, 350);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm -z-10"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 16 }}
            transition={{ type: 'spring', stiffness: 450, damping: 30 }}
            className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-lg border border-emerald-500/30">
                  ฿
                </div>
                <div>
                  <h3 className="text-base font-bold tracking-tight">
                    {mode === 'login' && 'เข้าสู่ระบบ DailyMoney'}
                    {mode === 'register' && 'สร้างบัญชีผู้ใช้ใหม่'}
                    {mode === 'forgot' && 'กู้คืนและรีเซ็ตรหัสผ่าน'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {mode === 'login' && 'จัดการงบประมาณและบันทึกรายจ่ายของคุณ'}
                    {mode === 'register' && 'เริ่มต้นวางแผนเพื่อรอดสิ้นเดือน'}
                    {mode === 'forgot' && 'ส่งรหัส OTP เพื่อตั้งรหัสผ่านใหม่'}
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Mode Switcher Tabs */}
            {mode !== 'forgot' && (
              <div className="grid grid-cols-2 p-1.5 bg-slate-100 border-b border-slate-200 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className={`py-2 rounded-xl transition-all cursor-pointer ${
                    mode === 'login'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  เข้าสู่ระบบ
                </button>
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  className={`py-2 rounded-xl transition-all cursor-pointer ${
                    mode === 'register'
                      ? 'bg-white text-slate-900 shadow-xs font-bold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  สมัครสมาชิกใหม่
                </button>
              </div>
            )}

            <div className="p-6">
              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -6, height: 0 }}
                    className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-start gap-2"
                  >
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 1. LOGIN MODE */}
              {mode === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      อีเมล หรือ ชื่อผู้ใช้
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="demo@dailymoney.app"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 rounded-xl text-xs text-slate-900 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        รหัสผ่าน
                      </label>
                      <button
                        type="button"
                        onClick={() => switchMode('forgot')}
                        className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer transition-colors"
                      >
                        ลืมรหัสผ่าน?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 rounded-xl text-xs text-slate-900 outline-none transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                  >
                    <span>{loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.button>

                  {/* 1-Tap Demo Account Helper */}
                  <div className="pt-3 border-t border-slate-100">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      type="button"
                      onClick={handleQuickDemoLogin}
                      className="w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>⚡ ล็อคอินด่วนด้วยบัญชีทดสอบ (1 คลิก)</span>
                    </motion.button>
                  </div>
                </form>
              )}

              {/* 2. REGISTER MODE */}
              {mode === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      ชื่อของคุณ
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="เช่น สมชาย, มานี"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 rounded-xl text-xs text-slate-900 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      อีเมล
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 rounded-xl text-xs text-slate-900 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      รหัสผ่าน (อย่างน้อย 4 ตัวอักษร)
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={4}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 rounded-xl text-xs text-slate-900 outline-none transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      ยืนยันรหัสผ่านอีกครั้ง
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 rounded-xl text-xs text-slate-900 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                  >
                    <span>{loading ? 'กำลังสร้างบัญชี...' : 'ยืนยันสมัครสมาชิก'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </motion.button>
                </form>
              )}

              {/* 3. FORGOT PASSWORD MODE (Requested feature) */}
              {mode === 'forgot' && (
                <div>
                  {forgotStep === 1 ? (
                    <form onSubmit={handleRequestCode} className="space-y-4">
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
                        <KeyRound className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-bold">ขั้นตอนที่ 1 จาก 2:</strong>
                          กรอกอีเมลของคุณ ระบบจะส่งรหัสยืนยัน OTP 6 หลัก เพื่อนำมาตั้งรหัสผ่านใหม่
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          อีเมลที่ลงทะเบียนไว้
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="demo@dailymoney.app"
                            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 rounded-xl text-xs text-slate-900 outline-none transition-colors"
                          />
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => switchMode('login')}
                          className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          ← กลับไปหน้าเข้าสู่ระบบ
                        </button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.96 }}
                          type="submit"
                          disabled={loading}
                          className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                        >
                          <span>{loading ? 'กำลังส่งรหัส...' : 'ขอรหัส OTP กู้คืน'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyReset} className="space-y-4">
                      {/* Simulated In-App Email Delivery Box */}
                      {generatedCode && (
                        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 space-y-1.5">
                          <div className="flex items-center justify-between font-bold">
                            <span className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>รหัส OTP ถูกส่งไปที่ {email} แล้ว!</span>
                            </span>
                            <span className="text-[10px] text-emerald-600 font-mono">15:00 น.</span>
                          </div>
                          <p className="text-[11px] text-emerald-800">
                            รหัสยืนยันของคุณคือ: <strong className="font-mono text-base font-black text-emerald-900 bg-white px-2 py-0.5 rounded border border-emerald-200">{generatedCode}</strong>
                          </p>
                          <button
                            type="button"
                            onClick={() => setResetCode(generatedCode)}
                            className="text-[11px] text-emerald-700 underline font-bold hover:text-emerald-900 cursor-pointer block mt-1"
                          >
                            กดตรงนี้เพื่อกรอกรหัสนี้อัตโนมัติ
                          </button>
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          รหัสยืนยัน OTP 6 หลัก
                        </label>
                        <div className="relative">
                          <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            maxLength={6}
                            required
                            value={resetCode}
                            onChange={(e) => setResetCode(e.target.value)}
                            placeholder="เช่น 123456"
                            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 rounded-xl text-xs font-mono font-bold tracking-widest text-slate-900 outline-none transition-colors"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          รหัสผ่านใหม่
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            minLength={4}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 rounded-xl text-xs text-slate-900 outline-none transition-colors"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          ยืนยันรหัสผ่านใหม่อีกครั้ง
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-600 rounded-xl text-xs text-slate-900 outline-none transition-colors"
                          />
                        </div>
                      </div>

                      <div className="pt-2 flex items-center justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => setForgotStep(1)}
                          className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          ← ขอรหัสใหม่
                        </button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.96 }}
                          type="submit"
                          disabled={loading}
                          className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>{loading ? 'กำลังเปลี่ยนรหัส...' : 'บันทึกรหัสผ่านใหม่ & ล็อคอิน'}</span>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
