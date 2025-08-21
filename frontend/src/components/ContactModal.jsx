import React from 'react';

// Props:
// isOpen: boolean que controla se o modal está visível
// onClose: função para fechar o modal
const ContactModal = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  // Impede que o clique dentro do modal o feche
  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    // Overlay (fundo escuro)
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 transition-opacity duration-300"
    >
      {/* Conteúdo do Modal */}
      <div
        onClick={handleModalContentClick}
        className="bg-[#1e1e1e] text-gray-200 p-8 rounded-lg shadow-2xl w-full max-w-md mx-4 border border-gray-700"
      >
        {/* Cabeçalho */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Diagnóstico Gratuito</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-3xl font-light"
            aria-label="Fechar modal"
          >
            &times;
          </button>
        </div>

        {/* Formulário */}
        <form>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
              Nome
            </label>
            <input
              type="text"
              id="name"
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" // <-- TROQUE A COR DO FOCO AQUI
              placeholder="Seu nome completo"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" // <-- TROQUE A COR DO FOCO AQUI
              placeholder="seu.email@exemplo.com"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">
              Qual seu maior desafio hoje?
            </label>
            <textarea
              id="message"
              rows="4"
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" // <-- TROQUE A COR DO FOCO AQUI
              placeholder="Ex: 'Não consigo atrair clientes qualificados', 'Meu site não gera vendas', etc."
            ></textarea>
          </div>

          {/* Botão de Envio */}
          <button
            type="submit"
            className="w-full p-3 font-bold text-white rounded-md transition-transform transform hover:scale-105
            bg-purple-500 hover:bg-purple-600" // <-- TROQUE AS CORES DO BOTÃO AQUI
          >
            Receber Diagnóstico
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;