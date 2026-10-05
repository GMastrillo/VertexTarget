'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle2, Globe, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SANDBOX_NICHES } from './laptop-sandbox-generator';

interface LaptopSandboxCtaProps {
  businessName: string;
  nicheId: string;
  city: string;
}

export default function LaptopSandboxCta({
  businessName,
  nicheId,
  city,
}: LaptopSandboxCtaProps) {
  const router = useRouter();
  const cleanName = businessName.trim() || 'Meu Negócio';
  const cleanCity = city.trim() || 'Brasil';
  const niche = SANDBOX_NICHES.find((n) => n.id === nicheId) || SANDBOX_NICHES[0];
  const slug = cleanName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'meu-site';

  const handlePublishClick = () => {
    // Salva o rascunho da sandbox na sessionStorage para herança direta no onboarding
    try {
      const draft = {
        businessName: cleanName,
        sector: niche.category,
        city: cleanCity,
        templateId: niche.defaultTemplateId,
        services: niche.features.map((f) => ({
          title: f,
          description: `Serviço especializado de ${f.toLowerCase()} com excelência e atendimento dedicado em ${cleanCity}.`,
        })),
        createdAt: Date.now(),
      };
      sessionStorage.setItem('vertex_sandbox_draft', JSON.stringify(draft));
    } catch {
      // Ignora erro de storage se indisponível
    }

    const query = new URLSearchParams({
      name: cleanName,
      sector: niche.category,
      city: cleanCity,
    }).toString();

    router.push(`/os/cadastro?${query}`);
  };

  return (
    <div className="mt-8 p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-card via-card to-muted border border-primary/40 shadow-[0_0_40px_rgba(0,240,255,0.18)] max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="space-y-1 text-center md:text-left">
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-success/10 border border-success/30 text-success text-[10px] font-mono font-bold">
            <CheckCircle2 className="w-3 h-3" />
            Estrutura Gerada com Sucesso
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
            <Globe className="w-3 h-3 text-primary" />
            vertextarget.com.br/sites/{slug}
          </span>
        </div>
        <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
          Pronto para colocar <span className="text-primary">{cleanName}</span> no ar?
        </h3>
        <p className="text-xs text-muted-foreground">
          Seus dados e estrutura já estão prontos. Crie sua conta gratuita para salvar e publicar.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
        <Button
          onClick={handlePublishClick}
          className="w-full sm:w-auto h-11 px-6 rounded-full bg-primary hover:bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,240,255,0.4)] flex items-center justify-center gap-2 transition-all hover:scale-105 cursor-pointer"
        >
          <span>Salvar e Publicar Grátis</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
        <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
          <Shield className="w-3 h-3" /> Sem cartão
        </span>
      </div>
    </div>
  );
}
