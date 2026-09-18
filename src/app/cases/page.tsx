import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { CASES } from "@/lib/constants";

export const metadata = {
  title: "Cases & estudos de arquitetura | VertexTarget",
  description: "Estudos de caso, decisões de arquitetura e resultados dos projetos da VertexTarget.",
};

export default function CasesIndexPage() {
  return <main className="min-h-screen bg-[var(--color-vt-bg)] px-6 py-8 text-[var(--color-vt-text)] sm:px-10 lg:px-16">
    <div className="mx-auto max-w-7xl">
      <header className="flex items-center justify-between gap-4 border-b border-white/[.08] pb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-cyan-300"><ArrowLeft size={15} /> Voltar para a home</Link>
        <span className="text-xs uppercase tracking-[.25em] text-cyan-300">VertexTarget / Cases</span>
      </header>

      <section className="max-w-3xl py-20 sm:py-28">
        <p className="mb-5 text-xs uppercase tracking-[.3em] text-cyan-300">Estudos de arquitetura</p>
        <h1 className="font-[var(--font-heading)] text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl">Projetos que transformam <span className="gradient-text">complexidade em impacto.</span></h1>
        <p className="mt-7 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">Explore os cases da VertexTarget, do contexto de negócio às decisões técnicas, experiências digitais e resultados entregues.</p>
      </section>

      <section className="grid gap-5 pb-24 md:grid-cols-2">
        {CASES.map((item, index) => <Link key={item.id} href={`/cases/${item.id}`} className={`group relative overflow-hidden rounded-2xl border border-white/[.08] bg-white/[.025] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-white/[.05] ${index === 0 ? "md:col-span-2" : ""}`}>
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-10 blur-3xl transition-opacity duration-300 group-hover:opacity-30" style={{ background: item.color }} />
          <div className="relative flex min-h-64 flex-col justify-between gap-10">
            <div className="flex items-start justify-between gap-4"><div><p className="mb-3 text-[10px] uppercase tracking-[.2em]" style={{ color: item.color }}>{item.category}</p><h2 className="font-[var(--font-heading)] text-3xl font-semibold tracking-tight sm:text-4xl">{item.title}</h2></div><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/[.1] text-slate-400 transition-colors group-hover:border-cyan-300/40 group-hover:text-cyan-300"><ArrowUpRight size={17} /></span></div>
            <div><p className="max-w-2xl text-sm leading-7 text-slate-400">{item.description}</p><div className="mt-5 flex flex-wrap gap-2">{item.tags.slice(0, 4).map((tag) => <span key={tag} className="rounded-full border border-white/[.08] px-3 py-1 text-[10px] text-slate-500">{tag}</span>)}</div></div>
          </div>
        </Link>)}
      </section>
    </div>
  </main>;
}
