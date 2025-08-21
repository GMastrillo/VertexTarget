// src/components/ContactModal.jsx

import React, { useState } from 'react';

const ContactModal = ({ isOpen, onClose }) => {
  // 1. Estados para controlar os dados do formulário e o status do envio
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null); // 'success' ou 'error'

  // 2. Função para lidar com o envio
  const handleSubmit = async (event) => {
    event.preventDefault(); // Impede o recarregamento da página!
    setIsSubmitting(true);
    setSubmissionStatus(null);

    try {
      const response = await fetch('https://formspree.io/f/myzpryzk', { // <-- NÃO ESQUEÇA DE TROCAR
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setSubmissionStatus('success');
        setFormData({ name: '', email: '', whatsapp: '', message: '' }); // Limpa o formulário
        setTimeout(() => {
          onClose(); // Fecha o modal após 2 segundos
          setSubmissionStatus(null); // Reseta o status para a próxima vez que abrir
        }, 2000);
      } else {
        throw new Error('Houve um problema ao enviar o formulário.');
      }
    } catch (error) {
      console.error(error);
      setSubmissionStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para atualizar o estado quando o usuário digita
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md relative border border-purple-500/30">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">&times;</button>
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Vamos conversar?</h2>
        
        {/* Renderiza o formulário ou a mensagem de sucesso */}
        {!submissionStatus ? (
          <>
            <p className="text-center text-gray-400 mb-6">Preencha o formulário e retornaremos o mais breve possível.</p>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campos do formulário agora são controlados pelo estado */}
              <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Seu nome" required className="..."/>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Seu e-mail" required className="..."/>
              <input type="tel" name="whatsapp" value={formData.whatsapp} onChange={handleChange} placeholder="Seu WhatsApp" className="..."/>
              <textarea name="message" value={formData.message} onChange={handleChange} placeholder="Sua mensagem" required rows="4" className="..."></textarea>
              
              <button type="submit" disabled={isSubmitting} className="...">
                {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            {submissionStatus === 'success' && <p className="text-green-400 text-lg">Obrigado! Sua mensagem foi enviada com sucesso. Já fecharemos esta janela.</p>}
            {submissionStatus === 'error' && <p className="text-red-400 text-lg">Ops! Algo deu errado. Por favor, tente novamente.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactModal;