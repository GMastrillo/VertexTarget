import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Loader2, X, Plus } from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export function ProjectModal({ 
  isOpen, 
  onClose, 
  project = null, // null para criar, objeto para editar
  onSuccess 
}) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    image_url: '',
    technologies: [],
    project_url: '',
    github_url: ''
  });
  
  const [currentTech, setCurrentTech] = useState('');
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const isEditing = !!project;

  // Reset form when modal opens/closes or project changes
  useEffect(() => {
    if (isOpen) {
      if (project) {
        // Editing existing project
        setFormData({
          title: project.title || '',
          description: project.description || '',
          category: project.category || '',
          image_url: project.image_url || '',
          technologies: project.technologies || [],
          project_url: project.project_url || '',
          github_url: project.github_url || ''
        });
      } else {
        // Creating new project
        setFormData({
          title: '',
          description: '',
          category: '',
          image_url: '',
          technologies: [],
          project_url: '',
          github_url: ''
        });
      }
      setErrors({});
      setCurrentTech('');
    }
  }, [isOpen, project]);

  // Handle form field changes
  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  // Add technology to the list
  const addTechnology = () => {
    const tech = currentTech.trim();
    if (tech && !formData.technologies.includes(tech)) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, tech]
      }));
      setCurrentTech('');
    }
  };

  // Remove technology from the list
  const removeTechnology = (techToRemove) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(tech => tech !== techToRemove)
    }));
  };

  // Handle Enter key for technology input
  const handleTechKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTechnology();
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Categoria é obrigatória';
    }

    if (!formData.image_url.trim()) {
      newErrors.image_url = 'URL da imagem é obrigatória';
    } else {
      // Basic URL validation
      try {
        new URL(formData.image_url);
      } catch {
        newErrors.image_url = 'URL da imagem deve ser válida';
      }
    }

    if (formData.technologies.length === 0) {
      newErrors.technologies = 'Adicione pelo menos uma tecnologia';
    }

    // Optional URL validations
    if (formData.project_url && formData.project_url.trim()) {
      try {
        new URL(formData.project_url);
      } catch {
        newErrors.project_url = 'URL do projeto deve ser válida';
      }
    }

    if (formData.github_url && formData.github_url.trim()) {
      try {
        new URL(formData.github_url);
      } catch {
        newErrors.github_url = 'URL do GitHub deve ser válida';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      // Prepare data for API
      const apiData = {
        ...formData,
        project_url: formData.project_url.trim() || null,
        github_url: formData.github_url.trim() || null
      };

      let response;
      if (isEditing) {
        // Update existing project
        response = await axios.put(`${API}/portfolio/${project.id}`, apiData);
      } else {
        // Create new project
        response = await axios.post(`${API}/portfolio`, apiData);
      }

      // Call success callback with the updated/created project
      onSuccess(response.data, isEditing ? 'updated' : 'created');
      
      // Close modal
      onClose();
      
    } catch (error) {
      console.error('Error saving project:', error);
      
      if (error.response?.data?.detail) {
        setErrors({ submit: error.response.data.detail });
      } else {
        setErrors({ 
          submit: `Erro ao ${isEditing ? 'atualizar' : 'criar'} projeto. Tente novamente.` 
        });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Projeto' : 'Adicionar Novo Projeto'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Atualize as informações do projeto abaixo.' 
              : 'Preencha as informações do novo projeto abaixo.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Ex: E-commerce Platform"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Descreva o projeto, suas funcionalidades e objetivos..."
              rows={3}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Categoria *</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              placeholder="Ex: Web Development, Mobile App, AI/ML"
              className={errors.category ? 'border-red-500' : ''}
            />
            {errors.category && (
              <p className="text-sm text-red-500">{errors.category}</p>
            )}
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="image_url">URL da Imagem *</Label>
            <Input
              id="image_url"
              type="url"
              value={formData.image_url}
              onChange={(e) => handleChange('image_url', e.target.value)}
              placeholder="https://example.com/image.jpg"
              className={errors.image_url ? 'border-red-500' : ''}
            />
            {errors.image_url && (
              <p className="text-sm text-red-500">{errors.image_url}</p>
            )}
            {formData.image_url && (
              <div className="mt-2">
                <img 
                  src={formData.image_url} 
                  alt="Preview" 
                  className="w-24 h-24 object-cover rounded-lg border"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Technologies */}
          <div className="space-y-2">
            <Label htmlFor="technologies">Tecnologias *</Label>
            <div className="flex gap-2">
              <Input
                id="technologies"
                value={currentTech}
                onChange={(e) => setCurrentTech(e.target.value)}
                onKeyPress={handleTechKeyPress}
                placeholder="Digite uma tecnologia e pressione Enter"
                className="flex-1"
              />
              <Button 
                type="button" 
                onClick={addTechnology}
                variant="outline"
                size="icon"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Technology badges */}
            {formData.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.technologies.map((tech, index) => (
                  <Badge key={index} variant="secondary" className="pr-1">
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechnology(tech)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            
            {errors.technologies && (
              <p className="text-sm text-red-500">{errors.technologies}</p>
            )}
          </div>

          {/* Project URL */}
          <div className="space-y-2">
            <Label htmlFor="project_url">URL do Projeto</Label>
            <Input
              id="project_url"
              type="url"
              value={formData.project_url}
              onChange={(e) => handleChange('project_url', e.target.value)}
              placeholder="https://exemplo.com (opcional)"
              className={errors.project_url ? 'border-red-500' : ''}
            />
            {errors.project_url && (
              <p className="text-sm text-red-500">{errors.project_url}</p>
            )}
          </div>

          {/* GitHub URL */}
          <div className="space-y-2">
            <Label htmlFor="github_url">URL do GitHub</Label>
            <Input
              id="github_url"
              type="url"
              value={formData.github_url}
              onChange={(e) => handleChange('github_url', e.target.value)}
              placeholder="https://github.com/usuario/projeto (opcional)"
              className={errors.github_url ? 'border-red-500' : ''}
            />
            {errors.github_url && (
              <p className="text-sm text-red-500">{errors.github_url}</p>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={saving}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isEditing ? 'Salvando...' : 'Criando...'}
              </>
            ) : (
              isEditing ? 'Salvar Alterações' : 'Criar Projeto'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}