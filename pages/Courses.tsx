
import React, { useState } from 'react';
import { useApp } from '../store';
import { Search, Filter, ArrowRight, Star, Tag } from 'lucide-react';
import { Course } from '../types';

const Courses: React.FC<{ onNavigate: (page: string, params?: any) => void }> = ({ onNavigate }) => {
  const { courses } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');

  const categories = ['Todos', ...Array.from(new Set(courses.map(c => c.category)))];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'Todos' || course.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">Nossos Cursos</h1>
          <p className="text-slate-600 dark:text-slate-400">Escolha o seu futuro hoje entre as melhores opções de ensino.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative flex-grow sm:flex-grow-0 sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Pesquisar curso..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm text-slate-900 dark:text-white font-bold"
            />
          </div>
          <div className="flex items-center gap-4 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-6 py-3 rounded-2xl font-semibold transition-all ${
                  activeCategory === cat 
                    ? 'bg-indigo-600 text-white shadow-lg' 
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredCourses.map(course => (
            <div key={course.id} className="group bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-700 hover:shadow-2xl hover:-translate-y-1 transition-all">
              <div className="relative h-48 overflow-hidden">
                <img src={course.bannerUrl} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 px-3 py-1 rounded-lg text-[10px] font-bold text-indigo-600 uppercase tracking-widest">{course.category}</div>
                {course.promoPrice && (
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest animate-pulse">Promoção</div>
                )}
                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star size={14} fill="currentColor" />
                    <span className="text-white text-xs font-bold">4.8</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2 line-clamp-1 text-slate-900 dark:text-white">{course.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2 h-10">{course.description}</p>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Investimento</span>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black text-indigo-600">
                        {(course.promoPrice || course.price).toLocaleString()} MT
                      </span>
                      {course.promoPrice && (
                        <span className="text-xs text-slate-400 line-through font-bold">
                          {course.price.toLocaleString()} MT
                        </span>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => onNavigate('course-detail', { id: course.id })}
                    className="flex items-center justify-center w-10 h-10 gradient-primary text-white rounded-xl shadow-lg hover:scale-110 transition-transform"
                  >
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
            <Tag size={40} />
          </div>
          <h3 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Nenhum curso encontrado</h3>
          <p className="text-slate-500">Tente ajustar seus filtros ou termos de pesquisa.</p>
        </div>
      )}
    </div>
  );
};

export default Courses;
