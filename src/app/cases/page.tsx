import type { Metadata } from "next";
import CasesIndexClient from "./CasesIndexClient";

export const metadata: Metadata = {
  title: "Cases & estudos de arquitetura | VertexTarget",
  description: "Estudos de caso, decisões de arquitetura e resultados dos projetos da VertexTarget.",
};

export default function CasesIndexPage() {
  return <CasesIndexClient />;
}
