
import React, { useState } from 'react';
import { useApp, ACCOUNTS } from '../store';
import { PaymentMethod, PaymentStatus } from '../types';
import { 
  CreditCard, Smartphone, Building2, CheckCircle, 
  ArrowLeft, Loader2, ShieldCheck, AlertCircle 
} from 'lucide-react';

const Checkout: React.FC<{ courseId: string; onNavigate: (page: string) => void }> = ({ courseId, onNavigate }) => {
  const { courses, user, processPayment, confirmPayment } = useApp();
  const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.MPESA);
  const [phone, setPhone] = useState(user?.phone || '');
  const [step, setStep] = useState<'selection' | 'processing' | 'success'>('selection');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const course = courses.find(c => c.id === courseId);
  if (!course) return <div className="p-20 text-center">Curso não encontrado.</div>;

  const handlePay = async () => {
    if (!phone) {
      setError('Por favor, insira o seu número de telefone.');
      return;
    }

    setLoading(true);
    setError('');
    
    const paymentId = await processPayment(courseId, method, phone);
    
    if (paymentId) {
      setStep('processing');
      setTimeout(async () => {
        await confirmPayment(paymentId);
        setStep('success');
        setLoading(false);
      }, 3000);
    } else {
      setError('Erro ao iniciar pagamento. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-in fade-in duration-500">
      <button 
        onClick={() => onNavigate('course-detail')} 
        className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold mb-8 transition-colors"
      >
        <ArrowLeft size={18}/> Voltar para Detalhes
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-8">
           <div className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-700">
              <h2 className="text-2xl font-black mb-6">Resumo da Compra</h2>
              <div className="flex gap-4 items-center p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl mb-6">
                 <img src={course.bannerUrl} className="w-20 h-20 rounded-xl object-cover" />
                 <div>
                    <div className="font-bold text-lg">{course.title}</div>
                    <div className="text-xs text-slate-400 uppercase font-black">{course.category}</div>
                 </div>
              </div>
              <div className="flex justify-between items-center py-4 border-t border-slate-100 dark:border-slate-700">
                 <span className="font-bold text-slate-500">Subtotal</span>
                 <span className="font-black">{course.price.toLocaleString()} MT</span>
              </div>
              <div className="flex justify-between items-center py-4 text-2xl">
                 <span className="font-bold">Total</span>
                 <span className="font-black text-indigo-600">{course.price.toLocaleString()} MT</span>
              </div>
           </div>

           <div className="flex items-center gap-3 p-4 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl text-xs font-bold border border-indigo-100 dark:border-indigo-800">
              <ShieldCheck size={20}/>
              Pagamento 100% seguro processado por Academia Albert Moçambique.
           </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-700 h-fit">
           {step === 'selection' && (
             <div className="space-y-8">
                <h2 className="text-2xl font-black">Método de Pagamento</h2>
                
                {error && (
                  <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 text-xs font-bold border border-red-100">
                    <AlertCircle size={18}/> {error}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4">
                  {[
                    { id: PaymentMethod.MPESA, label: 'M-Pesa', icon: Smartphone, color: 'text-red-600', number: ACCOUNTS.MPESA },
                    { id: PaymentMethod.EMOLA, label: 'E-Mola', icon: Smartphone, color: 'text-orange-500', number: ACCOUNTS.EMOLA },
                    { id: PaymentMethod.BIM, label: 'BIM (Transferência)', icon: Building2, color: 'text-blue-700', number: ACCOUNTS.BIM },
                  ].map(opt => (
                    <button 
                      key={opt.id}
                      onClick={() => setMethod(opt.id)}
                      className={`p-6 rounded-2xl border-2 transition-all flex items-center justify-between group ${method === opt.id ? 'border-indigo-600 bg-indigo-50/30 dark:bg-indigo-900/20' : 'border-slate-100 dark:border-slate-700'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm ${opt.color}`}>
                          <opt.icon size={24}/>
                        </div>
                        <div className="text-left">
                          <div className="font-black">{opt.label}</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{opt.number}</div>
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${method === opt.id ? 'border-indigo-600' : 'border-slate-300'}`}>
                        {method === opt.id && <div className="w-3 h-3 bg-indigo-600 rounded-full"/>}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Número da Conta / Telefone</label>
                   <input 
                    type="text" 
                    placeholder="Ex: 84XXXXXXX"
                    className="w-full p-4 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl outline-none font-bold border-2 border-transparent focus:border-indigo-600 transition-all"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                   />
                </div>

                <button 
                  onClick={handlePay}
                  disabled={loading}
                  className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-xl shadow-xl hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin mx-auto"/> : `Pagar ${course.price.toLocaleString()} MT`}
                </button>
             </div>
           )}

           {step === 'processing' && (
             <div className="py-20 text-center space-y-6">
                <div className="relative w-24 h-24 mx-auto">
                   <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                   <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                   <div className="absolute inset-0 flex items-center justify-center">
                      <Smartphone className="text-indigo-600" size={32}/>
                   </div>
                </div>
                <h2 className="text-2xl font-black">Processando Transação</h2>
                <p className="text-slate-500 font-medium max-w-xs mx-auto">Verifique o seu telemóvel para confirmar o pedido de pagamento via USSD.</p>
             </div>
           )}

           {step === 'success' && (
             <div className="py-20 text-center space-y-8 animate-in zoom-in-95 duration-500">
                <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-xl">
                   <CheckCircle size={48}/>
                </div>
                <div>
                   <h2 className="text-3xl font-black mb-2">Pagamento Sucesso!</h2>
                   <p className="text-slate-500 font-medium">O seu acesso ao curso foi liberado automaticamente.</p>
                </div>
                <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl space-y-2">
                   <div className="text-[10px] font-black uppercase text-slate-400 tracking-widest">A Factura foi gerada</div>
                   <div className="font-bold">Check seu painel de aluno</div>
                </div>
                <button 
                  onClick={() => onNavigate('dashboard')}
                  className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xl shadow-xl hover:bg-black transition-all active:scale-95"
                >
                  Ir para Meu Aprendizado
                </button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
