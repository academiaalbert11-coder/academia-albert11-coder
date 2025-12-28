
import { Course, Testimonial } from './types';

export const INITIAL_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Contabilidade Prática',
    description: 'Domine a contabilidade empresarial e gestão de fluxo de caixa.',
    price: 15000,
    promoPrice: 12000,
    bannerUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
    category: 'Gestão',
    author: 'Dr. Albert',
    lessons: [
      { id: 'l1', title: 'Fundamentos Contábeis', videoUrl: 'dQw4w9WgXcQ', duration: '15:00' },
      { id: 'l2', title: 'Lançamentos e Balancetes', videoUrl: 'dQw4w9WgXcQ', duration: '22:30' }
    ],
    ebooks: [{ id: 'eb1', title: 'Manual do Contabilista PDF', url: '#' }],
    quiz: [
      { id: 'q1', type: 'MULTIPLE_CHOICE', question: 'O que representa o Ativo?', options: ['Dívidas', 'Bens e Direitos', 'Despesas', 'Sócios'], correctIndex: 1 }
    ],
    faq: [
      { id: 'f1', question: 'Preciso de conhecimento prévio?', answer: 'Não, este curso começa do absoluto zero.' },
      { id: 'f2', question: 'Terei suporte para dúvidas?', answer: 'Sim, você pode usar o chat da comunidade abaixo de cada aula.' }
    ],
    comments: []
  },
  {
    id: 'c4',
    title: 'Saboaria Artesanal Profissional',
    description: 'Crie seu próprio negócio de sabonetes naturais e terapêuticos.',
    price: 8500,
    bannerUrl: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&w=800&q=80',
    category: 'Artesanato',
    author: 'Mestre Clara',
    lessons: [
      { id: 'l10', title: 'Materiais e Segurança', videoUrl: 'dQw4w9WgXcQ', duration: '12:00' }
    ],
    ebooks: [],
    quiz: [],
    faq: [
      { id: 'f3', question: 'O material é incluso?', answer: 'Fornecemos uma lista completa de fornecedores em Moçambique.' }
    ],
    comments: []
  },
  {
    id: 'c5',
    title: 'Violão Popular do Zero',
    description: 'Aprenda os primeiros acordes e toque suas músicas favoritas em semanas.',
    price: 9000,
    promoPrice: 5000,
    bannerUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80',
    category: 'Música',
    author: 'Prof. Ricardo',
    lessons: [],
    ebooks: [],
    quiz: [],
    comments: []
  },
  {
    id: 'c6',
    title: 'História Universal: Do Caos à Ordem',
    description: 'Uma viagem profunda pelos eventos que moldaram a humanidade.',
    price: 7000,
    bannerUrl: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=800&q=80',
    category: 'Educação',
    author: 'Dr. Fernando',
    lessons: [],
    ebooks: [],
    quiz: [],
    comments: []
  },
  {
    id: 'c7',
    title: 'Auxiliar de Enfermagem',
    description: 'Preparação técnica intensiva para o mercado de saúde.',
    price: 25000,
    bannerUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
    category: 'Saúde',
    author: 'Enf. Márcia',
    lessons: [],
    ebooks: [],
    quiz: [],
    comments: []
  }
];

export const TESTIMONIALS: Testimonial[] = [
  { id: 't1', name: 'Ana Silva', comment: 'O curso de Contabilidade foi o diferencial para minha promoção!', avatar: 'https://i.pravatar.cc/150?u=ana', course: 'Contabilidade Prática' },
  { id: 't2', name: 'João K.', comment: 'Saboaria virou minha principal fonte de renda. Obrigado Albert!', avatar: 'https://i.pravatar.cc/150?u=joao', course: 'Saboaria Artesanal' }
];
