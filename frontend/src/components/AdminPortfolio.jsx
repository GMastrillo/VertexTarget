import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Plus, Search, Edit, Trash2, ExternalLink, Github, Loader2 } from 'lucide-react';
import { ProjectModal } from './ProjectModal';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export function AdminPortfolio() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/portfolio`);
      setProjects(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Erro ao carregar projetos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Handle project success (create/update)
  const handleProjectSuccess = (updatedProject, action) => {
    if (action === 'created') {
      // Add new project to the list
      setProjects(prev => [updatedProject, ...prev]);
      console.log(`Projeto "${updatedProject.title}" criado com sucesso`);
    } else if (action === 'updated') {
      // Update existing project in the list
      setProjects(prev => 
        prev.map(project => 
          project.id === updatedProject.id ? updatedProject : project
        )
      );
      console.log(`Projeto "${updatedProject.title}" atualizado com sucesso`);
    }
  };

  // Open modal for creating new project
  const handleCreateProject = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  // Open modal for editing existing project
  const handleEditProject = (project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  // Delete project
  const handleDelete = async (projectId, projectTitle) => {
    try {
      setDeletingId(projectId);
      await axios.delete(`${API}/portfolio/${projectId}`);
      
      // Remove from local state
      setProjects(projects.filter(project => project.id !== projectId));
      
      // Show success feedback (you could use a toast here)
      console.log(`Projeto "${projectTitle}" deletado com sucesso`);
    } catch (err) {
      console.error('Error deleting project:', err);
      setError('Erro ao deletar projeto. Tente novamente.');
    } finally {
      setDeletingId(null);
    }
  };

  // Filter projects based on search term
  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm('');
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Load projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestão de Portfólio</h1>
            <p className="text-gray-600">Gerencie os projetos do seu portfólio</p>
          </div>
        </div>
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Carregando projetos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestão de Portfólio</h1>
            <p className="text-gray-600">Gerencie os projetos do seu portfólio</p>
          </div>
        </div>
        <Card className="border-0 shadow-md">
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <div className="text-red-500 mb-4">
                <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">{error}</h3>
              <Button onClick={fetchProjects} className="mt-4">
                Tentar Novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Portfólio</h1>
          <p className="text-gray-600">Gerencie os projetos do seu portfólio</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleCreateProject}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Projeto
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="border-0 shadow-md">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar projetos por título, categoria ou descrição..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Projects Table */}
      {filteredProjects.length === 0 ? (
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">Projetos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                {searchTerm ? 'Nenhum projeto encontrado' : 'Nenhum projeto encontrado'}
              </h3>
              <p className="text-gray-500 mt-2">
                {searchTerm 
                  ? 'Tente buscar por outros termos.' 
                  : 'Comece adicionando seu primeiro projeto ao portfólio.'
                }
              </p>
              <Button 
                className="mt-4 bg-blue-600 hover:bg-blue-700"
                onClick={searchTerm ? handleClearSearch : handleCreateProject}
              >
                <Plus className="h-4 w-4 mr-2" />
                {searchTerm ? 'Limpar Busca' : 'Adicionar Primeiro Projeto'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">
              Projetos ({filteredProjects.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Imagem</TableHead>
                    <TableHead>Título</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Tecnologias</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="w-32">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell>
                        <img 
                          src={project.image_url} 
                          alt={project.title}
                          className="w-12 h-12 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/48x48?text=IMG';
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{project.title}</div>
                          <div className="text-sm text-gray-500 line-clamp-2">{project.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{project.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.slice(0, 3).map((tech, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tech}
                            </Badge>
                          ))}
                          {project.technologies.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{project.technologies.length - 3}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {formatDate(project.created_at)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {/* External Links */}
                          {project.project_url && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => window.open(project.project_url, '_blank')}
                              title="Ver projeto"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                          {project.github_url && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => window.open(project.github_url, '_blank')}
                              title="Ver no GitHub"
                            >
                              <Github className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {/* Edit Button */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-600 hover:text-blue-700"
                            onClick={() => handleEditProject(project)}
                            title="Editar projeto"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          {/* Delete Button */}
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-600 hover:text-red-700"
                                title="Deletar projeto"
                                disabled={deletingId === project.id}
                              >
                                {deletingId === project.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja deletar o projeto "{project.title}"? 
                                  Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(project.id, project.title)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Deletar
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
            </div>
          </CardContent>
        </Card>
      )}

      {/* Project Modal */}
      <ProjectModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        project={editingProject}
        onSuccess={handleProjectSuccess}
      />
    </div>
  );
}