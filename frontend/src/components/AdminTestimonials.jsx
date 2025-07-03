import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Pencil, 
  Trash2,
  Star,
  X,
  Save,
  Loader,
  User
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [filteredTestimonials, setFilteredTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  useEffect(() => {
    filterTestimonials();
  }, [testimonials, searchTerm]);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API}/testimonials`);
      const data = await response.json();
      setTestimonials(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      setLoading(false);
    }
  };

  const filterTestimonials = () => {
    let filtered = testimonials;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(testimonial =>
        testimonial.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.cargo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.conteudo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTestimonials(filtered);
  };

  const openModal = (testimonial = null) => {
    setCurrentTestimonial(testimonial || {
      cliente: '',
      empresa: '',
      cargo: '',
      conteudo: '',
      rating: 5,
      avatar: ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentTestimonial(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setModalLoading(true);

    try {
      const url = currentTestimonial.id 
        ? `${API}/testimonials/${currentTestimonial.id}` 
        : `${API}/testimonials`;
      
      const method = currentTestimonial.id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cliente: currentTestimonial.cliente,
          empresa: currentTestimonial.empresa,
          cargo: currentTestimonial.cargo,
          conteudo: currentTestimonial.conteudo,
          rating: parseInt(currentTestimonial.rating),
          avatar: currentTestimonial.avatar
        }),
      });

      if (response.ok) {
        await fetchTestimonials();
        closeModal();
        alert(currentTestimonial.id ? 'Depoimento atualizado!' : 'Depoimento criado!');
      } else {
        alert('Erro ao salvar depoimento');
      }
    } catch (error) {
      console.error('Error saving testimonial:', error);
      alert('Erro ao conectar com o servidor');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API}/testimonials/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchTestimonials();
        setDeleteConfirm(null);
        alert('Depoimento deletado com sucesso!');
      } else {
        alert('Erro ao deletar depoimento');
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      alert('Erro ao conectar com o servidor');
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
          <p className="text-gray-600">Gerencie os depoimentos dos clientes</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="mr-2 w-4 h-4" />
          Novo Depoimento
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar depoimentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Testimonials Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-6 h-6 animate-spin text-green-600 mr-2" />
            <span className="text-gray-600">Carregando depoimentos...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Cliente</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Empresa</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Avaliação</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Depoimento</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Data</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTestimonials.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">
                      {testimonials.length === 0 ? 'Nenhum depoimento encontrado. Crie seu primeiro depoimento!' : 'Nenhum depoimento corresponde à busca.'}
                    </td>
                  </tr>
                ) : (
                  filteredTestimonials.map((testimonial) => (
                    <tr key={testimonial.id} className="hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          {testimonial.avatar ? (
                            <img
                              src={testimonial.avatar}
                              alt={testimonial.cliente}
                              className="w-10 h-10 rounded-full object-cover mr-3"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div 
                            className={`w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3 ${
                              testimonial.avatar ? 'hidden' : 'flex'
                            }`}
                          >
                            <User className="w-5 h-5 text-gray-500" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{testimonial.cliente}</h3>
                            <p className="text-sm text-gray-600">{testimonial.cargo}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium text-gray-900">{testimonial.empresa}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          {renderStars(testimonial.rating)}
                          <span className="ml-2 text-sm text-gray-600">({testimonial.rating})</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-gray-600 truncate max-w-xs">
                          {testimonial.conteudo}
                        </p>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {new Date(testimonial.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openModal(testimonial)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded"
                            title="Editar"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(testimonial)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Deletar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={closeModal} />
            
            <div className="inline-block w-full max-w-2xl px-6 py-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-gray-900">
                  {currentTestimonial.id ? 'Editar Depoimento' : 'Novo Depoimento'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome do Cliente *
                    </label>
                    <input
                      type="text"
                      required
                      value={currentTestimonial.cliente}
                      onChange={(e) => setCurrentTestimonial(prev => ({ ...prev, cliente: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Nome completo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Empresa *
                    </label>
                    <input
                      type="text"
                      required
                      value={currentTestimonial.empresa}
                      onChange={(e) => setCurrentTestimonial(prev => ({ ...prev, empresa: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Nome da empresa"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cargo *
                    </label>
                    <input
                      type="text"
                      required
                      value={currentTestimonial.cargo}
                      onChange={(e) => setCurrentTestimonial(prev => ({ ...prev, cargo: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Ex: CEO, CTO, Product Manager"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Avaliação *
                    </label>
                    <select
                      value={currentTestimonial.rating}
                      onChange={(e) => setCurrentTestimonial(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5 estrelas)</option>
                      <option value={4}>⭐⭐⭐⭐ (4 estrelas)</option>
                      <option value={3}>⭐⭐⭐ (3 estrelas)</option>
                      <option value={2}>⭐⭐ (2 estrelas)</option>
                      <option value={1}>⭐ (1 estrela)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Depoimento *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={currentTestimonial.conteudo}
                    onChange={(e) => setCurrentTestimonial(prev => ({ ...prev, conteudo: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Depoimento detalhado do cliente..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Avatar (URL da foto)
                  </label>
                  <input
                    type="url"
                    value={currentTestimonial.avatar}
                    onChange={(e) => setCurrentTestimonial(prev => ({ ...prev, avatar: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="https://exemplo.com/foto.jpg"
                  />
                  {currentTestimonial.avatar && (
                    <div className="mt-2">
                      <img
                        src={currentTestimonial.avatar}
                        alt="Preview"
                        className="w-16 h-16 rounded-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={modalLoading}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {modalLoading ? (
                      <Loader className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    {currentTestimonial.id ? 'Atualizar' : 'Criar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setDeleteConfirm(null)} />
            
            <div className="inline-block w-full max-w-md px-6 py-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Confirmar Exclusão
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Tem certeza que deseja deletar o depoimento de "{deleteConfirm.cliente}"? Esta ação não pode ser desfeita.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Deletar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTestimonials;