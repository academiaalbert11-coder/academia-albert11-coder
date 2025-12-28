
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Course, UserRole, Enrollment, PaymentStatus, PaymentMethod } from './types.ts';
import { INITIAL_COURSES } from './constants.tsx';
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://efdwiddcentpanszhnqg.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmZHdpZGRjZW50cGFuc3pobnFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY2NjM0NzcsImV4cCI6MjA4MjIzOTQ3N30.2wNC4BCmaX_j27wVMgqwfB97pykz30oOQeY2SkZCaQQ";
export const supabase = createClient(supabaseUrl, supabaseKey);

export const ADMIN_EMAIL = 'academiaalbert11@gmail.com';

// Fix generic function syntax to avoid JSX conflict in .tsx files
export function withTimeout<T>(promise: Promise<T>, timeout = 15000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("Timeout")), timeout))
  ]);
}

export const ACCOUNTS = {
  MPESA: '+258 844265435',
  EMOLA: '+258 864118493',
  BIM: '0001 2345 6789 (Albert)'
};

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  courses: Course[];
  allUsers: User[];
  loading: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  logout: () => Promise<void>;
  refreshData: () => Promise<void>;
  processPayment: (courseId: string, method: PaymentMethod, phone: string) => Promise<string>;
  updateCourse: (course: Course) => Promise<void>;
  welcomeVideoUrl: string;
  fetchUserProfile: (id: string, email: string) => Promise<User | null>;
  formatDriveLink: (url: string) => string;
  isLocalMode: boolean;
  confirmPayment: (paymentId: string) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  addCourse: (course: Course) => Promise<void>;
  updateUserStatus: (userId: string, courseId: string, currentStatus: string) => Promise<void>;
  toggleAdminRole: (userId: string) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  exportDataToCSV: () => void;
  updateWelcomeVideo: (url: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [welcomeVideoUrl, setWelcomeVideoUrl] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [isLocalMode] = useState(false);

  const refreshData = async () => {
    const { data: coursesData } = await supabase.from('courses').select('*');
    if (coursesData && coursesData.length > 0) setCourses(coursesData);
    else setCourses(INITIAL_COURSES);

    const { data: profiles } = await supabase.from('profiles').select('*');
    if (profiles) setAllUsers(profiles);
  };

  const fetchUserProfile = async (id: string, email: string) => {
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', id).single();
    if (profile) return profile as User;
    
    const newProfile: User = {
      id,
      name: email.split('@')[0],
      lastName: '',
      email,
      phone: '',
      role: email === ADMIN_EMAIL ? UserRole.ADMIN : UserRole.STUDENT,
      enrollments: []
    };
    await supabase.from('profiles').insert(newProfile);
    return newProfile;
  };

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const profile = await fetchUserProfile(session.user.id, session.user.email || '');
        if (profile) setUser(profile);
      }
      await refreshData();
      setLoading(false);
    };
    init();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark');
  };

  const processPayment = async (courseId: string, method: PaymentMethod, phone: string) => {
    if (!user) return "";
    const paymentId = "pay-" + Date.now();
    const newEnrollment: Enrollment = {
      courseId,
      status: 'PENDING',
      paymentStatus: PaymentStatus.PENDING,
      progress: 0,
      completedLessons: [],
      enrollmentDate: new Date().toISOString()
    };
    // Ensure user is defined before spreading
    const updatedUser = { ...user, enrollments: [...user.enrollments, newEnrollment] };
    const { error } = await supabase.from('profiles').update({ enrollments: updatedUser.enrollments }).eq('id', user.id);
    if (!error) {
      setUser(updatedUser);
      return paymentId;
    }
    return "";
  };

  const updateCourse = async (course: Course) => {
    await supabase.from('courses').upsert(course);
    await refreshData();
  };

  const addCourse = async (course: Course) => {
    await supabase.from('courses').insert(course);
    await refreshData();
  };

  const deleteCourse = async (id: string) => {
    await supabase.from('courses').delete().eq('id', id);
    await refreshData();
  };

  const updateUserStatus = async (userId: string, courseId: string, currentStatus: string) => {
    const profile = allUsers.find(u => u.id === userId);
    if (profile) {
      const enrollments = profile.enrollments.map(e => 
        e.courseId === courseId ? { 
          ...e, 
          paymentStatus: e.paymentStatus === PaymentStatus.PAID ? PaymentStatus.PENDING : PaymentStatus.PAID,
          status: 'ACTIVE' as const 
        } : e
      );
      await supabase.from('profiles').update({ enrollments }).eq('id', userId);
      await refreshData();
    }
  };

  const toggleAdminRole = async (userId: string) => {
    const profile = allUsers.find(u => u.id === userId);
    if (profile) {
      const newRole = profile.role === UserRole.ADMIN ? UserRole.STUDENT : UserRole.ADMIN;
      await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
      await refreshData();
    }
  };

  const deleteUser = async (id: string) => {
    await supabase.from('profiles').delete().eq('id', id);
    await refreshData();
  };

  const confirmPayment = async (paymentId: string) => {
    await new Promise(r => setTimeout(r, 1000));
  };

  const formatDriveLink = (url: string) => {
    if (url.includes('drive.google.com') && url.includes('view')) {
      return url.replace('/view', '/preview');
    }
    return url;
  };

  const exportDataToCSV = () => {
    const headers = "Nome,Email,Role,Enrollments\n";
    const rows = allUsers.map(u => `${u.name} ${u.lastName},${u.email},${u.role},${u.enrollments.length}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'academia_albert_report.csv';
    a.click();
  };

  const updateWelcomeVideo = async (url: string) => {
    setWelcomeVideoUrl(url);
  };

  return (
    <AppContext.Provider value={{ 
      user, setUser, courses, allUsers, loading, theme, toggleTheme, 
      logout, refreshData, processPayment, updateCourse, welcomeVideoUrl,
      fetchUserProfile, formatDriveLink, isLocalMode, confirmPayment,
      deleteCourse, addCourse, updateUserStatus, toggleAdminRole,
      deleteUser, exportDataToCSV, updateWelcomeVideo
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
