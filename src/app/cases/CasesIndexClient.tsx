"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { CASES } from "@/lib/constants";
import { CARD_CONTENT } from "@/lib/i18n-data";
import { useLanguage } from "@/providers/LanguageProvider";
import { CASE_INDEX_COPY } from "@/lib/case-index-i18n";
import CaseCard from "@/components/cases/CaseCard";
import { useRouter } from "next/navigation";

export default function CasesIndexClient() {
  const { locale } = useLanguage();
  const router = useRouter();
  const copy = CASE_INDEX_COPY[locale];
  const [category, setCategory] = useState("all");
  const [technology, setTechnology] = useState("all");
  const [year, setYear] = useState("all");
  const localizedCases = useMemo<LocalizedCaseStudy[]>(() => CASES.map((item) => ({ ...item, ...CARD_CONTENT[locale].cases[item.id] })), [locale]);
  const categories = useMemo(() => [...new Set(localizedCases.map((item) => item.category))].sort(), [localizedCases]);
  const technologies = useMemo(() => [...new Set(localizedCases.flatMap((item) => item.tags))].sort(), [localizedCases]);
  const years = useMemo(() => [...new Set(localizedCases.map((item) => item.year))].sort((a, b) => b.localeCompare(a)), [localizedCases]);
  const filteredCases = localizedCases.filter((item) => (category === "all" || item.category === category) && (technology === "all" || item.tags.includes(technology)) && (year === "all" || item.year === year));
  const hasFilters = category !== "all" || technology !== "all" || year !== "all";

  function resetFilters() {
    setCategory("all");
    setTechnology("all");
    setYear("all");
  }

  return <main className="min-h-screen bg-[var(--color-vt-bg)] px-6 py-8 text-[var(--color-vt-text)] sm:px-10 lg:px-16">
    <div className="mx-auto max-w-7xl">
      <header className="flex items-center justify-between gap-4 border-b border-white/[.08] pb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-cyan-300"><ArrowLeft size={15} /> {copy.backHome}</Link>
        <span className="text-xs uppercase tracking-[.25em] text-cyan-300">VertexTarget / Cases</span>
      </header>

      <section className="max-w-3xl py-20 sm:py-28">
        <p className="mb-5 text-xs uppercase tracking-[.3em] text-cyan-300">{copy.eyebrow}</p>
        <h1 className="font-[var(--font-heading)] text-5xl font-semibold leading-[1.05] tracking-tight sm:text-7xl">{copy.title1} <span className="gradient-text">{copy.title2}</span></h1>
        <p className="mt-7 max-w-2xl text-base leading-8 text-slate-400 sm:text-lg">{copy.description}</p>
      </section>

      <section aria-label={copy.all} className="mb-10 rounded-2xl border border-white/[.08] bg-white/[.025] p-4 sm:p-5">
        <div className="grid gap-3 md:grid-cols-3">
          <FilterSelect label={copy.category} value={category} onChange={setCategory} options={categories} allLabel={copy.allCategories} />
          <FilterSelect label={copy.technology} value={technology} onChange={setTechnology} options={technologies} allLabel={copy.allTechnologies} />
          <FilterSelect label={copy.year} value={year} onChange={setYear} options={years} allLabel={copy.allYears} />
        </div>
        {hasFilters && <button type="button" onClick={resetFilters} className="mt-4 inline-flex items-center gap-2 text-xs text-cyan-300 transition-colors hover:text-cyan-200"><RotateCcw size={13} /> {copy.reset}</button>}
      </section>

      {filteredCases.length ? <section className="grid gap-5 pb-24 md:grid-cols-2">{filteredCases.map((item, index) => <CaseCard key={item.id} caseStudy={item} index={index} onExpand={() => router.push(`/cases/${item.id}`)} />)}</section> : <div className="rounded-2xl border border-dashed border-white/[.12] py-20 text-center"><p className="text-sm text-slate-400">{copy.noResults}</p><button type="button" onClick={resetFilters} className="mt-4 text-xs text-cyan-300 hover:text-cyan-200">{copy.reset}</button></div>}
    </div>
  </main>;
}

function FilterSelect({ label, value, onChange, options, allLabel }: { label: string; value: string; onChange: (value: string) => void; options: string[]; allLabel: string }) {
  return <label className="block text-xs text-slate-400"><span className="mb-2 block uppercase tracking-wider">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="admin-input h-11 w-full text-sm"><option value="all">{allLabel}</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>;
}
