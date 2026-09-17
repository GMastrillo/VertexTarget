import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

    if (!apiKey) {
      // Demo mode — return a mock streamed response
      const demoResponse = generateDemoResponse(prompt);
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          const words = demoResponse.split(" ");
          for (const word of words) {
            controller.enqueue(encoder.encode(word + " "));
            await new Promise((r) => setTimeout(r, 30));
          }
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Transfer-Encoding": "chunked",
        },
      });
    }

    // Real Gemini API call
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const systemPrompt = `Você é o motor de IA da VertexTarget, empresa de marketing digital e automação inteligente liderada por Gabriel Mastrillo (CEO & CTO) e Denis Braghin (CEO especializado em Vendas e Marketing). 
    
Gere uma estratégia de marketing digital concisa, impactante e profissional para o negócio descrito pelo usuário. 

Estruture a resposta com:
1. Posicionamento Digital (2-3 linhas)
2. Canais Prioritários (4 canais com 1 linha cada)
3. Automações com IA (4 itens)
4. Próximos Passos (CTA para contato)

Use emojis moderadamente e formatação markdown. Seja direto e prático. Assine como "Motor IA VertexTarget v1.0".`;

    const result = await model.generateContentStream(
      `${systemPrompt}\n\nNegócio do cliente: ${prompt}`
    );

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          controller.enqueue(encoder.encode(text));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function generateDemoResponse(prompt: string): string {
  return `## Estratégia VertexTarget AI — Análise Rápida

**Negócio:** ${prompt}

### 🎯 Posicionamento Digital
Recomendamos uma abordagem de marketing digital focada em autoridade e conversão. Seu nicho tem potencial para crescimento de 3-5x nos próximos 12 meses com a estratégia correta.

### 📊 Canais Prioritários
1. **Google Ads (Search + Performance Max)** — Captação de demanda ativa
2. **Instagram + Reels** — Branding e prova social
3. **SEO Técnico** — Tráfego orgânico de longo prazo
4. **Email Marketing Automatizado** — Nutrição e retenção

### 🤖 Automações com IA
- Segmentação preditiva de audiência
- Copy dinâmico A/B testado por IA
- Chatbot inteligente para qualificação de leads
- Dashboard de métricas em tempo real

### 💡 Próximos Passos
Entre em contato para receber um diagnóstico completo e personalizado do seu negócio.

*— Motor IA VertexTarget v1.0*`;
}
