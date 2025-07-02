/**
 * Portfolio Store - Gerenciamento de estado global para projetos do portfólio
 * Implementado com Zustand para otimizar performance e reduzir chamadas à API
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { getPortfolioProjects } from '../services/portfolioService';

const usePortfolioStore = create(
  devtools(
    (set, get) => ({
      // Estado
      projects: [],
      isLoading: false,
      error: null,
      lastFetch: null,
      
      // Cache settings (30 minutos)
      CACHE_DURATION: 30 * 60 * 1000,

      // Actions
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      setProjects: (projects) => set({ 
        projects, 
        lastFetch: Date.now(),
        error: null 
      }),

      // Verifica se o cache ainda é válido
      isCacheValid: () => {
        const { lastFetch, CACHE_DURATION } = get();
        if (!lastFetch) return false;
        return (Date.now() - lastFetch) < CACHE_DURATION;
      },

      // Carrega projetos (com cache inteligente)
      fetchProjects: async (forceRefresh = false) => {
        const { projects, isLoading, isCacheValid, setLoading, setError, setProjects } = get();
        
        // Se já tem dados e cache é válido, não faz nova requisição
        if (!forceRefresh && projects.length > 0 && isCacheValid() && !isLoading) {
          console.log('📦 Portfolio: Usando dados do cache');
          return projects;
        }

        // Evita múltiplas requisições simultâneas
        if (isLoading) {
          console.log('⏳ Portfolio: Requisição já em andamento');
          return projects;
        }

        try {
          setLoading(true);
          setError(null);
          console.log('🔄 Portfolio: Carregando projetos da API...');
          
          const data = await getPortfolioProjects();
          setProjects(data);
          
          console.log(`✅ Portfolio: ${data.length} projetos carregados e cacheados`);
          return data;

        } catch (error) {
          console.error('❌ Portfolio Store Error:', error);
          setError(error.message);
          return [];
        } finally {
          setLoading(false);
        }
      },

      // Limpa o cache (útil para refresh manual)
      clearCache: () => set({ 
        projects: [], 
        lastFetch: null, 
        error: null 
      }),

      // Adiciona um novo projeto (para futuras funcionalidades CRUD)
      addProject: (project) => set((state) => ({
        projects: [...state.projects, project]
      })),

      // Atualiza um projeto
      updateProject: (id, updatedProject) => set((state) => ({
        projects: state.projects.map(project => 
          project.id === id ? { ...project, ...updatedProject } : project
        )
      })),

      // Remove um projeto
      removeProject: (id) => set((state) => ({
        projects: state.projects.filter(project => project.id !== id)
      })),

      // Obtém projeto por ID
      getProjectById: (id) => {
        const { projects } = get();
        return projects.find(project => project.id === id);
      },

      // Obtém projetos por categoria
      getProjectsByCategory: (category) => {
        const { projects } = get();
        return projects.filter(project => project.category === category);
      },

      // Estatísticas do store
      getStats: () => {
        const { projects, lastFetch, isCacheValid } = get();
        return {
          totalProjects: projects.length,
          categories: [...new Set(projects.map(p => p.category))],
          lastFetch: lastFetch ? new Date(lastFetch).toLocaleString() : 'Nunca',
          cacheValid: isCacheValid(),
          cacheExpiry: lastFetch ? new Date(lastFetch + get().CACHE_DURATION).toLocaleString() : 'N/A'
        };
      }
    }),
    {
      name: 'portfolio-store', // Nome para o DevTools
    }
  )
);

export default usePortfolioStore;