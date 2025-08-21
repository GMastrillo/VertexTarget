// src/components/ContactModal.jsx

import React from 'react';

const ContactModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md relative border border-purple-500/30">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">&times;</button>
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Vamos conversar?</h2>
        <p className="text-center text-gray-400 mb-6">Preencha o formulário e retornaremos o mais breve possível.</p>
        
        <form 
          action="https://formspree.io/f/myzpryzk" // <-- NÃO ESQUEÇA DE TROCAR
          method="POST" 
          className="space-y-6"
        >
          {/* Campo Nome */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">Nome</label>
            <input type="text" name="name" id="name" required className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-purple-500 focus:border-purple-500"/>
          </div>

          {/* Campo E-mail */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">E-mail</label>
            <input type="email" name="email" id="email" required className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-purple-500 focus:border-purple-500"/>
          </div>

          {/* --- NOVO CAMPO DE WHATSAPP --- */}
          <div>
            <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-300">WhatsApp</label>
            <input 
              type="tel" // Usar "tel" é bom para semântica e teclados mobile
              name="whatsapp" 
              id="whatsapp" 
              placeholder="(XX) XXXXX-XXXX"
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          {/* --- FIM DO NOVO CAMPO --- */}

          {/* Campo Mensagem */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-300">Sua mensagem</label>
            <textarea name="message" id="message" rows="4" required className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-purple-500 focus:border-purple-500"></textarea>
          </div>

          {/* Botão de Envio */}
          <button 
            type="submit" 
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md font-semibold hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 transition-colors duration-300"
          >
            Enviar Mensagem
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;