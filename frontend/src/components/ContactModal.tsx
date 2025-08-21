// src/components/ContactModal.tsx
import React from 'react';

// Tipamos as props que o componente vai receber
interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null; // Não renderiza nada se não estiver aberto
  }

  return (
    // Fundo semi-transparente
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      {/* Container do Modal */}
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md relative">
        {/* Botão de Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          &times; {/* Isso é um 'X' para fechar */}
        </button>

        <h3 className="text-2xl font-bold mb-4 text-gray-800">Diagnóstico Gratuito</h3>
        <p className="mb-6 text-gray-600">
          Preencha seus dados e nossa equipe entrará em contato para agendar uma conversa.
        </p>

        {/* Formulário - **IMPORTANTE: Substitua o 'action' pelo seu endpoint do Formspree ou outro serviço** */}
        <form action="https://formspree.io/f/SEU_CODIGO_AQUI" method="POST">
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 mb-2">Nome</label>
            <input type="text" id="name" name="name" className="w-full p-2 border border-gray-300 rounded" required />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">E-mail</label>
            <input type="email" id="email" name="email" className="w-full p-2 border border-gray-300 rounded" required />
          </div>
          <div className="mb-6">
            <label htmlFor="whatsapp" className="block text-gray-700 mb-2">WhatsApp (com DDD)</label>
            <input type="tel" id="whatsapp" name="whatsapp" className="w-full p-2 border border-gray-300 rounded" required />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded hover:bg-blue-700">
            Solicitar Contato
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;
