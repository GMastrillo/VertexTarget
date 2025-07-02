/**
 * Testimonials Store - Gerenciamento de estado global para depoimentos
 * Implementado com Zustand para otimizar performance e reduzir chamadas à API
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { getTestimonials } from '../services/testimonialsService';

const useTestimonialsStore = create(
  devtools(
    (set, get) => ({
      // Estado
      testimonials: [],
      isLoading: false,
      error: null,
      lastFetch: null,
      activeTestimonial: 0,
      
      // Cache settings (30 minutos)
      CACHE_DURATION: 30 * 60 * 1000,

      // Actions
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      setTestimonials: (testimonials) => set({ 
        testimonials, 
        lastFetch: Date.now(),
        error: null 
      }),

      setActiveTestimonial: (index) => set({ activeTestimonial: index }),

      // Verifica se o cache ainda é válido
      isCacheValid: () => {
        const { lastFetch, CACHE_DURATION } = get();
        if (!lastFetch) return false;
        return (Date.now() - lastFetch) < CACHE_DURATION;
      },

      // Carrega depoimentos (com cache inteligente)
      fetchTestimonials: async (forceRefresh = false) => {
        const { testimonials, isLoading, isCacheValid, setLoading, setError, setTestimonials } = get();
        
        // Se já tem dados e cache é válido, não faz nova requisição
        if (!forceRefresh && testimonials.length > 0 && isCacheValid() && !isLoading) {
          console.log('📦 Testimonials: Usando dados do cache');
          return testimonials;
        }

        // Evita múltiplas requisições simultâneas
        if (isLoading) {
          console.log('⏳ Testimonials: Requisição já em andamento');
          return testimonials;
        }

        try {
          setLoading(true);
          setError(null);
          console.log('🔄 Testimonials: Carregando depoimentos da API...');
          
          const data = await getTestimonials();
          setTestimonials(data);
          
          console.log(`✅ Testimonials: ${data.length} depoimentos carregados e cacheados`);
          return data;

        } catch (error) {
          console.error('❌ Testimonials Store Error:', error);
          setError(error.message);
          return [];
        } finally {
          setLoading(false);
        }
      },

      // Próximo depoimento (para auto-rotação)
      nextTestimonial: () => set((state) => ({
        activeTestimonial: (state.activeTestimonial + 1) % state.testimonials.length
      })),

      // Depoimento anterior
      previousTestimonial: () => set((state) => ({
        activeTestimonial: state.activeTestimonial === 0 
          ? state.testimonials.length - 1 
          : state.activeTestimonial - 1
      })),

      // Limpa o cache (útil para refresh manual)
      clearCache: () => set({ 
        testimonials: [], 
        lastFetch: null, 
        error: null,
        activeTestimonial: 0
      }),

      // Adiciona um novo depoimento (para futuras funcionalidades CRUD)
      addTestimonial: (testimonial) => set((state) => ({
        testimonials: [...state.testimonials, testimonial]
      })),

      // Atualiza um depoimento
      updateTestimonial: (id, updatedTestimonial) => set((state) => ({
        testimonials: state.testimonials.map(testimonial => 
          testimonial.id === id ? { ...testimonial, ...updatedTestimonial } : testimonial
        )
      })),

      // Remove um depoimento
      removeTestimonial: (id) => set((state) => ({
        testimonials: state.testimonials.filter(testimonial => testimonial.id !== id)
      })),

      // Obtém depoimento por ID
      getTestimonialById: (id) => {
        const { testimonials } = get();
        return testimonials.find(testimonial => testimonial.id === id);
      },

      // Obtém depoimentos por rating
      getTestimonialsByRating: (rating) => {
        const { testimonials } = get();
        return testimonials.filter(testimonial => testimonial.rating >= rating);
      },

      // Obtém depoimento ativo atual
      getActiveTestimonial: () => {
        const { testimonials, activeTestimonial } = get();
        return testimonials[activeTestimonial] || null;
      },

      // Estatísticas do store
      getStats: () => {
        const { testimonials, lastFetch, isCacheValid } = get();
        const avgRating = testimonials.length > 0 
          ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
          : 0;
        
        return {
          totalTestimonials: testimonials.length,
          averageRating: avgRating,
          companies: [...new Set(testimonials.map(t => t.company))],
          lastFetch: lastFetch ? new Date(lastFetch).toLocaleString() : 'Nunca',
          cacheValid: isCacheValid(),
          cacheExpiry: lastFetch ? new Date(lastFetch + get().CACHE_DURATION).toLocaleString() : 'N/A'
        };
      }
    }),
    {
      name: 'testimonials-store', // Nome para o DevTools
    }
  )
);

export default useTestimonialsStore;