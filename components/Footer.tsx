
import React from 'react';
import { Facebook, Instagram, Twitter, MessageCircle, MapPin, Phone, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center text-white font-bold mr-2">A</div>
            <span className="text-xl font-bold text-white">Academia Albert</span>
          </div>
          <p className="text-slate-400 mb-6">Desenvolvendo Futuro em Moçambique. Construindo Oportunidades em todo o território nacional e para o Mundo.</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-indigo-400 transition-colors" aria-label="Facebook"><Facebook size={20} /></a>
            <a href="#" className="hover:text-pink-400 transition-colors" aria-label="Instagram"><Instagram size={20} /></a>
            <a href="#" className="hover:text-blue-400 transition-colors" aria-label="Twitter"><Twitter size={20} /></a>
            <a 
              href="https://wa.me/258844265435" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-green-400 transition-colors"
              aria-label="WhatsApp"
            >
              <MessageCircle size={20} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Cursos Populares</h4>
          <ul className="space-y-4">
            <li><a href="#" className="hover:text-white transition-colors">Contabilidade Prática</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Preparação para Admissão</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Inglês para Negócios</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Marketing Digital</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Links Úteis</h4>
          <ul className="space-y-4">
            <li><a href="#" className="hover:text-white transition-colors">Termos e Condições</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Política de Privacidade</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Certificados</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Área Administrativa</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Contato Oficial</h4>
          <ul className="space-y-4">
            <li className="flex items-center space-x-3">
              <MapPin size={18} className="text-blue-400" />
              <span>Moçambique</span>
            </li>
            <li className="flex items-center space-x-3">
              <Phone size={18} className="text-blue-400" />
              <span>+258 864118493 / 844265435</span>
            </li>
            <li className="flex items-center space-x-3">
              <Mail size={18} className="text-blue-400" />
              <span className="text-sm">academiaalbert11@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-slate-800 text-center text-sm text-slate-500">
        © 2024 Academia Albert - Moçambique. Todos os direitos reservados.
      </div>
    </footer>
  );
};

export default Footer;
