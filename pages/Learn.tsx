
import React, { useState, useEffect } from 'react';
import { useApp } from '../store.tsx';
import { 
  Play, CheckCircle, FileText, ArrowLeft, Check, Video, BookOpen, Clock, AlertTriangle, Lock
} from 'lucide-react';

const Learn: React.FC<{ courseId: string; onNavigate: (page: string, params?: any) => void }> = ({ courseId, onNavigate }) => {
  const { user, courses, setUser, formatDriveLink } = useApp();
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  const course = courses.find(c => c.id === courseId);
  const enrollment = user?.enrollments.find(e => e.courseId === courseId);

  // Verificação de expiração
  const isExpired = enrollment?.accessExpiresAt ? new Date(enrollment.accessExpiresAt) < new Date() : false;

  if (!course || !enrollment || !user) return <div className="h-screen flex items-center justify-center font-black text-slate-400">CARREGANDO CONTEÚDO...</div>;

  if (isExpired) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 p-12 rounded-[3rem] shadow-2xl text-center space-y-6 border-4 border-amber-500/20">
           <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-[1.5rem] flex items-center justify-center mx-auto">
              <Clock size={40}/>
           </div>
           <h2 className="text-3xl font-black">Acesso Expirado</h2>
           <p className="text-slate-500 font-medium">O seu tempo de acesso a este curso terminou no dia <b>{new Date(enrollment.accessExpiresAt!).toLocaleDateString()}</b>. Por favor, efectue um novo pagamento.</p>
           <button onClick={() => onNavigate('checkout', {id: course.id})} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black">Renovar Acesso</button>
           <button onClick={() => onNavigate('dashboard')} className="w-full text-slate-400 font-bold text-sm">Voltar ao Painel</button>
        </div>
      </div>
    );
  }

  if (enrollment.status === 'PENDING') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 p-12 rounded-[3rem] shadow-2xl text-center space-y-6 border border-slate-100 dark:border-slate-700">
           <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-[1.5rem] flex items-center justify-center mx-auto animate-pulse">
              <Clock size={40}/>
           </div>
           <h2 className="text-3xl font-black">Aguardando Validação</h2>
           <p className="text-slate-500 font-medium leading-relaxed">Enviou o comprovativo de transação para <b>{course.title}</b>. A Academia Albert está a processar a sua matrícula manualmente agora.</p>
           <button onClick={() => onNavigate('dashboard')} className="w-full py-4 bg-slate-900 dark:bg-slate-700 text-white rounded-2xl font-black hover:scale-105 transition-all">Ir para Painel</button>
        </div>
      </div>
    );
  }

  const currentLesson = course.lessons[currentLessonIndex] || { title: 'Nenhuma Lição', id: 'none' };

  const markComplete = () => {
    if (enrollment.completedLessons.includes(currentLesson.id)) return;
    const newList = [...enrollment.completedLessons, currentLesson.id];
    const progress = Math.round((newList.length / course.lessons.length) * 100);
    
    const updatedEnrollments = user.enrollments.map(e => 
      e.courseId === courseId ? { ...e, completedLessons: newList, progress } : e
    );
    setUser({ ...user, enrollments: updatedEnrollments });
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-white dark:bg-slate-950 overflow-hidden transition-colors duration-500">
      <aside className="w-full lg:w-[350px] border-r border-slate-100 dark:border-slate-800 flex flex-col bg-slate-50/30 dark:bg-slate-900/50 backdrop-blur-xl">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/80">
           <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2 text-xs font-black text-indigo-600 uppercase tracking-widest mb-4 hover:-translate-x-1 transition-transform">
              <ArrowLeft size={14}/> Dashboard
           </button>
           <h2 className="font-black text-xl leading-tight mb-4 text-slate-800 dark:text-white">{course.title}</h2>
           {enrollment.accessExpiresAt && (
             <div className="text-[9px] font-black text-amber-600 uppercase mb-3 bg-amber-50 dark:bg-amber-900/20 p-2 rounded-lg text-center border border-amber-100">
               Expira em: {new Date(enrollment.accessExpiresAt).toLocaleDateString()}
             </div>
           )}
           <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-2"><div className="h-full bg-indigo-600 transition-all duration-1000" style={{width: `${enrollment.progress}%`}}></div></div>
           <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-tighter">
              <span>Progresso</span>
              <span className="text-indigo-600">{enrollment.progress}%</span>
           </div>
        </div>

        <div className="flex-grow overflow-y-auto p-4 space-y-2 no-scrollbar">
           {course.lessons.map((l, i) => (
             <button key={l.id} onClick={() => setCurrentLessonIndex(i)} className={`w-full p-4 rounded-2xl text-left flex items-center gap-4 transition-all group ${currentLessonIndex === i ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20' : 'hover:bg-white dark:hover:bg-slate-800'}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-colors ${currentLessonIndex === i ? 'bg-white/20 text-white' : enrollment.completedLessons.includes(l.id) ? 'bg-green-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}>
                   {enrollment.completedLessons.includes(l.id) ? <Check size={14}/> : i + 1}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="font-black text-sm truncate">{l.title}</div>
                  <div className={`text-[10px] font-bold uppercase opacity-60 ${currentLessonIndex === i ? 'text-white' : 'text-slate-400'}`}>Aula {i+1}</div>
                </div>
             </button>
           ))}
        </div>
      </aside>

      <main className="flex-grow overflow-y-auto p-6 lg:p-12 no-scrollbar bg-slate-50/30 dark:bg-slate-950">
        <div className="max-w-5xl mx-auto space-y-12 pb-40">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-slate-800 p-8 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-700">
              <div className="space-y-1">
                <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Módulo em Estudo:</div>
                <h1 className="text-4xl font-black text-slate-900 dark:text-white leading-tight">{currentLesson.title}</h1>
              </div>
              <button onClick={markComplete} className={`px-10 py-4 rounded-2xl font-black transition-all flex items-center justify-center gap-3 active:scale-95 ${enrollment.completedLessons.includes(currentLesson.id) ? 'bg-green-100 text-green-700' : 'bg-indigo-600 text-white'}`}>
                {enrollment.completedLessons.includes(currentLesson.id) ? <CheckCircle size={22}/> : <Play size={22}/>}
                {enrollment.completedLessons.includes(currentLesson.id) ? 'Concluída' : 'Marcar Aula'}
              </button>
           </div>

           {currentLesson.videoUrl && (
             <div className="space-y-4">
                <div className="aspect-video bg-black rounded-[3.5rem] overflow-hidden shadow-2xl border-[10px] border-white dark:border-slate-800">
                   <iframe 
                      width="100%" height="100%" 
                      src={`https://www.youtube.com/embed/${currentLesson.videoUrl.split('v=')[1] || currentLesson.videoUrl.split('/').pop()}`}
                      frameBorder="0" allowFullScreen 
                   />
                </div>
             </div>
           )}

           {currentLesson.richText && (
             <div className="bg-white dark:bg-slate-800 p-12 lg:p-20 rounded-[4rem] shadow-sm border border-slate-100 dark:border-slate-700">
                <div dangerouslySetInnerHTML={{ __html: currentLesson.richText }} className="text-xl leading-relaxed text-slate-700 dark:text-slate-300 font-medium prose dark:prose-invert max-w-none" />
             </div>
           )}

           {currentLesson.pdfUrl && (
             <div className="w-full h-[800px] bg-slate-100 dark:bg-slate-900 rounded-[3.5rem] overflow-hidden border-[10px] border-white dark:border-slate-800 shadow-xl relative">
                <iframe src={formatDriveLink(currentLesson.pdfUrl)} className="w-full h-full" />
                <a href={currentLesson.pdfUrl} target="_blank" rel="noreferrer" className="absolute bottom-6 right-6 p-4 bg-indigo-600 text-white rounded-2xl"><FileText size={24}/></a>
             </div>
           )}
        </div>
      </main>
    </div>
  );
};

export default Learn;
