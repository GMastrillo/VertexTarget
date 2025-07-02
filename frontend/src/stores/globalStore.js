/**
 * Global Store - Gerenciamento de estado global da aplicação
 * Combina funcionalidades compartilhadas entre componentes
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const useGlobalStore = create(
  devtools(
    persist(
      (set, get) => ({
        // Estado da aplicação
        isInitialized: false,
        theme: 'dark',
        
        // Estado de navegação
        activeSection: '',
        isScrolling: false,
        
        // Estado de modais e overlays
        isModalOpen: false,
        modalContent: null,
        
        // Performance settings
        enableAnimations: true,
        enableLazyLoading: true,
        
        // Cache global settings
        globalCacheDuration: 30 * 60 * 1000, // 30 minutos

        // Actions
        setInitialized: (initialized) => set({ isInitialized: initialized }),
        
        setTheme: (theme) => set({ theme }),
        
        setActiveSection: (section) => set({ activeSection: section }),
        
        setScrolling: (scrolling) => set({ isScrolling: scrolling }),
        
        openModal: (content) => set({ 
          isModalOpen: true, 
          modalContent: content 
        }),
        
        closeModal: () => set({ 
          isModalOpen: false, 
          modalContent: null 
        }),
        
        toggleAnimations: () => set((state) => ({ 
          enableAnimations: !state.enableAnimations 
        })),
        
        toggleLazyLoading: () => set((state) => ({ 
          enableLazyLoading: !state.enableLazyLoading 
        })),

        // Utilities
        getThemeClasses: () => {
          const { theme } = get();
          return theme === 'dark' 
            ? 'bg-gray-900 text-white' 
            : 'bg-white text-gray-900';
        },

        // Performance helpers
        shouldAnimate: () => {
          const { enableAnimations } = get();
          return enableAnimations;
        },

        shouldLazyLoad: () => {
          const { enableLazyLoading } = get();
          return enableLazyLoading;
        },

        // Debug information
        getDebugInfo: () => {
          const state = get();
          return {
            isInitialized: state.isInitialized,
            activeSection: state.activeSection,
            isScrolling: state.isScrolling,
            isModalOpen: state.isModalOpen,
            enableAnimations: state.enableAnimations,
            enableLazyLoading: state.enableLazyLoading,
            theme: state.theme
          };
        }
      }),
      {
        name: 'global-store', // Nome para persistência
        partialize: (state) => ({
          theme: state.theme,
          enableAnimations: state.enableAnimations,
          enableLazyLoading: state.enableLazyLoading
        }) // Apenas persiste configurações do usuário
      }
    ),
    {
      name: 'global-store', // Nome para o DevTools
    }
  )
);

export default useGlobalStore;