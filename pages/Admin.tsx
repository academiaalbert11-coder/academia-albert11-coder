
import React, { useState } from 'react';
import { useApp } from '../store';
import { 
  Plus, Edit3, Trash2, Users, Book, Search, FileDown,
  LayoutDashboard, X, Video, FileText, AlignLeft, Shield, CheckCircle, 
  AlertCircle, BarChart3, Settings, ShieldCheck, UserPlus, CreditCard, Image as ImageIcon,
  Globe, Monitor
} from 'lucide-react';
import { Course, Lesson, UserRole, Enrollment, PaymentStatus } from '../types';

const Admin: React.FC = () => {
  const { 
    courses, allUsers, deleteCourse, updateCourse, addCourse, 
    updateUserStatus, toggleAdminRole, deleteUser, exportDataToCSV,
    welcomeVideoUrl, updateWelcomeVideo
  } = useApp();
  
  const [view, setView] = useState<'stats' | 'courses' | 'users' | 'settings'>('stats');
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseModalTab, setCourseModalTab] = useState<'info' | 'lessons'>('info');
  const [newVideoUrl, setNewVideoUrl] = useState(welcomeVideoUrl);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const getEnrollmentCount = (courseId: string) => {
    return allUsers.reduce((acc, u) => acc + (u.enrollments?.filter(e => e.courseId === courseId).length || 0), 0);
  };

  const mostPopularCourses = [...courses].sort((a, b) => getEnrollmentCount(b.id) - getEnrollmentCount(a.id));
  const maxEnrollments = Math.max(...courses.map(c => getEnrollmentCount(c.id)), 1);

  const handleOpenAdd = () => {
    // Removed non-existent paymentStatus from Course object
    setEditingCourse({
      id: 'c' + Date.now(),
      title: '',
      description: '',
      price: 0,
      promoPrice: undefined,
      category: 'Geral',
      author: 'Academia Albert',
      bannerUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80',
      lessons: [],
      quiz: [],
      comments: []
    });
    setCourseModalTab('info');
    setShowCourseModal(true);
  };

  const handleSaveCourse = async () => {
    if (!editingCourse) return;
    if (courses.some(c => c.id === editingCourse.id)) await updateCourse(editingCourse);
    else await addCourse(editingCourse);
    setShowCourseModal(false);
  };

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    await updateWelcomeVideo(newVideoUrl);
    setTimeout(() => setIsSavingSettings(false), 1000);
  };

  const addLesson = () => {
    if (!editingCourse) return;
    const newLesson: Lesson = {
      id: 'l' + Date.now(),
      title: 'Nova Lição',
      duration: '10:00',
      videoUrl: '',
      pdfUrl: '',
      richText: ''
    };
    setEditingCourse({ ...editingCourse, lessons: [...editingCourse.lessons, newLesson] });
  };

  const updateLesson = (id: string, updates: Partial<Lesson>) => {
    if (!editingCourse) return;
    setEditingCourse({
      ...editingCourse,
      lessons: editingCourse.lessons.map(l => l.id === id ? { ...l, ...updates } : l)
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-in fade-in">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-72 space-y-2">
          <div className="p-8 bg-indigo-600 rounded-[2.5rem] text-white shadow-xl mb-6">
            <h1 className="font-black text-2xl">Gestão Albert</h1>
            <p className="text-xs opacity-70 font-bold uppercase tracking-widest mt-1">Moçambique System</p>
          </div>
          {[
            { id: 'stats', label: 'Estatísticas', icon: BarChart3 },
            { id: 'courses', label: 'Cursos', icon: Book },
            { id: 'users', label: 'Alunos & Pagamentos', icon: CreditCard },
            { id: 'settings', label: 'Ajustes do Site', icon: Globe },
          ].map(item => (
            <button key={item.id} onClick={() => setView(item.id as any)} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${view === item.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
              <item.icon size={20}/> {item.label}
            </button>
          ))}
        </aside>

        <main className="flex-grow space-y-6">
          {view === 'stats' && (
            <div className="space-y-8 text-slate-900 dark:text-white">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="text-slate-400 text-[10px] font-black uppercase mb-1">Total de Alunos</div>
                    <div className="text-4xl font-black">{allUsers.length}</div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="text-slate-400 text-[10px] font-black uppercase mb-1">Aguardando Pagamento</div>
                    <div className="text-4xl font-black text-amber-500">
                      {allUsers.reduce((acc, u) => acc + (u.enrollments?.filter(e => e.paymentStatus === PaymentStatus.PENDING).length || 0), 0)}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="text-slate-400 text-[10px] font-black uppercase mb-1">Faturação Bruta</div>
                    <div className="text-4xl font-black text-green-600">
                      {allUsers.reduce((acc, u) => acc + (u.enrollments?.filter(e => e.paymentStatus === PaymentStatus.PAID).reduce((cAcc, enr) => cAcc + (courses.find(c => c.id === enr.courseId)?.price || 0), 0) || 0), 0).toLocaleString()} MT
                    </div>
                  </div>
               </div>

               <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-700">
                  <h3 className="text-xl font-black mb-8">Desempenho por Curso</h3>
                  <div className="space-y-6">
                    {mostPopularCourses.map(course => {
                      const count = getEnrollmentCount(course.id);
                      const percentage = (count / maxEnrollments) * 100;
                      return (
                        <div key={course.id} className="space-y-2">
                          <div className="flex justify-between text-sm font-bold">
                            <span>{course.title}</span>
                            <span className="text-indigo-600 font-black">{count} Alunos</span>
                          </div>
                          <div className="h-4 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
               </div>
            </div>
          )}

          {view === 'settings' && (
            <div className="space-y-8 animate-in slide-in-from-right-4 text-slate-900 dark:text-white">
               <h2 className="text-3xl font-black">Configurações do Site</h2>
               <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm space-y-8">
                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-xl flex items-center justify-center">
                           <Video size={20}/>
                        </div>
                        <div>
                           <h4 className="font-bold">Vídeo de Boas-Vindas</h4>
                           <p className="text-xs text-slate-400">Este vídeo aparece na página inicial para todos os visitantes.</p>
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 ml-2">YouTube URL do Vídeo</label>
                        <div className="flex gap-4">
                           <input 
                              type="text" 
                              className="flex-grow p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl outline-none font-bold border-2 border-transparent focus:border-indigo-600 transition-all text-slate-900 dark:text-white"
                              placeholder="https://www.youtube.com/watch?v=..."
                              value={newVideoUrl}
                              onChange={(e) => setNewVideoUrl(e.target.value)}
                           />
                           <button 
                              onClick={handleSaveSettings}
                              disabled={isSavingSettings}
                              className={`px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg hover:bg-indigo-700 transition-all active:scale-95 flex items-center gap-2 ${isSavingSettings ? 'opacity-50' : ''}`}
                           >
                              {isSavingSettings ? 'Guardando...' : 'Atualizar Vídeo'}
                              {isSavingSettings && <CheckCircle size={18} className="animate-bounce"/>}
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {view === 'users' && (
            <div className="space-y-6 text-slate-900 dark:text-white">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h2 className="text-3xl font-black">Alunos & Pagamentos</h2>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button onClick={exportDataToCSV} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm">
                    <FileDown size={18}/> Relatório CSV
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                  <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
                    <tr>
                      <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Aluno</th>
                      <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Cursos & Pagamento</th>
                      <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Controle</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                    {allUsers.filter(u => u.role === UserRole.STUDENT).map(u => (
                      <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                        <td className="p-6">
                          <div className="font-bold">{u.name} {u.lastName}</div>
                          <div className="text-xs text-slate-400">{u.email}</div>
                        </td>
                        <td className="p-6">
                          <div className="flex flex-wrap gap-2">
                            {u.enrollments?.map(e => {
                              const c = courses.find(course => course.id === e.courseId);
                              return (
                                <div key={e.courseId} className="flex items-center gap-1">
                                   <div className={`px-3 py-1.5 rounded-l-lg text-[9px] font-black uppercase bg-slate-100 dark:bg-slate-900`}>
                                      {c?.title || 'Curso'}
                                   </div>
                                   <button 
                                      onClick={() => updateUserStatus(u.id, e.courseId, e.status)}
                                      className={`px-3 py-1.5 rounded-r-lg text-[9px] font-black uppercase flex items-center gap-2 shadow-sm transition-all active:scale-95 ${
                                        e.paymentStatus === PaymentStatus.PAID ? 'bg-green-100 text-green-700' : 
                                        e.paymentStatus === PaymentStatus.PENDING ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                                      }`}
                                    >
                                      {e.paymentStatus}
                                    </button>
                                </div>
                              );
                            })}
                          </div>
                        </td>
                        <td className="p-6 text-right">
                          <button onClick={() => deleteUser(u.id)} className="p-3 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"><Trash2 size={18}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {view === 'courses' && (
            <div className="space-y-6 text-slate-900 dark:text-white">
               <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-black">Catálogo de Cursos</h2>
                  <button onClick={handleOpenAdd} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl hover:bg-indigo-700 transition-all active:scale-95">
                    Novo Curso
                  </button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {courses.map(course => (
                    <div key={course.id} className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between group">
                       <div className="flex items-center gap-4">
                          <img src={course.bannerUrl} className="w-16 h-16 rounded-2xl object-cover" />
                          <div className="min-w-0 flex-grow">
                             <div className="font-bold group-hover:text-indigo-600 transition-colors truncate">{course.title}</div>
                             <div className="flex items-center gap-2">
                                <span className="text-xs text-indigo-600 font-black uppercase">{getEnrollmentCount(course.id)} Alunos Ativos</span>
                                {course.promoPrice && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded font-black uppercase">Promo</span>}
                             </div>
                          </div>
                       </div>
                       <div className="flex gap-2">
                          <button onClick={() => { setEditingCourse(course); setShowCourseModal(true); setCourseModalTab('info'); }} className="p-3 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all"><Edit3 size={18}/></button>
                          <button onClick={() => deleteCourse(course.id)} className="p-3 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"><Trash2 size={18}/></button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}
        </main>
      </div>

      {showCourseModal && editingCourse && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
           <div className="bg-white dark:bg-slate-800 w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col">
              <div className="p-8 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                 <div className="flex gap-4">
                    <button onClick={() => setCourseModalTab('info')} className={`px-6 py-2 rounded-xl font-black text-sm transition-all ${courseModalTab === 'info' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>Geral & Capa</button>
                    <button onClick={() => setCourseModalTab('lessons')} className={`px-6 py-2 rounded-xl font-black text-sm transition-all ${courseModalTab === 'lessons' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>Aulas Multimédia</button>
                 </div>
                 <button onClick={() => setShowCourseModal(false)} className="text-slate-400 hover:text-red-500 transition-colors"><X size={24}/></button>
              </div>

              <div className="flex-grow overflow-y-auto p-10 space-y-8 no-scrollbar">
                 {courseModalTab === 'info' && (
                   <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                         <div className="space-y-2">
                           <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Título do Curso</label>
                           <input className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl outline-none font-bold text-slate-900 dark:text-white" value={editingCourse.title} onChange={e => setEditingCourse({...editingCourse, title: e.target.value})} />
                         </div>
                         <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Preço Original (MT)</label>
                              <input type="number" className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl outline-none font-bold text-slate-900 dark:text-white" value={editingCourse.price} onChange={e => setEditingCourse({...editingCourse, price: Number(e.target.value)})} />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Preço Promo (MT)</label>
                              <input 
                                type="number" 
                                placeholder="Vazio = Sem promo"
                                className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl outline-none font-bold text-red-600 dark:text-red-400" 
                                value={editingCourse.promoPrice || ''} 
                                onChange={e => setEditingCourse({...editingCourse, promoPrice: e.target.value ? Number(e.target.value) : undefined})} 
                              />
                            </div>
                         </div>
                      </div>

                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-slate-400 ml-2 flex items-center gap-2">
                            <ImageIcon size={14}/> Link da Foto de Capa (URL)
                         </label>
                         <input 
                            placeholder="https://exemplo.com/foto.jpg"
                            className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl outline-none font-bold border-2 border-indigo-100 dark:border-indigo-900/30 text-slate-900 dark:text-white" 
                            value={editingCourse.bannerUrl} 
                            onChange={e => setEditingCourse({...editingCourse, bannerUrl: e.target.value})} 
                         />
                         {editingCourse.bannerUrl && (
                            <img src={editingCourse.bannerUrl} className="mt-2 w-40 h-24 object-cover rounded-xl border border-slate-200" alt="Preview" />
                         )}
                      </div>

                      <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Descrição Completa</label>
                         <textarea className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl outline-none font-bold min-h-[120px] text-slate-900 dark:text-white" value={editingCourse.description} onChange={e => setEditingCourse({...editingCourse, description: e.target.value})} />
                      </div>
                   </div>
                 )}

                 {courseModalTab === 'lessons' && (
                   <div className="space-y-6">
                      <button onClick={addLesson} className="w-full py-5 border-2 border-dashed border-indigo-200 dark:border-indigo-800 rounded-2xl text-indigo-600 font-bold hover:bg-indigo-50 dark:hover:bg-indigo-900/10 flex items-center justify-center gap-2 transition-all">
                         <Plus size={18}/> Nova Lição
                      </button>
                      {editingCourse.lessons.map((lesson, idx) => (
                        <div key={lesson.id} className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 space-y-6 text-slate-900 dark:text-white">
                           <div className="flex items-center justify-between">
                              <span className="px-4 py-1.5 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest">Módulo {idx + 1}</span>
                              <button onClick={() => setEditingCourse({...editingCourse, lessons: editingCourse.lessons.filter(l => l.id !== lesson.id)})} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={18}/></button>
                           </div>
                           <input placeholder="Nome da Aula" className="w-full p-4 bg-white dark:bg-slate-800 rounded-2xl font-bold text-slate-900 dark:text-white" value={lesson.title} onChange={e => updateLesson(lesson.id, {title: e.target.value})} />
                           
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-slate-400 ml-2 flex items-center gap-2"><Video size={12}/> YouTube ID</label>
                                 <input className="w-full p-3 bg-white dark:bg-slate-800 rounded-xl text-sm font-bold text-slate-900 dark:text-white" value={lesson.videoUrl} onChange={e => updateLesson(lesson.id, {videoUrl: e.target.value})} />
                              </div>
                              <div className="space-y-2">
                                 <label className="text-[10px] font-black uppercase text-slate-400 ml-2 flex items-center gap-2"><FileText size={12}/> Link PDF</label>
                                 <input className="w-full p-3 bg-white dark:bg-slate-800 rounded-xl text-sm font-bold text-slate-900 dark:text-white" value={lesson.pdfUrl} onChange={e => updateLesson(lesson.id, {pdfUrl: e.target.value})} />
                              </div>
                           </div>
                           
                           <div className="space-y-2">
                              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 flex items-center gap-2"><AlignLeft size={12}/> Texto de Apoio (HTML)</label>
                              <textarea className="w-full p-5 bg-white dark:bg-slate-800 rounded-2xl text-sm font-medium min-h-[150px] outline-none focus:ring-2 ring-indigo-500 text-slate-900 dark:text-white" value={lesson.richText} onChange={e => updateLesson(lesson.id, {richText: e.target.value})} />
                           </div>
                        </div>
                      ))}
                   </div>
                 )}
              </div>

              <div className="p-8 border-t border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-end gap-4">
                 <button onClick={() => setShowCourseModal(false)} className="px-8 py-3 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-xl font-bold transition-all">Cancelar</button>
                 <button onClick={handleSaveCourse} className="px-10 py-3 bg-indigo-600 text-white rounded-xl font-black shadow-xl hover:bg-indigo-700 transition-all active:scale-95">Guardar Alterações</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
