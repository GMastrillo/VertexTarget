import React, { useState } from 'react';
import './ContactModal.css'; // Crie este arquivo para os estilos

const ContactModal = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você adicionaria a lógica para enviar o formulário
    console.log({ name, email, message });
    alert('Mensagem enviada! (Simulação)');
    onClose(); // Fecha o modal após o envio
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Entre em Contato</h2>
        <button className="modal-close-button" onClick={onClose}>X</button>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nome:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Mensagem:</label>
            <textarea
              id="message"
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit" className="form-submit-button">Enviar</button>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;
