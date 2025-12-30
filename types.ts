
export enum UserRole {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED'
}

export enum PaymentMethod {
  MPESA = 'MPESA',
  EMOLA = 'EMOLA',
  BIM = 'BIM'
}

export interface Enrollment {
  courseId: string;
  status: 'PENDING' | 'ACTIVE' | 'BLOCKED';
  paymentStatus: PaymentStatus;
  progress: number;
  completedLessons: string[];
  enrollmentDate: string;
  accessExpiresAt?: string; // Data de expiração do acesso
  proofMessage?: string;    // Mensagem/Código de transação enviado pelo aluno
}

export interface Lesson {
  id: string;
  title: string;
  videoUrl?: string;
  pdfUrl?: string;
  richText?: string;
  duration: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text: string;
  date: string;
  rating?: number;
}

export interface Ebook {
  id: string;
  title: string;
  url: string;
}

export interface QuizItem {
  id: string;
  type: 'MULTIPLE_CHOICE' | 'TEXT';
  question: string;
  options: string[];
  correctIndex: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  promoPrice?: number;
  bannerUrl: string;
  lessons: Lesson[];
  category: string;
  author: string;
  comments: Comment[];
  ebooks?: Ebook[];
  quiz?: QuizItem[];
  faq?: FAQItem[];
}

export interface User {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  enrollments: Enrollment[];
}

export interface Testimonial {
  id: string;
  name: string;
  comment: string;
  avatar: string;
  course: string;
}
