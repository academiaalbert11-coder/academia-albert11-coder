
import React from 'react';
import { useApp } from '../store';
import { ArrowRight, Video, Zap, Award, BookOpen, Users } from 'lucide-react';

const Home: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { courses, welcomeVideoUrl } = useApp();
  
  const getEmbedUrl = (url: string) => url.includes('v=') ? url.replace('watch?v=', 'embed/') : url;

  return (
    <div className="space-y-32 pb-32 animate-in fade-in duration-700">
      <section className="relative pt-32 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <div className="inline-block px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-8">
            Líder em Educação em Moçambique
          </div>
          <h1 className="text-6xl lg:text-9xl font-black text-slate-900 dark:text-white leading-tight mb-8">
            REDEFINA SEU <br/> <span className="text-indigo-600">POTENCIAL.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12">
            Formação profissional prática para o mercado de trabalho moçambicano.
          </p>
          <div className="flex justify-center gap-6">
            <button onClick={() => onNavigate('courses')} className="px-12 py-6 bg-indigo-600 text-white rounded-[2rem] font-black text-xl shadow-xl hover:bg-indigo-700 transition-all">Explorar Cursos</button>
            <button onClick={() => onNavigate('register')} className="px-12 py-6 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-[2rem] font-black text-xl border border-slate-200">Criar Conta</button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-slate-900 rounded-[4rem] overflow-hidden grid lg:grid-cols-2 shadow-2xl">
          <div className="p-20 flex flex-col justify-center space-y-6">
            <Video className="text-indigo-500" size={48} />
            <h2 className="text-4xl font-black text-white">Educação que Transforma.</h2>
            <p className="text-slate-400">Assista ao vídeo e descubra nossa metodologia.</p>
          </div>
          <div className="aspect-video bg-black">
            <iframe width="100%" height="100%" src={getEmbedUrl(welcomeVideoUrl)} frameBorder="0" allowFullScreen />
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
        {courses.slice(0, 3).map(course => (
          <div key={course.id} className="bg-white dark:bg-slate-800 rounded-[3rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all p-8 space-y-6">
            <img src={course.bannerUrl} className="w-full h-48 object-cover rounded-2xl" />
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{course.title}</h3>
            <p className="text-slate-500 text-sm line-clamp-2">{course.description}</p>
            <div className="flex justify-between items-center pt-6 border-t border-slate-50">
              <span className="text-2xl font-black text-indigo-600">{course.price.toLocaleString()} MT</span>
              <button onClick={() => onNavigate('course-detail', {id: course.id})} className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center">→</button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;
