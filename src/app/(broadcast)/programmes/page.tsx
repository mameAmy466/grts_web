import type { Metadata } from "next";
import { ProgrammesCatalog } from "@/components/programmes-catalog";
import { getTveProgramCatalog } from "@/lib/api/tve";
import { programmes as fallbackProgrammes } from "@/lib/programmes";

export const metadata: Metadata = {
  title: "TV programs",
};

export const revalidate = 600; // REVALIDATE_CATEGORY

export default async function ProgrammesPage() {
  const { programmes, categories } = await getTveProgramCatalog();
  return (
    <ProgrammesCatalog
      programmes={programmes.length ? programmes : fallbackProgrammes}
      filters={categories.length ? categories : undefined}
    />
  );
}
