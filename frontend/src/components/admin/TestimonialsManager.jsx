/**
 * Testimonials Manager - Componente para gerenciamento completo dos depoimentos
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useAuth } from '../../contexts/AuthContext';
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../../services/testimonialsService';
import { useToast } from '../../hooks/use-toast';

const TestimonialsManager = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  
  // Estados principais
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Estados do formulário
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    company: '',
    avatar: '',
    quote: '',
    rating: 5,
    project: ''
  });

  // Carregar depoimentos na inicialização
  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const data = await getTestimonials();
      setTestimonials(data);
    } catch (error) {
      toast({
        title: "Erro ao carregar depoimentos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      company: '',
      avatar: '',
      quote: '',
      rating: 5,
      project: ''
    });
    setSelectedTestimonial(null);
  };

  const openCreateForm = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const openEditForm = (testimonial) => {
    setFormData({
      name: testimonial.name || '',
      position: testimonial.position || '',
      company: testimonial.company || '',
      avatar: testimonial.avatar || '',
      quote: testimonial.quote || '',
      rating: testimonial.rating || 5,
      project: testimonial.project || ''
    });
    setSelectedTestimonial(testimonial);
    setIsFormOpen(true);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const required = ['name', 'position', 'company', 'avatar', 'quote', 'project'];
    
    for (const field of required) {
      if (!formData[field]?.trim()) {
        toast({
          title: "Campo obrigatório",
          description: `O campo '${field}' é obrigatório.`,
          variant: "destructive",
        });
        return false;
      }
    }

    // Validar rating
    if (formData.rating < 1 || formData.rating > 5) {
      toast({
        title: "Avaliação inválida",
        description: "A avaliação deve ser entre 1 e 5 estrelas.",
        variant: "destructive",
      });
      return false;
    }

    // Validar tamanho da citação
    if (formData.quote.trim().length < 10) {
      toast({
        title: "Citação muito curta",
        description: "A citação deve ter pelo menos 10 caracteres.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      // Preparar dados para envio
      const testimonialData = {
        name: formData.name.trim(),
        position: formData.position.trim(),
        company: formData.company.trim(),
        avatar: formData.avatar.trim(),
        quote: formData.quote.trim(),
        rating: parseInt(formData.rating),
        project: formData.project.trim()
      };

      if (selectedTestimonial) {
        // Atualizar depoimento existente
        await updateTestimonial(selectedTestimonial.id, testimonialData, token);
        toast({
          title: "Depoimento atualizado",
          description: "O depoimento foi atualizado com sucesso!",
        });
      } else {
        // Criar novo depoimento
        await createTestimonial(testimonialData, token);
        toast({
          title: "Depoimento criado",
          description: "O depoimento foi criado com sucesso!",
        });
      }

      setIsFormOpen(false);
      resetForm();
      loadTestimonials();

    } catch (error) {
      toast({
        title: "Erro ao salvar depoimento",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (testimonial) => {
    try {
      setIsDeleting(true);
      await deleteTestimonial(testimonial.id, token);
      
      toast({
        title: "Depoimento deletado",
        description: "O depoimento foi removido com sucesso!",
      });
      
      loadTestimonials();
    } catch (error) {
      toast({
        title: "Erro ao deletar depoimento",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span key={index} className={index < rating ? "text-yellow-400" : "text-gray-600"}>
        ⭐
      </span>
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Gerenciar Depoimentos</h2>
          <p className="text-gray-400">Administre os depoimentos de clientes</p>
        </div>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateForm} className="bg-indigo-600 hover:bg-indigo-700">
              ➕ Novo Depoimento
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">
                {selectedTestimonial ? 'Editar Depoimento' : 'Novo Depoimento'}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Preencha as informações do depoimento do cliente
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Nome do Cliente *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="João Silva"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              {/* Cargo */}
              <div className="space-y-2">
                <Label htmlFor="position" className="text-white">Cargo *</Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  placeholder="CEO"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              {/* Empresa */}
              <div className="space-y-2">
                <Label htmlFor="company" className="text-white">Empresa *</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  placeholder="TechCorp Ltd."
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              {/* Projeto */}
              <div className="space-y-2">
                <Label htmlFor="project" className="text-white">Projeto *</Label>
                <Input
                  id="project"
                  value={formData.project}
                  onChange={(e) => handleInputChange('project', e.target.value)}
                  placeholder="E-commerce Platform"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              {/* Avatar */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="avatar" className="text-white">URL do Avatar *</Label>
                <Input
                  id="avatar"
                  value={formData.avatar}
                  onChange={(e) => handleInputChange('avatar', e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              {/* Avaliação */}
              <div className="space-y-2">
                <Label htmlFor="rating" className="text-white">Avaliação *</Label>
                <Select value={formData.rating.toString()} onValueChange={(value) => handleInputChange('rating', parseInt(value))}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Selecione a avaliação" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="1">1 ⭐</SelectItem>
                    <SelectItem value="2">2 ⭐⭐</SelectItem>
                    <SelectItem value="3">3 ⭐⭐⭐</SelectItem>
                    <SelectItem value="4">4 ⭐⭐⭐⭐</SelectItem>
                    <SelectItem value="5">5 ⭐⭐⭐⭐⭐</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Preview da Avaliação */}
              <div className="space-y-2">
                <Label className="text-white">Preview da Avaliação</Label>
                <div className="flex items-center space-x-2 p-3 bg-gray-800 rounded-lg border border-gray-700">
                  {renderStars(formData.rating)}
                  <span className="text-gray-300 text-sm">({formData.rating}/5)</span>
                </div>
              </div>

              {/* Citação */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="quote" className="text-white">Depoimento *</Label>
                <Textarea
                  id="quote"
                  value={formData.quote}
                  onChange={(e) => handleInputChange('quote', e.target.value)}
                  placeholder="A VERTEX TARGET transformou completamente nosso negócio..."
                  className="bg-gray-800 border-gray-700 text-white resize-none"
                  rows={4}
                />
                <p className="text-gray-500 text-xs">
                  {formData.quote.length}/1000 caracteres
                </p>
              </div>

              {/* Preview do Depoimento */}
              {formData.name && formData.quote && (
                <div className="md:col-span-2 space-y-2">
                  <Label className="text-white">Preview do Depoimento</Label>
                  <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={formData.avatar} alt={formData.name} />
                        <AvatarFallback className="bg-indigo-600 text-white">
                          {formData.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {renderStars(formData.rating)}
                        </div>
                        <p className="text-gray-300 text-sm mb-3 italic">
                          "{formData.quote}"
                        </p>
                        <div>
                          <p className="text-white font-semibold">{formData.name}</p>
                          <p className="text-gray-400 text-sm">
                            {formData.position} em {formData.company}
                          </p>
                          {formData.project && (
                            <Badge variant="outline" className="mt-1 text-xs">
                              {formData.project}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsFormOpen(false)} className="border-gray-700 text-gray-300">
                Cancelar
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={loading}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                {loading ? 'Salvando...' : (selectedTestimonial ? 'Atualizar' : 'Criar')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabela de Depoimentos */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Depoimentos de Clientes</CardTitle>
          <CardDescription className="text-gray-400">
            {testimonials.length} depoimento(s) cadastrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && testimonials.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">Carregando depoimentos...</p>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">Nenhum depoimento encontrado</p>
              <p className="text-gray-500 text-sm">Clique em "Novo Depoimento" para adicionar o primeiro</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Cliente</TableHead>
                  <TableHead className="text-gray-300">Avaliação</TableHead>
                  <TableHead className="text-gray-300">Projeto</TableHead>
                  <TableHead className="text-gray-300">Depoimento</TableHead>
                  <TableHead className="text-gray-300">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.map((testimonial) => (
                  <TableRow key={testimonial.id} className="border-gray-700">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                          <AvatarFallback className="bg-indigo-600 text-white">
                            {testimonial.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-white font-medium">{testimonial.name}</p>
                          <p className="text-gray-400 text-sm">
                            {testimonial.position} em {testimonial.company}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {renderStars(testimonial.rating)}
                        <span className="text-gray-400 text-sm ml-2">
                          ({testimonial.rating}/5)
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{testimonial.project}</Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-gray-300 truncate max-w-xs">
                        "{testimonial.quote}"
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditForm(testimonial)}
                          className="border-gray-700 text-gray-300 hover:bg-indigo-600"
                        >
                          ✏️
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-700 text-red-400 hover:bg-red-600"
                            >
                              🗑️
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-gray-900 border-gray-700">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-white">
                                Confirmar exclusão
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-gray-400">
                                Tem certeza de que deseja excluir o depoimento de "{testimonial.name}"? 
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-gray-700 text-gray-300">
                                Cancelar
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(testimonial)}
                                disabled={isDeleting}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                {isDeleting ? 'Excluindo...' : 'Excluir'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TestimonialsManager;