// src/components/ContactModal.jsx

import React from 'react';

const ContactModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    // Overlay (fundo escuro)
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm"
    >
      {/* Conteúdo do Modal */}
      <div
        onClick={(e) => e.stopPropagation()} // Impede que o clique dentro do modal o feche
        className="relative w-full max-w-md p-8 mx-4 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl text-white transform transition-all duration-300 ease-in-out"
      >
        {/* Botão de Fechar (X) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-2">Vamos começar seu projeto?</h2>
        <p className="text-gray-400 mb-6">Preencha o formulário e retornaremos em breve.</p>

        {/* ----- FORMULÁRIO COM A AÇÃO PARA O FORMSPREE ----- */}
        // Versão CORRETA (com action e method)
<form  action="https://formspree.io/f/myzpryzk" 
  method="POST" 
  className="space-y-6">
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Nome</label>
            <input
              type="text"
              id="name"
              name="name" // O atributo 'name' é crucial para o Formspree
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500" // <-- TROQUE a cor do 'focus:ring' se quiser
              placeholder="Seu nome completo"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">E-mail</label>
            <input
              type="email"
              id="email"
              name="email" // O atributo 'name' é crucial
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500" // <-- TROQUE a cor do 'focus:ring' se quiser
              placeholder="seu@email.com"
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Mensagem</label>
            <textarea
              id="message"
              name="message" // O atributo 'name' é crucial
              rows="4"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500" // <-- TROQUE a cor do 'focus:ring' se quiser
              placeholder="Fale um pouco sobre seu projeto..."
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-md transition-colors duration-300" // <-- TROQUE as cores do botão para as da sua marca
          >
            Enviar Mensagem
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;