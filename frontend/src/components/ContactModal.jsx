import React, { useState, useEffect } from 'react';

const ContactModal = ({ isOpen, onClose }) => {
  // Estado para controlar os dados do formulário
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    message: ''
  });

  // Estado para controlar o status do envio
  const [status, setStatus] = useState('');

  // Função para lidar com a mudança nos campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Enviando...');
    
    try {
      const response = await fetch('https://formspree.io/f/myzpryzk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('Mensagem enviada com sucesso!');
        setFormData({ name: '', email: '', whatsapp: '', message: '' }); // Limpa o formulário
        setTimeout(() => {
          onClose(); // Fecha o modal após 2 segundos
          setStatus(''); // Limpa a mensagem de status
        }, 2000);
      } else {
        throw new Error('Falha no envio');
      }
    } catch (error) {
      setStatus('Erro ao enviar. Tente novamente.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center">
      <div className="relative p-4 w-full max-w-md">
        <div className="relative bg-gray-900 rounded-lg shadow">
          <button type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-700 hover:text-white rounded-lg text-sm p-1.5 ml-auto inline-flex items-center" onClick={onClose}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
          </button>
          <div className="py-6 px-6 lg:px-8">
            <h3 className="mb-4 text-xl font-medium text-white">Fale Conosco</h3>
            {status ? (
              <p className="text-center text-white">{status}</p>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-300">Seu nome</label>
                  <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5" placeholder="Seu nome" required />
                </div>
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-300">Seu email</label>
                  <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5" placeholder="seu@email.com" required />
                </div>
                <div>
                  <label htmlFor="whatsapp" className="block mb-2 text-sm font-medium text-gray-300">WhatsApp</label>
                  <input type="tel" name="whatsapp" id="whatsapp" value={formData.whatsapp} onChange={handleChange} className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5" placeholder="(XX) XXXXX-XXXX" />
                </div>
                <div>
                  <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-300">Sua mensagem</label>
                  <textarea id="message" name="message" rows="4" value={formData.message} onChange={handleChange} className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5" placeholder="Deixe sua mensagem..." required></textarea>
                </div>
                <button type="submit" className="w-full text-white bg-purple-700 hover:bg-[purple]-800 focus:ring-4 focus:outline-none focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center" disabled={status === 'Enviando...'}>
                  {status === 'Enviando...' ? 'Enviando...' : 'Enviar Mensagem'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;