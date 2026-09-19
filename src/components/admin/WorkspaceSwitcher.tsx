"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Workspace } from "@/lib/workspace";

export function WorkspaceSwitcher({ current, organizations }: { current: Workspace; organizations: Workspace[] }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  if (organizations.length < 2) {
    return <p className="truncate text-xs text-slate-400">{current.name}</p>;
  }

  async function selectWorkspace(organizationId: string) {
    if (organizationId === current.id) return;
    setSaving(true);
    try {
      const response = await fetch("/api/admin/workspace", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organizationId }),
      });
      if (response.ok) router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <label className="block min-w-0">
      <span className="sr-only">Workspace ativo</span>
      <select
        value={current.id}
        disabled={saving}
        onChange={(event) => void selectWorkspace(event.target.value)}
        className="max-w-[190px] truncate rounded-lg border border-white/[.08] bg-[#0a0a1a] px-2 py-1 text-xs text-slate-300 outline-none focus:border-cyan-300/50"
      >
        {organizations.map((organization) => <option key={organization.id} value={organization.id}>{organization.name}</option>)}
      </select>
    </label>
  );
}
