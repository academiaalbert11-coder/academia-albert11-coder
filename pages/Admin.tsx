
import React, { useState } from 'react';
import { useApp } from '../store.tsx';
import { 
  Users, Book, FileDown,
  CheckCircle, 
  BarChart3, Globe, Clock, MessageSquare, Copy, RefreshCw, Trash2
} from 'lucide-react';
import { PaymentStatus } from '../types.ts';

const Admin: React.FC = () => {
  const { 
    courses, allUsers, updateUserStatus, deleteUser, exportDataToCSV, refreshData
  } = useApp();
  
  const [view, setView] = useState<'stats' | 'courses' | 'users' | 'settings'>('users');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Estados para aprovação de pagamento
  const [showApproveModal, setShowApproveModal] = useState<{userId: string, courseId: string} | null>(null);
  const [expireDays, setExpireDays] = useState(30);

  const handleApprove = async () => {
    if (!showApproveModal) return;
    await updateUserStatus(showApproveModal.userId, showApproveModal.courseId, PaymentStatus.PAID, expireDays);
    setShowApproveModal(null);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setIsRefreshing(false);
  };

  const copyProof = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    alert('Comprovativo copiado!');
  };

  // Filtrar usuários que tenham QUALQUER inscrição pendente
  const pendingUsers = allUsers.filter(u => u.enrollments?.some(e => e.paymentStatus === PaymentStatus.PENDING));

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-in fade-in">
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="w-full lg:w-72 space-y-2 no-print">
          <div className="p-8 bg-indigo-600 rounded-[2.5rem] text-white shadow-xl mb-6">
            <h1 className="font-black text-2xl leading-none mb-1">Albert Admin</h1>
            <p className="text-[10px] opacity-70 font-bold uppercase tracking-widest">Painel de Controlo</p>
          </div>
          {[
            { id: 'stats', label: 'Estatísticas', icon: BarChart3 },
            { id: 'users', label: 'Transações', icon: Users },
            { id: 'courses', label: 'Gestão Cursos', icon: Book },
            { id: 'settings', label: 'Ajustes Site', icon: Globe },
          ].map(item => (
            <button key={item.id} onClick={() => setView(item.id as any)} className={`w-full flex items-center gap-3 p-4 rounded-2xl font-bold transition-all ${view === item.id ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
              <item.icon size={20}/> {item.label}
            </button>
          ))}
        </aside>

        <main className="flex-grow space-y-6">
          {view === 'users' && (
            <div className="space-y-6 text-slate-900 dark:text-white">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                   <h2 className="text-3xl font-black">Pendentes de Validação</h2>
                   <button onClick={handleRefresh} className={`p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-indigo-600 hover:scale-110 transition-all ${isRefreshing ? 'animate-spin' : ''}`}>
                      <RefreshCw size={20}/>
                   </button>
                </div>
                <button onClick={exportDataToCSV} className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm">
                  <FileDown size={18}/> Relatório Geral
                </button>
              </div>

              <div className="grid gap-6">
                {pendingUsers.length > 0 ? (
                  pendingUsers.map(u => (
                    u.enrollments?.filter(e => e.paymentStatus === PaymentStatus.PENDING).map(e => {
                      const c = courses.find(course => course.id === e.courseId);
                      return (
                        <div key={u.id + e.courseId} className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] border-2 border-slate-100 dark:border-slate-700 shadow-xl flex flex-col space-y-6 animate-in slide-in-from-right-4">
                           <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                              <div className="flex items-center gap-6">
                                 <img src={u.avatar || `https://ui-avatars.com/api/?name=${u.name}&background=6366f1&color=fff`} className="w-16 h-16 rounded-2xl object-cover" />
                                 <div className="space-y-1">
                                    <div className="font-black text-xl">{u.name} {u.lastName}</div>
                                    <div className="text-sm font-bold text-slate-400">{u.email} • {u.phone || 'S/ Tel'}</div>
                                    <div className="flex gap-2 mt-1">
                                      <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                        {c?.title || 'Curso Desconhecido'}
                                      </span>
                                      <span className="px-3 py-1 bg-amber-100 text-amber-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                        Pendente
                                      </span>
                                    </div>
                                 </div>
                              </div>
                              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                                 <button 
                                   onClick={() => setShowApproveModal({userId: u.id, courseId: e.courseId})}
                                   className="px-8 py-4 bg-green-500 text-white rounded-2xl font-black text-sm shadow-xl hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                                 >
                                    <CheckCircle size={18}/> Aprovar Acesso
                                 </button>
                                 <button onClick={() => deleteUser(u.id)} className="p-4 text-red-500 hover:bg-red-50 rounded-2xl transition-all" title="Eliminar Aluno">
                                    <Trash2 size={20}/>
                                 </button>
                              </div>
                           </div>

                           <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border-2 border-indigo-100 dark:border-indigo-900/20">
                              <div className="flex items-center justify-between mb-3">
                                 <h4 className="text-[10px] font-black uppercase text-indigo-500 flex items-center gap-2 tracking-widest">
                                    <MessageSquare size={14}/> Texto do Comprovativo Enviado:
                                 </h4>
                                 <button 
                                    onClick={() => copyProof(e.proofMessage || '')}
                                    className="p-2 hover:bg-white rounded-lg text-slate-400 hover:text-indigo-600 transition-all"
                                 >
                                    <Copy size={16}/>
                                 </button>
                              </div>
                              <div className="text-slate-800 dark:text-slate-200 font-bold bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 italic break-words">
                                 {e.proofMessage || 'ALUNO NÃO ENVIOU MENSAGEM DE COMPROVATIVO.'}
                              </div>
                              <div className="mt-3 flex justify-between items-center text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                                 <span>Data do Pedido: {new Date(e.enrollmentDate).toLocaleString()}</span>
                                 <span>Factura Proforma Gerada</span>
                              </div>
                           </div>
                        </div>
                      )
                    })
                  ))
                ) : (
                  <div className="p-20 text-center bg-slate-50 dark:bg-slate-800/50 rounded-[4rem] border-2 border-dashed border-slate-200">
                     <Clock size={48} className="mx-auto text-slate-300 mb-4"/>
                     <h3 className="text-2xl font-black">Tudo em dia!</h3>
                     <p className="text-slate-500 font-medium max-w-xs mx-auto">Não há novos pedidos de acesso aguardando validação no momento.</p>
                     <button onClick={handleRefresh} className="mt-8 px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg">Sincronizar Banco</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {view === 'stats' && (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: 'Total Alunos', val: allUsers.length, color: 'bg-blue-600' },
                  { label: 'Cursos Ativos', val: courses.length, color: 'bg-indigo-600' },
                  { label: 'Matrículas Pendentes', val: pendingUsers.length, color: 'bg-amber-600' },
                ].map(s => (
                  <div key={s.label} className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-700">
                     <div className="text-4xl font-black mb-2">{s.val}</div>
                     <div className="text-xs font-black uppercase text-slate-400 tracking-widest">{s.label}</div>
                  </div>
                ))}
             </div>
          )}
        </main>
      </div>

      {showApproveModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
           <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-[3.5rem] shadow-2xl p-12 space-y-8">
              <div className="text-center space-y-3">
                 <div className="w-20 h-20 bg-green-100 text-green-600 rounded-[2rem] flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={40}/>
                 </div>
                 <h2 className="text-3xl font-black">Aprovar Matrícula</h2>
                 <p className="text-slate-500 font-medium">O aluno terá acesso por quanto tempo?</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 {[
                   { label: '30 Dias', val: 30 },
                   { label: '90 Dias', val: 90 },
                   { label: '1 Ano', val: 365 },
                   { label: 'Vitalício', val: 0 },
                 ].map(opt => (
                   <button 
                    key={opt.val}
                    onClick={() => setExpireDays(opt.val)}
                    className={`p-5 rounded-2xl font-black text-sm transition-all border-2 ${expireDays === opt.val ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 dark:border-slate-700'}`}
                   >
                    {opt.label}
                   </button>
                 ))}
              </div>

              <div className="space-y-4 pt-4">
                 <button 
                  onClick={handleApprove}
                  className="w-full py-5 bg-green-500 text-white rounded-2xl font-black shadow-xl hover:bg-green-600 transition-all text-lg"
                 >
                  Confirmar Pagamento
                 </button>
                 <button 
                  onClick={() => setShowApproveModal(null)}
                  className="w-full py-5 bg-slate-100 dark:bg-slate-700 text-slate-500 rounded-2xl font-black"
                 >
                  Cancelar
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
