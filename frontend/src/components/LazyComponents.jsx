/**
 * Lazy Loading Components - Implementação de React.lazy() para componentes principais
 * Otimiza o carregamento inicial da aplicação dividindo o bundle em chunks menores
 */

import React, { Suspense } from 'react';

// Componentes lazy-loaded
const LazyPortfolio = React.lazy(() => import('./Portfolio'));
const LazyTestimonials = React.lazy(() => import('./Testimonials'));
const LazyContact = React.lazy(() => import('./Contact'));
const LazyMethodology = React.lazy(() => import('./Methodology'));
const LazyAIDemo = React.lazy(() => import('./AIDemo'));

// Componente de loading personalizado
const SectionLoader = ({ sectionName = 'seção' }) => (
  <div className="min-h-[400px] flex items-center justify-center bg-gray-900">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-400 animate-pulse">
        Carregando {sectionName}...
      </p>
    </div>
  </div>
);

// HOC para criar componentes lazy com loading personalizado
const createLazyComponent = (LazyComponent, sectionName) => {
  return React.forwardRef((props, ref) => (
    <Suspense fallback={<SectionLoader sectionName={sectionName} />}>
      <LazyComponent {...props} ref={ref} />
    </Suspense>
  ));
};

// Exportações de componentes lazy
export const Portfolio = createLazyComponent(LazyPortfolio, 'portfólio');
export const Testimonials = createLazyComponent(LazyTestimonials, 'depoimentos');
export const Contact = createLazyComponent(LazyContact, 'contato');
export const Methodology = createLazyComponent(LazyMethodology, 'metodologia');
export const AIDemo = createLazyComponent(LazyAIDemo, 'demonstração de IA');

// Componente para pré-carregamento de componentes críticos
export const LazyPreloader = () => {
  React.useEffect(() => {
    // Pré-carrega componentes mais importantes após um delay
    const preloadTimer = setTimeout(() => {
      console.log('🚀 Pré-carregando componentes lazy...');
      
      // Pré-carrega Portfolio (geralmente primeira seção vista)
      import('./Portfolio');
      
      // Pré-carrega Contact (CTA principal)
      setTimeout(() => import('./Contact'), 1000);
      
      // Pré-carrega outros componentes
      setTimeout(() => {
        import('./Testimonials');
        import('./Methodology');
        import('./AIDemo');
      }, 2000);
      
    }, 3000); // Aguarda 3 segundos após carregamento inicial

    return () => clearTimeout(preloadTimer);
  }, []);

  return null; // Componente invisible
};

// Hook para lazy loading condicional
export const useLazyLoading = () => {
  const [shouldLoad, setShouldLoad] = React.useState(false);
  const [isInView, setIsInView] = React.useState(false);
  const ref = React.useRef();

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          setShouldLoad(true);
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '100px' // Começa a carregar 100px antes de entrar na viewport
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, shouldLoad, isInView };
};

export default {
  Portfolio,
  Testimonials,
  Contact,
  Methodology,
  AIDemo,
  LazyPreloader,
  useLazyLoading
};