'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    hcaptcha?: {
      render: (container: HTMLElement, opt: Record<string, unknown>) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
    onHcaptchaLoad?: () => void;
  }
}

interface HcaptchaWidgetProps {
  onToken: (token: string | null) => void;
  resetKey: number;
}

export function HcaptchaWidget({ onToken, resetKey }: HcaptchaWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [siteKey] = useState<string | null>(() => {
    return process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || null;
  });

  useEffect(() => {
    if (!siteKey || !containerRef.current) {
      return;
    }

    let isMounted = true;

    function renderWidget() {
      if (!window.hcaptcha || !containerRef.current || !isMounted) return;

      if (widgetIdRef.current) {
        try {
          window.hcaptcha.reset(widgetIdRef.current);
        } catch {
          // ignore reset error
        }
        return;
      }

      widgetIdRef.current = window.hcaptcha.render(containerRef.current, {
        sitekey: siteKey,
        theme: 'dark',
        callback: (token: string) => {
          if (isMounted) onToken(token);
        },
        'expired-callback': () => {
          if (isMounted) onToken(null);
        },
        'error-callback': () => {
          if (isMounted) onToken(null);
        },
      });
    }

    if (window.hcaptcha) {
      renderWidget();
    } else {
      const existingScript = document.getElementById('hcaptcha-script');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'hcaptcha-script';
        script.src = 'https://js.hcaptcha.com/1/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        script.onload = () => {
          if (isMounted) renderWidget();
        };
        document.head.appendChild(script);
      } else {
        existingScript.addEventListener('load', renderWidget);
      }
    }

    return () => {
      isMounted = false;
      if (widgetIdRef.current && window.hcaptcha) {
        try {
          window.hcaptcha.remove(widgetIdRef.current);
        } catch {
          // ignore cleanup error
        }
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, resetKey, onToken]);

  if (!siteKey) {
    return (
      <div className="rounded-lg border border-border/40 bg-muted/20 p-3 text-xs text-muted-foreground text-center">
        Verificação de segurança (modo desenvolvimento / sem chave configurada)
      </div>
    );
  }

  return (
    <div className="flex justify-center my-3" aria-label="Verificação de segurança anti-robô">
      <div ref={containerRef} />
    </div>
  );
}
