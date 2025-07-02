/**
 * Portfolio Manager - Componente para gerenciamento completo do portfólio
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
import { useAuth } from '../../contexts/AuthContext';
import { getPortfolioProjects, createPortfolioProject, updatePortfolioProject, deletePortfolioProject } from '../../services/portfolioService';
import { useToast } from '../../hooks/use-toast';

const PortfolioManager = () => {
  const { token } = useAuth();
  const { toast } = useToast();
  
  // Estados principais
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Estados do formulário
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    image: '',
    metric: '',
    description: '',
    technologies: '',
    results: '',
    challenge: '',
    solution: '',
    outcome: ''
  });

  // Carregar projetos na inicialização
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await getPortfolioProjects();
      setProjects(data);
    } catch (error) {
      toast({
        title: "Erro ao carregar projetos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      image: '',
      metric: '',
      description: '',
      technologies: '',
      results: '',
      challenge: '',
      solution: '',
      outcome: ''
    });
    setSelectedProject(null);
  };

  const openCreateForm = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const openEditForm = (project) => {
    setFormData({
      title: project.title || '',
      category: project.category || '',
      image: project.image || '',
      metric: project.metric || '',
      description: project.description || '',
      technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : '',
      results: typeof project.results === 'object' ? JSON.stringify(project.results, null, 2) : project.results || '',
      challenge: project.challenge || '',
      solution: project.solution || '',
      outcome: project.outcome || ''
    });
    setSelectedProject(project);
    setIsFormOpen(true);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const required = ['title', 'category', 'image', 'metric', 'description', 'technologies', 'challenge', 'solution', 'outcome'];
    
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

    // Validar technologies (deve ser uma lista separada por vírgulas)
    if (!formData.technologies.includes(',')) {
      toast({
        title: "Tecnologias inválidas",
        description: "Separe as tecnologias por vírgulas (ex: React, Node.js, MongoDB)",
        variant: "destructive",
      });
      return false;
    }

    // Validar results (deve ser JSON válido)
    try {
      JSON.parse(formData.results || '{}');
    } catch (error) {
      toast({
        title: "Resultados inválidos",
        description: "Os resultados devem estar em formato JSON válido.",
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
      const projectData = {
        title: formData.title.trim(),
        category: formData.category.trim(),
        image: formData.image.trim(),
        metric: formData.metric.trim(),
        description: formData.description.trim(),
        technologies: formData.technologies.split(',').map(t => t.trim()).filter(t => t),
        results: JSON.parse(formData.results || '{}'),
        challenge: formData.challenge.trim(),
        solution: formData.solution.trim(),
        outcome: formData.outcome.trim()
      };

      if (selectedProject) {
        // Atualizar projeto existente
        await updatePortfolioProject(selectedProject.id, projectData, token);
        toast({
          title: "Projeto atualizado",
          description: "O projeto foi atualizado com sucesso!",
        });
      } else {
        // Criar novo projeto
        await createPortfolioProject(projectData, token);
        toast({
          title: "Projeto criado",
          description: "O projeto foi criado com sucesso!",
        });
      }

      setIsFormOpen(false);
      resetForm();
      loadProjects();

    } catch (error) {
      toast({
        title: "Erro ao salvar projeto",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (project) => {
    try {
      setIsDeleting(true);
      await deletePortfolioProject(project.id, token);
      
      toast({
        title: "Projeto deletado",
        description: "O projeto foi removido com sucesso!",
      });
      
      loadProjects();
    } catch (error) {
      toast({
        title: "Erro ao deletar projeto",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Gerenciar Portfólio</h2>
          <p className="text-gray-400">Administre os projetos do seu portfólio</p>
        </div>
        
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateForm} className="bg-purple-600 hover:bg-purple-700">
              ➕ Novo Projeto
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">
                {selectedProject ? 'Editar Projeto' : 'Novo Projeto'}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Preencha as informações do projeto do portfólio
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              {/* Título */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Nome do projeto"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              {/* Categoria */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-white">Categoria *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="E-commerce">E-commerce</SelectItem>
                    <SelectItem value="FinTech">FinTech</SelectItem>
                    <SelectItem value="HealthTech">HealthTech</SelectItem>
                    <SelectItem value="SaaS">SaaS</SelectItem>
                    <SelectItem value="Website">Website</SelectItem>
                    <SelectItem value="App Mobile">App Mobile</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Imagem */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="image" className="text-white">URL da Imagem *</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              {/* Métrica */}
              <div className="space-y-2">
                <Label htmlFor="metric" className="text-white">Métrica Principal *</Label>
                <Input
                  id="metric"
                  value={formData.metric}
                  onChange={(e) => handleInputChange('metric', e.target.value)}
                  placeholder="+150% vendas"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              {/* Tecnologias */}
              <div className="space-y-2">
                <Label htmlFor="technologies" className="text-white">Tecnologias *</Label>
                <Input
                  id="technologies"
                  value={formData.technologies}
                  onChange={(e) => handleInputChange('technologies', e.target.value)}
                  placeholder="React, Node.js, MongoDB"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              {/* Descrição */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description" className="text-white">Descrição *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Breve descrição do projeto"
                  className="bg-gray-800 border-gray-700 text-white resize-none"
                  rows={3}
                />
              </div>

              {/* Resultados (JSON) */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="results" className="text-white">Resultados (JSON)</Label>
                <Textarea
                  id="results"
                  value={formData.results}
                  onChange={(e) => handleInputChange('results', e.target.value)}
                  placeholder='{"vendas": "+150%", "conversao": "+25%"}'
                  className="bg-gray-800 border-gray-700 text-white resize-none font-mono text-sm"
                  rows={3}
                />
              </div>

              {/* Desafio */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="challenge" className="text-white">Desafio *</Label>
                <Textarea
                  id="challenge"
                  value={formData.challenge}
                  onChange={(e) => handleInputChange('challenge', e.target.value)}
                  placeholder="Qual foi o principal desafio do projeto?"
                  className="bg-gray-800 border-gray-700 text-white resize-none"
                  rows={3}
                />
              </div>

              {/* Solução */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="solution" className="text-white">Solução *</Label>
                <Textarea
                  id="solution"
                  value={formData.solution}
                  onChange={(e) => handleInputChange('solution', e.target.value)}
                  placeholder="Como o desafio foi resolvido?"
                  className="bg-gray-800 border-gray-700 text-white resize-none"
                  rows={3}
                />
              </div>

              {/* Resultado */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="outcome" className="text-white">Resultado *</Label>
                <Textarea
                  id="outcome"
                  value={formData.outcome}
                  onChange={(e) => handleInputChange('outcome', e.target.value)}
                  placeholder="Qual foi o impacto final do projeto?"
                  className="bg-gray-800 border-gray-700 text-white resize-none"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsFormOpen(false)} className="border-gray-700 text-gray-300">
                Cancelar
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {loading ? 'Salvando...' : (selectedProject ? 'Atualizar' : 'Criar')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabela de Projetos */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Projetos do Portfólio</CardTitle>
          <CardDescription className="text-gray-400">
            {projects.length} projeto(s) cadastrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading && projects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">Carregando projetos...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-400">Nenhum projeto encontrado</p>
              <p className="text-gray-500 text-sm">Clique em "Novo Projeto" para adicionar o primeiro</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">Projeto</TableHead>
                  <TableHead className="text-gray-300">Categoria</TableHead>
                  <TableHead className="text-gray-300">Métrica</TableHead>
                  <TableHead className="text-gray-300">Tecnologias</TableHead>
                  <TableHead className="text-gray-300">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id} className="border-gray-700">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <img 
                          src={project.image} 
                          alt={project.title}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <p className="text-white font-medium">{project.title}</p>
                          <p className="text-gray-400 text-sm truncate max-w-xs">
                            {project.description}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{project.category}</Badge>
                    </TableCell>
                    <TableCell className="text-gray-300">{project.metric}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {project.technologies?.slice(0, 3).map((tech, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                        {project.technologies?.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.technologies.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditForm(project)}
                          className="border-gray-700 text-gray-300 hover:bg-purple-600"
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
                                Tem certeza de que deseja excluir o projeto "{project.title}"? 
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="border-gray-700 text-gray-300">
                                Cancelar
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(project)}
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

export default PortfolioManager;