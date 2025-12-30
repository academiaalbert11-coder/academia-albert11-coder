
import React, { useState, useRef } from 'react';
import { useApp, ACCOUNTS } from '../store.tsx';
import { PaymentMethod, PaymentStatus } from '../types.ts';
import { 
  Smartphone, Building2, CheckCircle, 
  ArrowLeft, Loader2, ShieldCheck, AlertCircle, FileText, Download, Printer, Send, Copy, MessageCircle
} from 'lucide-react';

const Checkout: React.FC<{ courseId: string; onNavigate: (page: string, params?: any) => void }> = ({ courseId, onNavigate }) => {
  const { courses, user, processPayment } = useApp();
  const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.MPESA);
  const [phone, setPhone] = useState(user?.phone || '');
  const [proof, setProof] = useState('');
  const [step, setStep] = useState<'selection' | 'invoice' | 'success'>('selection');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const invoiceRef = useRef<HTMLDivElement>(null);

  const course = courses.find(c => c.id === courseId);
  if (!course || !user) return <div className="p-20 text-center font-bold">Curso ou Usuário não encontrado.</div>;

  const invoiceId = "FAC-" + Math.floor(100000 + Math.random() * 900000);
  const dateStr = new Date().toLocaleDateString();

  const handleGenerateInvoice = () => {
    if (!phone || phone.length < 8) {
      setError('Insira um telefone válido para a fatura.');
      return;
    }
    setError('');
    setStep('invoice');
  };

  const handleSubmitProof = async () => {
    if (!proof.trim() || proof.length < 5) {
      setError('Por favor, cole o comprovativo ou código da transação.');
      return;
    }

    setLoading(true);
    try {
      const result = await processPayment(courseId, method, phone, proof);
      if (result) {
        setStep('success');
      } else {
        setError('Erro ao registar no sistema. Tente novamente.');
      }
    } catch (e) {
      setError('Erro de conexão ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = () => {
    alert("DICA: Para baixar a factura como PDF, selecione 'Salvar como PDF' na janela de impressão.");
    window.print();
  };

  const copyPaymentDetails = () => {
    const details = method === PaymentMethod.BIM ? ACCOUNTS.BIM : method === PaymentMethod.MPESA ? ACCOUNTS.MPESA : ACCOUNTS.EMOLA;
    navigator.clipboard.writeText(details);
    alert('Dados de pagamento copiados!');
  };

  const sendToWhatsApp = () => {
    const adminPhone = "258844265435";
    const text = `Olá Academia Albert! Enviei o comprovativo do curso: ${course.title}.\n\nAluno: ${user.name}\nCódigo/Mensagem: ${proof}`;
    window.open(`https://wa.me/${adminPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 animate-in fade-in duration-500">
      <div className="no-print">
        <button 
          onClick={() => onNavigate('course-detail', { id: courseId })} 
          className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold mb-8 transition-colors"
        >
          <ArrowLeft size={18}/> Voltar
        </button>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {step === 'selection' && (
          <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-700 max-w-2xl mx-auto w-full">
            <h2 className="text-3xl font-black mb-8 text-center">Dados da Matrícula</h2>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-xs font-bold border border-red-100">
                <AlertCircle size={18}/> {error}
              </div>
            )}

            <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Seu Telefone</label>
                 <input 
                  type="text" 
                  placeholder="84XXXXXXX"
                  className="w-full p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl outline-none font-bold border-2 border-transparent focus:border-indigo-600 transition-all"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                 />
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Meio de Pagamento</label>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: PaymentMethod.MPESA, label: 'M-Pesa', icon: Smartphone, color: 'text-red-600' },
                    { id: PaymentMethod.EMOLA, label: 'E-Mola', icon: Smartphone, color: 'text-orange-500' },
                    { id: PaymentMethod.BIM, label: 'BIM / Transferência', icon: Building2, color: 'text-blue-700' },
                  ].map(opt => (
                    <button 
                      key={opt.id}
                      onClick={() => setMethod(opt.id)}
                      className={`p-5 rounded-2xl border-2 transition-all flex items-center justify-between ${method === opt.id ? 'border-indigo-600 bg-indigo-50/30' : 'border-slate-100 dark:border-slate-700'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm ${opt.color}`}>
                          <opt.icon size={20}/>
                        </div>
                        <div className="font-black">{opt.label}</div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${method === opt.id ? 'border-indigo-600' : 'border-slate-300'}`}>
                        {method === opt.id && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full"/>}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleGenerateInvoice}
                className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl shadow-xl hover:bg-indigo-700 transition-all active:scale-95"
              >
                Gerar Factura Proforma
              </button>
            </div>
          </div>
        )}

        {step === 'invoice' && (
          <div className="space-y-12 animate-in slide-in-from-bottom-8">
            <div ref={invoiceRef} className="print-only bg-white p-12 rounded-[2rem] shadow-2xl border border-slate-200 text-slate-900 max-w-3xl mx-auto">
              <div className="flex justify-between items-start mb-12">
                <div>
                   <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black">A</div>
                      <span className="text-xl font-black tracking-tight text-indigo-600">Academia Albert</span>
                   </div>
                   <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Maputo, Moçambique</p>
                </div>
                <div className="text-right">
                   <h1 className="text-3xl font-black text-slate-300 uppercase leading-none mb-1">Factura Proforma</h1>
                   <p className="font-black text-indigo-600">{invoiceId}</p>
                   <p className="text-xs font-bold text-slate-400">Data: {dateStr}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-12 mb-12">
                <div>
                   <h4 className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Dados do Aluno</h4>
                   <p className="font-bold text-lg">{user.name} {user.lastName}</p>
                   <p className="text-sm font-medium text-slate-500">{user.email}</p>
                   <p className="text-sm font-medium text-slate-500">ID: {user.id.slice(0, 8)}</p>
                </div>
                <div className="text-right">
                   <h4 className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Dados de Pagamento</h4>
                   <p className="font-bold">{method === PaymentMethod.MPESA ? 'Carteira M-Pesa' : method === PaymentMethod.EMOLA ? 'Carteira E-Mola' : 'Banco BIM'}</p>
                   <p className="font-black text-xl text-indigo-600">{method === PaymentMethod.BIM ? ACCOUNTS.BIM : method === PaymentMethod.MPESA ? ACCOUNTS.MPESA : ACCOUNTS.EMOLA}</p>
                   <button onClick={copyPaymentDetails} className="no-print text-[9px] font-black text-indigo-500 uppercase flex items-center gap-1 justify-end mt-1 hover:underline"><Copy size={10}/> Copiar Dados</button>
                </div>
              </div>

              <table className="w-full mb-12">
                 <thead className="border-b-2 border-slate-100">
                    <tr>
                       <th className="py-4 text-left text-[10px] font-black uppercase text-slate-400">Descrição do Curso</th>
                       <th className="py-4 text-right text-[10px] font-black uppercase text-slate-400">Total (MT)</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                    <tr>
                       <td className="py-6">
                          <div className="font-bold text-lg">{course.title}</div>
                          <div className="text-xs text-slate-400">Matrícula em curso profissionalizante.</div>
                       </td>
                       <td className="py-6 text-right font-black text-lg">{(course.promoPrice || course.price).toLocaleString()} MT</td>
                    </tr>
                 </tbody>
              </table>

              <div className="flex justify-end mb-12">
                 <div className="w-64 space-y-3 text-right">
                    <div className="flex justify-between text-2xl font-black border-t-2 border-slate-900 pt-4">
                       <span>TOTAL</span>
                       <span className="text-indigo-600">{(course.promoPrice || course.price).toLocaleString()} MT</span>
                    </div>
                 </div>
              </div>

              <div className="p-8 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-center">
                 <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Confirmação do Acesso</p>
                 <p className="text-xs font-medium text-slate-500 leading-relaxed max-w-sm mx-auto">
                    Após o pagamento, copie o texto do SMS de confirmação recebido e cole no formulário do site para validação imediata.
                 </p>
              </div>
            </div>

            <div className="max-w-3xl mx-auto w-full no-print space-y-8 pb-20">
               <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button onClick={handleDownloadInvoice} className="flex items-center justify-center gap-3 px-8 py-5 bg-slate-900 text-white rounded-2xl font-black hover:scale-105 transition-all shadow-xl">
                    <Download size={20}/> Baixar em PDF
                  </button>
                  <button onClick={() => window.print()} className="flex items-center justify-center gap-3 px-8 py-5 bg-white border-2 border-slate-200 rounded-2xl font-black hover:bg-slate-50 transition-all">
                    <Printer size={20}/> Imprimir
                  </button>
               </div>

               <div className="bg-indigo-600 p-10 rounded-[3.5rem] shadow-2xl text-white space-y-8">
                  <div className="flex items-center gap-5">
                     <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                        <Send size={28}/>
                     </div>
                     <div>
                        <h3 className="text-2xl font-black">Finalizar Matrícula</h3>
                        <p className="text-white/60 text-sm font-medium">Cole o SMS de confirmação ou código aqui.</p>
                     </div>
                  </div>

                  {error && (
                    <div className="p-5 bg-red-500/20 rounded-2xl border border-white/20 text-white text-xs font-bold">
                       {error}
                    </div>
                  )}

                  <textarea 
                    placeholder="Cole aqui o texto do comprovativo..."
                    className="w-full p-6 bg-white/10 rounded-[2rem] outline-none font-bold text-white placeholder:text-white/40 border-2 border-white/10 focus:border-white/40 transition-all min-h-[180px] text-lg"
                    value={proof}
                    onChange={(e) => setProof(e.target.value)}
                  />

                  <button 
                    onClick={handleSubmitProof}
                    disabled={loading}
                    className="w-full py-6 bg-white text-indigo-600 rounded-2xl font-black text-2xl hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50 shadow-xl"
                  >
                    {loading ? <Loader2 className="animate-spin mx-auto"/> : 'Validar Agora'}
                  </button>
               </div>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="py-20 text-center space-y-10 animate-in zoom-in-95 duration-500 max-w-xl mx-auto">
             <div className="w-28 h-28 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-2xl border-4 border-white dark:border-slate-800">
                <CheckCircle size={56}/>
             </div>
             <div className="space-y-4">
                <h2 className="text-4xl font-black text-slate-900 dark:text-white">Matrícula em Processo!</h2>
                <p className="text-slate-500 font-medium text-lg leading-relaxed">O comprovativo foi enviado para o administrador. Você será notificado em breve.</p>
             </div>
             
             <div className="bg-green-50 dark:bg-green-900/10 p-8 rounded-[2.5rem] border border-green-100 dark:border-green-800 space-y-4">
                <p className="text-sm font-bold text-green-700 dark:text-green-400">Deseja acelerar a validação?</p>
                <button 
                  onClick={sendToWhatsApp}
                  className="flex items-center justify-center gap-3 w-full py-5 bg-green-600 text-white rounded-2xl font-black shadow-lg hover:bg-green-700 transition-all"
                >
                  <MessageCircle size={24}/> Enviar Directo via WhatsApp
                </button>
             </div>

             <button 
               onClick={() => onNavigate('dashboard')}
               className="w-full py-6 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl font-black text-xl shadow-2xl hover:bg-black transition-all"
             >
               Ir para Meu Dashboard
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
