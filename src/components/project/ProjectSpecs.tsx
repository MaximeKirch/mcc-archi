import type { ProjectLabels } from "#/config/labels.ts";

interface ProjectSpecsProps {
  localisation: string;
  annee: number | string;
  surface: number | string;
  labels: ProjectLabels;
}

export function ProjectSpecs({ localisation, annee, surface, labels }: ProjectSpecsProps) {
  const rows = [
    { label: labels.localisation, value: localisation, dd: "font-medium text-neutral-800 text-right" },
    { label: labels.annee, value: annee, dd: "font-mono text-neutral-800" },
    // Empty ACF number comes back as "" or null.
    surface ? { label: labels.superficie, value: `${surface} m²`, dd: "font-mono text-neutral-800" } : null,
  ].filter((row) => row !== null);

  return (
    <div className="bg-white border border-line-kaki rounded-sm p-8 space-y-6 lg:sticky lg:top-28 shadow-sm">
      <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400 border-b border-line-kaki pb-3">
        {labels.fiche_technique}
      </h3>
      <dl className="space-y-4 text-sm font-light">
        {rows.map((row, i) => (
          <div
            key={row.label}
            className={`flex justify-between items-baseline pb-2 ${i < rows.length - 1 ? "border-b border-line-kaki" : ""}`}
          >
            <dt className="text-neutral-400">{row.label}</dt>
            <dd className={row.dd}>{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
