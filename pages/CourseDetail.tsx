
import React, { useState } from 'react';
import { useApp } from '../store';
import { 
  Play, 
  CheckCircle, 
  Lock, 
  Star, 
  ShoppingCart, 
  ShieldCheck, 
  Tag, 
  Send, 
  MessageSquare, 
  Share2, 
  Facebook, 
  Twitter, 
  Link as LinkIcon,
  Check,
  ChevronDown,
  HelpCircle
} from 'lucide-react';
import { Course, Comment, FAQItem } from '../types';

const CourseDetail: React.FC<{ courseId: string; onNavigate: (page: string, params?: any) => void }> = ({ courseId, onNavigate }) => {
  const { courses, user, updateCourse } = useApp();
  const [activeTab, setActiveTab] = useState<'content' | 'instructor' | 'reviews'>('content');
  const [userRating, setUserRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const course = courses.find(c => c.id === courseId);
  if (!course) return <div className="p-20 text-center text-slate-900 dark:text-white">Curso não encontrado.</div>;

  const enrollment = user?.enrollments.find(e => e.courseId === courseId);
  const isEnrolled = enrollment?.status === 'ACTIVE';
  const hasRated = course.comments.some(c => c.userId === user?.id && c.rating);

  const averageRating = course.comments.length > 0 
    ? (course.comments.reduce((acc, c) => acc + (c.rating || 0), 0) / course.comments.filter(c => c.rating).length || 0).toFixed(1)
    : "0";

  const handleEnroll = () => {
    if (!user) {
      onNavigate('login');
      return;
    }
    onNavigate('checkout', { id: course.id });
  };

  const handleSubmitReview = () => {
    if (!user || userRating === 0 || !userComment.trim()) return;

    const newReview: Comment = {
      id: 'rev-' + Date.now(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      text: userComment,
      date: new Date().toLocaleDateString(),
      rating: userRating
    };

    const updatedCourse = {
      ...course,
      comments: [newReview, ...course.comments]
    };

    updateCourse(updatedCourse);
    setUserComment('');
    setUserRating(0);
    alert('Obrigado pela sua avaliação!');
  };

  const shareUrl = window.location.href;
  const shareText = `Confira o curso "${course.title}" na Academia Albert!`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm font-bold text-indigo-600 uppercase">
              <Tag size={14} />
              {course.category}
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white">{course.title}</h1>
            <p className="text-xl text-slate-600 dark:text-slate-400">{course.description}</p>
            
            <div className="flex flex-wrap items-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-900 dark:text-white">A</div>
                <div>
                  <div className="text-slate-400">Instrutor</div>
                  <div className="font-bold text-slate-900 dark:text-white">{course.author}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                <Star className="text-yellow-500" size={18} fill="currentColor" />
                <div>
                  <div className="text-slate-400">Avaliação</div>
                  <div className="font-bold">{averageRating} ({course.comments.filter(c => c.rating).length} alunos)</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-900 dark:text-white">
                <Play className="text-indigo-500" size={18} />
                <div>
                  <div className="text-slate-400">Aulas</div>
                  <div className="font-bold">{course.lessons.length} aulas</div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-b border-slate-200 dark:border-slate-800">
            <div className="flex gap-8">
              {(['content', 'instructor', 'reviews'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-sm font-bold uppercase tracking-widest transition-all relative ${
                    activeTab === tab ? 'text-indigo-600' : 'text-slate-400'
                  }`}
                >
                  {tab === 'content' ? 'Currículo' : tab === 'instructor' ? 'Instrutor' : 'Avaliações'}
                  {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-full" />}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-8 min-h-[400px]">
            {activeTab === 'content' && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Conteúdo do Curso</h3>
                {course.lessons.length > 0 ? (
                  <div className="space-y-3">
                    {course.lessons.map((lesson, idx) => (
                      <div key={lesson.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-slate-700 text-indigo-600 flex items-center justify-center text-sm font-bold">{idx + 1}</div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">{lesson.title}</div>
                            <div className="text-xs text-slate-400">{lesson.duration}</div>
                          </div>
                        </div>
                        {isEnrolled ? (
                          <button onClick={() => onNavigate('learn', { id: course.id })} className="text-indigo-600 hover:text-indigo-700"><Play size={20} /></button>
                        ) : (
                          <Lock size={18} className="text-slate-300" />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 italic">Cronograma sendo atualizado.</p>
                )}
              </div>
            )}
            
            {activeTab === 'instructor' && (
              <div className="p-8 bg-indigo-50 dark:bg-slate-800 rounded-3xl flex flex-col md:flex-row gap-8 items-center md:items-start">
                <img src={`https://ui-avatars.com/api/?name=${course.author}&size=128`} className="w-32 h-32 rounded-3xl object-cover shadow-lg" alt="instructor" />
                <div className="space-y-4 text-center md:text-left">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{course.author}</h3>
                  <p className="text-slate-600 dark:text-slate-400">Especialista com mais de 10 anos de experiência na área. Professor apaixonado por ensinar e transformar carreiras através do conhecimento prático.</p>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-12">
                {isEnrolled && !hasRated ? (
                  <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] border border-indigo-100 dark:border-indigo-900/30 shadow-sm space-y-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Avaliar este curso</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-500">Sua nota:</span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button 
                              key={star}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              onClick={() => setUserRating(star)}
                              className="transition-transform active:scale-90"
                            >
                              <Star 
                                size={24} 
                                className={(hoverRating || userRating) >= star ? 'text-yellow-500 fill-yellow-500' : 'text-slate-300'} 
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <textarea 
                        value={userComment}
                        onChange={(e) => setUserComment(e.target.value)}
                        placeholder="Conte-nos o que achou das aulas, do material e do instrutor..."
                        className="w-full p-4 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 min-h-[120px] transition-all font-bold"
                      />
                      <button 
                        onClick={handleSubmitReview}
                        disabled={userRating === 0 || !userComment.trim()}
                        className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Enviar Avaliação <Send size={18} />
                      </button>
                    </div>
                  </div>
                ) : isEnrolled && hasRated ? (
                  <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl border border-green-100 dark:border-green-800 text-green-700 dark:text-green-400 text-sm font-medium flex items-center gap-3">
                    <CheckCircle size={20} /> Você já avaliou este curso. Obrigado pelo feedback!
                  </div>
                ) : (
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500 text-sm italic flex items-center gap-3">
                    <Lock size={18} /> Você precisa estar matriculado para avaliar este curso.
                  </div>
                )}

                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Avaliações dos Alunos</h3>
                  {course.comments.length > 0 ? (
                    course.comments.map(comment => (
                      <div key={comment.id} className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row gap-6 shadow-sm">
                        <img 
                          src={comment.userAvatar || `https://ui-avatars.com/api/?name=${comment.userName}`} 
                          className="w-12 h-12 rounded-2xl shadow-sm"
                          alt="Avatar"
                        />
                        <div className="space-y-2 flex-grow">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="font-bold text-slate-900 dark:text-white">{comment.userName}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase">{comment.date}</div>
                          </div>
                          {comment.rating && (
                            <div className="flex gap-0.5 text-yellow-500">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} fill={i < comment.rating! ? "currentColor" : "none"} className={i < comment.rating! ? "" : "text-slate-300"} />
                              ))}
                            </div>
                          )}
                          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{comment.text}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-slate-400">
                      <MessageSquare size={40} className="mx-auto mb-4 opacity-20" />
                      Ainda não há avaliações para este curso. Seja o primeiro!
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700 p-2">
              <div className="relative h-52 rounded-[2rem] overflow-hidden mb-6">
                <img src={course.bannerUrl} alt="Banner" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                    <Play fill="white" className="text-white ml-1" />
                  </div>
                </div>
                {course.promoPrice && (
                  <div className="absolute top-6 right-6 bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl ring-4 ring-white/10">Promoção Ativa</div>
                )}
              </div>
              
              <div className="px-6 pb-8 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <div className="text-3xl font-extrabold text-indigo-600">
                      {(course.promoPrice || course.price).toLocaleString()} MT
                    </div>
                    {course.promoPrice && (
                      <div className="text-sm text-slate-400 font-bold mt-1">
                        De <span className="line-through">{course.price.toLocaleString()} MT</span>
                      </div>
                    )}
                  </div>
                </div>

                {isEnrolled ? (
                  <button 
                    onClick={() => onNavigate('learn', { id: course.id })}
                    className="w-full py-5 bg-green-500 text-white rounded-2xl font-bold text-lg shadow-xl hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                  >
                    Continuar Aprendendo <Play size={20} />
                  </button>
                ) : (
                  <button 
                    onClick={handleEnroll}
                    className="w-full py-5 gradient-primary text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-indigo-500/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                  >
                    Matricular Agora <ShoppingCart size={20} />
                  </button>
                )}

                <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                  <h4 className="font-bold text-sm uppercase text-slate-400 flex items-center gap-2">
                    <Share2 size={14} /> Compartilhe este curso:
                  </h4>
                  <div className="grid grid-cols-4 gap-2">
                    <a 
                      href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-xl flex items-center justify-center hover:bg-green-600 hover:text-white transition-all shadow-sm"
                      title="WhatsApp"
                    >
                      <MessageSquare size={20} />
                    </a>
                    <a 
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                      title="Facebook"
                    >
                      <Facebook size={20} />
                    </a>
                    <a 
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-sky-50 dark:bg-sky-900/20 text-sky-500 rounded-xl flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all shadow-sm"
                      title="Twitter"
                    >
                      <Twitter size={20} />
                    </a>
                    <button 
                      onClick={copyToClipboard}
                      className={`p-3 rounded-xl flex items-center justify-center transition-all shadow-sm ${
                        copied 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-300 hover:bg-indigo-600 hover:text-white'
                      }`}
                      title="Copiar Link"
                    >
                      {copied ? <Check size={20} /> : <LinkIcon size={20} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
