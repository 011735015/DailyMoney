import { UserProfile } from '../types';

export interface StoredUserAccount extends UserProfile {
  passwordHash: string; // stored credentials
}

export interface PasswordResetRequest {
  email: string;
  code: string; // 6-digit OTP code
  createdAt: number;
  expiresAt: number;
}

const AUTH_USERS_KEY = 'dailymoney_auth_users';
const CURRENT_USER_KEY = 'dailymoney_current_user';
const RESET_REQUEST_KEY = 'dailymoney_reset_requests';

// Default pre-seeded demo user for instant 1-tap testing
const DEFAULT_DEMO_USERS: StoredUserAccount[] = [
  {
    id: 'user-demo-1',
    name: 'สมชาย รักประหยัด',
    email: 'demo@dailymoney.app',
    passwordHash: '123456',
    avatar: '👨‍💼',
    joinedAt: Date.now() - 86400000 * 14,
  },
];

export function getStoredUsers(): StoredUserAccount[] {
  try {
    const raw = localStorage.getItem(AUTH_USERS_KEY);
    if (!raw) {
      localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(DEFAULT_DEMO_USERS));
      return DEFAULT_DEMO_USERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_DEMO_USERS;
  } catch {
    return DEFAULT_DEMO_USERS;
  }
}

export function saveStoredUsers(users: StoredUserAccount[]): void {
  try {
    localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users', err);
  }
}

export function getCurrentUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCurrentUser(user: UserProfile | null): void {
  try {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  } catch (err) {
    console.error('Failed to update current user session', err);
  }
}

export function loginUser(emailOrUsername: string, password: string): { success: boolean; user?: UserProfile; error?: string } {
  const users = getStoredUsers();
  const cleanQuery = emailOrUsername.trim().toLowerCase();
  const user = users.find(
    (u) => u.email.toLowerCase() === cleanQuery || u.name.toLowerCase() === cleanQuery
  );

  if (!user) {
    return { success: false, error: 'ไม่พบบัญชีผู้ใช้นี้ในระบบ กรุณาตรวจสอบอีเมลหรือสมัครสมาชิก' };
  }

  if (user.passwordHash !== password) {
    return { success: false, error: 'รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง หรือกด "ลืมรหัสผ่าน"' };
  }

  const userProfile: UserProfile = {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    joinedAt: user.joinedAt,
  };

  setCurrentUser(userProfile);
  return { success: true, user: userProfile };
}

export function registerUser(name: string, email: string, password: string): { success: boolean; user?: UserProfile; error?: string } {
  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanName) {
    return { success: false, error: 'กรุณากรอกชื่อผู้ใช้' };
  }
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, error: 'กรุณากรอกอีเมลที่ถูกต้อง' };
  }
  if (password.length < 4) {
    return { success: false, error: 'รหัสผ่านต้องมีความยาวอย่างน้อย 4 ตัวอักษร' };
  }

  const users = getStoredUsers();
  const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    return { success: false, error: 'อีเมลนี้ถูกลงทะเบียนไว้แล้ว กรุณาเข้าสู่ระบบ' };
  }

  const avatars = ['😊', '🧑‍💻', '👩‍💼', '🥗', '🍲', '☕', '🐱', '🦊'];
  const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

  const newUser: StoredUserAccount = {
    id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: cleanName,
    email: cleanEmail,
    passwordHash: password,
    avatar: randomAvatar,
    joinedAt: Date.now(),
  };

  const updatedUsers = [...users, newUser];
  saveStoredUsers(updatedUsers);

  const profile: UserProfile = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    avatar: newUser.avatar,
    joinedAt: newUser.joinedAt,
  };

  setCurrentUser(profile);
  return { success: true, user: profile };
}

export function requestPasswordReset(email: string): { success: boolean; code?: string; error?: string } {
  const cleanEmail = email.trim().toLowerCase();
  const users = getStoredUsers();
  const user = users.find((u) => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    return { success: false, error: 'ไม่พบอีเมลนี้ในระบบ กรุณาตรวจสอบความถูกต้อง' };
  }

  // Generate 6-digit random verification code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const resetReq: PasswordResetRequest = {
    email: cleanEmail,
    code,
    createdAt: Date.now(),
    expiresAt: Date.now() + 15 * 60 * 1000, // 15 mins
  };

  try {
    localStorage.setItem(RESET_REQUEST_KEY, JSON.stringify(resetReq));
  } catch (err) {
    console.error('Failed to save reset request', err);
  }

  return { success: true, code };
}

export function verifyAndResetPassword(email: string, code: string, newPassword: string): { success: boolean; error?: string } {
  const cleanEmail = email.trim().toLowerCase();
  const cleanCode = code.trim();

  if (newPassword.length < 4) {
    return { success: false, error: 'รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 4 ตัวอักษร' };
  }

  try {
    const raw = localStorage.getItem(RESET_REQUEST_KEY);
    if (!raw) {
      return { success: false, error: 'ไม่พบคำขอรีเซ็ตรหัสผ่าน กรุณากดขอรหัส OTP ใหม่อีกครั้ง' };
    }
    const resetReq: PasswordResetRequest = JSON.parse(raw);

    if (resetReq.email !== cleanEmail) {
      return { success: false, error: 'อีเมลไม่ตรงกับคำขอรีเซ็ตรหัสผ่าน' };
    }

    if (resetReq.code !== cleanCode) {
      return { success: false, error: 'รหัส OTP ไม่ถูกต้อง กรุณาตรวจสอบรหัส 6 หลัก' };
    }

    if (Date.now() > resetReq.expiresAt) {
      return { success: false, error: 'รหัส OTP หมดอายุแล้ว (เกิน 15 นาที) กรุณากดขอใหม่' };
    }

    // Update user password
    const users = getStoredUsers();
    const updatedUsers = users.map((u) => {
      if (u.email.toLowerCase() === cleanEmail) {
        return { ...u, passwordHash: newPassword };
      }
      return u;
    });

    saveStoredUsers(updatedUsers);
    localStorage.removeItem(RESET_REQUEST_KEY);

    // Auto login with new credentials
    const targetUser = updatedUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (targetUser) {
      setCurrentUser({
        id: targetUser.id,
        name: targetUser.name,
        email: targetUser.email,
        avatar: targetUser.avatar,
        joinedAt: targetUser.joinedAt,
      });
    }

    return { success: true };
  } catch {
    return { success: false, error: 'เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน กรุณาลองใหม่อีกครั้ง' };
  }
}
